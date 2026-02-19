import { Home, Search, ClipboardList, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: '홈' },
  { path: '/search', icon: Search, label: '검색' },
  { path: '/orders', icon: ClipboardList, label: '주문내역' },
  { path: '/mypage', icon: User, label: '마이' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-card shadow-top safe-bottom border-t border-border">
      <div className="flex items-center h-14 max-w-[428px] mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors',
                isActive ? 'text-primary' : 'text-neutral-500'
              )}
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-body-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
