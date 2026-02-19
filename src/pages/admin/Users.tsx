import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Search, UserCog, Users as UsersIcon } from 'lucide-react';

const roleLabels: Record<string, { label: string; color: string }> = {
  customer: { label: '고객', color: 'bg-neutral-200 text-neutral-600' },
  owner: { label: '사장님', color: 'bg-primary-50 text-primary' },
  admin: { label: '관리자', color: 'bg-error-light text-error-dark' },
};

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, user_roles(role)')
      .order('created_at', { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  };

  const addRole = async (userId: string, role: 'customer' | 'owner' | 'admin') => {
    const { error } = await supabase.from('user_roles').insert({ user_id: userId, role });
    if (error) {
      if (error.code === '23505') {
        toast({ title: '이미 해당 역할이 부여되어 있습니다', variant: 'destructive' });
      } else {
        toast({ title: '역할 추가 실패', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: '역할 추가 완료 ✅' });
      fetchUsers();
    }
  };

  const removeRole = async (userId: string, role: 'customer' | 'owner' | 'admin') => {
    if (role === 'customer') return; // customer는 삭제 불가
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role as 'customer' | 'owner' | 'admin');
    if (error) {
      toast({ title: '역할 삭제 실패', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '역할 삭제 완료' });
      fetchUsers();
    }
  };

  const filtered = profiles.filter(
    p =>
      !search ||
      p.username?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search),
  );

  return (
    <AdminLayout title="회원 관리">
      <div className="space-y-4">
        {/* Search */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="닉네임 또는 연락처 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-body-sm text-muted-foreground">총 {filtered.length}명</p>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-neutral-200 overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  닉네임
                </th>
                <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  역할
                </th>
                <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  연락처
                </th>
                <th className="text-right px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  가입일
                </th>
                <th className="text-right px-4 py-3 text-body-md font-semibold text-muted-foreground">
                  역할 관리
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const roles = (p.user_roles || []).map((r: any) => r.role);
                return (
                  <tr key={p.id} className="border-t border-neutral-200 hover:bg-secondary/50">
                    <td className="px-4 py-3 text-body-md text-foreground font-medium">
                      {p.username || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(p.user_roles || []).map((r: any) => {
                          const rl = roleLabels[r.role] || roleLabels.customer;
                          return (
                            <button
                              key={r.role}
                              onClick={() => {
                                if (r.role !== 'customer' && confirm(`"${r.role}" 역할을 삭제하시겠습니까?`)) {
                                  removeRole(p.id, r.role);
                                }
                              }}
                              className={`text-body-xs px-2 py-0.5 rounded-full font-medium ${rl.color} ${
                                r.role !== 'customer' ? 'cursor-pointer hover:opacity-70' : ''
                              }`}
                              title={r.role !== 'customer' ? '클릭하여 역할 삭제' : ''}
                            >
                              {rl.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-md text-muted-foreground">
                      {p.phone || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-body-sm text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {!roles.includes('owner') && (
                          <button
                            onClick={() => addRole(p.id, 'owner')}
                            className="text-body-xs px-2 py-1 rounded-lg bg-primary-50 text-primary hover:bg-primary-100 transition-colors"
                          >
                            +사장님
                          </button>
                        )}
                        {!roles.includes('admin') && (
                          <button
                            onClick={() => addRole(p.id, 'admin')}
                            className="text-body-xs px-2 py-1 rounded-lg bg-error-light text-error-dark hover:bg-error/20 transition-colors"
                          >
                            +관리자
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="text-center py-16">
              <UsersIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-body-lg text-muted-foreground">회원이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
