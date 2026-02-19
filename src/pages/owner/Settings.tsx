import { useEffect, useState } from 'react';
import { OwnerLayout } from '@/components/layout/OwnerLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Store, Clock, Phone, MapPin, CreditCard, Settings } from 'lucide-react';

export default function OwnerSettings() {
  const { user } = useAuth();
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchShop();
  }, [user]);

  const fetchShop = async () => {
    const { data: ownership } = await supabase
      .from('shop_owners')
      .select('shop_id')
      .eq('user_id', user!.id)
      .limit(1)
      .single();
    if (ownership) {
      const { data } = await supabase.from('shops').select('*').eq('id', ownership.shop_id).single();
      setShop(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!shop) return;
    setSaving(true);
    const { error } = await supabase
      .from('shops')
      .update({
        name: shop.name,
        description: shop.description,
        address: shop.address,
        phone: shop.phone,
        category: shop.category,
        is_open: shop.is_open,
        avg_prep_time: shop.avg_prep_time,
        min_order_amount: shop.min_order_amount,
      })
      .eq('id', shop.id);

    if (error) toast({ title: '오류', description: error.message, variant: 'destructive' });
    else toast({ title: '저장 완료 ✅', description: '변경사항이 적용되었습니다.' });
    setSaving(false);
  };

  if (loading) {
    return (
      <OwnerLayout title="매장 설정">
        <div className="space-y-4">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </OwnerLayout>
    );
  }

  if (!shop) {
    return (
      <OwnerLayout title="매장 설정">
        <div className="text-center py-16">
          <p className="text-[48px] mb-4">🏪</p>
          <p className="text-heading-md text-muted-foreground">등록된 매장이 없습니다</p>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title="매장 설정">
      <div className="space-y-6">
        {/* 영업 상태 토글 */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  shop.is_open ? 'bg-success-light' : 'bg-neutral-200'
                }`}
              >
                <Store className={`w-5 h-5 ${shop.is_open ? 'text-success-dark' : 'text-neutral-500'}`} />
              </div>
              <div>
                <p className="text-heading-sm text-foreground">영업 상태</p>
                <p className="text-body-sm text-muted-foreground">
                  {shop.is_open ? '영업 중' : '영업 종료'}
                </p>
              </div>
            </div>
            <Switch
              checked={shop.is_open}
              onCheckedChange={v => setShop({ ...shop, is_open: v })}
            />
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-neutral-200 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="text-heading-sm text-foreground">기본 정보</h3>
          </div>

          <div>
            <Label>매장명</Label>
            <Input
              value={shop.name}
              onChange={e => setShop({ ...shop, name: e.target.value })}
              placeholder="매장 이름"
            />
          </div>

          <div>
            <Label>카테고리</Label>
            <Input
              value={shop.category || ''}
              onChange={e => setShop({ ...shop, category: e.target.value })}
              placeholder="예: 카페, 한식, 분식"
            />
          </div>

          <div>
            <Label>소개</Label>
            <Textarea
              value={shop.description || ''}
              onChange={e => setShop({ ...shop, description: e.target.value })}
              placeholder="매장을 소개해주세요"
              maxChars={200}
              charCount={(shop.description || '').length}
            />
          </div>
        </div>

        {/* 연락처 & 위치 */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-neutral-200 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-heading-sm text-foreground">연락처 & 위치</h3>
          </div>

          <div>
            <Label className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> 주소
            </Label>
            <Input
              value={shop.address || ''}
              onChange={e => setShop({ ...shop, address: e.target.value })}
              placeholder="매장 주소"
            />
          </div>

          <div>
            <Label className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> 전화번호
            </Label>
            <Input
              value={shop.phone || ''}
              onChange={e => setShop({ ...shop, phone: e.target.value })}
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        {/* 주문 설정 */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-neutral-200 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-heading-sm text-foreground">주문 설정</h3>
          </div>

          <div>
            <Label className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 평균 조리 시간 (분)
            </Label>
            <Input
              type="number"
              value={shop.avg_prep_time}
              onChange={e => setShop({ ...shop, avg_prep_time: Number(e.target.value) })}
              placeholder="15"
            />
            <p className="text-body-xs text-muted-foreground mt-1">
              고객의 픽업 타임슬롯 계산에 사용됩니다
            </p>
          </div>

          <div>
            <Label className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> 최소 주문 금액 (원)
            </Label>
            <Input
              type="number"
              value={shop.min_order_amount}
              onChange={e => setShop({ ...shop, min_order_amount: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
        </div>

        {/* Save */}
        <Button
          className="w-full h-[52px] rounded-xl text-btn-lg"
          onClick={handleSave}
          loading={saving}
        >
          변경사항 저장
        </Button>
      </div>
    </OwnerLayout>
  );
}
