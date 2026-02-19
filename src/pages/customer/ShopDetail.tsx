import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShopData } from "@/hooks/useShopData";
import { useCartStore } from "@/lib/cart-store";
import {
  ArrowLeft,
  Share,
  Heart,
  Star,
  MapPin,
  Phone,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Assuming this exists or I'll use clsx

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shop, categories, loading } = useShopData(id);
  const addItem = useCartStore((s) => s.addItem);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPriceFn = useCartStore((s) => s.totalPrice);
  const totalPrice = typeof totalPriceFn === 'function' ? totalPriceFn() : 0;

  const [activeTab, setActiveTab] = useState<string>("");

  // Set initial active tab
  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].id);
    }
  }, [categories, activeTab]);

  const handleAddItem = (item: any) => {
    if (item.is_sold_out) return;
    addItem(id!, shop?.name || "Store", {
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      options: [],
      imageUrl: item.image_url || undefined,
    });
    toast({ title: "장바구니에 담았습니다", description: item.name });
  };

  const scrollToCategory = (catId: string) => {
    setActiveTab(catId);
    const element = document.getElementById(catId);
    if (element) {
      const offset = 80; // approximate header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] max-w-[430px] mx-auto p-4 space-y-4">
        <Skeleton className="w-full h-48 rounded-xl" />
        <Skeleton className="w-2/3 h-8" />
        <Skeleton className="w-full h-24" />
      </div>
    );
  }

  if (!shop)
    return <div className="p-8 text-center">매장을 찾을 수 없습니다.</div>;

  return (
    <div className="relative mx-auto min-h-screen max-w-[430px] bg-[#F7FAFC] pb-32 font-sans text-slate-900">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 z-50 flex w-full max-w-[430px] items-center justify-between px-4 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="size-5 text-slate-900" />
        </button>
        <div className="flex gap-2">
          <button className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform active:scale-95">
            <Share className="size-5 text-slate-900" />
          </button>
          <button className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform active:scale-95">
            <Heart className="size-5 text-slate-900" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        {shop.image_url ? (
          <img
            alt={shop.name}
            className="h-full w-full object-cover"
            src={shop.image_url}
          />
        ) : (
          <div className="h-full w-full bg-slate-200 flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
      </div>

      {/* Shop Information Section */}
      <div className="relative -mt-6 rounded-t-[2rem] bg-[#F7FAFC] px-4 pt-6 z-20">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1a212d]">
              {shop.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  shop.is_open
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-500",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    shop.is_open ? "bg-green-500" : "bg-slate-400",
                  )}
                ></span>
                {shop.is_open ? "Open" : "Closed"}
              </span>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Star className="size-4 text-amber-400 fill-amber-400" />
                <span>4.8</span>
                <span className="font-normal text-slate-500">(1.2k)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Actions */}
        <div className="mt-5 flex gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold shadow-sm transition-colors active:bg-slate-50">
            <MapPin className="size-5 text-slate-900" />
            주소 보기
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold shadow-sm transition-colors active:bg-slate-50"
            onClick={() =>
              shop.phone
                ? (window.location.href = `tel:${shop.phone}`)
                : toast({ title: "전화번호가 없습니다" })
            }
          >
            <Phone className="size-5 text-slate-900" />
            전화하기
          </button>
        </div>
      </div>

      {/* Sticky Navigation Tabs */}
      <div className="sticky top-0 z-40 mt-6 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="flex overflow-x-auto px-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === cat.id
                  ? "border-[#1a212d] text-[#1a212d] font-bold"
                  : "border-transparent text-slate-500",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Sections */}
      <div className="min-h-[500px]">
        {categories.map((cat) => (
          <div
            key={cat.id}
            id={cat.id}
            className="scroll-mt-32 px-4 pt-8 first:pt-6"
          >
            <h2 className="mb-4 text-xl font-bold text-[#1a212d]">
              {cat.name}
            </h2>
            <div className="flex flex-col gap-4">
              {cat.menu_items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all",
                    item.is_sold_out && "opacity-60 grayscale",
                  )}
                >
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                          {item.name}
                        </h3>
                        {item.is_popular && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                            HOT
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-[#1a212d]">
                        {item.price.toLocaleString()}원
                      </span>
                      {!item.is_sold_out ? (
                        <button
                          onClick={() => handleAddItem(item)}
                          className="flex size-8 items-center justify-center rounded-full bg-[#FF5C00] text-white shadow-lg shadow-[#FF5C00]/20 active:scale-95 transition-transform"
                        >
                          <Plus className="size-5" />
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-red-500">
                          품절
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {item.image_url ? (
                      <img
                        alt={item.name}
                        className="h-full w-full object-cover"
                        src={item.image_url}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-300">
                        <ShoppingBag className="size-8" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {cat.menu_items.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-sm">
                  준비 중입니다.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 p-4 pb-8">
          <div className="flex items-center justify-between rounded-full bg-[#1a212d] p-2 pl-6 text-white shadow-2xl shadow-[#1a212d]/30">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400">
                {totalItems}개 메뉴
              </span>
              <span className="text-lg font-bold leading-none">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#1a212d] active:scale-95 transition-transform"
            >
              장바구니 보기
              <ShoppingBag className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
