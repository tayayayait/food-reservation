import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  CookingPot,
  PackageCheck,
} from 'lucide-react';

const statusSteps = [
  { key: 'pending', label: '접수 대기', icon: Clock, color: 'text-status-pending' },
  { key: 'accepted', label: '주문 수락', icon: CheckCircle2, color: 'text-info' },
  { key: 'cooking', label: '조리 중', icon: CookingPot, color: 'text-primary' },
  { key: 'ready', label: '픽업 가능', icon: PackageCheck, color: 'text-success' },
] as const;

const rejectedStatus = { key: 'rejected', label: '거절됨', icon: XCircle, color: 'text-error' } as const;

interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  total_price: number;
  note: string | null;
  created_at: string;
  pickup_time: string | null;
  shops: { name: string; address: string | null; phone: string | null } | null;
}

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  price_at_order: number;
  options: { name: string; priceModifier: number }[];
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) fetchOrder();
  }, [id, user]);

  // Realtime status updates
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`order-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` }, (payload) => {
        setOrder(prev => prev ? { ...prev, ...payload.new } : prev);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const fetchOrder = async () => {
    const [orderRes, itemsRes] = await Promise.all([
      supabase
        .from('orders')
        .select('id, order_number, status, total_price, note, created_at, pickup_time, shops(name, address, phone)')
        .eq('id', id)
        .single(),
      supabase
        .from('order_items')
        .select('id, item_name, quantity, price_at_order, options')
        .eq('order_id', id),
    ]);

    setOrder(orderRes.data as any);
    setItems((itemsRes.data as any) || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background max-w-[428px] mx-auto">
        <MobileHeader title="주문 상세" showBack />
        <div className="pt-[72px] px-4 space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background max-w-[428px] mx-auto">
        <MobileHeader title="주문 상세" showBack />
        <div className="pt-[72px] text-center py-20">
          <p className="text-[48px] mb-4">🤷</p>
          <p className="text-heading-md text-muted-foreground">주문을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const isRejected = order.status === 'rejected' || order.status === 'cancelled';
  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-background max-w-[428px] mx-auto pb-8">
      <MobileHeader title="주문 상세" showBack />

      <div className="pt-[72px] px-4 space-y-4">
        {/* Order Number & Date */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-order text-heading-md text-foreground">{order.order_number}</span>
            <span className="text-body-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleString('ko-KR', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
          {order.pickup_time && (
            <div className="flex items-center gap-2 text-body-md text-primary">
              <Clock className="w-4 h-4" />
              <span>픽업 예정: {order.pickup_time}</span>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-heading-sm text-foreground mb-4">주문 상태</h3>

          {isRejected ? (
            <div className="flex items-center gap-3 p-4 bg-error-light rounded-xl">
              <XCircle className="w-6 h-6 text-error" />
              <div>
                <p className="text-heading-sm text-error-dark">
                  {order.status === 'rejected' ? '주문이 거절되었습니다' : '주문이 취소되었습니다'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-neutral-200" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-slow"
                style={{ width: `${Math.max(0, currentStepIndex) / (statusSteps.length - 1) * 100}%` }}
              />

              {statusSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="relative flex flex-col items-center z-10 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-primary text-white shadow-md scale-110'
                          : isActive
                            ? 'bg-primary-100 text-primary'
                            : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-body-xs mt-2 text-center ${
                        isCurrent ? 'text-primary font-semibold' : isActive ? 'text-foreground' : 'text-neutral-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Shop Info */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-heading-sm text-foreground mb-3">매장 정보</h3>
          <div className="space-y-2">
            <p className="text-body-lg font-semibold text-foreground">{order.shops?.name || '매장'}</p>
            {order.shops?.address && (
              <div className="flex items-center gap-2 text-body-md text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{order.shops.address}</span>
              </div>
            )}
            {order.shops?.phone && (
              <a href={`tel:${order.shops.phone}`} className="flex items-center gap-2 text-body-md text-primary">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{order.shops.phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-heading-sm text-foreground mb-3">주문 내역</h3>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-body-lg text-foreground">{item.item_name}</p>
                  {item.options && item.options.length > 0 && (
                    <p className="text-body-sm text-muted-foreground">
                      {item.options.map(o => o.name).join(', ')}
                    </p>
                  )}
                  <span className="text-body-sm text-neutral-500">수량: {item.quantity}</span>
                </div>
                <span className="font-price text-body-lg text-foreground">
                  {(item.price_at_order * item.quantity).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-heading-sm text-foreground">총 결제금액</span>
              <span className="font-price text-heading-lg text-primary">
                {order.total_price.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* Note */}
        {order.note && (
          <div className="bg-card rounded-xl p-5 shadow-sm">
            <h3 className="text-heading-sm text-foreground mb-2">요청사항</h3>
            <p className="text-body-md text-muted-foreground">{order.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
