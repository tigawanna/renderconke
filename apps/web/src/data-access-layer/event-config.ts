/**
 * RenderCon event configuration.
 * Update this file each year to change event-specific details across the site.
 */

const SESSIONIZE_BASE_URL = "https://sessionize.com/api/v2/c1nslc55/view";

export const EVENT_CONFIG = {
  year: 2026,
  dates: {
    startDate: "2026-10-17",
    endDate: "2026-10-17",
    displayDate: "17th October 2026",
  },
  venue: {
    name: "ALX The Piano",
    location: "Westlands, Nairobi",
    fullAddress: "ALX The Piano — Westlands, Nairobi",
  },
  links: {
    tickets: "https://zenlipa.co.ke/events/k6NMNf",
    website: "https://www.rendercon.org",
    gallery2023: "https://bit.ly/rcke23pics",
    gallery2024: "https://bit.ly/rcke24pics",
    gallery2025: "https://bit.ly/rcke25pics",
    schedule2024: "/schedule_24",
    schedule2026: "/schedule",
  },
  api: {
    sessionize: {
      agendaEmbed: "https://sessionize.com/api/v2/b7swgk5n/view/GridSmart",
      all: `${SESSIONIZE_BASE_URL}/All`,
      gridSmart: `${SESSIONIZE_BASE_URL}/GridSmart`,
      sessions: `${SESSIONIZE_BASE_URL}/Sessions`,
      speakers: `${SESSIONIZE_BASE_URL}/Speakers`,
      speakerWall: `${SESSIONIZE_BASE_URL}/SpeakerWall`,
    },
  },
  programme: {
    timeZone: "Africa/Nairobi",
    offsetForLocalTimestamps: "+03:00",
    revalidateSeconds: 300,
    timeoutMilliseconds: 10000,
  },
  emails: {
    sponsors: "sponsors@rendercon.org",
    partnerships: "partnerships@rendercon.org",
  },
  social: {
    twitter: "https://twitter.com/renderconke",
    github: "https://github.com/reactdevske",
  },
  metadata: {
    title: "RenderconKe 2026 — The premier conference experience for Web and Mobile",
    description:
      "RenderconKe 2026 is a conference for Web and Mobile developers. We bring together a diverse group of people from all across the world to share their knowledge and experience.",
  },
};

export const getGalleryLinks = () => {
  const galleries = [];
  const currentYear = EVENT_CONFIG.year;

  for (let year = 2023; year <= currentYear; year++) {
    galleries.push({
      year,
      label: `View Gallery(${year})`,
      url: EVENT_CONFIG.links[`gallery${year}` as keyof typeof EVENT_CONFIG.links] || "#",
    });
  }

  return galleries;
};

export const getScheduleLink = () => {
  const currentYear = EVENT_CONFIG.year;
  const currentYearSchedule =
    EVENT_CONFIG.links[`schedule${currentYear}` as keyof typeof EVENT_CONFIG.links];

  if (currentYearSchedule) return currentYearSchedule as string;

  const previousYear = currentYear - 1;
  const previousYearSchedule =
    EVENT_CONFIG.links[`schedule${previousYear}` as keyof typeof EVENT_CONFIG.links];
  return (previousYearSchedule as string) || "/schedule";
};

export const SPONSORS_BY_YEAR: Record<
  number,
  Array<{ name: string; logo: string; link: string; height: number; width: number }>
> = {
  2026: [],
  2025: [
    {
      name: "Cloudinary",
      logo: "/images/logos/cloudinary_logo_white.png",
      link: "https://cloudinary.com/",
      height: 200,
      width: 500,
    },
  ],
};

export const getCurrentSponsors = () => {
  const currentYear = EVENT_CONFIG.year;
  const sponsors = SPONSORS_BY_YEAR[currentYear];

  return {
    sponsors: sponsors || [],
    showHallOfFame: !sponsors || sponsors.length === 0,
    currentYear,
  };
};
