import { ReactNode } from 'react';
import { MobileHeader } from './MobileHeader';
import { OwnerBottomNav } from './OwnerBottomNav';

interface OwnerLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

export function OwnerLayout({ children, title, showBack = false }: OwnerLayoutProps) {
  return (
    <div className="min-h-screen bg-background max-w-[428px] mx-auto relative">
      <MobileHeader title={title} showBack={showBack} />
      <main className="pt-[72px] pb-[88px] px-4">
        {children}
      </main>
      <OwnerBottomNav />
    </div>
  );
}
