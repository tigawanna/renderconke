import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-outline-variant/40 px-5 py-3">
      <p className="text-label-medium text-on-surface-variant">{siteConfig.name}</p>
      <a
        href={siteConfig.officialUrl}
        target="_blank"
        rel="noreferrer"
        className="text-label-large text-primary no-underline"
      >
        official rendercon.org
      </a>
    </footer>
  );
}
