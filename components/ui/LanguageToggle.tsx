"use client";
import { useI18n } from "@/lib/i18n";
import { Language } from "@/lib/i18n/translations";
import { Globe } from "lucide-react";

const LANGUAGES: { code: Language; name: string }[] = [
  { code: "fr", name: "FR" },
  { code: "en", name: "EN" },
  { code: "de", name: "DE" },
];

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div
      className="cw-language-toggle flex items-center justify-center rounded-full gap-[12px] sm:gap-[16px]"
      style={{
        background: "var(--brand-surface-neutral)",
        border: "1px solid var(--brand-border)",
        boxShadow: "0 1px 4px var(--brand-border-subtle)",
        padding: "0 16px",
        height: "44px",
      }}
    >
      <Globe
        className="h-[16px] w-[16px] shrink-0"
        strokeWidth={1.5}
        style={{ color: "var(--brand-text-muted)" }}
      />
      <div className="flex items-center gap-[12px] sm:gap-[16px]">
        {LANGUAGES.map(({ code, name }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className="text-[11px] font-bold tracking-widest transition-colors"
            style={{
              color: lang === code
                ? "var(--brand-text-strong)"
                : "var(--brand-text-disabled)",
            }}
            onMouseEnter={(e) => {
              if (lang !== code) e.currentTarget.style.color = "var(--brand-text-muted)";
            }}
            onMouseLeave={(e) => {
              if (lang !== code) e.currentTarget.style.color = "var(--brand-text-disabled)";
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
