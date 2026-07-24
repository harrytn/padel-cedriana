"use client";
import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import SlotGrid from "@/components/booking/SlotGrid";
import CheckoutModal from "@/components/booking/CheckoutModal";
import { SlotData } from "@/components/booking/SlotCard";
import { ACTIVE_THEME } from "@/lib/theme";
import HotelLogo from "@/components/ui/HotelLogo";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function maxISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

import { formatLocalizedDate } from "@/lib/i18n/date";

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
    <div className="theme-bg min-h-screen">

      <div className="max-w-[1500px] mx-auto px-8 py-8">
        
        {/* ── TOP HEADER ── */}
        <header
          className="cw-mobile-header flex items-center justify-between gap-8"
          style={{
            background: "var(--brand-surface)",
            border: "1px solid var(--brand-border)",
            boxShadow: "var(--shadow-header)",
            borderRadius: "var(--radius-header)",
            padding: "20px 32px",
          }}
        >
          <div className="cw-mobile-title-row flex items-center justify-between gap-4 w-full md:w-auto">
            {/* Left: Logo + eyebrow */}
            <div className="flex items-center gap-[16px] shrink-0">
              <HotelLogo />
              <div className="hidden sm:flex flex-col justify-center">
                <span
                  className="text-[10px] font-bold tracking-[0.18em] uppercase theme-text-meta"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {eyebrow}
                </span>
              </div>
            </div>
            
            {/* Center: Title */}
            <div className="flex-1 flex flex-col justify-center sm:text-left text-right">
              <h1
                className="text-[20px] sm:text-[26px] md:text-[32px] font-extrabold tracking-tight leading-tight theme-text-strong"
              >
                {t.book_title}
              </h1>
              <span className="text-[13px] sm:text-[15px] font-medium theme-text-muted capitalize mt-1 hidden sm:block">
                {selectedDate ? formatLocalizedDate(selectedDate, lang) : ""}
              </span>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="cw-mobile-controls-row flex items-center gap-6 shrink-0 w-full md:w-auto">
            <input
              type="date"
              value={selectedDate}
              min={todayISO()}
              max={maxISO()}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
              className="h-12 px-5 text-[15px] font-bold outline-none cursor-pointer w-full md:w-auto"
              style={{
                background: "var(--brand-surface)",
                border: "1px solid var(--brand-border)",
                borderRadius: "var(--radius-control)",
                color: "var(--brand-text-strong)",
                boxShadow: "0 1px 4px var(--brand-border-subtle)",
              }}
            />
            <LanguageToggle />
          </div>
        </header>

        {/* ── MAIN CONTENT LAYOUT ── */}
        <div className="cw-mobile-main-flow lg:grid lg:grid-cols-[280px_1fr] lg:gap-[40px] items-start mt-[48px]">
          
          {/* ── SIDEBAR ── */}
          <aside className="cw-sidebar-root cw-mobile-sidebar-second flex flex-col gap-[28px]">
            <div className="cw-mobile-sidebar-inner flex flex-col gap-[28px]">
              {/* Primary Navigation */}
              <nav className="cw-mobile-nav-primary flex flex-col gap-[12px]">
                <a
                  href="#"
                  className="cw-nav-item transition-all font-bold text-[15px]"
                  style={{
                    background: "var(--brand-surface-neutral)",
                    color: "var(--brand-text-strong)",
                    border: "1px solid var(--brand-border)",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ color: "var(--brand-secondary)" }}
                  >
                    sports_tennis
                  </span>
                  {t.courts}
                </a>
              </nav>

              {/* Legend */}
              <div className="cw-mobile-legend cw-legend-root">
                <p
                  className="text-[12px] font-bold uppercase tracking-widest mb-[16px] theme-text-meta"
                >
                  {t.legend}
                </p>
                <ul className="flex flex-col gap-[12px]">
                  <li className="cw-legend-row text-[14px] font-medium theme-text-muted">
                    <span
                      className="w-4 h-4 rounded-md border-2 shrink-0"
                      style={{
                        background: "var(--state-available-bg)",
                        borderColor: "var(--state-available-accent)",
                      }}
                    />
                    {t.available}
                  </li>
                  <li className="cw-legend-row text-[14px] font-medium theme-text-muted">
                    <span
                      className="w-4 h-4 rounded-md shrink-0"
                      style={{
                        background: "var(--state-occupied-bg)",
                        border: "1px solid var(--state-occupied-border)",
                      }}
                    />
                    {t.occupied}
                  </li>
                  <li className="cw-legend-row text-[14px] font-medium theme-text-muted">
                    <span
                      className="w-4 h-4 rounded-md shrink-0"
                      style={{ background: "var(--state-selected-bg)" }}
                    />
                    {t.selected}
                  </li>
                  <li className="cw-legend-row text-[14px] font-medium theme-text-muted">
                    <span
                      className="w-4 h-4 rounded-md shrink-0"
                      style={{
                        background: "var(--state-passed-bg)",
                        border: "1px solid var(--state-passed-border)",
                      }}
                    />
                    {t.passed}
                  </li>
                </ul>
              </div>

              {/* Secondary Navigation */}
              <nav className="cw-mobile-staff-link flex flex-col gap-[12px]">
                <a
                  href="/admin"
                  className="cw-nav-item transition-all font-semibold text-[15px] theme-text-muted"
                  style={{ "--hover-bg": "var(--brand-surface-neutral)" } as React.CSSProperties}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-surface-neutral)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span
                    className="material-symbols-outlined text-[24px] theme-text-meta"
                  >
                    admin_panel_settings
                  </span>
                  {t.staffAccess}
                </a>
              </nav>
            </div>
          </aside>

          {/* ── WHITE CARD GRID PANEL ── */}
          <main className="cw-glass-panel cw-mobile-booking-first flex flex-col">
            <div className="cw-panel-heading flex items-center justify-between mb-[32px]">
              <h2
                className="text-[20px] sm:text-[24px] font-bold tracking-tight flex items-center gap-3 theme-text-strong"
              >
                <span
                  className="material-symbols-outlined text-3xl shrink-0"
                  style={{ color: "var(--brand-secondary)" }}
                >
                  sports_tennis
                </span>
                {t.availableSlots}
              </h2>
              <span
                className="cw-panel-badge px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest shadow-sm shrink-0 uppercase theme-text-meta"
                style={{
                  background: "var(--brand-surface-neutral)",
                  border: "1px solid var(--brand-border)",
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
                className="mb-7 px-[20px] py-[16px] rounded-[8px] text-[14px] font-bold text-center"
                style={{
                  background: "var(--state-error-soft)",
                  border: "1px solid var(--state-error)",
                  color: "var(--state-error-dark)",
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
              className="mt-8 pt-6 border-t text-center theme-border"
            >
              <p className="text-[13px] font-medium theme-text-meta">
                {t.footerArrivalNote}
              </p>
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