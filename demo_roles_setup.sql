-- 1. Create Profile for Admin
INSERT INTO public.profiles (id, username, phone, created_at)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Demo Admin', '010-0000-0001', now())
ON CONFLICT (id) DO NOTHING;

-- 2. Create Profile for Owner
INSERT INTO public.profiles (id, username, phone, created_at)
VALUES 
    ('00000000-0000-0000-0000-000000000002', 'Demo Owner', '010-0000-0002', now())
ON CONFLICT (id) DO NOTHING;


-- 3. Create Auth Users (This part is tricky in pure SQL because of password hashing)
-- Ideally, you should create these users via Supabase Dashboard -> Auth -> Add User
-- Email: admin@demo.com / Pass: 123123
-- Email: owner@demo.com / Pass: 123123
-- once created, find their UUIDs and replace below:

-- HOWEVER, for roles, we can insert into user_roles if we know the UUIDs.
-- assuming you created them manually and got their UUIDs.

-- FOR THIS DEMO SCRIPT: We will assume the user manually creates the accounts first.
-- OR, if you use the "Quick Login" logic in Auth.tsx to *programmatically* sign up if not exists.

-- Let's just create the roles assuming the emails will be 'admin@demo.com' and 'owner@demo.com'
-- We can look up UUID by email primarily if they exist in auth.users

DO $$
DECLARE
    admin_uid uuid;
    owner_uid uuid;
BEGIN
    -- Try to find users by email
    SELECT id INTO admin_uid FROM auth.users WHERE email = 'admin@demo.com';
    SELECT id INTO owner_uid FROM auth.users WHERE email = 'owner@demo.com';

    -- If Admin exists, assign role
    IF admin_uid IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role) VALUES (admin_uid, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- Also ensure profile exists for smooth login
        INSERT INTO public.profiles (id, username) VALUES (admin_uid, 'Demo Admin')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- If Owner exists, assign role
    IF owner_uid IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role) VALUES (owner_uid, 'owner')
        ON CONFLICT (user_id, role) DO NOTHING;

        -- Also ensure profile exists
        INSERT INTO public.profiles (id, username) VALUES (owner_uid, 'Demo Owner')
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;
