import { RenderconMark } from "@/components/rendercon-mark";
import { Button } from "@/components/m3e/button";
import { Icon } from "@/components/m3e/icon";
import { pageHead, siteConfig } from "@/lib/site";
import { Link, createFileRoute } from "@tanstack/react-router";

const nav = [
  { to: "/stage", label: "Stage" },
  { to: "/sessions", label: "Sessions" },
  { to: "/speakers", label: "Speakers" },
] as const;

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Community lineup",
      description:
        "A community lineup for the talks at RenderCon Kenya. This is not the official site.",
      path: "/",
    }),
  component: Landing,
});

function Landing() {
  return (
    <div className="flex min-h-dvh flex-col">
      <p className="bg-primary-container text-on-primary-container px-6 py-2 text-center text-label-large">
        Community site. This is not the official site.
      </p>
      <header className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <span className="bg-primary-container grid size-11 place-items-center rounded-2xl">
            <RenderconMark className="h-8 w-auto" />
          </span>
          <span className="text-title-large">{siteConfig.name}</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-end">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="text-label-large no-underline">
              {item.label}
            </Link>
          ))}
          <a
            href={siteConfig.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="text-label-large text-primary no-underline"
          >
            Official site
          </a>
        </nav>
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-6 py-8 md:grid-cols-[1.15fr_0.85fr] md:gap-x-10 md:px-10 md:py-12">
        <div className="text-center md:text-left">
          <h1 className="text-display-medium sm:text-display-large">
            React.
            <br />
            Connect.
            <br />
            <span className="text-primary">Build.</span>
          </h1>
        </div>
        <div className="relative mx-auto grid size-64 place-items-center md:col-start-2 md:row-span-2 md:row-start-1 md:size-96 md:self-center">
          <div aria-hidden className="bg-primary/35 absolute inset-4 rounded-full blur-3xl" />
          <div aria-hidden className="bg-primary-container/70 absolute inset-8 rounded-full" />
          <RenderconMark className="relative h-48 w-auto md:h-72" />
        </div>
        <div className="text-center md:col-start-1 md:text-left">
          <p className="text-headline-small">RenderCon Kenya {siteConfig.year}</p>
          <ul className="text-title-medium text-primary mt-4 flex flex-col items-center gap-2 md:items-start">
            <li className="flex items-center gap-2">
              <Icon name="calendar_month" />
              {siteConfig.dates.displayDate}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="location_on" />
              {siteConfig.venue.fullAddress}
            </li>
          </ul>
          <p className="text-body-large text-on-surface-variant mt-6 max-w-xl text-balance">
            The home of the East African React ecosystem. Join 200+ developers, engineers, and
            designers for a day of deep talks, community, and connection.
          </p>
          <p className="text-body-medium text-on-surface-variant mt-3 max-w-xl text-balance">
            This is a community lineup for the talks that will be given at RenderCon Kenya. It is
            not the official site. The event is organized by{" "}
            <a
              href={siteConfig.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary"
            >
              RenderCon KE
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Button size="md" nativeButton={false} render={<Link to="/stage" />}>
              Stage
            </Button>
            <Button
              size="md"
              variant="outlined"
              nativeButton={false}
              render={<a href={siteConfig.officialUrl} target="_blank" rel="noreferrer" />}
            >
              Official site
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
