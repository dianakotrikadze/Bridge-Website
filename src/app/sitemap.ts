import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { courses } from "@/content/courses";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/courses", "/find-your-bridge", "/about", "/how-it-works", "/instructors", "/faq", "/contact", "/apply", "/privacy", "/terms", ...courses.map((c) => `/courses/${c.slug}`)];
  return locales.flatMap((l) =>
    paths.map((p) => ({
      url: `${siteConfig.url}/${l}${p}`,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${siteConfig.url}/${x}${p}`])) },
    })),
  );
}
