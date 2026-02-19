import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = searchParams.get('message') || '결제에 실패했습니다.';
  const code = searchParams.get('code');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <XCircle className="w-16 h-16 text-destructive mb-6" />
      <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
      <p className="text-muted-foreground mb-8">
        {message} <br/>
        <span className="text-sm text-neutral-400">(코드: {code})</span>
      </p>
      <div className="flex gap-3 w-full max-w-xs">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => navigate('/')}
        >
          홈으로
        </Button>
        <Button 
          className="flex-1"
          onClick={() => navigate('/cart')}
        >
          장바구니로
        </Button>
      </div>
    </div>
  );
}
