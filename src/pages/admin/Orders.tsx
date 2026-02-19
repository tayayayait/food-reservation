import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '접수 대기', color: 'bg-warning-light text-warning-dark' },
  accepted: { label: '수락', color: 'bg-info-light text-info-dark' },
  cooking: { label: '조리 중', color: 'bg-primary-50 text-primary' },
  ready: { label: '완료', color: 'bg-success-light text-success-dark' },
  rejected: { label: '거절', color: 'bg-error-light text-error-dark' },
  cancelled: { label: '취소', color: 'bg-neutral-200 text-neutral-600' },
  delayed: { label: '지연', color: 'bg-warning-light text-warning-dark' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, shops(name)')
      .order('created_at', { ascending: false })
      .limit(200);
    setOrders(data || []);
    setLoading(false);
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      !search ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.shops?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusFilters = [
    { key: 'all', label: '전체' },
    { key: 'pending', label: '대기' },
    { key: 'accepted', label: '수락' },
    { key: 'cooking', label: '조리중' },
    { key: 'ready', label: '완료' },
    { key: 'rejected', label: '거절' },
  ];

  return (
    <AdminLayout title="주문 모니터링">
      <div className="space-y-4">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="주문번호 또는 매장명 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statusFilters.map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-body-sm whitespace-nowrap transition-all ${
                  statusFilter === f.key
                    ? 'bg-primary text-white'
                    : 'bg-card border border-neutral-200 text-muted-foreground hover:border-neutral-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-body-sm text-muted-foreground">{filtered.length}건</p>

        {/* Table */}
        <div className="bg-card rounded-xl border border-neutral-200 overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  주문번호
                </th>
                <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  매장
                </th>
                <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  상태
                </th>
                <th className="text-right px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  금액
                </th>
                <th className="text-right px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  일시
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const status = statusMap[order.status] || statusMap.pending;
                return (
                  <tr key={order.id} className="border-t border-neutral-200 hover:bg-secondary/50">
                    <td className="px-4 py-3 font-mono-order text-body-md text-foreground">
                      {order.order_number}
                    </td>
                    <td className="px-4 py-3 text-body-md text-foreground">
                      {order.shops?.name || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-body-xs px-2 py-1 rounded-full font-semibold ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-price text-body-md text-foreground">
                      {order.total_price.toLocaleString()}원
                    </td>
                    <td className="px-4 py-3 text-right text-body-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString('ko-KR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-body-lg text-muted-foreground">주문이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
