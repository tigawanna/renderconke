import { Button } from "@/components/m3e/button";
import { useColorMode } from "@/components/m3e/color-mode-provider";
import { Icon } from "@/components/m3e/icon";
import { Label } from "@/components/m3e/label";
import { useM3Theme } from "@/components/m3e/m3-theme-provider";
import {
  SideSheet,
  SideSheetContent,
  SideSheetFooter,
  SideSheetHeader,
} from "@/components/m3e/side-sheet";
import { Switch } from "@/components/m3e/switch";

const PRESETS = [
  "#99461c",
  "#6750a4",
  "#006a6a",
  "#0058be",
  "#8e4d2f",
  "#725c0c",
  "#7d5260",
  "#ba1a1a",
  "#1b6b4a",
  "#3f51b5",
  "#5c4b8a",
  "#006874",
];

export function ThemeControls({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { resolvedMode, setMode } = useColorMode();
  const { theme, setSeedColor, resetTheme } = useM3Theme();
  const dark = resolvedMode === "dark";

  return (
    <SideSheet open={open} side="right" float onDismiss={() => onOpenChange(false)}>
      <SideSheetHeader title="Theme" onClose={() => onOpenChange(false)} />
      <SideSheetContent className="flex flex-col gap-6 py-4 text-on-surface">
        <div className="flex flex-col gap-3">
          <span className="text-title-medium">Seed color</span>
          <span className="text-body-medium text-on-surface-variant">
            {theme.variant} · {resolvedMode} · {theme.source.primary}
          </span>
          <div className="grid grid-cols-6 gap-2">
            {PRESETS.map((color) => {
              const selected = theme.source.primary.toLowerCase() === color;
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  aria-pressed={selected}
                  className="size-10 rounded-full border-2 border-transparent aria-pressed:border-primary"
                  style={{ backgroundColor: color }}
                  onClick={() => setSeedColor(color, { variant: "expressive" })}
                />
              );
            })}
          </div>
          <input
            aria-label="Theme seed color"
            className="h-12 w-full cursor-pointer rounded-lg border border-outline-variant bg-surface-container-highest"
            type="color"
            value={theme.source.primary}
            onChange={(event) => setSeedColor(event.target.value, { variant: "expressive" })}
          />
        </div>
        <Label>
          <Switch
            checked={dark}
            checkedIcon={<Icon name="dark_mode" />}
            uncheckedIcon={<Icon name="light_mode" />}
            onCheckedChange={(checked) => setMode(checked ? "dark" : "light")}
          />
          Dark theme
        </Label>
      </SideSheetContent>
      <SideSheetFooter>
        <Button variant="text" onClick={() => resetTheme()}>
          Reset theme
        </Button>
      </SideSheetFooter>
    </SideSheet>
  );
}
