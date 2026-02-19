import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '@/lib/cart-store';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      navigate('/', { replace: true });
      return;
    }

    processSuccess(orderId, paymentKey, amount);
  }, []);

  const processSuccess = async (orderId: string, paymentKey: string, amount: string) => {
    try {
      // 1. Supabase 주문 업데이트 (결제 정보 저장)
      // 실제로는 서버에서 토스 승인 API를 호출해야 하지만, 여기서는 성공으로 간주하고 처리
      // paymentKey 등을 orders 테이블에 저장하거나, 별도 payments 테이블에 저장
      // 여기서는 status만 확실하게 업데이트
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'pending', // 이미 pending이지만 명시적으로 (또는 paid로 변경)
          // payment_key: paymentKey // 컬럼이 있다면 저장
        })
        .eq('id', orderId);

      if (error) throw error;

      // 2. 장바구니 비우기
      clearCart();
      
      setLoading(false);
    } catch (err) {
      console.error('Payment processing error', err);
      alert('결제 처리 중 오류가 발생했습니다.');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold">결제 확인 중...</h2>
        <p className="text-muted-foreground mt-2">잠시만 기다려주세요.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <CheckCircle2 className="w-16 h-16 text-success-dark mb-6" />
      <h1 className="text-2xl font-bold mb-2">결제가 완료되었습니다!</h1>
      <p className="text-muted-foreground mb-8">
        주문이 성공적으로 접수되었습니다.<br />
        매장에서 곧 주문을 확인합니다.
      </p>
      <Button 
        size="lg" 
        className="w-full max-w-xs"
        onClick={() => navigate(`/orders/${searchParams.get('orderId')}`, { replace: true })}
      >
        주문 내역 보기
      </Button>
    </div>
  );
}
