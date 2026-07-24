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

  // ── Derive per-state inline styles (all via CSS variables) ──────────────
  let cardStyle: React.CSSProperties = {};
  let statusOrPrice = "";
  let showReserveCta = false;
  let isOccupied = false;

  if (isPast) {
    cardStyle = {
      background: "var(--state-passed-bg)",
      borderColor: "var(--state-passed-border)",
      color: "var(--state-passed-text)",
      cursor: "not-allowed",
    };
    statusOrPrice = t.passed;
  } else if (!isAvailable) {
    cardStyle = {
      background: "var(--state-occupied-bg)",
      borderColor: "var(--state-occupied-border)",
      color: "var(--state-occupied-text)",
      cursor: "not-allowed",
    };
    statusOrPrice = t.book_booked;
    isOccupied = true;
  } else if (isSelected) {
    cardStyle = {
      background: `linear-gradient(135deg, var(--state-selected-bg), var(--state-selected-bg-end))`,
      borderColor: "var(--state-selected-bg)",
      color: "var(--state-selected-text)",
      boxShadow: "var(--shadow-selected)",
    };
    statusOrPrice = formattedPrice;
    showReserveCta = true;
  } else {
    cardStyle = {
      background: "var(--state-available-bg)",
      borderColor: "var(--state-available-border)",
      color: "var(--brand-text)",
    };
    statusOrPrice = formattedPrice;
    showReserveCta = true;
  }

  // ── Per-state text colors (CSS variables) ────────────────────────────────
  const iconColor = isPast
    ? "var(--state-passed-text)"
    : isOccupied
    ? "var(--state-occupied-text)"
    : isSelected
    ? "var(--state-selected-text)"
    : "var(--brand-secondary)";

  const durationColor = isPast
    ? "var(--state-passed-text)"
    : isOccupied
    ? "var(--state-occupied-text)"
    : isSelected
    ? "rgba(255,255,255,0.75)"
    : "var(--brand-text-muted)";

  const priceColor = isPast
    ? "var(--state-passed-text)"
    : isOccupied
    ? "var(--state-occupied-text)"
    : isSelected
    ? "var(--state-selected-text)"
    : "var(--brand-text-strong)";

  const ctaColor = isSelected ? "rgba(255,255,255,0.85)" : "var(--brand-text-muted)";

  const timeColor = isSelected
    ? "var(--state-selected-text)"
    : isOccupied
    ? "var(--state-occupied-text)"
    : isPast
    ? "var(--state-passed-text)"
    : "var(--brand-text-strong)";

  const peakBadgeStyle: React.CSSProperties = isSelected
    ? {
        background: "rgba(255,255,255,0.20)",
        color: "var(--state-selected-text)",
      }
    : {
        background: "var(--state-peak-bg)",
        color: "var(--state-peak-text)",
        border: "1px solid var(--brand-highlight-soft)",
      };

  return (
    <button
      disabled={isPast || !isAvailable}
      onClick={!isPast && isAvailable ? onClick : undefined}
      className={`${BASE}`}
      style={cardStyle}
    >
      <div className="cw-slot-card-inner h-full w-full flex flex-col justify-between items-start gap-[20px]">
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[8px]">
              <Clock
                className="h-[20px] w-[20px] shrink-0"
                strokeWidth={2}
                style={{ color: iconColor }}
              />
              <span
                className="cw-slot-time text-[24px] font-bold leading-none"
                style={{ color: timeColor }}
              >
                {slotStart}
              </span>
            </div>
            {isPeak && (
              <span
                className="text-[10px] font-bold px-[8px] py-[4px] rounded-full flex items-center gap-[4px] shrink-0"
                style={peakBadgeStyle}
              >
                <Zap size={10} fill="currentColor" /> Peak
              </span>
            )}
          </div>

          <span
            className="cw-slot-duration mt-[8px] text-[12px] font-bold tracking-[0.12em] uppercase leading-none"
            style={{ color: durationColor }}
          >
            {t.book_duration.replace("{count}", durationMinutes.toString())}
          </span>
        </div>

        <div className="w-full flex items-end justify-between gap-[16px] pt-[16px] mt-auto">
          <span
            className="cw-slot-price cw-slot-status text-[16px] font-bold leading-none"
            style={{ color: priceColor }}
          >
            {statusOrPrice}
          </span>

          {showReserveCta && (
            <span
              className={`cw-slot-cta text-[12px] font-bold tracking-[0.14em] uppercase leading-none whitespace-nowrap ${isSelected ? "" : "opacity-0 lg:opacity-100 transition-opacity"}`}
              style={{ color: ctaColor }}
            >
              {isSelected ? `✓ ${t.selected}` : `${t.reserve} →`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}