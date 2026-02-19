import React from "react";
import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ShopCard — XML 명세 3.4 매장카드 프리셋
 *
 * 썸네일: 120×120 radius-sm, object-fit:cover
 * 매장명: heading-md, 1줄 말줄임
 * 카테고리: body-sm, neutral-600
 * 거리/시간: body-sm, primary-500 아이콘+텍스트
 * 영업 상태: body-xs, success/neutral-500
 */
interface ShopCardProps {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
  isOpen: boolean;
  distance?: string;
  avgPrepTime?: number;
  onClick?: () => void;
  className?: string;
}

export function ShopCard({
  name,
  category,
  imageUrl,
  isOpen,
  distance = "500m",
  avgPrepTime,
  onClick,
  className,
}: ShopCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex gap-4 p-4 bg-card rounded-xl shadow-sm border border-neutral-200",
        "hover:shadow-md transition-shadow duration-normal text-left",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="w-[120px] h-[120px] rounded-sm bg-neutral-200 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-heading-lg">🍽️</div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-heading-md text-foreground text-ellipsis-1">{name}</h4>
          <span
            className={cn(
              "text-body-xs px-2 py-0.5 rounded-full font-medium",
              isOpen
                ? "bg-success-light text-success-dark"
                : "bg-neutral-200 text-neutral-500",
            )}
          >
            {isOpen ? "영업중" : "준비중"}
          </span>
        </div>

        <p className="text-body-sm text-neutral-600 mb-1">{category}</p>

        <div className="flex items-center gap-3 text-body-sm">
          <span className="flex items-center gap-1 text-primary">
            <MapPin className="w-4 h-4" />
            {distance}
          </span>
          {avgPrepTime != null && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {avgPrepTime}분
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/**
 * MenuCard — XML 명세 3.4 메뉴카드 프리셋
 *
 * 이미지: 80×80 radius-sm, 우측 배치
 * 메뉴명: heading-sm, 2줄 max
 * 설명: body-md, 2줄 말줄임
 * 가격: price (20/700 Inter)
 * 품절: 이미지 오버레이 60% 딤 + '품절'
 */
interface MenuCardProps {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isSoldOut?: boolean;
  isPopular?: boolean;
  onClick?: () => void;
  className?: string;
  actions?: React.ReactNode;
}

export function MenuCard({
  name,
  description,
  price,
  imageUrl,
  isSoldOut = false,
  isPopular = false,
  onClick,
  className,
  actions,
}: MenuCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={isSoldOut ? undefined : onClick}
      onKeyDown={
        onClick && !isSoldOut
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
      className={cn(
        "flex gap-4 p-4 bg-card rounded-xl shadow-sm border border-neutral-200",
        onClick && !isSoldOut && "hover:shadow-md cursor-pointer transition-shadow duration-normal",
        isSoldOut && "opacity-80",
        className,
      )}
    >
      {/* Text content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-heading-sm text-foreground text-ellipsis-2">{name}</h4>
          {isPopular && (
            <span className="text-body-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary font-medium">
              인기
            </span>
          )}
        </div>

        {description && (
          <p className="text-body-md text-neutral-600 text-ellipsis-2 mb-2">{description}</p>
        )}

        <span className="font-price text-price text-foreground">
          {price.toLocaleString()}원
        </span>

        {actions && <div className="mt-2">{actions}</div>}
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="relative w-[80px] h-[80px] rounded-sm overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-body-md text-white font-semibold">품절</span>
            </div>
          )}
        </div>
      )}

      {/* Sold out without image */}
      {!imageUrl && isSoldOut && (
        <div className="flex items-center">
          <span className="text-body-sm text-error font-semibold">품절</span>
        </div>
      )}
    </div>
  );
}
