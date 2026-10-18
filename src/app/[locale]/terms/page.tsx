import { LegalPage } from "@/components/LegalPage";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  return pageMetadata(params.locale, { title: getDictionary(params.locale).legal.termsTitle, path: "/terms" });
}

export default function TermsPage({ params }: { params: { locale: Locale } }) {
  const l = getDictionary(params.locale).legal;
  return <LegalPage title={l.termsTitle} intro={l.termsIntro} points={l.termsPoints} notice={l.draftNotice} />;
}
