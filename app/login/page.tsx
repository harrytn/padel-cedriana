"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

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
    <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center px-[16px]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-[32px]">
          {/* Logo placeholder */}
          <div className="w-[64px] h-[64px] rounded-[10px] bg-[#e8e8e8] border border-[#d0d0d0] flex items-center justify-center mx-auto mb-[16px]">
            <span className="text-[#999999] text-[11px] font-bold tracking-tight">LOGO</span>
          </div>
          <h1
            className="text-[24px] font-bold text-[#111111] tracking-tight"
          >
            Hotel Name
          </h1>
          <p className="text-[#888888] mt-[8px] text-[14px] font-medium">{t.login_title}</p>
        </div>

        <div className="cw-form-card">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-[8px]">
              <label
                htmlFor="admin-password"
                className="block text-[13px] font-bold text-[#333333] tracking-wide"
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
                className="cw-input w-full text-[15px] font-medium text-[#111111] placeholder-[#aaaaaa]"
              />
            </div>

            {error && (
              <p className="text-sm text-[#666666] bg-[#f0f0f0] px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="cw-button w-full bg-[#111111] text-white hover:opacity-80 disabled:opacity-40 mt-[16px]"
            >
              {loading ? "..." : t.login_btn}
            </button>
          </form>
        </div>

        <p className="text-center mt-[24px]">
          <a href="/book" className="text-[13px] font-bold text-[#888888] hover:text-[#333333] transition-colors">
            ← Back to booking
          </a>
        </p>
      </div>
    </div>
  );
}
