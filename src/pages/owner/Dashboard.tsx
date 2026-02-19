import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OwnerLayout } from '@/components/layout/OwnerLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  DollarSign,
  Clock,
  TrendingUp,
  ChevronRight,
  Bell,
  PackageCheck,
} from 'lucide-react';

interface DayOrder {
  status: string;
  total_price: number;
  created_at: string;
}

/** 시간대별 주문 수 계산 */
function hourlyBreakdown(orders: DayOrder[]): { hour: number; count: number; revenue: number }[] {
  const map: Record<number, { count: number; revenue: number }> = {};
  for (const o of orders) {
    const h = new Date(o.created_at).getHours();
    if (!map[h]) map[h] = { count: 0, revenue: 0 };
    map[h].count += 1;
    map[h].revenue += o.total_price;
  }
  // 8시~22시 범위
  return Array.from({ length: 15 }, (_, i) => {
    const hour = i + 8;
    return { hour, count: map[hour]?.count || 0, revenue: map[hour]?.revenue || 0 };
  });
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<DayOrder[]>([]);
  const [shopId, setShopId] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user) fetchShop();
  }, [user]);

  // Realtime 신규 주문 알림
  useEffect(() => {
    if (!shopId) return;
    const channel = supabase
      .channel(`owner-dash-${shopId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders', filter: `shop_id=eq.${shopId}` },
        () => {
          // 새 주문 → 통계 새로고침
          fetchStats(shopId);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shopId]);

  const fetchShop = async () => {
    const { data } = await supabase
      .from('shop_owners')
      .select('shop_id')
      .eq('user_id', user!.id)
      .limit(1)
      .single();

    if (data) {
      setShopId(data.shop_id);
      fetchStats(data.shop_id);
    }
  };

  const fetchStats = async (sid: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('orders')
      .select('status, total_price, created_at')
      .eq('shop_id', sid)
      .gte('created_at', today);

    const list = (data || []) as DayOrder[];
    setOrders(list);
    setPendingCount(list.filter(o => o.status === 'pending').length);
  };

  const stats = useMemo(() => {
    const todayOrders = orders.length;
    const todayRevenue = orders.reduce((s, o) => s + o.total_price, 0);
    const pending = orders.filter(o => o.status === 'pending').length;
    const completed = orders.filter(o => o.status === 'ready').length;
    return { todayOrders, todayRevenue, pending, completed };
  }, [orders]);

  const hourly = useMemo(() => hourlyBreakdown(orders), [orders]);
  const maxCount = useMemo(() => Math.max(...hourly.map(h => h.count), 1), [hourly]);

  const cards = [
    { icon: ClipboardList, label: '오늘 주문', value: stats.todayOrders, color: 'text-primary', bg: 'bg-primary-50' },
    { icon: DollarSign, label: '오늘 매출', value: `${stats.todayRevenue.toLocaleString()}원`, color: 'text-success-dark', bg: 'bg-success-light' },
    { icon: Clock, label: '대기 중', value: stats.pending, color: 'text-status-pending', bg: 'bg-warning-light' },
    { icon: PackageCheck, label: '완료', value: stats.completed, color: 'text-success', bg: 'bg-success-light' },
  ];

  return (
    <OwnerLayout title="대시보드">
      {!shopId ? (
        <div className="text-center py-20">
          <p className="text-[48px] mb-4">🏪</p>
          <p className="text-heading-md text-muted-foreground">등록된 매장이 없습니다</p>
          <p className="text-body-md text-muted-foreground mt-2">관리자에게 매장 등록을 요청하세요</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Alert */}
          {pendingCount > 0 && (
            <button
              onClick={() => navigate('/owner/orders')}
              className="w-full flex items-center gap-3 p-4 bg-warning-light border border-warning rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Bell className="w-6 h-6 text-warning-dark" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-heading-sm text-warning-dark">신규 주문 {pendingCount}건</p>
                <p className="text-body-sm text-warning-dark/70">터치하여 주문을 확인하세요</p>
              </div>
              <ChevronRight className="w-5 h-5 text-warning-dark" />
            </button>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-3">
            {cards.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-card rounded-2xl p-4 shadow-sm border border-neutral-200">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-body-sm text-muted-foreground">{label}</p>
                <p className={`text-heading-lg font-price ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Hourly Bar Chart */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-neutral-200">
            <h3 className="text-heading-sm text-foreground mb-4">시간대별 주문</h3>
            <div className="flex items-end gap-1 h-[120px]">
              {hourly.map(h => {
                const height = maxCount > 0 ? (h.count / maxCount) * 100 : 0;
                const now = new Date().getHours();
                const isCurrent = h.hour === now;
                return (
                  <div key={h.hour} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        isCurrent ? 'bg-primary' : h.count > 0 ? 'bg-primary/40' : 'bg-neutral-200'
                      }`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    <span className={`text-[10px] mt-1 ${isCurrent ? 'text-primary font-bold' : 'text-neutral-400'}`}>
                      {h.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-14 rounded-xl justify-start gap-3"
              onClick={() => navigate('/owner/orders')}
            >
              <ClipboardList className="w-5 h-5 text-primary" />
              주문 관리
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-xl justify-start gap-3"
              onClick={() => navigate('/owner/menu')}
            >
              <TrendingUp className="w-5 h-5 text-primary" />
              메뉴 관리
            </Button>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
