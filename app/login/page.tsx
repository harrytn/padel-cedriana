"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { ACTIVE_THEME } from "@/lib/theme";
import HotelLogo from "@/components/ui/HotelLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(t.login_error);
      }
    } catch {
      setError(t.error_generic);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-[16px]"
      style={{ background: "var(--brand-bg)" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-[32px]">
          {/* Hotel logo */}
          <div className="flex justify-center mb-[16px]">
            <HotelLogo size="mobile" />
          </div>
          <h1
            className="text-[24px] font-bold tracking-tight theme-text-strong"
          >
            {ACTIVE_THEME.name}
          </h1>
          <p className="theme-text-muted mt-[8px] text-[14px] font-medium">{t.login_title}</p>
        </div>

        <div className="cw-form-card">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-[8px]">
              <label
                htmlFor="admin-password"
                className="block text-[13px] font-bold tracking-wide theme-text"
              >
                PIN
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login_password_placeholder}
                required
                className="cw-input w-full text-[15px] font-medium"
              />
            </div>

            {error && (
              <p
                className="text-sm px-3 py-2 rounded-lg theme-text-muted"
                style={{
                  background: "var(--state-error-soft)",
                  color: "var(--state-error-dark)",
                }}
              >
                {error}
              </p>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="cw-button w-full hover:opacity-80 disabled:opacity-40 mt-[16px]"
              style={{
                background: "var(--brand-accent)",
                color: "var(--brand-on-accent)",
                boxShadow: "var(--shadow-button)",
              }}
            >
              {loading ? "..." : t.login_btn}
            </button>
          </form>
        </div>

        <p className="text-center mt-[24px]">
          <a
            href="/book"
            className="text-[13px] font-bold theme-text-meta transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--brand-text-metadata)")}
          >
            ← Back to booking
          </a>
        </p>
      </div>
    </div>
  );
}
