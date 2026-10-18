import { LegalPage } from "@/components/LegalPage";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  return pageMetadata(params.locale, { title: getDictionary(params.locale).legal.privacyTitle, path: "/privacy" });
}

export default function PrivacyPage({ params }: { params: { locale: Locale } }) {
  const l = getDictionary(params.locale).legal;
  return <LegalPage title={l.privacyTitle} intro={l.privacyIntro} points={l.privacyPoints} notice={l.draftNotice} />;
}
