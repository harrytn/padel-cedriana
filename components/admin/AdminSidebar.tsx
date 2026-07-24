"use client";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRole } from "@/lib/role-context";
import { ACTIVE_THEME } from "@/lib/theme";
import HotelLogo from "@/components/ui/HotelLogo";

interface AdminSidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function AdminSidebar({ isCollapsed, toggleCollapse }: AdminSidebarProps) {
  const router = useRouter();
  const role = useRole();
  const isAdmin = role === "admin";

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div
      className={`relative h-screen flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
        isCollapsed ? "w-20" : "w-[280px]"
      }`}
      style={{
        background: "var(--brand-surface)",
        borderRight: "1px solid var(--brand-border)",
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-10 w-6 h-6 rounded-full flex items-center justify-center z-50 transition-colors theme-text-muted"
        style={{
          background: "var(--brand-surface)",
          border: "1px solid var(--brand-border)",
          boxShadow: "0 1px 4px var(--brand-border-subtle)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-surface-neutral)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand-surface)")}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header / Logo */}
      <div
        className={`p-[24px] flex items-center gap-[12px] ${isCollapsed ? "justify-center" : ""}`}
        style={{ borderBottom: "1px solid var(--brand-border)" }}
      >
        {isCollapsed ? (
          /* Collapsed: show initials or small logo */
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-sm shrink-0"
            style={{
              background: "var(--brand-surface-neutral)",
              color: "var(--brand-text-strong)",
              border: "1px solid var(--brand-border)",
              letterSpacing: "-0.01em",
            }}
          >
            {(ACTIVE_THEME.shortName ?? ACTIVE_THEME.name)
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0].toUpperCase())
              .join("")}
          </div>
        ) : (
          /* Expanded: full logo */
          <div className="flex flex-col gap-[6px]">
            <HotelLogo size="mobile" />
            <p
              className="text-[10px] font-bold tracking-[0.18em] uppercase theme-text-meta"
            >
              Staff Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-[16px] flex flex-col gap-[8px] mt-[16px]">
        <a
          href="/admin"
          className={`flex items-center gap-[12px] px-[16px] h-[48px] rounded-xl text-[14px] font-bold transition-all ${
            isCollapsed ? "justify-center" : ""
          } theme-text-muted`}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--brand-surface-neutral)";
            e.currentTarget.style.color = "var(--brand-text-strong)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--brand-text-muted)";
          }}
        >
          <Calendar size={18} strokeWidth={1.5} className="shrink-0" />
          {!isCollapsed && <span>Schedule</span>}
        </a>

        {/* Settings — Admin only */}
        {isAdmin && (
          <a
            href="/admin/settings"
            className={`flex items-center gap-[12px] px-[16px] h-[48px] rounded-xl text-[14px] font-bold transition-all ${
              isCollapsed ? "justify-center" : ""
            } theme-text-muted`}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--brand-surface-neutral)";
              e.currentTarget.style.color = "var(--brand-text-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--brand-text-muted)";
            }}
          >
            <Settings size={18} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </a>
        )}
      </nav>

      {/* Role Badge + Logout */}
      <div
        className="p-[16px] flex flex-col gap-[12px]"
        style={{ borderTop: "1px solid var(--brand-border)" }}
      >
        {/* Role Badge */}
        {!isCollapsed && (
          <div
            className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-xl"
            style={{
              background: "var(--brand-surface-neutral)",
              border: "1px solid var(--brand-border)",
            }}
          >
            {isAdmin ? (
              <ShieldCheck
                size={16}
                className="shrink-0"
                style={{ color: "var(--brand-secondary)" }}
              />
            ) : (
              <UserRound
                size={16}
                className="shrink-0"
                style={{ color: "var(--brand-secondary)" }}
              />
            )}
            <div className="min-w-0">
              <p className="text-[12px] font-bold truncate theme-text-strong">
                {isAdmin ? "Administrator" : "Reception"}
              </p>
              <p className="text-[10px] font-bold leading-none mt-0.5 uppercase tracking-wide theme-text-meta">
                {isAdmin ? "Full access" : "Limited access"}
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            {isAdmin ? (
              <ShieldCheck size={18} style={{ color: "var(--brand-text-muted)" }} />
            ) : (
              <UserRound size={18} style={{ color: "var(--brand-text-muted)" }} />
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-[12px] px-[16px] h-[48px] rounded-xl text-[14px] font-bold transition-all ${
            isCollapsed ? "justify-center" : ""
          } theme-text-muted`}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--brand-surface-neutral)";
            e.currentTarget.style.color = "var(--brand-text-strong)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--brand-text-muted)";
          }}
        >
          <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}
