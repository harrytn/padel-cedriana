"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { CheckCircle2, Calendar, Clock, DollarSign, ArrowLeft, Download } from "lucide-react";

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
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-[24px]">

      <div className="w-full max-w-2xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-[24px]">
          <button
            onClick={() => router.push("/book")}
            className="flex items-center gap-2 text-[11px] font-bold text-[#888888] hover:text-[#333333] uppercase tracking-[0.15em] transition-colors"
          >
            <ArrowLeft size={14} />
            {t.confirm_another_btn}
          </button>
          <LanguageToggle />
        </div>

        {/* ── Neutral Receipt Card ── */}
        <div className="cw-confirmation-card space-y-10">

          {/* Status Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-[64px] h-[64px] rounded-full bg-[#222222] flex items-center justify-center mb-[20px] shadow-md">
              <CheckCircle2 size={32} strokeWidth={1.5} className="text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111111] tracking-tight mb-1">
              {t.bookingConfirmed}
            </h1>
            <p className="text-[13px] font-medium text-[#999999] uppercase tracking-widest">
              {t.reservationConfirmed}
            </p>
          </div>

          {/* PIN / Reservation Code */}
          <div className="cw-confirmation-section py-8 border-y border-[#e0e0e0] text-center">
            <span className="text-sm font-semibold text-[#888888] uppercase tracking-[0.2em] mb-4 block">
              {t.yourBookingPin}
            </span>
            <div className="text-5xl md:text-6xl font-bold text-[#111111] tracking-widest py-2">
              {pin}
            </div>
            <p className="text-[11px] font-medium text-[#aaaaaa] mt-4 flex items-center justify-center gap-2">
              <Download size={12} />
              {t.screenshotPinHint}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[32px]">
            <div className="cw-confirmation-section space-y-1.5 p-0">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={13} strokeWidth={1.5} className="text-[#888888]" />
                <span className="text-sm font-semibold text-[#888888] uppercase">{t.date}</span>
              </div>
              <p className="text-lg font-medium text-[#111111] capitalize">{formatLocalizedDate(date, lang)}</p>
            </div>
            <div className="cw-confirmation-section space-y-1.5 p-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={13} strokeWidth={1.5} className="text-[#888888]" />
                <span className="text-sm font-semibold text-[#888888] uppercase">{t.slot}</span>
              </div>
              <p className="text-lg font-medium text-[#111111]">{slot} — {t.book_duration.replace("{count}", duration)}</p>
            </div>
            <div className="cw-confirmation-section space-y-1.5 p-0">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={13} strokeWidth={1.5} className="text-[#888888]" />
                <span className="text-sm font-semibold text-[#888888] uppercase">{t.amountToPay}</span>
              </div>
              <p className="text-lg font-medium text-[#111111]">{formatPrice(Number(total), displayCurrency)}</p>
            </div>
          </div>

          {/* Instructions Notice */}
          <div className="cw-confirmation-instructions bg-[#f5f5f5] border border-[#e0e0e0] mt-[24px]">
            <p className="text-[11px] font-bold text-[#888888] uppercase tracking-[0.1em] mb-[8px]">
              {t.instructions}
            </p>
            <p className="text-sm font-medium text-[#333333] leading-relaxed">
              {t.confirmationInstructions}
            </p>
          </div>
        </div>

        {/* Footer placeholder */}
        <div className="mt-[32px] text-center">
          <div className="inline-flex items-center justify-center gap-[8px] opacity-40">
            <div className="w-5 h-5 rounded-[4px] bg-[#cccccc] border border-[#bbbbbb]" />
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#999999] uppercase">
              Hotel Name
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <span className="text-[11px] font-bold text-[#aaaaaa] tracking-widest uppercase">Loading...</span>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
