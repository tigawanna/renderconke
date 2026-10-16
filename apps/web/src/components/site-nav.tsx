import {
  NavigationBar,
  NavigationBarItem,
  NavigationRail,
  NavigationRailItem,
} from "@/components/m3e/navigation";
import { Link, useRouterState } from "@tanstack/react-router";
import { RenderconMark } from "./rendercon-mark";

const items = [
  { to: "/stage", label: "Stage", icon: "home" },
  { to: "/sessions", label: "Sessions", icon: "calendar_month" },
  { to: "/speakers", label: "Speakers", icon: "groups" },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <>
      <NavigationRail className="sticky top-0 hidden h-dvh md:flex">
        <Link
          to="/"
          aria-label="Home"
          className="focus-ring grid size-11 shrink-0 place-items-center rounded-full no-underline"
        >
          <RenderconMark className="h-8 w-auto" />
        </Link>
        {items.map((item) => (
          <NavigationRailItem
            key={item.to}
            active={pathname === item.to || pathname.startsWith(`${item.to}/`)}
            icon={item.icon}
            label={item.label}
            render={<Link to={item.to} />}
          />
        ))}
      </NavigationRail>
      <NavigationBar className="fixed inset-x-0 bottom-0 z-10 md:hidden">
        {items.map((item) => (
          <NavigationBarItem
            key={item.to}
            active={pathname === item.to || pathname.startsWith(`${item.to}/`)}
            icon={item.icon}
            label={item.label}
            render={<Link to={item.to} />}
          />
        ))}
      </NavigationBar>
    </>
  );
}
