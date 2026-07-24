"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-3 py-2 text-sm rounded-lg transition-colors text-left theme-text-muted"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--brand-surface-neutral)";
        e.currentTarget.style.color = "var(--brand-text-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--brand-text-muted)";
      }}
    >
      🚪 Déconnexion
    </button>
  );
}
