import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/lib/cart-store';
import { useAuth } from '@/hooks/useAuth';
import { useOrderCreate } from '@/hooks/useOrderCreate';
import { ArrowLeft, Trash2, Minus, Plus, CreditCard, Wallet, Lock, MessageCircle } from 'lucide-react';
import { TimeSlotPicker } from '@/components/ui/time-slot-picker';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Optional, but I might use standard HTML buttons to match Stitch

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { shopId, items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();
  const { createOrder, requestTossPayment, loading } = useOrderCreate();

  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'toss' | 'kakao'>('card');
  const [mode, setMode] = useState<'quick' | 'scheduled'>('quick');

  const handlePayment = async () => {
    if (!user) {
      toast({ title: "로그인이 필요합니다" });
      navigate('/auth');
      return;
    }

    if (items.length === 0) return;

    // Calculate pickup time
    let pickupTime = scheduledTime;
    if (mode === 'quick') {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 15); // Default 15 mins for quick
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      pickupTime = `${h}:${m}`;
    }

    if (!pickupTime) {
      toast({ title: "픽업 시간을 선택해주세요" });
      return;
    }
    
    try {
      const order = await createOrder({
        userId: user.id,
        shopId: shopId!,
        items,
        totalPrice: totalPrice(),
        pickupTime,
        note
      });

      if (order) {
        await requestTossPayment(order, user.email || 'Guest');
        clearCart();
      }
    } catch (error: any) {
       // Error handled in hook or here
       toast({ title: "주문 실패", description: error.message, variant: "destructive" });
    }
  };

  const discount = 0; // Logic for discount if any
  const finalPrice = totalPrice() - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex flex-col items-center justify-center p-4 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-[#1a212d] mb-2">장바구니가 비어있습니다</h2>
        <p className="text-slate-500 mb-6">맛있는 음식을 담아보세요!</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#FF5C00] text-white rounded-xl font-bold"
        >
          메뉴 보러가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F7FAFC] font-sans text-[#1a212d] min-h-screen pb-40 relative mx-auto max-w-[430px]">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#F7FAFC]/80 backdrop-blur-md px-4 pt-6 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center size-10 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <ArrowLeft className="size-5 text-[#1a212d]" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-[#1a212d]">장바구니</h1>
          <div className="size-10"></div>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-6">
        
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.itemId} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex gap-4">
              <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {item.imageUrl ? (
                   <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.name} />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#1a212d] text-base leading-tight line-clamp-1">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(item.itemId)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                  {item.options.length > 0 && (
                    <p className="text-slate-500 text-xs mt-1">{item.options.map(o => o.name).join(', ')}</p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-[#1a212d]">{(item.price * item.quantity).toLocaleString()}원</span>
                  <div className="flex items-center gap-3 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                    <button 
                      onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                      className="size-6 flex items-center justify-center rounded-full text-[#FF5C00] hover:bg-[#FF5C00]/10"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      className="size-6 flex items-center justify-center rounded-full text-[#FF5C00] hover:bg-[#FF5C00]/10"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pickup Time */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-4">
           <h2 className="text-lg font-bold text-[#1a212d]">픽업 시간</h2>
           <div className="flex bg-slate-100 p-1 rounded-xl">
             <button
               onClick={() => setMode('quick')}
               className={cn(
                 "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                 mode === 'quick' ? "bg-white text-[#FF5C00] shadow-sm" : "text-slate-500"
               )}
             >
               지금 갈게요 (+15분)
             </button>
             <button
               onClick={() => setMode('scheduled')}
               className={cn(
                 "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                 mode === 'scheduled' ? "bg-white text-[#FF5C00] shadow-sm" : "text-slate-500"
               )}
             >
               예약할게요
             </button>
           </div>
           
           {mode === 'scheduled' && (
             <div className="animate-in fade-in slide-in-from-top-2">
                <TimeSlotPicker 
                  selectedTime={scheduledTime}
                  onSelectTime={setScheduledTime}
                  prepTimeMinutes={15}
                />
             </div>
           )}
        </section>

        {/* Request Note */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
           <h2 className="text-lg font-bold text-[#1a212d] mb-3">요청사항</h2>
           <Textarea 
             placeholder="예: 견과류 빼주세요, 일회용품 X" 
             value={note}
             onChange={(e) => setNote(e.target.value)}
             className="bg-slate-50 border-slate-200 focus:border-[#FF5C00]"
           />
        </section>

        {/* Payment Method */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1a212d]">결제 수단</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'card', label: '카드', icon: CreditCard },
              { id: 'toss', label: '토스', icon: Wallet },
              { id: 'kakao', label: '카카오', icon: MessageCircle },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all h-24",
                  paymentMethod === method.id 
                    ? "border-[#FF5C00] bg-[#FF5C00]/5 text-[#FF5C00]" 
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                )}
              >
                <method.icon className={cn("size-6", paymentMethod === method.id ? "text-[#FF5C00]" : "text-slate-400")} />
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Summary Section */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-lg font-bold text-[#1a212d] mb-2">결제 정보</h2>
          <div className="flex justify-between text-slate-500">
            <span>주문 금액</span>
            <span>{totalPrice().toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>할인</span>
            <span className="text-[#FF5C00]">-{discount}원</span>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-lg font-bold text-[#1a212d]">Total</span>
            <span className="text-xl font-bold text-[#1a212d]">{finalPrice.toLocaleString()}원</span>
          </div>
        </section>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 py-2 text-slate-400">
          <Lock className="size-4" />
          <span className="text-xs uppercase tracking-widest font-semibold">Secure Payment Guaranteed</span>
        </div>
      </main>

      {/* Fixed Footer Action */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-4 pt-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-[430px] mx-auto">
          <Button 
            onClick={handlePayment}
            className="w-full bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-[#FF5C00]/30 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? '결제 처리 중...' : `${finalPrice.toLocaleString()}원 결제하기`}
          </Button>
        </div>
      </footer>
    </div>
  );
}
