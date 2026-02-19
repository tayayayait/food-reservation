import { useEffect, useState, useMemo } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import {
  Store,
  ClipboardList,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface OrderRow {
  total_price: number;
  created_at: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ shops: 0, orders: 0, users: 0, revenue: 0 });
  const [todayOrders, setTodayOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    const [shopsRes, allOrdersRes, usersRes, todayRes] = await Promise.all([
      supabase.from('shops').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id, total_price'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase
        .from('orders')
        .select('total_price, created_at, status')
        .gte('created_at', today),
    ]);

    setStats({
      shops: shopsRes.count || 0,
      orders: allOrdersRes.data?.length || 0,
      users: usersRes.count || 0,
      revenue: allOrdersRes.data?.reduce((s, o) => s + o.total_price, 0) || 0,
    });

    setTodayOrders((todayRes.data as OrderRow[]) || []);
  };

  const todayStats = useMemo(() => {
    const count = todayOrders.length;
    const revenue = todayOrders.reduce((s, o) => s + o.total_price, 0);
    const pending = todayOrders.filter(o => o.status === 'pending').length;
    return { count, revenue, pending };
  }, [todayOrders]);

  const cards = [
    {
      icon: Store,
      label: '총 매장',
      value: stats.shops,
      color: 'text-primary',
      bg: 'bg-primary-50',
    },
    {
      icon: ClipboardList,
      label: '총 주문',
      value: stats.orders.toLocaleString(),
      color: 'text-info',
      bg: 'bg-info-light',
    },
    {
      icon: Users,
      label: '총 회원',
      value: stats.users.toLocaleString(),
      color: 'text-success',
      bg: 'bg-success-light',
    },
    {
      icon: TrendingUp,
      label: '총 매출',
      value: `${stats.revenue.toLocaleString()}원`,
      color: 'text-warning-dark',
      bg: 'bg-warning-light',
    },
  ];

  return (
    <AdminLayout title="대시보드">
      <div className="space-y-6">
        {/* Today Summary Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-400 rounded-2xl p-6 text-white">
          <h2 className="text-heading-md mb-4">📊 오늘의 요약</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-white/70 text-body-sm">오늘 주문</p>
              <p className="text-heading-lg font-price">{todayStats.count}건</p>
            </div>
            <div>
              <p className="text-white/70 text-body-sm">오늘 매출</p>
              <p className="text-heading-lg font-price">{todayStats.revenue.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-white/70 text-body-sm">대기 주문</p>
              <p className="text-heading-lg font-price">{todayStats.pending}건</p>
            </div>
          </div>
        </div>

        {/* Total Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="bg-card rounded-2xl p-5 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <p className="text-body-md text-muted-foreground">{label}</p>
                  <p className={`text-heading-lg font-price ${color}`}>{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
