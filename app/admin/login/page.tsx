"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserRound, Eye, EyeOff } from "lucide-react";
import { ACTIVE_THEME } from "@/lib/theme";
import HotelLogo from "@/components/ui/HotelLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        setError("Mot de passe incorrect.");
        setPassword("");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-[16px]"
      style={{ background: "var(--brand-bg)" }}
    >

      <div className="w-full max-w-sm relative">
        {/* Header */}
        <div className="text-center mb-[32px]">
          <div className="flex justify-center mb-[16px]">
            <HotelLogo size="mobile" />
          </div>
          <h1
            className="text-2xl font-bold theme-text-strong"
          >
            {ACTIVE_THEME.name}
          </h1>
          <p className="theme-text-muted mt-1 text-sm">Staff Portal</p>
        </div>

        {/* Role info cards */}
        <div className="grid grid-cols-2 gap-[12px] mb-[24px]">
          <div
            className="rounded-xl px-[12px] py-[12px] flex items-center gap-[10px]"
            style={{
              background: "var(--brand-surface-neutral)",
              border: "1px solid var(--brand-border)",
            }}
          >
            <ShieldCheck size={16} className="shrink-0" style={{ color: "var(--brand-secondary)" }} />
            <div>
              <p className="text-xs font-bold theme-text-strong">Admin</p>
              <p className="text-[10px] leading-tight theme-text-meta">Full access</p>
            </div>
          </div>
          <div
            className="rounded-xl px-[12px] py-[12px] flex items-center gap-[10px]"
            style={{
              background: "var(--brand-surface-neutral)",
              border: "1px solid var(--brand-border)",
            }}
          >
            <UserRound size={16} className="shrink-0" style={{ color: "var(--brand-secondary)" }} />
            <div>
              <p className="text-xs font-bold theme-text-strong">Reception</p>
              <p className="text-[10px] leading-tight theme-text-meta">Schedule + statuses</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-[24px]"
          style={{
            background: "var(--brand-surface)",
            border: "1px solid var(--brand-border)",
          }}
        >
          <p className="text-xs text-center mb-[20px] theme-text-muted">
            Your role is detected automatically from your password.
          </p>

          <form onSubmit={handleLogin} className="space-y-[16px]">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium mb-1 theme-text"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="cw-input w-full pr-[44px] text-[15px]"
                  style={{ fontFamily: "var(--font-body)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors theme-text-disabled"
                  tabIndex={-1}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-text-muted)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--brand-text-disabled)")}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-sm px-3 py-2 rounded-lg"
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
              disabled={loading || !password}
              className="cw-button w-full font-bold text-white transition-all"
              style={{
                background: loading || !password ? "var(--brand-border)" : "var(--brand-accent)",
                color: loading || !password ? "var(--brand-text-muted)" : "var(--brand-on-accent)",
                boxShadow: loading || !password ? "none" : "var(--shadow-button)",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center mt-[24px]">
          <a
            href="/book"
            className="text-sm theme-text-meta transition-colors"
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
