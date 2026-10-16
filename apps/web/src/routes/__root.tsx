import { M3eProvider } from "@/components/m3e/m3e-provider";
import type { QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import appCss from "../styles.css?url";

const colorModeScript = `(function(){try{var m=localStorage.getItem("color-mode");var dark=m==="dark"||(m!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);if(dark)document.documentElement.classList.add("dark")}catch(e){}})()`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Items" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
  component: () => <Outlet />,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeScript }} />
        <HeadContent />
      </head>
      <body>
        <M3eProvider
          theme={{
            defaultTheme: { source: { primary: "#6750A4" }, variant: "expressive" },
          }}
        >
          {children}
        </M3eProvider>
        <Scripts />
      </body>
    </html>
  );
}
