"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserRound, Eye, EyeOff } from "lucide-react";

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
      style={{ background: "#f5f5f5" }}
    >

      <div className="w-full max-w-sm relative">
        {/* Header */}
        <div className="text-center mb-[32px]">
          <div className="inline-flex items-center justify-center w-[64px] h-[64px] rounded-2xl mb-[16px]"
            style={{ background: "#e8e8e8", border: "1px solid #d0d0d0" }}
          >
            <span className="text-2xl">🎾</span>
          </div>
          <h1
            className="text-2xl font-bold text-[#111111]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Hotel Name
          </h1>
          <p className="text-[#888888] mt-1 text-sm">Staff Portal</p>
        </div>

        {/* Role info cards */}
        <div className="grid grid-cols-2 gap-[12px] mb-[24px]">
          <div
            className="rounded-xl px-[12px] py-[12px] flex items-center gap-[10px]"
            style={{ background: "#f0f0f0", border: "1px solid #d0d0d0" }}
          >
            <ShieldCheck size={16} className="text-[#555555] shrink-0" />
            <div>
              <p className="text-[#333333] text-xs font-bold">Admin</p>
              <p className="text-[#999999] text-[10px] leading-tight">Full access</p>
            </div>
          </div>
          <div
            className="rounded-xl px-[12px] py-[12px] flex items-center gap-[10px]"
            style={{ background: "#f0f0f0", border: "1px solid #d0d0d0" }}
          >
            <UserRound size={16} className="text-[#555555] shrink-0" />
            <div>
              <p className="text-[#333333] text-xs font-bold">Reception</p>
              <p className="text-[#999999] text-[10px] leading-tight">Schedule + statuses</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-[24px]"
          style={{ background: "#ffffff", border: "1px solid #e0e0e0" }}
        >
          <p className="text-[#888888] text-xs text-center mb-[20px]">
            Your role is detected automatically from your password.
          </p>

          <form onSubmit={handleLogin} className="space-y-[16px]">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-[#333333] mb-1"
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
                  className="w-full px-[16px] py-[12px] pr-[44px] rounded-xl text-[#111111] placeholder-[#aaaaaa] outline-none transition-all"
                  style={{
                    background: "#f5f5f5",
                    border: "1.5px solid #cccccc",
                    fontFamily: "var(--font-body)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#555555")}
                  onBlur={(e) => (e.target.style.borderColor = "#cccccc")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] hover:text-[#555555] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg border border-red-900/30">
                {error}
              </p>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading || !password}
              className="w-full py-[12px] rounded-xl font-bold text-white transition-all"
              style={{
                background: loading || !password ? "#cccccc" : "#111111",
                boxShadow: loading || !password ? "none" : "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center mt-[24px]">
          <a
            href="/book"
            className="text-sm text-[#888888] hover:text-[#333333] transition-colors"
          >
            ← Back to booking
          </a>
        </p>
      </div>
    </div>
  );
}
