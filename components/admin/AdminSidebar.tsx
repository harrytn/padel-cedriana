"use client";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wind,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRole } from "@/lib/role-context";

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
      className={`relative h-screen flex flex-col transition-all duration-300 ease-in-out shrink-0 border-r border-[#e0e0e0] bg-white ${
        isCollapsed ? "w-20" : "w-[280px]"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-white text-[#555555] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors z-50 border border-[#e0e0e0] shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header / Logo */}
      <div
        className={`p-[24px] border-b border-[#e0e0e0] flex items-center gap-[12px] ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="shrink-0 text-[#555555]">
          <Wind size={24} strokeWidth={1.5} />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="font-bold text-[#111111] text-[15px] tracking-tight uppercase">Hotel</h1>
            <p className="text-[11px] text-[#888888] font-bold tracking-widest leading-none mt-[4px]">
              Staff Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-[16px] flex flex-col gap-[8px] mt-[16px]">
        <a
          href="/admin"
          className={`flex items-center gap-[12px] px-[16px] h-[48px] rounded-xl text-[14px] font-bold transition-all group ${
            isCollapsed ? "justify-center" : ""
          } text-[#555555] hover:text-[#111111] hover:bg-[#f0f0f0]`}
        >
          <Calendar size={18} strokeWidth={1.5} className="shrink-0" />
          {!isCollapsed && <span>Schedule</span>}
        </a>

        {/* Settings — Admin only */}
        {isAdmin && (
          <a
            href="/admin/settings"
            className={`flex items-center gap-[12px] px-[16px] h-[48px] rounded-xl text-[14px] font-bold transition-all group ${
              isCollapsed ? "justify-center" : ""
            } text-[#555555] hover:text-[#111111] hover:bg-[#f0f0f0]`}
          >
            <Settings size={18} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </a>
        )}
      </nav>

      {/* Role Badge + Logout */}
      <div className="p-[16px] border-t border-[#e0e0e0] flex flex-col gap-[12px]">
        {/* Role Badge */}
        {!isCollapsed && (
          <div
            className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-xl bg-[#f5f5f5] border border-[#e0e0e0]"
          >
            {isAdmin ? (
              <ShieldCheck size={16} className="text-[#555555] shrink-0" />
            ) : (
              <UserRound size={16} className="text-[#555555] shrink-0" />
            )}
            <div className="min-w-0">
              <p
                className="text-[12px] font-bold truncate text-[#333333]"
              >
                {isAdmin ? "Administrator" : "Reception"}
              </p>
              <p className="text-[10px] font-bold text-[#888888] leading-none mt-0.5 uppercase tracking-wide">
                {isAdmin ? "Full access" : "Limited access"}
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            {isAdmin ? (
              <ShieldCheck size={18} className="text-[#777777]" />
            ) : (
              <UserRound size={18} className="text-[#777777]" />
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-[12px] px-[16px] h-[48px] rounded-xl text-[14px] font-bold transition-all group ${
            isCollapsed ? "justify-center" : ""
          } text-[#888888] hover:text-[#333333] hover:bg-[#f0f0f0]`}
        >
          <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}
