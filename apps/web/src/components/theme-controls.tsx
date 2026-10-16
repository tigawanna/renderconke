import { Button } from "@/components/m3e/button";
import { useColorMode } from "@/components/m3e/color-mode-provider";
import { useM3Theme } from "@/components/m3e/m3-theme-provider";

export function ThemeControls() {
  const { resolvedMode, setMode } = useColorMode();
  const { setSeedColor, resetTheme } = useM3Theme();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-label-large inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1.5">
        Seed
        <input
          aria-label="Theme seed color"
          className="size-7 cursor-pointer rounded-full border border-outline-variant bg-transparent"
          type="color"
          defaultValue="#6750A4"
          onChange={(event) => setSeedColor(event.target.value, { variant: "expressive" })}
        />
      </label>
      <Button
        variant="tonal"
        size="sm"
        onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}
      >
        {resolvedMode === "dark" ? "Light" : "Dark"}
      </Button>
      <Button variant="text" size="sm" onClick={() => resetTheme()}>
        Reset
      </Button>
    </div>
  );
}
