-- 1. Create Sample Shops (위경도 포함)
INSERT INTO public.shops (id, name, category, address, phone, description, image_url, avg_prep_time, lat, lng) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', '맛있는 김치찌개', '한식', '서울 강남구 테헤란로 123', '02-1234-5678', '어머니의 손맛이 느껴지는 김치찌개 전문점입니다.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', 15, 37.498095, 127.027610),
  ('22222222-2222-2222-2222-222222222222', '카페 딜라이트', '카페/디저트', '서울 강남구 역삼로 456', '02-9876-5432', '매일 직접 굽는 신선한 빵과 스페셜티 커피', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', 10, 37.500000, 127.030000),
  ('33333333-3333-3333-3333-333333333333', '스시 마스터', '일식', '서울 서초구 서초대로 789', '02-555-5555', '매일 아침 공수하는 신선한 재료로 만듭니다.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', 20, 37.495000, 127.020000);

-- 2. Create Menu Categories
INSERT INTO public.menu_categories (id, shop_id, name, sort_order)
VALUES
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '찌개류', 1),
  ('c1111111-1111-1111-1111-222222222222', '11111111-1111-1111-1111-111111111111', '사이드', 2),
  ('c2222222-2222-2222-2222-111111111111', '22222222-2222-2222-2222-222222222222', '커피', 1),
  ('c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '디저트', 2);

-- 3. Create Menu Items
INSERT INTO public.menu_items (category_id, name, price, description, is_popular, image_url)
VALUES
  -- 김치찌개
  ('c1111111-1111-1111-1111-111111111111', '돼지김치찌개', 9000, '국내산 암퇘지와 묵은지의 환상 조화', true, 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80'),
  ('c1111111-1111-1111-1111-111111111111', '참치김치찌개', 9000, '담백한 참치가 듬뿍 들어간 찌개', false, NULL),
  ('c1111111-1111-1111-1111-222222222222', '계란말이', 7000, '왕 계란말이 (케찹 제공)', true, 'https://images.unsplash.com/photo-1625937329535-618778f69747?w=800&q=80'),
  -- 카페
  ('c2222222-2222-2222-2222-111111111111', '아메리카노', 4500, '고소한 견과류 풍미의 블렌딩', true, 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80'),
  ('c2222222-2222-2222-2222-222222222222', '초코 브라우니', 5500, '꾸덕한 식감의 수제 브라우니', true, 'https://images.unsplash.com/photo-1564355808539-22fda3e53b89?w=800&q=80');

-- 4. Enable Realtime
alter publication supabase_realtime add table shops;
alter publication supabase_realtime add table menu_categories;
alter publication supabase_realtime add table menu_items;
