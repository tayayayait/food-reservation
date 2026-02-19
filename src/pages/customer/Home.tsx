import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface Shop {
  id: string;
  name: string;
  category: string;
  address: string;
  image_url: string | null;
  is_open: boolean;
  avg_prep_time: number;
}

const categories = ['전체', '한식', '중식', '일식', '양식', '카페', '분식', '치킨', '피자'];

export default function CustomerHome() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    const { data } = await supabase
      .from('shops')
      .select('id, name, category, address, image_url, is_open, avg_prep_time')
      .order('created_at', { ascending: false });
    setShops(data || []);
    setLoading(false);
  };

  const filtered = shops.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === '전체' || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <MobileLayout showCart>
      {/* Hero */}
      <div className="bg-primary rounded-2xl p-5 mb-6 -mx-0">
        <h2 className="text-heading-lg text-primary-foreground mb-1">미리 주문하고</h2>
        <p className="text-body-lg text-primary-foreground/80 mb-4">기다림 없이 픽업하세요! 🍊</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden="true" />
          <Input
            placeholder="매장 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
            className="pl-10 h-11 bg-card border-0 rounded-xl"
            aria-label="매장 검색"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4 scrollbar-hide" role="tablist" aria-label="카테고리 필터">
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-btn-sm whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shop List */}
      <section>
        <h3 className="text-heading-sm text-foreground mb-3">주변 매장</h3>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 bg-card rounded-xl">
                <Skeleton className="w-[100px] h-[100px] rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-heading-md text-neutral-400 mb-2">🏪</p>
            <p className="text-body-lg text-muted-foreground">매장이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(shop => (
              <button
                key={shop.id}
                onClick={() => navigate(`/shop/${shop.id}`)}
                className="w-full flex gap-4 p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="w-[100px] h-[100px] rounded-lg bg-neutral-200 overflow-hidden flex-shrink-0">
                  {shop.image_url ? (
                    <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-heading-lg">🍽️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-heading-sm text-foreground text-ellipsis-1">{shop.name}</h4>
                    <span className={`text-body-xs px-2 py-0.5 rounded-full ${shop.is_open ? 'bg-success-light text-success-dark' : 'bg-neutral-200 text-neutral-500'}`}>
                      {shop.is_open ? '영업중' : '준비중'}
                    </span>
                  </div>
                  <p className="text-body-sm text-muted-foreground mb-1">{shop.category}</p>
                  <div className="flex items-center gap-3 text-body-sm">
                    <span className="flex items-center gap-1 text-primary">
                      <MapPin className="w-3.5 h-3.5" /> 500m
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" /> {shop.avg_prep_time}분
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </MobileLayout>
  );
}
