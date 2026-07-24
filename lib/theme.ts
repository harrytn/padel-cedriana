/**
 * theme.ts — Hotel Theme System
 *
 * Single source of truth for hotel identity and brand tokens.
 *
 * To rebrand for another hotel:
 *   1. Add a new `HotelTheme` entry below.
 *   2. Set `ACTIVE_THEME` to the new entry.
 *   3. Add a matching `[data-theme="<id>"]` block in app/globals.css.
 *   4. Set `data-theme="<id>"` on <html> in app/layout.tsx.
 *   5. Drop the hotel logo in /public/.
 *
 * Nothing else needs to change.
 */

export type HotelTheme = {
  id: string;
  name: string;
  shortName?: string;
  location?: string;
  logo?: {
    src: string;
    alt: string;
    desktopWidth?: number;
    mobileWidth?: number;
  };
  colors: {
    primary: string;
    primaryDark: string;
    onPrimary: string;
    secondary: string;
    secondarySoft: string;
    onSecondary: string;
    accent: string;
    accentDark: string;
    onAccent: string;
    highlight: string;
    highlightSoft: string;
    onHighlight: string;
    information: string;
    informationSoft: string;
    informationSoftest: string;
    background: string;
    surface: string;
    surfaceMuted: string;
    surfaceNeutral: string;
    surfaceDisabled: string;
    border: string;
    borderSubtle: string;
    text: string;
    textStrong: string;
    textMuted: string;
    textMetadata: string;
    textDisabled: string;
    success: string;
    successSoft: string;
    warning: string;
    warningSoft: string;
    error: string;
    errorDark: string;
    errorSoft: string;
  };
};

// ─── Neutral base theme ────────────────────────────────────────────────────────
// The CSS :root defaults already express this palette.
// ACTIVE_THEME being set to NEUTRAL_THEME is a no-op: the [data-theme] block
// won't activate, so :root values apply.

export const NEUTRAL_THEME: HotelTheme = {
  id: "neutral",
  name: "Hotel",
  shortName: "Hotel",
  colors: {
    primary: "#111111",
    primaryDark: "#000000",
    onPrimary: "#ffffff",
    secondary: "#444444",
    secondarySoft: "#eeeeee",
    onSecondary: "#ffffff",
    accent: "#333333",
    accentDark: "#111111",
    onAccent: "#ffffff",
    highlight: "#aaaaaa",
    highlightSoft: "#eeeeee",
    onHighlight: "#333333",
    information: "#666666",
    informationSoft: "#e0e0e0",
    informationSoftest: "#f0f0f0",
    background: "#f5f5f5",
    surface: "#ffffff",
    surfaceMuted: "#f0f0f0",
    surfaceNeutral: "#f5f5f5",
    surfaceDisabled: "#ececec",
    border: "#e0e0e0",
    borderSubtle: "rgba(0,0,0,0.08)",
    text: "#1a1a1a",
    textStrong: "#111111",
    textMuted: "#666666",
    textMetadata: "#999999",
    textDisabled: "#aaaaaa",
    success: "#444444",
    successSoft: "#eeeeee",
    warning: "#aaaaaa",
    warningSoft: "#eeeeee",
    error: "#888888",
    errorDark: "#555555",
    errorSoft: "#eeeeee",
  },
};

// ─── Hotel Cedriana — Mediterranean resort luxury ──────────────────────────────

export const CEDRIANA_THEME: HotelTheme = {
  id: "cedriana",
  name: "Hôtel Cedriana",
  shortName: "Cedriana",
  location: "Djerba",
  logo: {
    src: "/logo-no-bg-old.png",
    alt: "Hôtel Cedriana logo",
    desktopWidth: 230,
    mobileWidth: 180,
  },
  colors: {
    primary: "#172766",
    primaryDark: "#101D50",
    onPrimary: "#ffffff",
    secondary: "#317C78",
    secondarySoft: "#DDECDF",
    onSecondary: "#ffffff",
    accent: "#E83F3D",
    accentDark: "#CA2F34",
    onAccent: "#ffffff",
    highlight: "#F8C51C",
    highlightSoft: "#FFF1A8",
    onHighlight: "#776318",
    information: "#4D8EB7",
    informationSoft: "#DCEEFA",
    informationSoftest: "#EFF8FD",
    background: "#FCFAF5",
    surface: "#ffffff",
    surfaceMuted: "#F4ECDF",
    surfaceNeutral: "#F5F2EB",
    surfaceDisabled: "#F1EFEB",
    border: "#DDD7CC",
    borderSubtle: "rgba(23,39,102,0.09)",
    text: "#17213B",
    textStrong: "#172766",
    textMuted: "#77766F",
    textMetadata: "#969188",
    textDisabled: "#AAA79F",
    success: "#317C78",
    successSoft: "#DDECDF",
    warning: "#F8C51C",
    warningSoft: "#FFF1A8",
    error: "#E83F3D",
    errorDark: "#CA2F34",
    errorSoft: "#FCE3E2",
  },
};

// ─── Active theme ──────────────────────────────────────────────────────────────
// Change this line (and data-theme in layout.tsx) to rebrand the entire app.

export const ACTIVE_THEME: HotelTheme = CEDRIANA_THEME;
