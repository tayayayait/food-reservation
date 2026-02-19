import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut, Heart, Bell, ChevronRight, Settings, Star, Shield, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MyPage() {
  const { user, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
        <div className="relative mx-auto min-h-screen max-w-[430px] bg-[#F7FAFC] flex flex-col items-center justify-center p-6 text-center shadow-2xl overflow-x-hidden font-sans">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <User className="size-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">로그인이 필요해요</h2>
            <p className="text-slate-500 mb-8">주문 내역과 혜택을 확인하려면 로그인해주세요</p>
            <Button onClick={() => navigate('/auth')} className="w-full h-12 rounded-xl text-lg font-bold bg-[#FF5C00] hover:bg-[#FF5C00]/90">
                로그인 / 회원가입
            </Button>
        </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-[430px] bg-[#F7FAFC] shadow-2xl overflow-x-hidden font-sans text-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 px-6 py-4 backdrop-blur-md">
        <h1 className="text-xl font-bold text-[#1A202C]">마이페이지</h1>
      </header>

      <div className="px-4 mt-6 space-y-6">
        
        {/* Profile Card */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-white shadow-sm ring-1 ring-slate-100">
                <User className="size-12 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.email?.split('@')[0]}</h2>
            <p className="text-sm text-slate-400 mt-1">{user.email}</p>
            <button className="text-xs font-bold text-[#FF5C00] mt-3 border border-[#FF5C00]/30 rounded-full px-3 py-1">
                프로필 편집
            </button>
            
            {/* Stats Row */}
            <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-slate-50">
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-900">0</p>
                    <p className="text-xs text-slate-400 font-medium">주문</p>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-900">0</p>
                    <p className="text-xs text-slate-400 font-medium">리뷰</p>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-900">0 P</p>
                    <p className="text-xs text-slate-400 font-medium">포인트</p>
                </div>
            </div>
        </section>

        {/* Menu List */}
        <section className="space-y-3">
             <h3 className="text-sm font-bold text-slate-500 px-2">설정</h3>
             
             <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 text-pink-500 rounded-lg">
                        <Heart className="size-5" />
                    </div>
                    <span className="font-bold text-slate-700">즐겨찾기</span>
                </div>
                <ChevronRight className="size-5 text-slate-300" />
             </button>

             <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 text-yellow-500 rounded-lg">
                        <Star className="size-5" />
                    </div>
                    <span className="font-bold text-slate-700">나의 리뷰</span>
                </div>
                <ChevronRight className="size-5 text-slate-300" />
             </button>

             <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                        <Bell className="size-5" />
                    </div>
                    <span className="font-bold text-slate-700">알림 설정</span>
                </div>
                <ChevronRight className="size-5 text-slate-300" />
             </button>
        </section>

        {/* Admin/Owner Sections */}
        {(hasRole('owner') || hasRole('admin')) && (
            <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 px-2">관리자</h3>
                {hasRole('owner') && (
                     <button onClick={() => navigate('/owner')} className="w-full flex items-center justify-between p-4 bg-slate-800 rounded-2xl shadow-sm text-white active:scale-[0.99] transition-transform">
                        <div className="flex items-center gap-3">
                            <Store className="size-5" />
                            <span className="font-bold">사장님 모드</span>
                        </div>
                        <ChevronRight className="size-5 text-slate-400" />
                    </button>
                )}
                 {hasRole('admin') && (
                     <button onClick={() => navigate('/admin')} className="w-full flex items-center justify-between p-4 bg-slate-900 rounded-2xl shadow-sm text-white active:scale-[0.99] transition-transform">
                        <div className="flex items-center gap-3">
                            <Shield className="size-5" />
                            <span className="font-bold">관리자 모드</span>
                        </div>
                        <ChevronRight className="size-5 text-slate-400" />
                    </button>
                )}
            </section>
        )}

        <button onClick={handleLogout} className="w-full py-4 text-center text-red-500 font-bold text-sm hover:underline">
            로그아웃
        </button>

      </div>
    </div>
  );
}
