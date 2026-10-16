import { Button } from "@/components/m3e/button";
import { useColorMode } from "@/components/m3e/color-mode-provider";
import { useM3Theme } from "@/components/m3e/m3-theme-provider";
import {
  SideSheet,
  SideSheetContent,
  SideSheetFooter,
  SideSheetHeader,
} from "@/components/m3e/side-sheet";

export function ThemeControls({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { resolvedMode, setMode } = useColorMode();
  const { setSeedColor, resetTheme } = useM3Theme();

  return (
    <SideSheet open={open} side="right" detached className="sticky top-0 h-dvh self-start">
      <SideSheetHeader title="Theme" onClose={() => onOpenChange(false)} />
      <SideSheetContent className="flex flex-col gap-6 py-4 text-on-surface">
        <label className="flex flex-col gap-2">
          <span className="text-title-medium">Seed color</span>
          <span className="text-body-medium text-on-surface-variant">
            This color generates the expressive scheme.
          </span>
          <input
            aria-label="Theme seed color"
            className="h-12 w-full cursor-pointer rounded-lg border border-outline-variant bg-surface-container-highest"
            type="color"
            defaultValue="#6750A4"
            onChange={(event) => setSeedColor(event.target.value, { variant: "expressive" })}
          />
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-title-medium">Appearance</span>
          <div className="flex gap-2">
            <Button
              variant={resolvedMode === "light" ? "filled" : "outlined"}
              onClick={() => setMode("light")}
            >
              Light
            </Button>
            <Button
              variant={resolvedMode === "dark" ? "filled" : "outlined"}
              onClick={() => setMode("dark")}
            >
              Dark
            </Button>
          </div>
        </div>
      </SideSheetContent>
      <SideSheetFooter>
        <Button variant="text" onClick={() => resetTheme()}>
          Reset theme
        </Button>
      </SideSheetFooter>
    </SideSheet>
  );
}
