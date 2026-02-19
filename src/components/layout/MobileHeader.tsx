import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/lib/cart-store';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  rightAction?: React.ReactNode;
}

export function MobileHeader({ title, showBack = false, showCart = false, rightAction }: MobileHeaderProps) {
  const navigate = useNavigate();
  const totalItems = useCartStore(s => s.totalItems());

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center h-14 px-4 bg-card border-b border-border">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors" aria-label="뒤로가기">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        {title && <h1 className="text-heading-sm text-foreground text-ellipsis-1">{title}</h1>}
      </div>
      <div className="flex items-center gap-1">
        {showCart && (
          <button onClick={() => navigate('/cart')} className="relative p-2 hover:bg-secondary rounded-full transition-colors" aria-label="장바구니">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-body-xs w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                {totalItems}
              </span>
            )}
          </button>
        )}
        {rightAction}
      </div>
    </header>
  );
}
