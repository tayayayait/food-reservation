import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Store, Shield, Heart, Bell, ChevronRight, Settings } from 'lucide-react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
}

function MenuItem({ icon, label, description, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-card rounded-xl shadow-xs border border-neutral-200 hover:shadow-sm transition-shadow text-left"
    >
      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-lg text-foreground font-medium">{label}</p>
        {description && <p className="text-body-sm text-muted-foreground">{description}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
    </button>
  );
}

export default function MyPage() {
  const { user, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  return (
    <MobileLayout title="마이페이지">
      {!user ? (
        <div className="text-center py-20">
          <p className="text-[48px] mb-4">👤</p>
          <p className="text-heading-md text-muted-foreground mb-2">로그인이 필요합니다</p>
          <p className="text-body-md text-neutral-500 mb-6">로그인하고 더 많은 기능을 이용해보세요</p>
          <Button className="rounded-xl h-11 px-8" onClick={() => navigate('/auth')}>
            로그인 / 회원가입
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-heading-md text-foreground">{user.email?.split('@')[0]}</h3>
                <p className="text-body-sm text-muted-foreground text-ellipsis-1">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="bg-card rounded-xl p-4 shadow-xs border border-neutral-200 text-center hover:shadow-sm transition-shadow"
            >
              <p className="text-heading-md text-primary mb-1">📋</p>
              <p className="text-body-sm text-muted-foreground">주문내역</p>
            </button>
            <button
              className="bg-card rounded-xl p-4 shadow-xs border border-neutral-200 text-center hover:shadow-sm transition-shadow"
            >
              <p className="text-heading-md text-primary mb-1">❤️</p>
              <p className="text-body-sm text-muted-foreground">즐겨찾기</p>
            </button>
            <button
              className="bg-card rounded-xl p-4 shadow-xs border border-neutral-200 text-center hover:shadow-sm transition-shadow"
            >
              <p className="text-heading-md text-primary mb-1">⭐</p>
              <p className="text-body-sm text-muted-foreground">리뷰</p>
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <h3 className="text-heading-sm text-foreground px-1 mb-2">설정</h3>

            <MenuItem
              icon={<Bell className="w-5 h-5 text-primary" />}
              label="알림 설정"
              description="주문 상태 알림을 관리하세요"
              onClick={() => {}}
            />

            <MenuItem
              icon={<Heart className="w-5 h-5 text-primary" />}
              label="즐겨찾기 매장"
              description="자주 가는 매장을 확인하세요"
              onClick={() => {}}
            />

            <MenuItem
              icon={<Settings className="w-5 h-5 text-primary" />}
              label="프로필 편집"
              description="이름, 전화번호 등을 수정하세요"
              onClick={() => {}}
            />
          </div>

          {/* Role switching */}
          {(hasRole('owner') || hasRole('admin')) && (
            <div className="space-y-2">
              <h3 className="text-heading-sm text-foreground px-1 mb-2">관리</h3>

              {hasRole('owner') && (
                <MenuItem
                  icon={<Store className="w-5 h-5 text-primary" />}
                  label="사장님 모드"
                  description="매장을 관리하세요"
                  onClick={() => navigate('/owner')}
                />
              )}

              {hasRole('admin') && (
                <MenuItem
                  icon={<Shield className="w-5 h-5 text-primary" />}
                  label="관리자 모드"
                  description="전체 서비스를 관리하세요"
                  onClick={() => navigate('/admin')}
                />
              )}
            </div>
          )}

          {/* Logout */}
          <Button
            variant="outline-neutral"
            className="w-full h-11 rounded-xl"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" /> 로그아웃
          </Button>
        </div>
      )}
    </MobileLayout>
  );
}
