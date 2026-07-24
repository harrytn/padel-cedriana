"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { generateTimeSlots, normalizeHour } from "@/lib/slots";
import { useRole } from "@/lib/role-context";
import { ShieldAlert } from "lucide-react";

interface Settings {
  id: number;
  base_price: number;
  racket_price_with_balls: number;
  balls_only_price: number;
  lighting_price: number;
  peak_premium: number;
  open_hour: string;
  close_hour: string;
  lighting_trigger_hour: string;
  peak_slots: string;
  slot_duration_minutes: number;
  currency: string;
}

const InputField = ({
  label,
  id,
  value,
  onChange,
  type = "text",
  step,
}: {
  label: string;
  id: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  step?: string;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium theme-text-muted"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cw-input w-full mt-1 text-sm"
      style={{ fontFamily: "var(--font-body)" }}
    />
  </div>
);

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const role = useRole();
  const isAdmin = role === "admin";

  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState<Partial<Settings>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [peakSlotsInput, setPeakSlotsInput] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isAdmin) return; // Don't bother fetching if access denied
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings);
        setForm(data.settings);
        try {
          const arr = JSON.parse(data.settings.peak_slots);
          setPeakSlotsInput(arr.join(", "));
        } catch {
          setPeakSlotsInput(data.settings.peak_slots);
        }
      });
  }, [isAdmin]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const openHour = normalizeHour(form?.open_hour ?? "08:00");
      const closeHour = normalizeHour(form?.close_hour ?? "22:00");
      const duration = Number(form?.slot_duration_minutes || 90);
      const generatedSlots = generateTimeSlots(openHour, closeHour, duration);
      const peakArr = peakSlotsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => generatedSlots.includes(s));

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          peak_slots: JSON.stringify(peakArr),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        showToast("✅ Paramètres sauvegardés");
      } else {
        showToast("❌ Erreur lors de la sauvegarde");
      }
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof Settings) => ({
    value: String(form?.[key] ?? ""),
    onChange: (val: string) => setForm((prev) => ({ ...prev, [key]: val })),
  });

  // ── Access Denied Panel ────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold theme-text-strong">
            ⚙️ {t.admin_settings_title}
          </h1>
        </div>
        <div
          className="rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-5"
          style={{
            background: "var(--brand-surface)",
            border: "1px solid var(--brand-border)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "var(--state-error-soft)",
              border: "1px solid var(--state-error-soft)",
            }}
          >
            <ShieldAlert size={32} strokeWidth={1.5} style={{ color: "var(--state-error)" }} />
          </div>
          <div>
            <p className="font-bold text-lg theme-text-strong">Access Denied</p>
            <p className="text-sm mt-2 max-w-xs theme-text-muted">
              Settings changes are reserved for administrators. Contact your manager for access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!settings) {
    return (
      <div className="p-8 flex items-center justify-center theme-text-muted">
        Loading...
      </div>
    );
  }

  // ── Admin Settings Form ────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 px-5 py-3 rounded-xl font-medium text-sm z-50"
          style={{
            background: "var(--brand-primary)",
            color: "var(--brand-on-primary)",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          {toast}
        </div>
      )}

      <div className="mb-[32px]">
        <h1 className="text-2xl font-bold theme-text-strong">
          ⚙️ {t.admin_settings_title}
        </h1>
        <p className="theme-text-muted mt-[4px] text-sm">
          Mises à jour appliquées immédiatement aux nouvelles réservations.
        </p>
      </div>

      <div className="space-y-[24px]">
        {/* Pricing Section */}
        <div
          className="rounded-2xl p-[24px] md:p-[32px] space-y-[16px]"
          style={{
            background: "var(--brand-surface)",
            border: "1px solid var(--brand-border)",
          }}
        >
          <h2 className="font-semibold text-sm uppercase tracking-wider theme-text-strong">
            💰 Tarifs
          </h2>
          <div className="grid grid-cols-2 gap-[16px]">
            <InputField
              label="Prix de base (court 90 min)"
              id="base-price"
              type="number"
              step="0.5"
              {...field("base_price")}
            />
            <InputField
              label="Supplément heure de pointe"
              id="peak-premium"
              type="number"
              step="0.5"
              {...field("peak_premium")}
            />
            <InputField
              label="Raquette + balles (par raquette)"
              id="racket-price"
              type="number"
              step="0.5"
              {...field("racket_price_with_balls")}
            />
            <InputField
              label="Location balles uniquement"
              id="balls-price"
              type="number"
              step="0.5"
              {...field("balls_only_price")}
            />
            <InputField
              label="Éclairage du terrain"
              id="lighting-price"
              type="number"
              step="0.5"
              {...field("lighting_price")}
            />
            <div>
              <label htmlFor="currency" className="block text-sm font-medium theme-text-muted">
                {t.admin_settings_currency}
              </label>
              <select
                id="currency"
                value={form.currency || "TND"}
                onChange={(e) => setForm(prev => ({ ...prev, currency: e.target.value }))}
                className="cw-input w-full mt-1 text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <option value="TND">{t.admin_settings_currency_tnd}</option>
                <option value="EUR">{t.admin_settings_currency_eur}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div
          className="rounded-2xl p-[24px] md:p-[32px] space-y-[16px]"
          style={{
            background: "var(--brand-surface)",
            border: "1px solid var(--brand-border)",
          }}
        >
          <h2 className="font-semibold text-sm uppercase tracking-wider theme-text-strong">
            🕐 Horaires
          </h2>
          <div className="grid grid-cols-3 gap-[16px]">
            <InputField
              label="Heure d'ouverture (HH:mm)"
              id="open-hour"
              type="time"
              {...field("open_hour")}
            />
            <InputField
              label="Heure de fermeture (HH:mm)"
              id="close-hour"
              type="time"
              {...field("close_hour")}
            />
            <InputField
              label="Déclenchement éclairage"
              id="lighting-trigger"
              {...field("lighting_trigger_hour")}
            />
            <div>
              <label htmlFor="slot-duration" className="block text-sm font-medium theme-text-muted">
                {t.admin_settings_duration}
              </label>
              <select
                id="slot-duration"
                value={form.slot_duration_minutes || 90}
                onChange={(e) => setForm(prev => ({ ...prev, slot_duration_minutes: Number(e.target.value) }))}
                className="cw-input w-full mt-1 text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <option value={20}>20 min</option>
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>
          </div>
        </div>

        {/* Peak Slots Section */}
        <div
          className="rounded-2xl p-[24px] md:p-[32px] space-y-[16px]"
          style={{
            background: "var(--brand-surface)",
            border: "1px solid var(--brand-border)",
          }}
        >
          <h2 className="font-semibold text-sm uppercase tracking-wider theme-text-strong">
            ⚡ Créneaux de pointe
          </h2>
          <div>
            <label
              htmlFor="peak-slots"
              className="block text-sm font-medium theme-text-muted"
            >
              Créneaux (HH:mm séparés par des virgules)
            </label>
            <input
              id="peak-slots"
              type="text"
              value={peakSlotsInput}
              onChange={(e) => setPeakSlotsInput(e.target.value)}
              placeholder="Ex: 17:00, 18:30, 20:00"
              className="cw-input w-full mt-[4px] text-sm"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            />
            <p className="text-xs mt-1.5 theme-text-meta">
              Créneaux valides: {generateTimeSlots(
                normalizeHour(form?.open_hour ?? "08:00"),
                normalizeHour(form?.close_hour ?? "22:00"),
                Number(form?.slot_duration_minutes || 90)
              ).join(" · ")}
            </p>
          </div>
        </div>

        {/* Save button */}
        <button
          id="save-settings-btn"
          onClick={handleSave}
          disabled={saving}
          className="cw-button w-full font-bold transition-opacity"
          style={{
            background: saving ? "var(--brand-border)" : "var(--brand-accent)",
            color: saving ? "var(--brand-text-muted)" : "var(--brand-on-accent)",
            boxShadow: saving ? "none" : "var(--shadow-button)",
          }}
        >
          {saving ? "Saving..." : "💾 Save settings"}
        </button>
      </div>
    </div>
  );
}
