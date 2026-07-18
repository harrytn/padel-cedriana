"use client";
import { useI18n } from "@/lib/i18n";
import { Clock, Zap } from "lucide-react";
import { formatPrice } from "@/lib/currency";

export interface SlotData {
  slotStart: string;
  slotEnd: string;
  isAvailable: boolean;
  isPeak: boolean;
  hasLighting: boolean;
  basePrice: number;
  peakPremium: number;
  durationMinutes: number;
  currency?: string;
  isPast?: boolean;
}

interface SlotCardProps {
  slot: SlotData;
  isSelected: boolean;
  onClick: () => void;
  isPast?: boolean;
}

const BASE = "cw-slot-card-root flex text-left transition-all w-full";

export default function SlotCard({ slot, isSelected, onClick, isPast }: SlotCardProps) {
  const { t } = useI18n();
  const { slotStart, isAvailable, isPeak, basePrice, peakPremium, durationMinutes, currency } = slot;
  const displayPrice = basePrice + (isPeak ? peakPremium : 0);
  const formattedPrice = formatPrice(displayPrice, currency);

  let stateClasses = "";
  let statusOrPrice = "";
  let showReserveCta = false;
  let isOccupied = false;

  if (isPast) {
    stateClasses = "bg-[#ececec] border border-[#d0d0d0] text-[#999999] cursor-not-allowed";
    statusOrPrice = t.passed;
  } else if (!isAvailable) {
    stateClasses = "bg-[#e0e0e0] border border-[#cccccc] text-[#555555] cursor-not-allowed";
    statusOrPrice = t.book_booked;
    isOccupied = true;
  } else if (isSelected) {
    stateClasses = "bg-[#111111] border border-[#000000] text-white shadow-xl";
    statusOrPrice = formattedPrice;
    showReserveCta = true;
  } else {
    stateClasses = "bg-white border border-[#aaaaaa] text-[#111111] hover:bg-[#f5f5f5] hover:shadow-md";
    statusOrPrice = formattedPrice;
    showReserveCta = true;
  }

  const iconColor = isPast ? "text-[#aaaaaa]" : isOccupied ? "text-[#888888]" : isSelected ? "text-white" : "text-[#555555]";
  const durationColor = isPast ? "text-[#aaaaaa]" : isOccupied ? "text-[#888888]" : isSelected ? "text-white/80" : "text-[#888888]";
  const priceColor = isPast ? "text-[#aaaaaa]" : isOccupied ? "text-[#555555]" : isSelected ? "text-white" : "text-[#222222]";
  const ctaColor = isSelected ? "text-white/90" : "text-[#555555]";
  const timeColor = isSelected ? "text-white" : isOccupied ? "text-[#555555]" : isPast ? "text-[#aaaaaa]" : "text-[#111111]";

  return (
    <button
      disabled={isPast || !isAvailable}
      onClick={!isPast && isAvailable ? onClick : undefined}
      className={`${BASE} ${stateClasses}`}
    >
      <div className="cw-slot-card-inner h-full w-full flex flex-col justify-between items-start gap-[20px]">
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[8px]">
              <Clock className={`h-[20px] w-[20px] shrink-0 ${iconColor}`} strokeWidth={2} />
              <span className={`cw-slot-time text-[24px] font-bold leading-none ${timeColor}`}>
                {slotStart}
              </span>
            </div>
            {isPeak && (
              <span className={isSelected ? "bg-white/20 text-white text-[10px] font-bold px-[8px] py-[4px] rounded-full flex items-center gap-[4px] shrink-0" : "bg-[#e0e0e0] text-[#555555] border border-[#cccccc] text-[10px] font-bold px-[8px] py-[4px] rounded-full flex items-center gap-[4px] shrink-0"}>
                <Zap size={10} fill="currentColor" /> Peak
              </span>
            )}
          </div>

          <span className={`cw-slot-duration mt-[8px] text-[12px] font-bold tracking-[0.12em] uppercase leading-none ${durationColor}`}>
            {t.book_duration.replace("{count}", durationMinutes.toString())}
          </span>
        </div>

        <div className="w-full flex items-end justify-between gap-[16px] pt-[16px] mt-auto">
          <span className={`cw-slot-price cw-slot-status text-[16px] font-bold leading-none ${priceColor}`}>
            {statusOrPrice}
          </span>

          {showReserveCta && (
            <span className={`cw-slot-cta text-[12px] font-bold tracking-[0.14em] uppercase leading-none whitespace-nowrap ${isSelected ? '' : 'opacity-0 lg:opacity-100 transition-opacity'} ${ctaColor}`}>
              {isSelected ? `✓ ${t.selected}` : `${t.reserve} →`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}