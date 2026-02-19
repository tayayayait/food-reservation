import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  Search, 
  Utensils, 
  Soup, 
  Fish, 
  Pizza, 
  Coffee, 
  Drumstick,
  Star,
  Timer,
  Home,
  Receipt,
  User,
  ChevronDown
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Interfaces
interface Shop {
  id: string;
  name: string;
  category: string;
  address: string;
  image_url: string | null;
  is_open: boolean;
  avg_prep_time: number;
}

// Category Configuration
const CATEGORIES = [
  { id: '전체', label: '전체', icon: Utensils },
  { id: '한식', label: '한식', icon: Soup },
  { id: '중식', label: '중식', icon: Utensils },
  { id: '일식', label: '일식', icon: Fish },
  { id: '양식', label: '양식', icon: Pizza },
  { id: '카페', label: '카페', icon: Coffee },
  { id: '치킨', label: '치킨', icon: Drumstick },
];

export default function CustomerHome() {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('id, name, category, address, image_url, is_open, avg_prep_time')
        .order('is_open', { ascending: false }) // Open shops first
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setShops(data || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchSearch = shop.name.toLowerCase().includes(search.toLowerCase()) || 
                       shop.category.includes(search);
    const matchCategory = selectedCategory === '전체' || shop.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="relative mx-auto min-h-screen max-w-[430px] bg-[#F7FAFC] shadow-2xl overflow-x-hidden font-sans text-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-4 py-4 backdrop-blur-md">
        <h1 className="text-2xl font-black tracking-tighter text-[#FF5C00]">Mirijumun</h1>
        <button className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 transition-colors hover:bg-slate-200">
          <MapPin className="size-4 text-[#FF5C00]" />
          <span className="text-sm font-bold text-slate-700">역삼동</span>
          <ChevronDown className="size-4 text-slate-400" />
        </button>
      </header>

      {/* Search Hero */}
      <section className="bg-white px-4 pb-8 pt-4 rounded-b-3xl shadow-sm">
        <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
          기다리지 말고,<br/>
          <span className="text-[#FF5C00]">바로 픽업하세요!</span>
        </h2>
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="size-5 text-slate-400 group-focus-within:text-[#FF5C00] transition-colors" />
          </div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 rounded-2xl border-none bg-slate-50 py-4 pl-12 pr-4 text-base font-medium shadow-lg shadow-slate-200/50 focus:ring-2 focus:ring-[#FF5C00]/20 placeholder:text-slate-400"
            placeholder="매장이나 메뉴를 검색하세요"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="mt-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-lg font-bold">카테고리</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition-all active:scale-95 border",
                selectedCategory === cat.id 
                  ? "bg-[#FF5C00] border-[#FF5C00] text-white shadow-[#FF5C00]/30" 
                  : "bg-white border-slate-100 text-[#FF5C00] group-hover:border-[#FF5C00]/50"
              )}>
                <cat.icon className="size-8 stroke-[1.5]" />
              </div>
              <span className={cn(
                "text-xs font-semibold transition-colors",
                selectedCategory === cat.id ? "text-[#FF5C00]" : "text-slate-600"
              )}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Shop List */}
      <section className="mt-4 px-4 space-y-4">
        <h3 className="text-lg font-bold mb-4">추천 매장</h3>
        
        {loading ? (
          // Skeletons
          [1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-3 bg-white rounded-2xl border border-slate-100">
               <Skeleton className="size-24 rounded-xl" />
               <div className="flex-1 space-y-2">
                 <Skeleton className="h-5 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
               </div>
            </div>
          ))
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg">검색 결과가 없습니다 😢</p>
          </div>
        ) : (
          filteredShops.map((shop) => (
            <button
              key={shop.id}
              onClick={() => navigate(`/shop/${shop.id}`)}
              className="w-full flex gap-4 overflow-hidden rounded-2xl bg-white p-3 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-[#FF5C00]/30 text-left group"
            >
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {shop.image_url ? (
                  <img className="h-full w-full object-cover transition-transform group-hover:scale-105" src={shop.image_url} alt={shop.name} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl">🍽️</div>
                )}
                {shop.is_open ? (
                  <div className="absolute left-1 top-1 rounded-md bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase shadow-sm">
                    영업중
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="text-white font-bold text-xs bg-slate-900/80 px-2 py-1 rounded">영업종료</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-1 flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-start justify-between">
                    <h4 className="text-base font-bold text-slate-900 leading-tight line-clamp-1">{shop.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{shop.category} • {shop.address.split(' ')[0]}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-slate-700">4.8</span>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-[#FF5C00]/10 px-1.5 py-0.5">
                    <Timer className="size-3.5 text-[#FF5C00]" />
                    <span className="text-[10px] font-bold text-[#FF5C00]">{shop.avg_prep_time || 15}분 대기</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">500m</span>
                </div>
              </div>
            </button>
          ))
        )}
      </section>


    </div>
  );
}
