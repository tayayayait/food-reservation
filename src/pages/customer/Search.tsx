import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, X, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ShopResult {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
  is_open: boolean;
}

interface MenuResult {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  is_sold_out: boolean;
  menu_categories: { shop_id: string; shops: { name: string } | null } | null;
}

const RECENT_KEY = 'recent-searches';
const MAX_RECENT = 10;

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecent(term: string) {
  const list = getRecent().filter(t => t !== term);
  list.unshift(term);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
}

function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [shops, setShops] = useState<ShopResult[]>([]);
  const [menus, setMenus] = useState<MenuResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecent());
  const [activeTab, setActiveTab] = useState<'shop' | 'menu'>('shop');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute search
  useEffect(() => {
    if (!debouncedQuery) {
      setShops([]);
      setMenus([]);
      return;
    }
    doSearch(debouncedQuery);
  }, [debouncedQuery]);

  const doSearch = async (term: string) => {
    setLoading(true);
    try {
      const [shopRes, menuRes] = await Promise.all([
        supabase
          .from('shops')
          .select('id, name, category, image_url, is_open')
          .ilike('name', `%${term}%`)
          .limit(20),
        supabase
          .from('menu_items')
          .select('id, name, price, image_url, is_sold_out, menu_categories(shop_id, shops(name))')
          .ilike('name', `%${term}%`)
          .limit(20),
      ]);

      setShops((shopRes.data as ShopResult[]) || []);
      setMenus((menuRes.data as MenuResult[]) || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((term: string) => {
    setQuery(term);
    saveRecent(term);
    setRecentSearches(getRecent());
  }, []);

  const handleClearRecent = () => {
    clearRecent();
    setRecentSearches([]);
  };

  const totalResults = shops.length + menus.length;
  const hasQuery = debouncedQuery.length > 0;

  return (
    <MobileLayout title="검색">
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <Input
          placeholder="매장이나 메뉴를 검색해보세요"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && query.trim()) handleSearch(query.trim());
          }}
          className="pl-10 pr-10 h-[52px] rounded-2xl text-body-lg"
          aria-label="검색어 입력"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-foreground"
            aria-label="검색어 지우기"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Recent searches (when idle) */}
      {!hasQuery && recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-heading-sm text-foreground">최근 검색어</h3>
            <button onClick={handleClearRecent} className="text-body-sm text-neutral-500 hover:text-foreground">
              전체 삭제
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(term => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="flex items-center gap-1.5 px-3 py-2 bg-card rounded-full shadow-xs border border-neutral-200 text-body-md hover:bg-neutral-100 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state (no query) */}
      {!hasQuery && recentSearches.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[48px] mb-4">🔍</p>
          <p className="text-body-lg text-muted-foreground">매장이나 메뉴를 검색해보세요</p>
        </div>
      )}

      {/* Loading */}
      {hasQuery && loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {/* Results */}
      {hasQuery && !loading && (
        <>
          {/* Tabs: 매장 / 메뉴 */}
          <div className="flex gap-1 mb-4 bg-secondary rounded-xl p-1">
            <button
              onClick={() => setActiveTab('shop')}
              className={`flex-1 py-2.5 rounded-lg text-btn-md transition-all ${
                activeTab === 'shop'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              매장 ({shops.length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-2.5 rounded-lg text-btn-md transition-all ${
                activeTab === 'menu'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              메뉴 ({menus.length})
            </button>
          </div>

          {totalResults === 0 ? (
            <div className="text-center py-16">
              <p className="text-[48px] mb-4">🤔</p>
              <p className="text-heading-md text-muted-foreground mb-2">검색 결과가 없습니다</p>
              <p className="text-body-md text-neutral-500">다른 검색어를 입력해보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Shop results */}
              {activeTab === 'shop' &&
                shops.map(shop => (
                  <button
                    key={shop.id}
                    onClick={() => {
                      saveRecent(debouncedQuery);
                      navigate(`/shop/${shop.id}`);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow text-left"
                  >
                    <div className="w-[60px] h-[60px] rounded-lg bg-neutral-200 overflow-hidden flex-shrink-0">
                      {shop.image_url ? (
                        <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-heading-sm text-foreground text-ellipsis-1">{shop.name}</h4>
                      <p className="text-body-sm text-muted-foreground">{shop.category || '일반'}</p>
                    </div>
                    <span
                      className={`text-body-xs px-2 py-0.5 rounded-full font-medium ${
                        shop.is_open ? 'bg-success-light text-success-dark' : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {shop.is_open ? '영업중' : '준비중'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  </button>
                ))}

              {/* Menu results */}
              {activeTab === 'menu' &&
                menus.map(menu => {
                  const shopId = (menu.menu_categories as any)?.shop_id;
                  const shopName = (menu.menu_categories as any)?.shops?.name;
                  return (
                    <button
                      key={menu.id}
                      onClick={() => {
                        saveRecent(debouncedQuery);
                        if (shopId) navigate(`/shop/${shopId}`);
                      }}
                      className={`w-full flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow text-left ${
                        menu.is_sold_out ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="w-[60px] h-[60px] rounded-lg bg-neutral-200 overflow-hidden flex-shrink-0">
                        {menu.image_url ? (
                          <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🍴</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-heading-sm text-foreground text-ellipsis-1">{menu.name}</h4>
                        <p className="text-body-sm text-muted-foreground">{shopName || '매장'}</p>
                        <span className="font-price text-body-lg text-foreground">{menu.price.toLocaleString()}원</span>
                      </div>
                      {menu.is_sold_out && (
                        <span className="text-body-xs text-error font-semibold">품절</span>
                      )}
                    </button>
                  );
                })}
            </div>
          )}
        </>
      )}
    </MobileLayout>
  );
}
