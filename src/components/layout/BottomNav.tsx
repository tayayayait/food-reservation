import { Home, Search, Receipt, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: '홈' },
  { path: '/search', icon: Search, label: '검색' },
  { path: '/orders', icon: Receipt, label: '주문내역' },
  { path: '/mypage', icon: User, label: '마이' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-slate-100 bg-white/95 px-6 pb-6 pt-3 backdrop-blur-lg z-[100] transition-all duration-300">
      <div className="flex justify-between items-center">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors relative",
                isActive ? "text-[#FF5C00]" : "text-slate-400 hover:text-[#FF5C00]/70"
              )}
            >
              <Icon className={cn("size-6 transition-all", isActive ? "fill-current scale-110" : "scale-100")} />
              <span className="text-[10px] font-bold">{label}</span>
              {isActive && (
                <span className="absolute -top-1 right-2 w-1.5 h-1.5 bg-[#FF5C00] rounded-full animate-bounce" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
