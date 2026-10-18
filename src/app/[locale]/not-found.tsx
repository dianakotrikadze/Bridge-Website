"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/content/dictionaries";
import { href, isLocale } from "@/lib/i18n";

export default function NotFound() {
  const seg = (usePathname() || "").split("/")[1];
  const locale = isLocale(seg) ? seg : "ka";
  const dict = getDictionary(locale);
  return (
    <div className="container flex flex-col items-start py-24 md:py-32">
      <svg aria-hidden className="h-20 w-40 text-sage-300" viewBox="0 0 160 80" fill="none">
        <path d="M8 70 Q 50 10 72 34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M152 70 Q 110 10 92 34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M2 74h60M98 74h60" stroke="#1E3B2C" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <h1 className="h-display mt-8 max-w-2xl">{dict.common.notFoundTitle}</h1>
      <p className="lead mt-4 max-w-xl">{dict.common.notFoundText}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={href(locale)} className="btn btn-primary">{dict.common.backHome}</Link>
        <Link href={href(locale, "/courses")} className="btn btn-outline">{dict.common.allCourses}</Link>
      </div>
    </div>
  );
}
