import { M3eProvider } from "@/components/m3e/m3e-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteNav } from "@/components/site-nav";
import { ThemeControls } from "@/components/theme-controls";
import { pageHead, siteIcons } from "@/lib/site";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useState } from "react";
import appCss from "../styles.css?url";

const themeScript = `(function(){try{function cookie(n){var m=document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)"));return m?decodeURIComponent(m[1]):null}var mode=cookie("color-mode");var dark=mode==="dark"||(mode!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);var root=document.documentElement;root.dataset.theme=dark?"dark":"light";var raw=cookie("m3-theme");if(raw){var t=JSON.parse(raw);if(t.motion)root.dataset.motion=t.motion;if(typeof t.shapeScale==="number")root.style.setProperty("--md-sys-shape-scale",String(t.shapeScale))}var css=raw?localStorage.getItem("m3-theme-css"):null;if(css){var style=document.createElement("style");style.id="m3-theme";style.textContent=css;document.head.appendChild(style)}}catch(e){}})()`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const seo = pageHead();
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#1f0638" },
        ...seo.meta,
      ],
      links: [{ rel: "stylesheet", href: appCss }, ...siteIcons],
    };
  },
  shellComponent: RootDocument,
  component: RootLayout,
});

function RootLayout() {
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden">
      <SiteNav />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <SiteHeader themeOpen={themeOpen} onOpenTheme={() => setThemeOpen(true)} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <SiteFooter />
      </div>
      <ThemeControls open={themeOpen} onOpenChange={setThemeOpen} />
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body>
        <M3eProvider
          theme={{
            defaultTheme: { source: { primary: "#99461c" }, variant: "expressive" },
          }}
        >
          {children}
        </M3eProvider>
        {import.meta.env.DEV ? (
          <TanStackDevtools
            plugins={[
              {
                name: "TanStack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  );
}
