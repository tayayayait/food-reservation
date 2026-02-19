import { ReactNode } from 'react';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  showBottomNav?: boolean;
  rightAction?: ReactNode;
}

export function MobileLayout({
  children,
  title,
  showBack = false,
  showCart = false,
  showBottomNav = true,
  rightAction,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background max-w-[428px] mx-auto relative">
      <MobileHeader title={title} showBack={showBack} showCart={showCart} rightAction={rightAction} />
      <main className="pt-[72px] pb-[88px] px-4">
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
