
-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'accepted', 'cooking', 'ready', 'rejected', 'cancelled', 'delayed');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('customer', 'owner', 'admin');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Shops table
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  image_url TEXT,
  category TEXT DEFAULT '한식',
  is_open BOOLEAN DEFAULT false,
  min_order_amount INTEGER DEFAULT 0,
  avg_prep_time INTEGER DEFAULT 15,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Shop owners (membership table)
CREATE TABLE public.shop_owners (
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (shop_id, user_id)
);
ALTER TABLE public.shop_owners ENABLE ROW LEVEL SECURITY;

-- Menu categories
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Menu items
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_sold_out BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Menu options (e.g., size, toppings)
CREATE TABLE public.menu_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price_modifier INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);
ALTER TABLE public.menu_options ENABLE ROW LEVEL SECURITY;

-- Time slots
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_orders INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true
);
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  shop_id UUID REFERENCES public.shops(id) NOT NULL,
  status order_status DEFAULT 'pending',
  pickup_time TIMESTAMPTZ,
  total_price INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  reject_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.menu_items(id) NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_order INTEGER NOT NULL,
  options JSONB DEFAULT '[]'
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper functions (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_shop_owner(_user_id UUID, _shop_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.shop_owners
    WHERE user_id = _user_id AND shop_id = _shop_id
  )
$$;

-- Auto-create profile + assign customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "System creates profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Shops (public read for customers)
CREATE POLICY "Anyone can view shops" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Owners can create shops" ON public.shops FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Shop owners can update" ON public.shops FOR UPDATE USING (public.is_shop_owner(auth.uid(), id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Shop owners can delete" ON public.shops FOR DELETE USING (public.is_shop_owner(auth.uid(), id) OR public.has_role(auth.uid(), 'admin'));

-- Shop owners
CREATE POLICY "View own shop ownership" ON public.shop_owners FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Create shop ownership" ON public.shop_owners FOR INSERT WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Delete shop ownership" ON public.shop_owners FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Menu categories (public read)
CREATE POLICY "Anyone can view categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Shop owners can manage categories" ON public.menu_categories FOR INSERT WITH CHECK (public.is_shop_owner(auth.uid(), shop_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Shop owners can update categories" ON public.menu_categories FOR UPDATE USING (public.is_shop_owner(auth.uid(), shop_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Shop owners can delete categories" ON public.menu_categories FOR DELETE USING (public.is_shop_owner(auth.uid(), shop_id) OR public.has_role(auth.uid(), 'admin'));

-- Menu items (public read)
CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Shop owners can manage items" ON public.menu_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.menu_categories mc WHERE mc.id = category_id AND (public.is_shop_owner(auth.uid(), mc.shop_id) OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Shop owners can update items" ON public.menu_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.menu_categories mc WHERE mc.id = category_id AND (public.is_shop_owner(auth.uid(), mc.shop_id) OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Shop owners can delete items" ON public.menu_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.menu_categories mc WHERE mc.id = category_id AND (public.is_shop_owner(auth.uid(), mc.shop_id) OR public.has_role(auth.uid(), 'admin')))
);

-- Menu options (public read)
CREATE POLICY "Anyone can view options" ON public.menu_options FOR SELECT USING (true);
CREATE POLICY "Shop owners can manage options" ON public.menu_options FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.menu_items mi JOIN public.menu_categories mc ON mi.category_id = mc.id WHERE mi.id = item_id AND (public.is_shop_owner(auth.uid(), mc.shop_id) OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Shop owners can update options" ON public.menu_options FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.menu_items mi JOIN public.menu_categories mc ON mi.category_id = mc.id WHERE mi.id = item_id AND (public.is_shop_owner(auth.uid(), mc.shop_id) OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Shop owners can delete options" ON public.menu_options FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.menu_items mi JOIN public.menu_categories mc ON mi.category_id = mc.id WHERE mi.id = item_id AND (public.is_shop_owner(auth.uid(), mc.shop_id) OR public.has_role(auth.uid(), 'admin')))
);

-- Time slots (public read)
CREATE POLICY "Anyone can view time slots" ON public.time_slots FOR SELECT USING (true);
CREATE POLICY "Shop owners can manage slots" ON public.time_slots FOR INSERT WITH CHECK (public.is_shop_owner(auth.uid(), shop_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Shop owners can update slots" ON public.time_slots FOR UPDATE USING (public.is_shop_owner(auth.uid(), shop_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Shop owners can delete slots" ON public.time_slots FOR DELETE USING (public.is_shop_owner(auth.uid(), shop_id) OR public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE POLICY "Customers can view own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Shop owners can view shop orders" ON public.orders FOR SELECT USING (public.is_shop_owner(auth.uid(), shop_id));
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Shop owners can update order status" ON public.orders FOR UPDATE USING (public.is_shop_owner(auth.uid(), shop_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can cancel own orders" ON public.orders FOR UPDATE USING (auth.uid() = customer_id AND status = 'pending');

-- Order items
CREATE POLICY "View own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.customer_id = auth.uid() OR public.is_shop_owner(auth.uid(), o.shop_id) OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Create order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid())
);

-- Generate order number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();
