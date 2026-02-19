import { useState, useEffect } from 'react';
import { useOwnerOrders, Order, OrderStatus } from '@/hooks/useOwnerOrders';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Clock, Timer, AlertTriangle, List, History, Settings, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function OwnerOrders() {
  const { user } = useAuth();
  const { orders, loading, updateStatus } = useOwnerOrders(user?.id);
  const [filter, setFilter] = useState<'active' | 'completed'>('active');

  const filteredOrders = orders.filter(o => {
    if (filter === 'active') {
      return ['pending', 'accepted', 'cooking', 'delayed'].includes(o.status);
    }
    return ['ready', 'rejected', 'cancelled'].includes(o.status);
  });

  const getElapsedTime = (dateStr: string) => {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko });
  };

  const statusColors: Record<OrderStatus, string> = {
    pending: 'text-[#1f83e0] bg-[#1f83e0]/10',
    accepted: 'text-[#1f83e0] bg-[#1f83e0]/10',
    cooking: 'text-[#D69E2E] bg-[#D69E2E]/10',
    ready: 'text-[#38A169] bg-[#38A169]/10',
    rejected: 'text-[#E53E3E] bg-[#E53E3E]/10',
    cancelled: 'text-slate-500 bg-slate-100',
    delayed: 'text-[#E53E3E] bg-[#E53E3E]/10',
  };

  const statusLabels: Record<OrderStatus, string> = {
    pending: 'NEW',
    accepted: 'ACCEPTED',
    cooking: 'COOKING',
    ready: 'READY',
    rejected: 'REJECTED',
    cancelled: 'CANCELLED',
    delayed: 'DELAYED',
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading orders...</div>;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] text-slate-900 font-sans">
      
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 pt-4 pb-2 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <List className="text-[#1f83e0] size-8" />
            <h1 className="text-xl font-extrabold tracking-tight">Order Queue</h1>
          </div>
          <div className="flex items-center gap-2 bg-[#38A169]/10 px-3 py-1 rounded-full">
            <span className="size-2 rounded-full bg-[#38A169] animate-pulse"></span>
            <span className="text-[#38A169] text-xs font-bold uppercase tracking-wider">Shop Open</span>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 p-1 mb-2">
          <button
            onClick={() => setFilter('active')}
            className={cn(
              "flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 font-bold text-sm transition-all",
              filter === 'active' ? "bg-white text-[#1f83e0] shadow-sm" : "text-slate-500"
            )}
          >
            Active ({orders.filter(o => ['pending', 'accepted', 'cooking', 'delayed'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={cn(
              "flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 font-bold text-sm transition-all",
              filter === 'completed' ? "bg-white text-[#1f83e0] shadow-sm" : "text-slate-500"
            )}
          >
            Completed
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4 pb-24">
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-slate-400">
             <p className="text-lg font-bold">No {filter} orders</p>
          </div>
        )}

        {filteredOrders.map(order => (
          <div key={order.id} className={cn(
            "bg-white rounded-xl shadow-md border-l-8 overflow-hidden transition-all",
            order.status === 'pending' ? "border-[#1f83e0]" : 
            order.status === 'cooking' ? "border-[#D69E2E]" : 
            "border-slate-200"
          )}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">#{order.order_number.split('-')[1]}</h2>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase",
                  statusColors[order.status]
                )}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-slate-600 font-mono font-bold text-lg">
                  <Clock className="size-4" />
                  {order.pickup_time || 'ASAP'}
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                  {getElapsedTime(order.created_at)} ago
                </p>
              </div>
            </div>

            <div className="p-4 space-y-4">
               {order.order_items.map((item: any) => (
                 <div key={item.id} className="flex items-start gap-3">
                   <div className="bg-slate-100 rounded-lg px-3 py-1 font-extrabold text-lg text-[#1f83e0]">
                     {item.quantity}x
                   </div>
                   <div className="flex-1">
                     <p className="text-lg font-bold leading-tight">{item.item_name}</p>
                     {/* Options would go here if available in flattened structure */}
                   </div>
                 </div>
               ))}
               
               {order.note && (
                 <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm text-yellow-800 font-medium flex gap-2">
                   <AlertTriangle className="size-4 shrink-0" />
                   {order.note}
                 </div>
               )}
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              {order.status === 'pending' && (
                <>
                  <button 
                    onClick={() => updateStatus(order.id, 'rejected')}
                    className="flex-1 h-14 bg-[#E53E3E] text-white rounded-lg font-extrabold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <XCircle className="size-6" />
                    Reject
                  </button>
                  <button 
                    onClick={() => updateStatus(order.id, 'accepted')}
                    className="flex-[2] h-14 bg-[#1f83e0] text-white rounded-lg font-extrabold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <CheckCircle className="size-6" />
                    Accept
                  </button>
                </>
              )}
              {order.status === 'accepted' && (
                <button 
                  onClick={() => updateStatus(order.id, 'cooking')}
                  className="w-full h-14 bg-[#D69E2E] text-white rounded-lg font-extrabold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Timer className="size-6" />
                  Start Cooking
                </button>
              )}
              {order.status === 'cooking' && (
                 <button 
                   onClick={() => updateStatus(order.id, 'ready')}
                   className="w-full h-14 bg-[#38A169] text-white rounded-lg font-extrabold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                 >
                   <CheckCircle className="size-6" />
                   Mark Ready
                 </button>
              )}
               {['ready', 'rejected', 'cancelled'].includes(order.status) && (
                 <div className="w-full h-14 flex items-center justify-center text-slate-400 font-bold bg-slate-100 rounded-lg">
                   {order.status === 'ready' ? 'Completed' : 'Ended'}
                 </div>
               )}
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pb-6 pt-2 z-20">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-[#1f83e0]">
            <List className="size-6" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Orders</p>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-[#1f83e0]">
            <History className="size-6" />
            <p className="text-[10px] font-bold uppercase tracking-widest">History</p>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-[#1f83e0]">
            <Package className="size-6" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Stock</p>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-[#1f83e0]">
            <Settings className="size-6" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Settings</p>
          </button>
        </div>
      </nav>
    </div>
  );
}
