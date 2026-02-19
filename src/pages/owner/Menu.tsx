import { useEffect, useState } from 'react';
import { OwnerLayout } from '@/components/layout/OwnerLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Image, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function OwnerMenu() {
  const { user } = useAuth();
  const [shopId, setShopId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [showCatDialog, setShowCatDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [catName, setCatName] = useState('');
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    imageUrl: '',
  });
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchShop();
  }, [user]);

  const fetchShop = async () => {
    const { data } = await supabase
      .from('shop_owners')
      .select('shop_id')
      .eq('user_id', user!.id)
      .limit(1)
      .single();
    if (data) {
      setShopId(data.shop_id);
      fetchMenu(data.shop_id);
    } else {
      setLoading(false);
    }
  };

  const fetchMenu = async (sid: string) => {
    const { data: cats } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('shop_id', sid)
      .order('sort_order');
    setCategories(cats || []);

    const itemMap: Record<string, any[]> = {};
    for (const cat of cats || []) {
      const { data: menuItems } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category_id', cat.id)
        .order('sort_order');
      itemMap[cat.id] = menuItems || [];
    }
    setItems(itemMap);
    setLoading(false);
  };

  const saveCategory = async () => {
    if (!shopId || !catName.trim()) return;
    setSaving(true);
    if (editCatId) {
      await supabase.from('menu_categories').update({ name: catName }).eq('id', editCatId);
    } else {
      await supabase
        .from('menu_categories')
        .insert({ shop_id: shopId, name: catName });
    }
    setShowCatDialog(false);
    setCatName('');
    setEditCatId(null);
    fetchMenu(shopId);
    toast({ title: editCatId ? '카테고리 수정 ✅' : '카테고리 추가 ✅' });
    setSaving(false);
  };

  const deleteCategory = async (catId: string) => {
    if (!confirm('이 카테고리와 소속 메뉴를 모두 삭제합니다.')) return;
    await supabase.from('menu_categories').delete().eq('id', catId);
    if (shopId) fetchMenu(shopId);
    toast({ title: '카테고리 삭제 완료' });
  };

  const saveItem = async () => {
    if (!itemForm.categoryId || !itemForm.name.trim()) return;
    setSaving(true);
    const payload: any = {
      name: itemForm.name,
      description: itemForm.description,
      price: itemForm.price,
      image_url: itemForm.imageUrl || null,
    };

    if (editItemId) {
      await supabase.from('menu_items').update(payload).eq('id', editItemId);
    } else {
      await supabase.from('menu_items').insert({
        ...payload,
        category_id: itemForm.categoryId,
      });
    }
    setShowItemDialog(false);
    setItemForm({ name: '', description: '', price: 0, categoryId: '', imageUrl: '' });
    setEditItemId(null);
    if (shopId) fetchMenu(shopId);
    toast({ title: editItemId ? '메뉴 수정 ✅' : '메뉴 추가 ✅' });
    setSaving(false);
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('이 메뉴를 삭제합니다.')) return;
    await supabase.from('menu_items').delete().eq('id', itemId);
    if (shopId) fetchMenu(shopId);
    toast({ title: '메뉴 삭제 완료' });
  };

  const toggleSoldOut = async (itemId: string, current: boolean) => {
    await supabase.from('menu_items').update({ is_sold_out: !current }).eq('id', itemId);
    if (shopId) fetchMenu(shopId);
    toast({
      title: current ? '판매 재개 ✅' : '품절 처리 ✅',
    });
  };

  return (
    <OwnerLayout title="메뉴 관리">
      {!shopId ? (
        <div className="text-center py-16 text-muted-foreground">등록된 매장이 없습니다</div>
      ) : loading ? (
        <div className="text-center py-8 text-muted-foreground">불러오는 중...</div>
      ) : (
        <>
          <Button
            className="rounded-xl mb-4"
            onClick={() => {
              setCatName('');
              setEditCatId(null);
              setShowCatDialog(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> 카테고리 추가
          </Button>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[48px] mb-4">📂</p>
              <p className="text-body-lg text-muted-foreground">카테고리가 없습니다</p>
              <p className="text-body-sm text-neutral-500 mt-1">카테고리를 추가하여 메뉴를 관리하세요</p>
            </div>
          )}

          {categories.map(cat => (
            <div key={cat.id} className="mb-6">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3 bg-card rounded-xl p-3 shadow-xs border border-neutral-200">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-neutral-300" />
                  <h3 className="text-heading-sm text-foreground">{cat.name}</h3>
                  <span className="text-body-xs text-neutral-400">
                    ({(items[cat.id] || []).length}개)
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setCatName(cat.name);
                      setEditCatId(cat.id);
                      setShowCatDialog(true);
                    }}
                    className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="카테고리 수정"
                  >
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 hover:bg-error-light rounded-lg transition-colors"
                    aria-label="카테고리 삭제"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                  <Button
                    size="xs"
                    variant="outline"
                    className="rounded-lg ml-1"
                    onClick={() => {
                      setItemForm({
                        name: '',
                        description: '',
                        price: 0,
                        categoryId: cat.id,
                        imageUrl: '',
                      });
                      setEditItemId(null);
                      setShowItemDialog(true);
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" /> 메뉴
                  </Button>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2 pl-2">
                {(items[cat.id] || []).map((item: any) => (
                  <div
                    key={item.id}
                    className={`bg-card rounded-xl p-3 shadow-sm border border-neutral-200 flex items-center gap-3 ${
                      item.is_sold_out ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-[52px] h-[52px] rounded-lg bg-neutral-200 overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-body-lg text-foreground text-ellipsis-1 font-medium">
                          {item.name}
                        </span>
                        {item.is_sold_out && (
                          <span className="text-body-xs text-white bg-error px-1.5 py-0.5 rounded font-bold">
                            품절
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-body-sm text-muted-foreground text-ellipsis-1">
                          {item.description}
                        </p>
                      )}
                      <span className="font-price text-body-md text-primary">
                        {item.price.toLocaleString()}원
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleSoldOut(item.id, item.is_sold_out)}
                        className={`text-body-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                          item.is_sold_out
                            ? 'bg-success-light text-success-dark hover:bg-success/20'
                            : 'bg-error-light text-error-dark hover:bg-error/20'
                        }`}
                      >
                        {item.is_sold_out ? '판매' : '품절'}
                      </button>
                      <button
                        onClick={() => {
                          setItemForm({
                            name: item.name,
                            description: item.description || '',
                            price: item.price,
                            categoryId: cat.id,
                            imageUrl: item.image_url || '',
                          });
                          setEditItemId(item.id);
                          setShowItemDialog(true);
                        }}
                        className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                        aria-label="메뉴 수정"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 hover:bg-error-light rounded-lg transition-colors"
                        aria-label="메뉴 삭제"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Category Dialog */}
          <Dialog open={showCatDialog} onOpenChange={setShowCatDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editCatId ? '카테고리 수정' : '카테고리 추가'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>카테고리명</Label>
                  <Input
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    placeholder="예: 인기메뉴, 사이드, 음료"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button loading={saving} onClick={saveCategory}>
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Item Dialog */}
          <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editItemId ? '메뉴 수정' : '메뉴 추가'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>메뉴명 *</Label>
                  <Input
                    value={itemForm.name}
                    onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="예: 아메리카노"
                  />
                </div>
                <div>
                  <Label>설명</Label>
                  <Textarea
                    value={itemForm.description}
                    onChange={e =>
                      setItemForm(p => ({ ...p, description: e.target.value }))
                    }
                    placeholder="메뉴에 대한 간단한 설명"
                    maxChars={100}
                    charCount={itemForm.description.length}
                  />
                </div>
                <div>
                  <Label>가격 (원) *</Label>
                  <Input
                    type="number"
                    value={itemForm.price}
                    onChange={e =>
                      setItemForm(p => ({ ...p, price: Number(e.target.value) }))
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>이미지 URL</Label>
                  <Input
                    value={itemForm.imageUrl}
                    onChange={e =>
                      setItemForm(p => ({ ...p, imageUrl: e.target.value }))
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  {itemForm.imageUrl && (
                    <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-neutral-200">
                      <img
                        src={itemForm.imageUrl}
                        alt="미리보기"
                        className="w-full h-full object-cover"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button loading={saving} onClick={saveItem}>
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </OwnerLayout>
  );
}
