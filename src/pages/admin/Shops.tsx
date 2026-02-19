import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Store } from 'lucide-react';

export default function AdminShops() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', category: '한식', address: '', phone: '', description: '' });

  useEffect(() => { fetchShops(); }, []);

  const fetchShops = async () => {
    const { data } = await supabase.from('shops').select('*').order('created_at', { ascending: false });
    setShops(data || []);
    setLoading(false);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    if (editId) {
      await supabase.from('shops').update(form).eq('id', editId);
    } else {
      await supabase.from('shops').insert(form);
    }
    setShowDialog(false);
    setEditId(null);
    setForm({ name: '', category: '한식', address: '', phone: '', description: '' });
    fetchShops();
    toast({ title: editId ? '매장 수정 완료' : '매장 추가 완료' });
  };

  const remove = async (id: string) => {
    await supabase.from('shops').delete().eq('id', id);
    fetchShops();
    toast({ title: '매장 삭제 완료' });
  };

  return (
    <AdminLayout title="매장 관리">
      <div className="flex justify-between items-center mb-6">
        <p className="text-body-lg text-muted-foreground">총 {shops.length}개 매장</p>
        <Button className="rounded-xl" onClick={() => { setForm({ name: '', category: '한식', address: '', phone: '', description: '' }); setEditId(null); setShowDialog(true); }}>
          <Plus className="w-4 h-4 mr-1" /> 매장 추가
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">매장명</th>
              <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">카테고리</th>
              <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">상태</th>
              <th className="text-left px-4 py-3 text-body-md font-semibold text-muted-foreground">주소</th>
              <th className="text-right px-4 py-3 text-body-md font-semibold text-muted-foreground">관리</th>
            </tr>
          </thead>
          <tbody>
            {shops.map(shop => (
              <tr key={shop.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-4 py-3 text-body-md text-foreground font-medium">{shop.name}</td>
                <td className="px-4 py-3 text-body-md text-muted-foreground">{shop.category}</td>
                <td className="px-4 py-3">
                  <span className={`text-body-xs px-2 py-1 rounded-full ${shop.is_open ? 'bg-success-light text-success-dark' : 'bg-neutral-200 text-neutral-500'}`}>
                    {shop.is_open ? '영업중' : '준비중'}
                  </span>
                </td>
                <td className="px-4 py-3 text-body-md text-muted-foreground">{shop.address || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setForm({ name: shop.name, category: shop.category, address: shop.address || '', phone: shop.phone || '', description: shop.description || '' }); setEditId(shop.id); setShowDialog(true); }} className="p-2 hover:bg-secondary rounded-lg">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => remove(shop.id)} className="p-2 hover:bg-secondary rounded-lg">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shops.length === 0 && !loading && (
          <div className="text-center py-16">
            <Store className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-lg text-muted-foreground">등록된 매장이 없습니다</p>
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? '매장 수정' : '매장 추가'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>매장명</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><Label>카테고리</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
            <div><Label>주소</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></div>
            <div><Label>전화번호</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
            <div><Label>설명</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button onClick={save}>저장</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
