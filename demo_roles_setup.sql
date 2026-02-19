-- 1. Create Profile and Roles for Admin and Owner
-- IMPORTANT: You must SIGN UP first with these emails before running this script!
-- Email: admin@demo.com
-- Email: owner@demo.com

DO $$
DECLARE
    admin_id uuid;
    owner_id uuid;
BEGIN
    -- 1. Find the User IDs by Email
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@demo.com';
    SELECT id INTO owner_id FROM auth.users WHERE email = 'owner@demo.com';

    -- 2. If Admin User exists, set up Profile and Role
    IF admin_id IS NOT NULL THEN
        -- Upsert Profile
        INSERT INTO public.profiles (id, username, phone)
        VALUES (admin_id, 'Demo Admin', '010-0000-0001')
        ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username;
        
        -- Upsert Role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin setup complete for id: %', admin_id;
    ELSE
        RAISE NOTICE 'Admin user (admin@demo.com) NOT FOUND. Please sign up first.';
    END IF;

    -- 3. If Owner User exists, set up Profile and Role
    IF owner_id IS NOT NULL THEN
        -- Upsert Profile
        INSERT INTO public.profiles (id, username, phone)
        VALUES (owner_id, 'Demo Owner', '010-0000-0002')
        ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username;
        
        -- Upsert Role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (owner_id, 'owner')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Owner setup complete for id: %', owner_id;
    ELSE
        RAISE NOTICE 'Owner user (owner@demo.com) NOT FOUND. Please sign up first.';
    END IF;
END $$;
