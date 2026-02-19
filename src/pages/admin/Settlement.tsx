import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

export default function Settlement() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    totalSales: 0,
    todayOrders: 0,
    totalOrders: 0,
  });
  const [shopSales, setShopSales] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    // 전체 주문 조회 (완료된 것만 매출로 계산하거나, accepted 이상을 매출로 잡거나. 여기선 ready/accepted/cooking 다 잡음)
    // 보통 정산은 결제 완료 기준.
    const { data: orders } = await supabase
      .from('orders')
      .select('total_price, created_at, status, shop_id, shops(name)')
      .neq('status', 'cancelled')
      .neq('status', 'rejected');

    if (orders) {
      let todayS = 0;
      let totalS = 0;
      let todayO = 0;

      const shopMap: Record<string, { name: string; sales: number; count: number }> = {};

      orders.forEach((o) => {
        const isToday = o.created_at.startsWith(today);
        const price = o.total_price || 0;

        totalS += price;
        if (isToday) {
          todayS += price;
          todayO += 1;
        }

        // 매장별 집계
        const sId = o.shop_id;
        const sName = o.shops?.name || 'Unknown';
        if (!shopMap[sId]) shopMap[sId] = { name: sName, sales: 0, count: 0 };
        shopMap[sId].sales += price;
        shopMap[sId].count += 1;
      });

      setStats({
        todaySales: todayS,
        totalSales: totalS,
        todayOrders: todayO,
        totalOrders: orders.length,
      });

      setShopSales(Object.values(shopMap).sort((a, b) => b.sales - a.sales));
    }
    setLoading(false);
  };

  return (
    <AdminLayout title="정산 및 매출">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">오늘 매출</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todaySales.toLocaleString()}원</div>
                <p className="text-xs text-muted-foreground">주문 {stats.todayOrders}건</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 매출 (누적)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSales.toLocaleString()}원</div>
                <p className="text-xs text-muted-foreground">총 주문 {stats.totalOrders}건</p>
              </CardContent>
            </Card>
          </div>

          {/* Shop Sales Rank */}
          <Card>
            <CardHeader>
              <CardTitle>매장별 매출 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shopSales.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">데이터가 없습니다.</p>
                ) : (
                  shopSales.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground">주문 {item.count}건</span>
                      </div>
                      <span className="font-bold">{item.sales.toLocaleString()}원</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
