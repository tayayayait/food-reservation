import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, ChevronRight } from 'lucide-react';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '접수 대기', color: 'bg-status-pending/20 text-status-pending' },
  accepted: { label: '주문 수락', color: 'bg-info-light text-info-dark' },
  cooking: { label: '조리 중', color: 'bg-primary-50 text-primary' },
  ready: { label: '픽업 가능', color: 'bg-success-light text-success-dark' },
  rejected: { label: '거절됨', color: 'bg-error-light text-error-dark' },
  cancelled: { label: '취소됨', color: 'bg-neutral-200 text-neutral-600' },
  delayed: { label: '지연', color: 'bg-warning-light text-warning-dark' },
};

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_price: number;
  created_at: string;
  shop_id: string;
  shops: { name: string } | null;
}

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, status, total_price, created_at, shop_id, shops(name)')
      .eq('customer_id', user!.id)
      .order('created_at', { ascending: false });
    setOrders((data as any) || []);
    setLoading(false);
  };

  return (
    <MobileLayout title="주문내역">
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[48px] mb-4">📋</p>
          <p className="text-heading-md text-muted-foreground">주문 내역이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const status = statusMap[order.status] || statusMap.pending;
            return (
              <button
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="w-full bg-card rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-heading-sm text-foreground">{order.shops?.name || '매장'}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-body-xs px-2 py-1 rounded-full font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                    <span className="font-mono-order">{order.order_number}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <span className="font-price text-heading-sm text-foreground">
                    {order.total_price.toLocaleString()}원
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </MobileLayout>
  );
}

