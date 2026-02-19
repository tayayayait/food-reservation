import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Search, X, Clock, ArrowRight, Utensils, Soup, Fish, Pizza, Coffee, Drumstick, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Types
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

// Recent Search Helpers
const RECENT_KEY = 'recent-searches';
const MAX_RECENT = 10;
const getRecent = (): string[] => {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
};
const saveRecent = (term: string) => {
  const list = getRecent().filter(t => t !== term);
  list.unshift(term);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
};
const clearRecent = () => localStorage.removeItem(RECENT_KEY);

const POPULAR_TAGS = [
  { label: '족발', icon: '🍖', color: 'bg-orange-100 text-orange-600' },
  { label: '마라탕', icon: '🍜', color: 'bg-red-100 text-red-600' },
  { label: '카페', icon: '☕', color: 'bg-amber-100 text-amber-700' },
  { label: '돈까스', icon: '🍱', color: 'bg-yellow-100 text-yellow-700' },
  { label: '치킨', icon: '🍗', color: 'bg-orange-100 text-orange-600' },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [shops, setShops] = useState<ShopResult[]>([]);
  const [menus, setMenus] = useState<MenuResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecent());
  const [activeTab, setActiveTab] = useState<'shop' | 'menu'>('shop');

  // Debouncing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Search Logic
  useEffect(() => {
    if (!debouncedQuery) {
      setShops([]);
      setMenus([]);
      return;
    }
    const doSearch = async () => {
      setLoading(true);
      try {
        const [shopRes, menuRes] = await Promise.all([
          supabase.from('shops').select('id, name, category, image_url, is_open').ilike('name', `%${debouncedQuery}%`).limit(20),
          supabase.from('menu_items').select('id, name, price, image_url, is_sold_out, menu_categories(shop_id, shops(name))').ilike('name', `%${debouncedQuery}%`).limit(20),
        ]);
        setShops((shopRes.data as ShopResult[]) || []);
        setMenus((menuRes.data as MenuResult[]) || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [debouncedQuery]);

  const handleSearch = useCallback((term: string) => {
    setQuery(term);
    saveRecent(term);
    setRecentSearches(getRecent());
  }, []);

  const totalResults = shops.length + menus.length;
  const hasQuery = debouncedQuery.length > 0;

  return (
    <div className="relative mx-auto min-h-screen max-w-[430px] bg-[#F7FAFC] shadow-2xl overflow-x-hidden font-sans text-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-[#1A202C]">검색</h1>
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
            <X className="size-6" />
        </button>
      </header>
      
      {/* Search Input Hero */}
      <section className="bg-white px-4 pb-6 pt-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-14 rounded-2xl border-none bg-slate-50 pl-12 pr-10 text-lg font-medium shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-[#FF5C00]/20 placeholder:text-slate-400"
            placeholder="매장이나 메뉴를 검색하세요"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 p-1">
              <X className="size-4" />
            </button>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="px-4 mt-6">
        
        {/* State 1: Idle (Recent & Popular) */}
        {!hasQuery && (
          <div className="space-y-8">
            {recentSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-500">최근 검색어</h3>
                  <button onClick={() => { clearRecent(); setRecentSearches([]); }} className="text-xs text-slate-400">전체 삭제</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button 
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm active:scale-95 transition-transform"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-sm font-bold text-slate-500 mb-3">인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map(tag => (
                  <button 
                    key={tag.label}
                    onClick={() => handleSearch(tag.label)}
                    className={cn("px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform", tag.color)}
                  >
                    <span>{tag.icon}</span>
                    {tag.label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* State 2: Loading or Empty */}
        {hasQuery && loading && (
             <div className="space-y-4">
               {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white" />)}
             </div>
        )}
        
        {hasQuery && !loading && totalResults === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                    🔍
                </div>
                <h3 className="text-lg font-bold text-slate-700">검색 결과가 없습니다</h3>
                <p className="text-slate-400 text-sm mt-1">다른 키워드로 검색해보세요</p>
            </div>
        )}

        {/* State 3: Results */}
        {hasQuery && !loading && totalResults > 0 && (
          <div className="space-y-4">
             {/* Tabs */}
             <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                <button 
                    onClick={() => setActiveTab('shop')}
                    className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'shop' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
                >
                    매장 ({shops.length})
                </button>
                <button 
                    onClick={() => setActiveTab('menu')}
                    className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'menu' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
                >
                    메뉴 ({menus.length})
                </button>
             </div>

             {activeTab === 'shop' && shops.map(shop => (
                 <button
                    key={shop.id}
                    onClick={() => { saveRecent(debouncedQuery); navigate(`/shop/${shop.id}`); }}
                    className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF5C00]/30 transition-all text-left group"
                 >
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-[#FF5C00] transition-colors">{shop.name}</h4>
                        <p className="text-sm text-slate-400 mt-0.5">{shop.category}</p>
                    </div>
                    <div className={cn("px-2.5 py-1 rounded-lg text-xs font-bold", shop.is_open ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500")}>
                        {shop.is_open ? '영업중' : '영업종료'}
                    </div>
                    <ChevronRight className="size-5 text-slate-300" />
                 </button>
             ))}

             {activeTab === 'menu' && menus.map(menu => (
                 <button
                    key={menu.id}
                    onClick={() => {
                         saveRecent(debouncedQuery);
                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
                         const shopId = (menu.menu_categories as any)?.shop_id;
                         if (shopId) navigate(`/shop/${shopId}`);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF5C00]/30 transition-all text-left"
                 > 
                    <div className="size-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🍴</div>}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{menu.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{(menu.menu_categories as any)?.shops?.name}</p>
                        <p className="text-sm font-bold text-[#FF5C00] mt-1">{menu.price.toLocaleString()}원</p>
                    </div>
                    {menu.is_sold_out && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">품절</span>}
                 </button>
             ))}
          </div>
        )}

      </div>
    </div>
  );
}
