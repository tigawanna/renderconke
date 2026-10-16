import { EVENT_CONFIG } from "@/data-access-layer/event-config";

const siteUrl = (import.meta.env.VITE_SITE_URL || "https://rendercon.org").replace(/\/$/, "");

export const siteConfig = {
  name: "RenderCon Ke Stage",
  shortName: "Stage",
  eventName: "RenderCon Ke",
  year: EVENT_CONFIG.year,
  title: "RenderCon Ke Stage",
  description: EVENT_CONFIG.metadata.description,
  url: siteUrl,
  officialUrl: "https://www.rendercon.org",
  locale: "en_KE",
  themeColor: "#1f0638",
  accentColor: "#99461c",
  twitter: "@renderconke",
  keywords: [
    "RenderCon Ke",
    "RenderconKe",
    "web conference",
    "mobile conference",
    "Nairobi",
    "React",
    "React Native",
  ].join(", "),
  dates: EVENT_CONFIG.dates,
  venue: EVENT_CONFIG.venue,
  social: EVENT_CONFIG.social,
} as const;

export const siteIcons = [
  { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
  { rel: "icon", type: "image/png", href: "/favicon-32x32.png", sizes: "32x32" },
  { rel: "icon", type: "image/svg+xml", href: "/rendercon.svg" },
  { rel: "shortcut icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

function clip(value: string, max: number) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function ogImageUrl() {
  return absoluteUrl("/og.png");
}

type PageSeo = {
  title?: string;
  description?: string;
  path?: string;
};

export function pageHead({ title, description, path = "/" }: PageSeo = {}) {
  const documentTitle = title ? `${title} · ${siteConfig.name}` : siteConfig.title;
  const ogTitle = title ?? `${siteConfig.name} ${siteConfig.year}`;
  const summary = clip(description ?? siteConfig.description, 180);
  const image = ogImageUrl();
  const url = absoluteUrl(path);

  return {
    meta: [
      { title: documentTitle },
      { name: "description", content: summary },
      { name: "keywords", content: siteConfig.keywords },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: summary },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: ogTitle },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: siteConfig.locale },
      { property: "og:site_name", content: siteConfig.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: summary },
      { name: "twitter:image", content: image },
      { name: "twitter:site", content: siteConfig.twitter },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function eventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${siteConfig.eventName} ${siteConfig.year}`,
    description: siteConfig.description,
    startDate: siteConfig.dates.startDate,
    endDate: siteConfig.dates.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: ogImageUrl(),
    url: siteConfig.officialUrl,
    location: {
      "@type": "Place",
      name: siteConfig.venue.name,
      address: siteConfig.venue.fullAddress,
    },
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.officialUrl,
      sameAs: [siteConfig.officialUrl, siteConfig.social.twitter, siteConfig.social.github],
    },
  };
}

export function sessionJsonLd(session: {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: session.title,
    description: clip(session.description, 500),
    startDate: session.startsAt,
    endDate: session.endsAt,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: ogImageUrl(),
    url: absoluteUrl(`/sessions/${session.id}`),
    location: {
      "@type": "Place",
      name: siteConfig.venue.name,
      address: siteConfig.venue.fullAddress,
    },
    superEvent: {
      "@type": "Event",
      name: `${siteConfig.eventName} ${siteConfig.year}`,
      url: siteConfig.officialUrl,
    },
  };
}

export function speakerJsonLd(speaker: {
  id: string;
  fullName: string;
  bio: string;
  tagLine: string;
  profilePicture: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: speaker.fullName,
    description: clip(speaker.bio || speaker.tagLine, 500),
    jobTitle: speaker.tagLine,
    image: speaker.profilePicture,
    url: absoluteUrl(`/speakers/${speaker.id}`),
  };
}
