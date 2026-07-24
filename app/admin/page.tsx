"use client";
import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { getSlotEnd } from "@/lib/slots";
import { formatPrice } from "@/lib/currency";
import { useRole } from "@/lib/role-context";
import { ACTIVE_THEME } from "@/lib/theme";

interface BookingRecord {
  id: string;
  booking_pin: string;
  type: string;
  customer_first_name: string | null;
  customer_last_name: string | null;
  room_number: string | null;
  date: string;
  slot_start: string;
  racket_count: number;
  bought_balls_only: boolean;
  needs_lighting: boolean;
  total_price: number;
  currency: string;
  status: string;
}

interface ScheduleSlot {
  slotStart: string;
  isPeak: boolean;
  booking: BookingRecord | null;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Maps booking status to the CSS badge class from globals.css */
function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    PAID: "badge-paid",
    PENDING_PAYMENT: "badge-pending",
    CANCELLED: "badge-cancelled",
    ARRIVED: "badge-arrived",
    NO_SHOW: "badge-noshow",
  };
  return map[status] ?? "badge-noshow";
}

export default function AdminSchedulePage() {
  const { t } = useI18n();
  const role = useRole();
  const isAdmin = role === "admin";

  const [date, setDate] = useState(todayISO());
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSchedule = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/schedule?date=${d}`);
      if (res.ok) {
        const data = await res.json();
        setSchedule(data.schedule);
        setSettings(data.settings);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule(date);
  }, [date, fetchSchedule]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(
          newStatus === "PAID" ? "✅ Marqué comme payé" : "⏳ Marqué en attente"
        );
        fetchSchedule(date);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("Annuler cette réservation ?")) return;
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (res.ok) {
        showToast("❌ Réservation annulée");
        fetchSchedule(date);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const restoreBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESTORE" }),
      });
      if (res.ok) {
        showToast(`✅ ${t.admin_action_restore}`);
        fetchSchedule(date);
      } else if (res.status === 409) {
        showToast(`⚠️ ${t.admin_restore_conflict}`);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // ── Admin-only actions ────────────────────────────────────────────────────
  const unblockSlot = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("✅ Créneau débloqué");
        fetchSchedule(date);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const blockSlot = async (slotStart: string) => {
    setActionLoading(slotStart);
    try {
      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, slotStart }),
      });
      if (res.ok) {
        showToast("🚫 Créneau bloqué");
        fetchSchedule(date);
      } else if (res.status === 409) {
        showToast("⚠️ Ce créneau est déjà réservé");
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 px-[20px] py-[12px] rounded-xl font-medium text-sm z-50"
          style={{
            background: "var(--brand-primary)",
            color: "var(--brand-on-primary)",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between mb-[32px]">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight theme-text-strong">
            📅 {t.admin_schedule_title}
          </h1>
          <p className="text-[14px] font-bold mt-[4px] theme-text-muted">
            {ACTIVE_THEME.name}
            {ACTIVE_THEME.location ? ` — ${ACTIVE_THEME.location}` : ""} · Padel Court
          </p>
        </div>
        <input
          id="admin-date-picker"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="cw-input"
        />
      </div>

      {/* Schedule table */}
      <div className="cw-glass-card w-full overflow-x-auto p-0 border-none">
        <table className="w-full whitespace-nowrap min-w-max">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--brand-border)" }}>
              {[t.admin_col_time, t.admin_col_type, t.admin_col_client, t.admin_col_room, t.admin_col_pin, t.admin_col_price, t.admin_col_status, t.admin_col_actions].map(
                (h) => (
                  <th
                    key={h}
                    className="px-[24px] py-[16px] text-left text-[12px] font-bold uppercase tracking-wider theme-text-muted"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--brand-border-subtle)" }}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-[24px] py-[20px]">
                        <div
                          className="h-[16px] rounded animate-pulse w-[80%]"
                          style={{ background: "var(--brand-surface-muted)" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : schedule.map(({ slotStart, isPeak, booking }, i) => {
                  const isBlock = booking?.type === "ADMIN_BLOCK";
                  const busy =
                    actionLoading === booking?.id || actionLoading === slotStart;

                  return (
                    <tr
                      key={slotStart}
                      style={{
                        borderBottom: "1px solid var(--brand-border-subtle)",
                        opacity: busy ? 0.6 : 1,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--brand-surface-neutral)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* Time */}
                      <td className="px-[24px] py-[20px]">
                        <span
                          className="font-bold text-[15px] block"
                          style={{ color: isPeak ? "var(--brand-text-muted)" : "var(--brand-text)" }}
                        >
                          {slotStart} - {getSlotEnd(slotStart, settings?.slot_duration_minutes || 90)}
                        </span>
                        {isPeak && (
                          <span
                            className="text-[11px] font-bold tracking-tight"
                            style={{ color: "var(--brand-on-highlight)", opacity: 0.8 }}
                          >
                            ⚡ Peak hour
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="px-[24px] py-[20px]">
                        {booking ? (
                          <span className={`badge-base ${isBlock ? "badge-blocked" : "badge-arrived"}`}>
                            {isBlock ? "🚫 Blocked" : "👤 Guest"}
                          </span>
                        ) : (
                          <span className="theme-text-disabled text-[14px] font-bold">—</span>
                        )}
                      </td>

                      {/* Client name & Add-ons */}
                      <td className="px-[24px] py-[20px]">
                        <div className="flex flex-col gap-[4px]">
                          <span className="font-bold text-[14px] theme-text-strong">
                            {booking && !isBlock
                              ? `${booking.customer_first_name} ${booking.customer_last_name}`
                              : "—"}
                          </span>
                          {booking && !isBlock && (
                            <div className="flex items-center gap-[6px]">
                              {booking.racket_count > 0 && (
                                <span
                                  className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                                  style={{
                                    background: "var(--brand-surface-neutral)",
                                    color: "var(--brand-text-muted)",
                                    border: "1px solid var(--brand-border)",
                                  }}
                                >
                                  🎾 x{booking.racket_count}
                                </span>
                              )}
                              {booking.bought_balls_only && (
                                <span
                                  className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                                  style={{
                                    background: "var(--brand-surface-neutral)",
                                    color: "var(--brand-text-muted)",
                                    border: "1px solid var(--brand-border)",
                                  }}
                                >
                                  🎾 Balls
                                </span>
                              )}
                              {booking.needs_lighting && (
                                <span
                                  className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                                  style={{
                                    background: "var(--brand-surface-neutral)",
                                    color: "var(--brand-text-muted)",
                                    border: "1px solid var(--brand-border)",
                                  }}
                                >
                                  💡 Lighting
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Room */}
                      <td className="px-[24px] py-[20px] font-bold text-[14px] theme-text-strong">
                        {booking?.room_number ?? "—"}
                      </td>

                      {/* PIN */}
                      <td className="px-[24px] py-[20px]">
                        {booking && !isBlock ? (
                          <span
                            className="font-bold text-[14px] tracking-widest px-[12px] py-[4px] rounded-lg"
                            style={{
                              background: "var(--brand-surface-neutral)",
                              color: "var(--brand-text-strong)",
                              border: "1px solid var(--brand-border)",
                            }}
                          >
                            {booking.booking_pin}
                          </span>
                        ) : (
                          <span className="font-bold theme-text-disabled">—</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-[24px] py-[20px]">
                        {booking && !isBlock ? (
                          <span className="font-bold text-[14px] theme-text-strong">
                            {formatPrice(booking.total_price, booking.currency || settings?.currency)}
                          </span>
                        ) : (
                          <span className="font-bold theme-text-disabled">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-[24px] py-[20px]">
                        {isBlock ? (
                          <span className="badge-base badge-blocked">🚫 Blocked</span>
                        ) : booking ? (
                          <span className={`badge-base ${statusBadgeClass(booking.status)}`}>
                            {/* @ts-expect-error valid dynamic key mapping */}
                            {t[
                              {
                                PAID: "status_paid",
                                PENDING_PAYMENT: "status_pending",
                                CANCELLED: "status_cancelled",
                                ARRIVED: "status_arrived",
                                NO_SHOW: "status_no_show",
                              }[booking.status] ?? "status_free"
                            ] ?? booking.status}
                          </span>
                        ) : (
                          <span className="badge-free">{t.status_free}</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-[16px] py-[16px]">
                        <div className="flex items-center gap-[8px]">
                          {/* Block — Admin only */}
                          {!booking && isAdmin && (
                            <button
                              id={`block-slot-${slotStart.replace(":", "")}`}
                              onClick={() => blockSlot(slotStart)}
                              disabled={busy}
                              className="action-btn action-btn-block"
                            >
                              🚫 {t.admin_block_slot}
                            </button>
                          )}

                          {/* Mark Paid — both roles */}
                          {booking &&
                            !isBlock &&
                            booking.status === "PENDING_PAYMENT" && (
                              <button
                                id={`mark-paid-${booking.id.slice(0, 8)}`}
                                onClick={() => updateStatus(booking.id, "PAID")}
                                disabled={busy}
                                className="action-btn action-btn-approve"
                              >
                                {t.status_paid}
                              </button>
                            )}

                          {/* Check-in (ARRIVED) — both roles */}
                          {booking &&
                            !isBlock &&
                            (booking.status === "PENDING_PAYMENT" || booking.status === "PAID") && (
                              <button
                                id={`mark-arrived-${booking.id.slice(0, 8)}`}
                                onClick={() => updateStatus(booking.id, "ARRIVED")}
                                disabled={busy}
                                className="action-btn action-btn-checkin"
                              >
                                {t.admin_action_checkin}
                              </button>
                            )}

                          {/* No Show — both roles */}
                          {booking &&
                            !isBlock &&
                            (booking.status === "PENDING_PAYMENT" || booking.status === "PAID") && (
                              <button
                                id={`mark-noshow-${booking.id.slice(0, 8)}`}
                                onClick={() => updateStatus(booking.id, "NO_SHOW")}
                                disabled={busy}
                                className="action-btn action-btn-noshow"
                              >
                                {t.admin_action_noshow}
                              </button>
                            )}

                          {/* Cancel — both roles */}
                          {booking && !isBlock && booking.status !== "CANCELLED" && (
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              disabled={busy}
                              className="action-btn action-btn-cancel"
                            >
                              ❌
                            </button>
                          )}

                          {/* Restore — Admin only */}
                          {booking && !isBlock && booking.status === "CANCELLED" && isAdmin && (
                            <button
                              onClick={() => restoreBooking(booking.id)}
                              disabled={busy}
                              className="action-btn action-btn-restore"
                            >
                              🔄 {t.admin_action_restore}
                            </button>
                          )}

                          {/* Unblock — Admin only */}
                          {isBlock && isAdmin && (
                            <button
                              onClick={() => unblockSlot(booking!.id)}
                              disabled={busy}
                              className="action-btn action-btn-unblock"
                            >
                              {t.admin_unblock_slot}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
