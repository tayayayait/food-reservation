-- 1. Profiles Table (Users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. User Roles Table
CREATE TABLE public.user_roles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('customer', 'owner', 'admin')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, role)
);

-- 3. Shops Table
CREATE TABLE public.shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT '한식',
  address TEXT,
  phone TEXT,
  description TEXT,
  image_url TEXT,
  is_open BOOLEAN DEFAULT true,
  avg_prep_time INTEGER DEFAULT 15,
  lat double precision,
  lng double precision,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Shop Owners Table (Mapping)
CREATE TABLE public.shop_owners (
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (shop_id, user_id)
);

-- 5. Menu Categories Table
CREATE TABLE public.menu_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Menu Items Table
CREATE TABLE public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  is_sold_out BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Orders Table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- User deleted logic
  shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL,
  total_price INTEGER NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'accepted', 'cooking', 'ready', 'completed', 'cancelled', 'rejected', 'delayed')) DEFAULT 'pending',
  order_number TEXT,
  pickup_time TEXT,
  note TEXT,
  payment_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Order Items Table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_order INTEGER NOT NULL,
  options JSONB, -- Option selection (future proof)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Trigger for New User Profile Creation
-- Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. Enable RLS (Row Level Security) - Basic Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 11. Policies (Open for Development / Auth needed for Write)
-- Profiles: Public Read, Self Update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Roles: Public Read (for checking roles), Admin Manage (TODO)
CREATE POLICY "Roles are viewable by everyone" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert roles" ON public.user_roles FOR INSERT WITH CHECK (auth.role() = 'authenticated'); -- Weak security for dev
CREATE POLICY "Authenticated users can delete roles" ON public.user_roles FOR DELETE USING (auth.role() = 'authenticated');

-- Shops: Public Read, Authenticated Insert/Update
CREATE POLICY "Shops are viewable by everyone" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create shops" ON public.shops FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update shops" ON public.shops FOR UPDATE USING (auth.role() = 'authenticated');

-- Menu: Public Read, Shop Owner Manage (simplified to Authenticated for now)
CREATE POLICY "Menu categories are viewable by everyone" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage categories" ON public.menu_categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Menu items are viewable by everyone" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage items" ON public.menu_items FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Authenticated Users (Customer/Owner) -- logic needs improvement for real app
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id OR auth.role() = 'authenticated'); -- Allow owners to see all
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update orders" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Order items viewable by participants" ON public.order_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime for Orders
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
