import { LayoutDashboard, Store, ClipboardList, Users, ChevronLeft, ChevronRight, LogOut, Calendar, DollarSign } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: '대시보드' },
  { path: '/admin/shops', icon: Store, label: '매장 관리' },
  { path: '/admin/orders', icon: ClipboardList, label: '주문 관리' },
  { path: '/admin/users', icon: Users, label: '회원 관리' },
  { path: '/admin/slots', icon: Calendar, label: '슬롯/운영' },
  { path: '/admin/settlement', icon: DollarSign, label: '정산/매출' },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border z-20 transition-all duration-300 flex flex-col',
        isOpen ? 'w-[260px]' : 'w-[72px]'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {isOpen && <span className="text-heading-sm text-primary font-bold">🍊 관리자</span>}
        <button onClick={onToggle} className="p-2 hover:bg-secondary rounded-lg ml-auto">
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-3">
        {menuItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-body-md',
                isActive
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-secondary'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>{label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-4">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors text-body-md"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span>로그아웃</span>}
        </button>
      </div>
    </aside>
  );
}
