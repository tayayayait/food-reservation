import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Clock, ChevronRight, RotateCcw, MessageSquare, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Order Interface
interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'accepted' | 'cooking' | 'ready' | 'completed' | 'cancelled' | 'rejected';
  total_price: number;
  created_at: string;
  shop_id: string;
  shops: { name: string } | null;
  items?: { menu_name: string, quantity: number }[]; // Simplified for checking what was ordered
}

// Status Helpers
const getStatusStep = (status: string) => {
  if (['pending', 'accepted'].includes(status)) return 1;
  if (['cooking'].includes(status)) return 2;
  if (['ready'].includes(status)) return 3;
  return 3;
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '접수 대기',
    accepted: '주문 수락',
    cooking: '조리 중',
    ready: '픽업 대기',
    completed: '픽업 완료',
    cancelled: '취소됨',
    rejected: '주문 거절'
  };
  return map[status] || status;
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
            id, order_number, status, total_price, created_at, shop_id,
            shops(name)
        `)
        .eq('customer_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const orders = (data as any) || [];
      const active = orders.filter((o: Order) => ['pending', 'accepted', 'cooking', 'ready'].includes(o.status));
      const past = orders.filter((o: Order) => !['pending', 'accepted', 'cooking', 'ready'].includes(o.status));
      
      setActiveOrders(active);
      setPastOrders(past);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-[430px] bg-[#F7FAFC] shadow-2xl overflow-x-hidden font-sans text-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 px-6 py-4 backdrop-blur-md border-b border-slate-100">
        <h1 className="text-xl font-bold text-[#1A202C]">주문내역</h1>
      </header>

      <div className="px-4 mt-6">
        
        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5C00]"></span>
              </span>
              진행 중인 주문
            </h2>
            <div className="space-y-4">
              {activeOrders.map(order => {
                const step = getStatusStep(order.status);
                return (
                  <div key={order.id} className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{order.shops?.name}</h3>
                        <p className="text-sm text-slate-500 mt-1 font-mono">{order.order_number}</p>
                      </div>
                      <div className="bg-[#FF5C00]/10 text-[#FF5C00] px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        {getStatusLabel(order.status)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative mt-6 mb-8">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-[#FF5C00] -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                      ></div>
                      <div className="relative flex justify-between text-xs font-bold text-slate-400">
                        <div className={cn("text-center transition-colors", step >= 1 && "text-[#FF5C00]")}>
                          <div className={cn("w-3 h-3 rounded-full mb-2 mx-auto ring-4 ring-white", step >= 1 ? "bg-[#FF5C00]" : "bg-slate-200")}></div>
                          접수
                        </div>
                         <div className={cn("text-center transition-colors", step >= 2 && "text-[#FF5C00]")}>
                          <div className={cn("w-3 h-3 rounded-full mb-2 mx-auto ring-4 ring-white", step >= 2 ? "bg-[#FF5C00]" : "bg-slate-200")}></div>
                          조리
                        </div>
                         <div className={cn("text-center transition-colors", step >= 3 && "text-[#FF5C00]")}>
                          <div className={cn("w-3 h-3 rounded-full mb-2 mx-auto ring-4 ring-white", step >= 3 ? "bg-[#FF5C00]" : "bg-slate-200")}></div>
                          픽업
                        </div>
                      </div>
                    </div>
                    
                     <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-slate-600">
                            {step === 3 ? '픽업대에서 번호를 보여주세요!' : '맛있게 조리하고 있어요 👨‍🍳'}
                        </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Past Orders */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4">지난 주문</h2>
          
          {user && !loading && pastOrders.length === 0 && activeOrders.length === 0 && (
             <div className="text-center py-20 text-slate-400">
                <p className="text-4xl mb-2">🍽️</p>
                <p>주문 내역이 없습니다</p>
             </div>
          )}

          {loading && <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}</div>}

          <div className="space-y-3">
            {pastOrders.map(order => (
               <div key={order.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                        <h3 className="font-bold text-slate-900">{order.shops?.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <Clock className="size-3" />
                            {new Date(order.created_at).toLocaleDateString()}
                        </div>
                     </div>
                     <span className={cn("text-xs font-bold px-2 py-0.5 rounded", 
                        order.status === 'completed' ? "bg-slate-100 text-slate-600" : "bg-red-50 text-red-500"
                     )}>
                        {getStatusLabel(order.status)}
                     </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                     <span className="font-bold text-lg text-slate-900">{order.total_price.toLocaleString()}원</span>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg" onClick={() => navigate(`/shop/${order.shop_id}`)}>
                            <RotateCcw className="size-3 mr-1" /> 재주문
                        </Button>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
