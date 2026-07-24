"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { CheckCircle2, Calendar, Clock, DollarSign, ArrowLeft, Download } from "lucide-react";
import { ACTIVE_THEME } from "@/lib/theme";
import HotelLogo from "@/components/ui/HotelLogo";

import { formatLocalizedDate } from "@/lib/i18n/date";
import { formatPrice } from "@/lib/currency";

function ConfirmationContent() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const params = useSearchParams();

  const pin = params.get("pin") ?? "????";
  const slot = params.get("slot") ?? "";
  const date = params.get("date") ?? "";
  const total = params.get("total") ?? "0";
  const duration = params.get("duration") ?? "90";
  const urlCurrency = params.get("currency") ?? "TND";

  const [bookingCurrency, setBookingCurrency] = useState<string | null>(null);

  useEffect(() => {
    if (pin && pin !== "????") {
      fetch(`/api/bookings/pin/${pin}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.booking?.currency) {
            setBookingCurrency(data.booking.currency);
          }
        })
        .catch((err) => console.error("Failed to fetch booking currency", err));
    }
  }, [pin]);

  const displayCurrency = bookingCurrency || urlCurrency;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-[24px]"
      style={{ background: "var(--brand-bg)" }}
    >

      <div className="w-full max-w-2xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-[24px]">
          <button
            onClick={() => router.push("/book")}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors theme-text-meta hover:theme-text"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--brand-text-metadata)")}
          >
            <ArrowLeft size={14} />
            {t.confirm_another_btn}
          </button>
          <LanguageToggle />
        </div>

        {/* ── Confirmation Card ── */}
        <div className="cw-confirmation-card space-y-10">

          {/* Status Header */}
          <div className="flex flex-col items-center text-center">
            <div
              className="w-[64px] h-[64px] rounded-full flex items-center justify-center mb-[20px] shadow-md"
              style={{ background: "var(--brand-secondary)" }}
            >
              <CheckCircle2 size={32} strokeWidth={1.5} className="text-white" />
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight mb-1 theme-text-strong"
            >
              {t.bookingConfirmed}
            </h1>
            <p className="text-[13px] font-medium uppercase tracking-widest theme-text-meta">
              {t.reservationConfirmed}
            </p>
          </div>

          {/* PIN / Reservation Code */}
          <div
            className="cw-confirmation-section py-8 text-center"
            style={{ borderTop: "1px solid var(--brand-border)", borderBottom: "1px solid var(--brand-border)" }}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.2em] mb-4 block theme-text-meta">
              {t.yourBookingPin}
            </span>
            <div
              className="text-5xl md:text-6xl font-bold tracking-widest py-2 theme-text-strong"
            >
              {pin}
            </div>
            <p className="text-[11px] font-medium mt-4 flex items-center justify-center gap-2 theme-text-disabled">
              <Download size={12} />
              {t.screenshotPinHint}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[32px]">
            <div className="cw-confirmation-section space-y-1.5 p-0">
              <div className="flex items-center gap-2 mb-1">
                <Calendar
                  size={13}
                  strokeWidth={1.5}
                  style={{ color: "var(--brand-secondary)" }}
                />
                <span className="text-sm font-semibold uppercase theme-text-meta">{t.date}</span>
              </div>
              <p className="text-lg font-medium capitalize theme-text-strong">
                {formatLocalizedDate(date, lang)}
              </p>
            </div>
            <div className="cw-confirmation-section space-y-1.5 p-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock
                  size={13}
                  strokeWidth={1.5}
                  style={{ color: "var(--brand-secondary)" }}
                />
                <span className="text-sm font-semibold uppercase theme-text-meta">{t.slot}</span>
              </div>
              <p className="text-lg font-medium theme-text-strong">
                {slot} — {t.book_duration.replace("{count}", duration)}
              </p>
            </div>
            <div className="cw-confirmation-section space-y-1.5 p-0">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign
                  size={13}
                  strokeWidth={1.5}
                  style={{ color: "var(--brand-secondary)" }}
                />
                <span className="text-sm font-semibold uppercase theme-text-meta">{t.amountToPay}</span>
              </div>
              <p className="text-lg font-medium theme-text-strong">
                {formatPrice(Number(total), displayCurrency)}
              </p>
            </div>
          </div>

          {/* Instructions Notice */}
          <div className="cw-confirmation-instructions theme-info-box mt-[24px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-[8px] theme-text-meta">
              {t.instructions}
            </p>
            <p className="text-sm font-medium leading-relaxed theme-text">
              {t.confirmationInstructions}
            </p>
          </div>
        </div>

        {/* Footer — hotel logo */}
        <div className="mt-[32px] flex flex-col items-center justify-center gap-[8px] opacity-60">
          <HotelLogo size="mobile" />
          {ACTIVE_THEME.location && (
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase theme-text-meta">
              {ACTIVE_THEME.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--brand-bg)" }}
      >
        <span className="text-[11px] font-bold uppercase tracking-widest theme-text-disabled">
          Loading...
        </span>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
