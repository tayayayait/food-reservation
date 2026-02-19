import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Citrus, Eye, EyeOff, MessageCircle, Mail } from 'lucide-react'; // Using Lucide icons
import { cn } from '@/lib/utils';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        // Navigation handled by OAuth/State change usually, but explicit push is good if not auto-redirected
        navigate('/');
      } else {
        await signUp(email, password);
        toast({ title: '가입 완료', description: '이메일 확인 후 로그인해주세요.' });
      }
    } catch (err: any) {
      let errorMessage = err.message;
      if (err.message.includes('Invalid login credentials')) {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.';
      }
      toast({ title: '로그인 실패', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'kakao' | 'google') => {
    try {
      await signInWithOAuth(provider);
    } catch (err: any) {
      toast({ title: '소셜 로그인 실패', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#16181c] flex flex-col items-center justify-center p-6 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Header / Logo Section */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-[#FF5C00]">
            <Citrus className="size-10 stroke-[2px]" />
          </div>
          <h1 className="text-[#1a202d] dark:text-white text-3xl font-extrabold tracking-tight">Mirijumun</h1>
        </div>
        <h2 className="text-2xl font-bold mt-2">{isLogin ? '환영합니다' : '회원가입'}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          {isLogin ? '빠르고 믿을 수 있는 미리주문' : '맛있는 식사를 시작해보세요'}
        </p>
      </div>

      <div className="w-full max-w-[400px] space-y-6">
        
        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold ml-1">이메일</Label>
            <div className="relative">
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="name@example.com" 
                className="h-14 rounded-xl px-4 bg-slate-50 border-slate-200 focus:border-[#FF5C00] focus:ring-[#FF5C00]/20"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <Label htmlFor="password" className="font-semibold">비밀번호</Label>
              {isLogin && (
                <button type="button" className="text-xs font-medium text-[#FF5C00] hover:underline">
                  비밀번호를 잊으셨나요?
                </button>
              )}
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="비밀번호를 입력하세요" 
                className="h-14 rounded-xl px-4 pr-12 bg-slate-50 border-slate-200 focus:border-[#FF5C00] focus:ring-[#FF5C00]/20"
                required 
                minLength={6}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-[#1a202d] hover:bg-[#1a202d]/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-[#1a202d]/20 mt-2"
            disabled={loading}
          >
            {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-[#16181c] px-4 text-slate-400 font-medium tracking-wider">
              또는
            </span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="space-y-3">
          <button 
            onClick={() => handleSocialLogin('kakao')}
            className="w-full h-14 bg-[#FEE500] text-[#3C1E1E] font-bold rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
          >
            <MessageCircle className="size-5 fill-current" />
            카카오로 시작하기
          </button>
          
          <button 
            onClick={() => handleSocialLogin('google')}
            className="w-full h-14 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-[0.98] hover:bg-slate-50"
          >
             <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Google로 시작하기
          </button>
        </div>

        {/* Demo Mode Section */}
        <div className="pt-6 border-t border-slate-100">
          <p className="text-center text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
            Guest / Demo Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@demo.com');
                setPassword('123123');
                setIsLogin(true);
                // Optionally auto-submit: 
                // setTimeout(() => document.querySelector('form')?.requestSubmit(), 100);
              }}
              className="flex items-center justify-center h-10 rounded-lg bg-slate-800 text-white text-sm font-bold shadow-md hover:bg-slate-700 transition"
            >
              관리자 체험
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('owner@demo.com');
                setPassword('123123');
                setIsLogin(true);
              }}
              className="flex items-center justify-center h-10 rounded-lg bg-slate-600 text-white text-sm font-bold shadow-md hover:bg-slate-500 transition"
            >
              점주 체험
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            * 비밀번호는 123123 입니다. 계정이 없다면 회원가입 해주세요.
          </p>
        </div>

        {/* Footer Toggle */}
        <div className="text-center pt-4">
          <p className="text-slate-500 text-sm">
            {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"} 
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#FF5C00] font-bold hover:underline underline-offset-4 ml-1.5"
            >
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
