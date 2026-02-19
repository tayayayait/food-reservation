import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

/**
 * TimeSlotPicker — XML 명세 2-2 타임슬롯 선택
 *
 * 5분 단위 슬롯, 현재 시간 이후만 선택 가능
 * 가장 빠른 슬롯에 "가장 빠름" 배지
 */
interface TimeSlotPickerProps {
  /** 슬롯 간격 (분 단위, 기본 5) */
  intervalMinutes?: number;
  /** 표시할 슬롯 개수 */
  slotsCount?: number;
  /** 현재 선택된 시간 (HH:mm) */
  selectedTime: string | null;
  /** 변경 핸들러 */
  onSelectTime: (time: string) => void;
  /** 비활성화된 시간 목록 */
  disabledTimes?: string[];
  /** 조리 예상 시간(분) — 최소 픽업 시간 계산용 */
  prepTimeMinutes?: number;
  className?: string;
}

function generateSlots(interval: number, count: number, prepTime: number): { time: string; label: string; isEarliest: boolean }[] {
  const now = new Date();
  // 최소 픽업 시간: 현재시간 + 조리시간
  const earliest = new Date(now.getTime() + prepTime * 60 * 1000);

  // 다음 interval에 맞추기
  const minutes = earliest.getMinutes();
  const nextSlot = Math.ceil(minutes / interval) * interval;
  earliest.setMinutes(nextSlot, 0, 0);

  const slots: { time: string; label: string; isEarliest: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(earliest.getTime() + i * interval * 60 * 1000);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    slots.push({
      time: `${h}:${m}`,
      label: `${h}:${m}`,
      isEarliest: i === 0,
    });
  }
  return slots;
}

export function TimeSlotPicker({
  intervalMinutes = 5,
  slotsCount = 12,
  selectedTime,
  onSelectTime,
  disabledTimes = [],
  prepTimeMinutes = 15,
  className,
}: TimeSlotPickerProps) {
  const slots = useMemo(
    () => generateSlots(intervalMinutes, slotsCount, prepTimeMinutes),
    [intervalMinutes, slotsCount, prepTimeMinutes],
  );

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-heading-sm text-foreground">픽업 예정 시간</h3>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {slots.map(slot => {
          const isDisabled = disabledTimes.includes(slot.time);
          const isSelected = selectedTime === slot.time;

          return (
            <button
              key={slot.time}
              onClick={() => !isDisabled && onSelectTime(slot.time)}
              disabled={isDisabled}
              className={cn(
                'relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-center transition-all duration-normal',
                isSelected
                  ? 'border-2 border-primary bg-primary-50 text-primary shadow-sm'
                  : 'border-neutral-200 bg-card text-foreground hover:border-neutral-400 hover:shadow-xs',
                isDisabled && 'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200',
              )}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
            >
              <span className="text-btn-md">{slot.label}</span>
              {slot.isEarliest && !isDisabled && (
                <span className="text-body-xs text-primary mt-0.5">가장 빠름</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
