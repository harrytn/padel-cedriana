"use client";
import { SlotData } from "./SlotCard";
import SlotCard from "./SlotCard";
import { useI18n } from "@/lib/i18n";
import { Calendar, AlertCircle } from "lucide-react";

interface SlotGridProps {
  slots: SlotData[];
  selectedSlot: string | null;
  onSelectSlot: (slot: SlotData) => void;
  loading: boolean;
  error?: string | null;
  selectedDate: string; // ISO "YYYY-MM-DD"
}

/** Returns true if the slot start time on the given date is already in the past. */
function isSlotPast(isoDate: string, slotStart: string): boolean {
  if (!isoDate || !slotStart) return false;
  const [hours, minutes] = slotStart.split(":").map(Number);
  const slotDateTime = new Date(isoDate + "T12:00:00"); // start with a valid date
  slotDateTime.setHours(hours, minutes, 0, 0);
  return slotDateTime < new Date();
}

export default function SlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
  error,
  selectedDate,
}: SlotGridProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px] w-full">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flat-card h-24 animate-pulse"
            style={{ background: "#eeeeee" }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-[#f5f5f5] rounded-xl border border-dashed border-[#cccccc]">
        <div className="flex justify-center mb-4">
          <AlertCircle size={48} strokeWidth={1} className="text-[#aaaaaa]" />
        </div>
        <p className="text-sm font-bold text-[#888888] tracking-tight">
          {error}
        </p>
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="text-center py-12 bg-[#f8f8f8] rounded-xl border border-dashed border-[#d0d0d0]">
        <div className="flex justify-center mb-4">
          <Calendar size={48} strokeWidth={1} className="text-[#bbbbbb]" />
        </div>
        <p className="text-sm font-medium text-[#999999] tracking-tight">
          {t.book_select_date}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-[8px]">
      <div className="cw-slot-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]">
        {slots.map((slot) => (
          <SlotCard
            key={slot.slotStart}
            slot={slot}
            isSelected={selectedSlot === slot.slotStart}
            onClick={() => onSelectSlot(slot)}
            isPast={isSlotPast(selectedDate, slot.slotStart)}
          />
        ))}
      </div>
    </div>
  );
}
