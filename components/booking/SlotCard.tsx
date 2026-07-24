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

export default function SlotCard({ slot, isSelected, onClick, isPast }: SlotCardProps) {
  const { t } = useI18n();
  const { slotStart, isAvailable, isPeak, basePrice, peakPremium, durationMinutes, currency } = slot;
  const displayPrice = basePrice + (isPeak ? peakPremium : 0);
  const formattedPrice = formatPrice(displayPrice, currency);

  // ── Derive state ────────────────────────────────────────────────────────────
  const state: "available" | "selected" | "occupied" | "passed" =
    isPast ? "passed"
    : !isAvailable ? "occupied"
    : isSelected ? "selected"
    : "available";

  const statusOrPrice =
    state === "passed" ? t.passed
    : state === "occupied" ? t.book_booked
    : formattedPrice;

  const showReserveCta = state === "available" || state === "selected";

  // ── Per-state text colors ───────────────────────────────────────────────────
  const iconColor =
    state === "passed" ? "var(--state-passed-text)"
    : state === "occupied" ? "var(--state-occupied-text)"
    : state === "selected" ? "var(--state-selected-text)"
    : "var(--brand-secondary)";

  const timeColor =
    state === "passed" ? "var(--state-passed-text)"
    : state === "occupied" ? "var(--state-occupied-text)"
    : state === "selected" ? "var(--state-selected-text)"
    : "var(--brand-text-strong)";

  const durationColor =
    state === "passed" ? "var(--state-passed-text)"
    : state === "occupied" ? "var(--state-occupied-text)"
    : state === "selected" ? "rgba(255,255,255,0.75)"
    : "var(--brand-text-muted)";

  const priceColor =
    state === "passed" ? "var(--state-passed-text)"
    : state === "occupied" ? "var(--state-occupied-text)"
    : state === "selected" ? "var(--state-selected-text)"
    : "var(--brand-text-strong)";

  const ctaColor =
    state === "selected" ? "rgba(255,255,255,0.9)"
    : "var(--brand-accent)";

  const peakBadgeStyle: React.CSSProperties =
    state === "selected"
      ? { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }
      : {
          background: "var(--state-peak-bg)",
          color: "var(--state-peak-text)",
          border: "1px solid var(--brand-highlight-soft)",
        };

  return (
    <button
      disabled={isPast || !isAvailable}
      onClick={!isPast && isAvailable ? onClick : undefined}
      data-state={state}
      className="cw-slot-card-root flex text-left transition-all w-full group"
    >
      {/* Yellow decorative accent triangle corner on selected card */}
      {state === "selected" && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 18px 18px 0",
            borderColor: "transparent var(--brand-highlight) transparent transparent",
            zIndex: 10,
          }}
        />
      )}

      {/* Teal left-accent strip on available cards */}
      {state === "available" && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: "20%",
            bottom: "20%",
            width: "3.5px",
            borderRadius: "0 3px 3px 0",
            background: "var(--state-available-accent)",
            opacity: 0.8,
            transition: "all 0.25s ease",
          }}
          className="group-hover:scale-y-125 group-hover:opacity-100"
        />
      )}

      <div className="cw-slot-card-inner h-full w-full flex flex-col justify-between items-start gap-[16px] z-10 relative">
        {/* Top row: time + peak badge */}
        <div className="flex flex-col items-start w-full gap-[6px]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[8px]">
              <Clock
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2}
                style={{ color: iconColor }}
              />
              <span
                className="text-[22px] font-bold leading-none tracking-tight"
                style={{ color: timeColor }}
              >
                {slotStart}
              </span>
            </div>
            {isPeak && (
              <span
                className="text-[10px] font-bold px-[8px] py-[3px] rounded-full flex items-center gap-[4px] shrink-0"
                style={peakBadgeStyle}
              >
                <Zap size={9} fill="currentColor" /> Peak
              </span>
            )}
          </div>

          <span
            className="text-[11px] font-bold tracking-[0.12em] uppercase leading-none"
            style={{ color: durationColor }}
          >
            {t.book_duration.replace("{count}", durationMinutes.toString())}
          </span>
        </div>

        {/* Bottom row: price + CTA */}
        <div className="w-full flex items-center justify-between gap-[12px] mt-auto">
          <span
            className="text-[16px] font-bold leading-none"
            style={{ color: priceColor }}
          >
            {statusOrPrice}
          </span>

          {showReserveCta && (
            <span
              className={`text-[11px] font-extrabold tracking-[0.14em] uppercase leading-none whitespace-nowrap transition-all duration-200 ${
                state === "selected"
                  ? "opacity-100"
                  : "opacity-75 group-hover:opacity-100 group-hover:translate-x-1"
              }`}
              style={{ color: ctaColor }}
            >
              {state === "selected" ? `✓ ${t.selected}` : `${t.reserve} →`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}