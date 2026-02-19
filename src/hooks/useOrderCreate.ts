import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCartStore } from '@/lib/cart-store';

interface CreateOrderParams {
  userId: string;
  shopId: string;
  items: Array<{
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    options: any[];
  }>;
  totalPrice: number;
  pickupTime: string;
  note: string;
}

export function useOrderCreate() {
  const [loading, setLoading] = useState(false);

  const createOrder = async (params: CreateOrderParams) => {
    setLoading(true);
    const { userId, shopId, items, totalPrice, pickupTime, note } = params;

    try {
      // 1. Generate Order Number & Insert Order
      let order = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const orderNumber = `${timestamp}-${randomStr}`;

        const { data, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_id: userId,
            shop_id: shopId,
            total_price: totalPrice,
            note,
            order_number: orderNumber,
            pickup_time: pickupTime,
            status: 'pending',
          })
          .select()
          .single();

        if (orderError) {
          if (orderError.code === '23505' || orderError.code === '409') {
            retryCount++;
            continue;
          }
          throw orderError;
        }

        order = data;
        break;
      }

      if (!order) throw new Error('Order creation failed after multiple retries.');

      // 2. Insert Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        item_id: item.itemId,
        item_name: item.name,
        quantity: item.quantity,
        price_at_order: item.price,
        options: item.options,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      return order;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestTossPayment = async (order: any, customerName: string) => {
    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
    if (!clientKey) {
      throw new Error('Toss Payments Client Key not found');
    }

    const tossPayments = window.TossPayments(clientKey);

    await tossPayments.requestPayment('카드', {
      amount: order.total_price,
      orderId: order.id,
      orderName: order.note ? '음식 주문' : '음식 주문', // Can be improved
      customerName: customerName,
      successUrl: window.location.origin + '/payment/success',
      failUrl: window.location.origin + '/payment/fail',
    });
  };

  return { createOrder, requestTossPayment, loading };
}
