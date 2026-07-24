"use client";
import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import SlotGrid from "@/components/booking/SlotGrid";
import CheckoutModal from "@/components/booking/CheckoutModal";
import { SlotData } from "@/components/booking/SlotCard";
import { ACTIVE_THEME } from "@/lib/theme";
import HotelLogo from "@/components/ui/HotelLogo";
import { formatLocalizedDate } from "@/lib/i18n/date";
import { ShieldCheck } from "lucide-react";

function PadelIcon({ size = 22, className = "shrink-0", style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ color: "var(--brand-accent)", ...style }}
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 3.2 2.15 5.9 5.08 6.74L9 21h6l-1.08-5.26C16.85 14.9 19 12.2 19 9c0-3.87-3.13-7-7-7z" />
      <line x1="10" y1="18" x2="14" y2="18" />
      <circle cx="10" cy="7.5" r="0.75" fill="currentColor" />
      <circle cx="14" cy="7.5" r="0.75" fill="currentColor" />
      <circle cx="12" cy="10" r="0.75" fill="currentColor" />
    </svg>
  );
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function maxISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function BookPage() {
  const { t, lang } = useI18n();
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [settings, setSettings] = useState<{
    base_price: number;
    racket_price_with_balls: number;
    balls_only_price: number;
    lighting_price: number;
    peak_premium: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [slotTakenError, setSlotTakenError] = useState(false);

  const fetchSlots = useCallback(async (date: string) => {
    if (!date) return;
    setLoading(true);
    setError(null);
    setSlotTakenError(false);
    try {
      const res = await fetch(`/api/slots?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
        setSettings(data.settings);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || t.error_generic);
        setSlots([]);
      }
    } catch (err) {
      console.error("fetchSlots error:", err);
      setError(t.error_generic);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [t.error_generic]);

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const handleSlotTaken = () => {
    setSelectedSlot(null);
    setSlotTakenError(true);
    fetchSlots(selectedDate);
  };

  const eyebrow = ACTIVE_THEME.location
    ? `${ACTIVE_THEME.shortName ?? ACTIVE_THEME.name} · ${ACTIVE_THEME.location}`.toUpperCase()
    : (ACTIVE_THEME.shortName ?? ACTIVE_THEME.name).toUpperCase();

  return (
    <div
      className="theme-bg min-h-screen"
    >
      <div
        className="cw-mobile-page-container max-w-[1400px] mx-auto px-3 py-3 md:px-8 md:py-7"
      >

        {/* ── TOP HEADER ── */}
        <header
          className="cw-mobile-header flex items-center justify-between"
          style={{
            background: "var(--brand-surface)",
            border: "1px solid var(--brand-border)",
            boxShadow: "var(--shadow-header)",
            borderRadius: "var(--radius-header)",
            padding: "14px 28px",
            gap: "24px",
          }}
        >
          {/* Left: Logo block */}
          <div className="flex items-center gap-[24px] shrink-0 justify-between md:justify-start w-full md:w-auto">
            <HotelLogo />
            
            {/* Elegant light blue title panel inside header (desktop) */}
            <div
              className="hidden md:flex flex-col justify-center"
              style={{
                background: "var(--brand-info-softest)",
                border: "1px solid var(--brand-info-soft)",
                borderRadius: "var(--radius-card)",
                padding: "12px 28px",
                boxShadow: "inset 0 1px 2px rgba(23, 39, 102, 0.02)",
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ letterSpacing: "0.22em", color: "var(--brand-secondary)" }}
              >
                {eyebrow}
              </span>
              <h1
                className="text-[20px] font-extrabold tracking-tight leading-tight mt-[2px]"
                style={{ color: "var(--brand-primary)" }}
              >
                {t.book_title}
              </h1>
              <div className="flex items-center gap-2 mt-[2px]">
                <span className="text-[12px] font-semibold capitalize" style={{ color: "var(--brand-text-muted)" }}>
                  {selectedDate ? formatLocalizedDate(selectedDate, lang) : ""}
                </span>
                <span className="text-[12px]" style={{ color: "var(--brand-text-metadata)" }}>•</span>
                <span className="text-[12px] font-medium" style={{ color: "var(--brand-text-muted)" }}>
                  {t.book_subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile: Title below logo */}
          <div className="w-full md:hidden text-left my-1">
            <h1 className="text-[17px] font-extrabold tracking-tight theme-text-strong leading-snug">
              {t.book_title}
            </h1>
          </div>

          {/* Controls row */}
          <div className="cw-mobile-controls-row flex items-center gap-[12px] shrink-0 w-full md:w-auto">
            <input
              type="date"
              value={selectedDate}
              min={todayISO()}
              max={maxISO()}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
              className="cw-input-date h-11 px-4 text-[14px] font-bold outline-none cursor-pointer"
              style={{
                background: "var(--brand-surface-neutral)",
                border: "1px solid var(--brand-border)",
                borderRadius: "var(--radius-control)",
                color: "var(--brand-text-strong)",
                minWidth: "140px",
              }}
            />
            <LanguageToggle />
          </div>
        </header>

        {/* ── MAIN CONTENT LAYOUT ── */}
        <div
          className="cw-mobile-main-flow lg:grid lg:grid-cols-[260px_1fr] items-start"
          style={{ gap: "24px", marginTop: "24px" }}
        >

          {/* ── SIDEBAR ── */}
          <aside
            className="cw-mobile-sidebar-second flex flex-col"
            style={{
              background: "var(--brand-surface)",
              border: "1px solid var(--brand-border)",
              boxShadow: "var(--shadow-header)",
              borderRadius: "var(--radius-panel)",
              padding: "24px 20px",
              gap: "20px",
            }}
          >
            {/* Court summary card with CSS court lines */}
            <div
              style={{
                background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)",
                borderRadius: "var(--radius-card)",
                padding: "20px",
                position: "relative",
                color: "#ffffff",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(23, 39, 102, 0.15)",
                minHeight: "150px",
              }}
            >
              {/* CSS Court Line Illustration */}
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  bottom: "-20px",
                  width: "120px",
                  height: "120px",
                  border: "2px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  pointerEvents: "none",
                  transform: "rotate(-15deg)",
                }}
              >
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", background: "rgba(255, 255, 255, 0.15)" }} />
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", background: "rgba(255, 255, 255, 0.15)" }} />
                <div style={{ position: "absolute", left: "15%", right: "15%", top: "15%", bottom: "15%", border: "1.5px dashed rgba(255, 255, 255, 0.12)" }} />
              </div>

              {/* Yellow marker */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "var(--brand-highlight)",
                  color: "var(--brand-primary)",
                  fontWeight: 900,
                  fontSize: "10px",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  letterSpacing: "0.05em",
                }}
              >
                {t.court_badge}
              </div>

              {/* Details */}
              <div className="flex flex-col h-full justify-between z-10 relative">
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "rgba(255, 255, 255, 0.7)", letterSpacing: "0.1em" }}
                  >
                    {t.court_active_label}
                  </span>
                  <h3 className="text-[18px] font-bold leading-tight mt-1" style={{ fontFamily: "var(--font-family-headline-lg)" }}>
                    {t.court_name}
                  </h3>
                </div>
                <div className="mt-8 text-[11px] font-medium" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                  {t.court_description}
                </div>
              </div>
            </div>

            {/* Court nav item */}
            <nav>
              <a
                href="#"
                className="flex items-center font-bold text-[14px] transition-all"
                style={{
                  background: "var(--brand-surface-neutral)",
                  color: "var(--brand-text-strong)",
                  border: "1px solid var(--brand-border)",
                  borderRadius: "var(--radius-card)",
                  padding: "14px 16px",
                  gap: "12px",
                  minHeight: "52px",
                }}
              >
                <PadelIcon size={20} className="shrink-0" />
                {t.courts}
              </a>
            </nav>

            {/* Divider */}
            <div style={{ borderTop: "1px solid var(--brand-border)" }} />

            {/* Legend */}
            <div>
              <p
                className="text-[11px] font-bold uppercase theme-text-meta"
                style={{ letterSpacing: "0.16em", marginBottom: "12px" }}
              >
                {t.legend}
              </p>
              <ul className="flex flex-col" style={{ gap: "10px" }}>
                <li className="flex items-center theme-text-muted text-[13px] font-medium" style={{ gap: "12px" }}>
                  <span
                    className="shrink-0"
                    style={{
                      width: "16px", height: "16px",
                      borderRadius: "5px",
                      background: "var(--state-available-bg)",
                      border: "2px solid var(--state-available-accent)",
                      display: "inline-block",
                    }}
                  />
                  {t.available}
                </li>
                <li className="flex items-center theme-text-muted text-[13px] font-medium" style={{ gap: "12px" }}>
                  <span
                    className="shrink-0"
                    style={{
                      width: "16px", height: "16px",
                      borderRadius: "5px",
                      background: "var(--state-occupied-bg)",
                      border: "1px solid var(--state-occupied-border)",
                      display: "inline-block",
                    }}
                  />
                  {t.occupied}
                </li>
                <li className="flex items-center theme-text-muted text-[13px] font-medium" style={{ gap: "12px" }}>
                  <span
                    className="shrink-0"
                    style={{
                      width: "16px", height: "16px",
                      borderRadius: "5px",
                      background: "var(--state-selected-bg)",
                      display: "inline-block",
                    }}
                  />
                  {t.selected}
                </li>
                <li className="flex items-center theme-text-muted text-[13px] font-medium" style={{ gap: "12px" }}>
                  <span
                    className="shrink-0"
                    style={{
                      width: "16px", height: "16px",
                      borderRadius: "5px",
                      background: "var(--state-passed-bg)",
                      border: "1px solid var(--state-passed-border)",
                      display: "inline-block",
                    }}
                  />
                  {t.passed}
                </li>
              </ul>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid var(--brand-border)" }} />

            {/* Staff access */}
            <a
              href="/admin"
              className="flex items-center font-semibold text-[13px] transition-all theme-text-muted"
              style={{
                borderRadius: "var(--radius-card)",
                padding: "12px 14px",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--brand-surface-neutral)";
                e.currentTarget.style.color = "var(--brand-text-strong)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--brand-text-muted)";
              }}
            >
              <ShieldCheck size={18} className="shrink-0" style={{ color: "var(--brand-text-meta)" }} />
              {t.staffAccess}
            </a>
          </aside>

          {/* ── BOOKING PANEL ── */}
          <main
            className="cw-mobile-booking-first flex flex-col"
            style={{
              background: "var(--brand-surface)",
              border: "1px solid var(--brand-border)",
              boxShadow: "var(--shadow-panel)",
              borderRadius: "var(--radius-panel)",
              padding: "28px 32px",
            }}
          >
            {/* Panel header */}
            <div className="cw-panel-heading flex flex-wrap items-center justify-between gap-2 mb-5 md:mb-6">
              <h2
                className="font-bold tracking-tight flex items-center theme-text-strong text-[18px] sm:text-[20px] gap-2.5"
              >
                <PadelIcon size={22} className="shrink-0" />
                {t.availableSlots}
              </h2>
              <span
                className="cw-panel-badge text-[10px] sm:text-[11px] font-bold tracking-widest uppercase shrink-0 theme-text-meta"
                style={{
                  background: "var(--brand-surface-neutral)",
                  border: "1px solid var(--brand-border)",
                  borderRadius: "var(--radius-pill)",
                  padding: "6px 14px",
                }}
              >
                {slots.length > 0 ? (
                  lang === "de"
                    ? `${slots.length} Slots / Tag`
                    : lang === "en"
                    ? `${slots.length} slots / day`
                    : `${slots.length} slots / jour`
                ) : t.slotsPerDay}
              </span>
            </div>

            {slotTakenError && (
              <div
                className="text-[13px] font-bold text-center"
                style={{
                  background: "var(--state-error-soft)",
                  border: "1px solid var(--state-error)",
                  color: "var(--state-error-dark)",
                  borderRadius: "var(--radius-card)",
                  padding: "14px 20px",
                  marginBottom: "20px",
                }}
              >
                ⚠️ {t.checkout_slot_taken}
              </div>
            )}

            <SlotGrid
              slots={slots}
              selectedSlot={selectedSlot?.slotStart ?? null}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);
                setSlotTakenError(false);
              }}
              loading={loading}
              error={error}
              selectedDate={selectedDate}
            />

            <div
              className="text-center theme-text-meta"
              style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid var(--brand-border)",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {t.footerArrivalNote}
            </div>
          </main>
        </div>
      </div>

      {/* ── Checkout Modal ── */}
      {selectedSlot && settings && (
        <CheckoutModal
          slot={selectedSlot}
          settings={settings}
          date={selectedDate}
          onClose={() => setSelectedSlot(null)}
          onSlotTaken={handleSlotTaken}
        />
      )}
    </div>
  );
}