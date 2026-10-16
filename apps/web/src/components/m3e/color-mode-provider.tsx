import { readCookie, writeCookie } from "@/lib/m3e/theme-cookie";
import * as React from "react";

/** What the user chose. `system` follows the OS. */
export type ColorMode = "light" | "dark" | "system";
/** What is on screen: `system` resolved to light or dark. */
export type ResolvedColorMode = "light" | "dark";

export type ColorModeProviderProps = {
  children: React.ReactNode;
  /** the mode before the user chooses one (default `system`) */
  defaultMode?: ColorMode;
  /** cookie name of the chosen mode. The root document reads it before paint */
  storageKey?: string;
  /** no transitions while the colors swap, so nothing animates through gray */
  disableTransitionOnChange?: boolean;
  /** key that toggles light/dark outside text fields; `false` turns it off */
  toggleKey?: string | false;
};

type ColorModeContextValue = {
  /** the chosen mode, possibly `system` */
  mode: ColorMode;
  /** light or dark, whatever is on screen right now */
  resolvedMode: ResolvedColorMode;
  setMode: (mode: ColorMode) => void;
  /** light ↔ dark (from `system`, goes to the opposite of the OS) */
  toggleMode: () => void;
};

const DARK_QUERY = "(prefers-color-scheme: dark)";
const MODES: readonly ColorMode[] = ["light", "dark", "system"];

const ColorModeContext = React.createContext<ColorModeContextValue | undefined>(undefined);

const isColorMode = (value: string | null): value is ColorMode => MODES.some((m) => m === value);

const systemMode = (): ResolvedColorMode => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
};

const resolve = (mode: ColorMode): ResolvedColorMode => (mode === "system" ? systemMode() : mode);

const opposite = (mode: ResolvedColorMode): ResolvedColorMode =>
  mode === "dark" ? "light" : "dark";

function readMode(key: string, fallback: ColorMode): ColorMode {
  const stored = readCookie(key);
  if (isColorMode(stored)) return stored;
  try {
    const legacy = localStorage.getItem(key);
    if (isColorMode(legacy)) {
      writeCookie(key, legacy);
      localStorage.removeItem(key);
      return legacy;
    }
  } catch {
    // storage may be blocked
  }
  return fallback;
}

function writeMode(key: string, mode: ColorMode) {
  writeCookie(key, mode);
}

/** Suspends CSS transitions; call the returned function to bring them back. */
function pauseTransitions() {
  const style = document.createElement("style");
  style.textContent =
    "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}";
  document.head.appendChild(style);

  return () => {
    // force a style flush, then lift the pause after the new colors painted
    window.getComputedStyle(document.body);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => style.remove());
    });
  };
}

function isTextEntry(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest("input, textarea, select, [contenteditable='true']") !== null)
  );
}

/**
 * Light / dark / system. Writes the resolved mode to `<html data-theme>`.
 * Color roles follow that attribute. Which colors those roles have is the job
 * of `M3ThemeProvider`.
 */
export function ColorModeProvider({
  children,
  defaultMode = "system",
  storageKey = "color-mode",
  disableTransitionOnChange = true,
  toggleKey = "d",
}: ColorModeProviderProps) {
  const [mode, setModeState] = React.useState<ColorMode>(defaultMode);
  const [resolvedMode, setResolvedMode] = React.useState<ResolvedColorMode>(
    defaultMode === "dark" ? "dark" : "light",
  );
  const stored = React.useRef(false);

  React.useLayoutEffect(() => {
    setModeState(readMode(storageKey, defaultMode));
    stored.current = true;
  }, [storageKey, defaultMode]);

  const setMode = React.useCallback(
    (next: ColorMode) => {
      writeMode(storageKey, next);
      setModeState(next);
    },
    [storageKey],
  );

  const toggleMode = React.useCallback(() => setMode(opposite(resolve(mode))), [mode, setMode]);

  // put the resolved mode on <html>, and follow the OS while mode is `system`
  React.useLayoutEffect(() => {
    if (!stored.current) return undefined;
    const apply = () => {
      const next = resolve(mode);
      const resume = disableTransitionOnChange ? pauseTransitions() : null;
      document.documentElement.dataset.theme = next;
      setResolvedMode(next);
      resume?.();
    };
    apply();

    if (mode !== "system") return undefined;
    const query = window.matchMedia(DARK_QUERY);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [mode, disableTransitionOnChange]);

  React.useEffect(() => {
    if (toggleKey === false) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTextEntry(event.target)) return;
      if (event.key.toLowerCase() !== toggleKey.toLowerCase()) return;
      toggleMode();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleKey, toggleMode]);

  const value = React.useMemo(
    () => ({ mode, resolvedMode, setMode, toggleMode }),
    [mode, resolvedMode, setMode, toggleMode],
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
  const ctx = React.useContext(ColorModeContext);
  if (!ctx) throw new Error("useColorMode must be used within a ColorModeProvider");
  return ctx;
}
