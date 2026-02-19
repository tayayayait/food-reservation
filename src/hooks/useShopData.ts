import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MenuCategory {
  id: string;
  name: string;
  menu_items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_sold_out: boolean;
  is_popular: boolean;
}

export interface ShopData {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  image_url: string | null;
  avg_prep_time: number | null;
  is_open: boolean;
  lat: number | null;
  lng: number | null;
}

export function useShopData(shopId: string | undefined) {
  const [shop, setShop] = useState<ShopData | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!shopId) return;

    const fetchShopData = async () => {
      try {
        setLoading(true);
        // Fetch Shop
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('id', shopId)
          .single();

        if (shopError) throw shopError;
        setShop(shopData);

        // Fetch Categories
        const { data: cats, error: catsError } = await supabase
          .from('menu_categories')
          .select('id, name, sort_order')
          .eq('shop_id', shopId)
          .order('sort_order');

        if (catsError) throw catsError;

        if (cats && cats.length > 0) {
          const categoriesWithItems = await Promise.all(
            cats.map(async (cat) => {
              const { data: items } = await supabase
                .from('menu_items')
                .select('id, name, description, price, image_url, is_sold_out, is_popular')
                .eq('category_id', cat.id)
                .order('sort_order');
              
              return { ...cat, menu_items: items || [] };
            })
          );
          setCategories(categoriesWithItems);
        } else {
          setCategories([]);
        }
      } catch (err: any) {
        console.error('Error fetching shop data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId]);

  return { shop, categories, loading, error };
}
