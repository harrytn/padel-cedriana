"use client";
import { useState } from "react";
import { ACTIVE_THEME } from "@/lib/theme";

interface HotelLogoProps {
  /** "desktop" (default) or "mobile" for responsive sizing */
  size?: "desktop" | "mobile";
  /** Additional class names */
  className?: string;
}

/**
 * HotelLogo — renders the active hotel's logo with a graceful fallback.
 *
 * Fallback: if the image is missing or fails to load, shows the hotel's
 * initials inside a branded pill. The header layout is preserved either way.
 *
 * To update the logo: change ACTIVE_THEME.logo.src in lib/theme.ts.
 */
export default function HotelLogo({ size = "desktop", className = "" }: HotelLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const logo = ACTIVE_THEME.logo;

  const desktopWidth = logo?.desktopWidth ?? 200;
  const mobileWidth = logo?.mobileWidth ?? 160;
  const width = size === "mobile" ? mobileWidth : desktopWidth;

  // Generate initials fallback from hotel name
  const initials = (ACTIVE_THEME.shortName ?? ACTIVE_THEME.name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  if (!logo || imgFailed) {
    // Fallback: initials pill, preserves logo area dimensions
    return (
      <div
        className={`flex items-center justify-center font-extrabold tracking-tight ${className}`}
        style={{
          width: `${width}px`,
          maxHeight: size === "mobile" ? "52px" : "68px",
          minHeight: size === "mobile" ? "44px" : "56px",
          background: "var(--brand-surface-neutral)",
          border: "1px solid var(--brand-border)",
          borderRadius: "var(--radius-control)",
          color: "var(--brand-text-strong)",
          fontSize: size === "mobile" ? "18px" : "22px",
          letterSpacing: "-0.01em",
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logo.src}
      alt={logo.alt}
      onError={() => setImgFailed(true)}
      className={`object-contain ${className}`}
      style={{
        width: `${width}px`,
        maxWidth: `${width}px`,
        maxHeight: size === "mobile" ? "52px" : "68px",
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}
