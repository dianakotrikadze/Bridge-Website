import Link from "next/link";
import { Journey } from "@/components/Journey";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionaries";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const d = getDictionary(params.locale);
  return pageMetadata(params.locale, { title: d.journey.title, description: d.journey.lead, path: "/how-it-works" });
}

export default function HowItWorksPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const j = dict.journey;
  return (
    <>
      <PageHeader title={j.title} lead={j.lead} />
      <section className="bg-sage-50"><div className="container py-16 md:py-24"><Journey dict={dict} /></div></section>
      <section aria-labelledby="tools" className="border-t border-forest/10 bg-white py-16">
        <div className="container grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 id="tools" className="h-section">{j.toolsTitle}</h2>
            <p className="lead mt-4">{j.toolsText}</p>
          </div>
          <div className="rounded-card bg-sage-50 p-8">
            <p className="font-semibold text-forest">{dict.nav.studentPortal}</p>
            {siteConfig.links.studentPortal ? (
              <a href={siteConfig.links.studentPortal} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4">{j.portalCta}</a>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-forest/25 bg-white px-4 py-3 text-sm text-ink-muted">{j.portalPending}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={href(locale, "/find-your-bridge")} className="btn btn-outline">{dict.common.takeQuiz}</Link>
              <Link href={href(locale, "/apply")} className="btn btn-outline">{dict.common.applyNow}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
