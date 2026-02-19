import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type OrderStatus = 'pending' | 'accepted' | 'cooking' | 'ready' | 'rejected' | 'cancelled' | 'delayed';

export interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: OrderStatus;
  total_price: number;
  note: string | null;
  pickup_time: string | null;
  shop_id: string;
  customer_id: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  price_at_order: number;
}

export function useOwnerOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  // 1. Fetch Shop ID for the owner
  useEffect(() => {
    if (!userId) return;

    const fetchShop = async () => {
      const { data } = await supabase
        .from('shop_owners')
        .select('shop_id')
        .eq('user_id', userId)
        .limit(1)
        .single();
      
      if (data) {
        setShopId(data.shop_id);
      } else {
        setLoading(false);
      }
    };
    fetchShop();
  }, [userId]);

  // 2. Fetch Orders & Subscribe to Realtime
  useEffect(() => {
    if (!shopId) return;

    const fetchOrders = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(id, item_name, quantity, price_at_order)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();

    // Subscribe
    const channel = supabase
      .channel(`owner-orders-${shopId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `shop_id=eq.${shopId}` },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            toast({
              title: '🔔 새 주문 접수!',
              description: `주문번호: ${(payload.new as any).order_number}`,
            });
            // Re-fetch to get items relationship
            fetchOrders();
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev =>
              prev.map(o => (o.id === (payload.new as any).id ? { ...o, ...(payload.new as any) } : o))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shopId, toast]);

  // 3. Status Update
  const updateStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    
    // Optimistic Update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    
    if (error) {
      toast({ title: '오류 발생', description: error.message, variant: 'destructive' });
      // Revert optimism if needed, but usually we just fetch again or let it be
    } 
    
    setUpdatingId(null);
  }, [toast]);

  return { orders, loading, updateStatus, updatingId, shopId };
}
