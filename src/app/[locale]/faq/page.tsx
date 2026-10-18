import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { PageHeader } from "@/components/PageHeader";
import { courses } from "@/content/courses";
import { getDictionary } from "@/content/dictionaries";
import { href, tr, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const d = getDictionary(params.locale);
  return pageMetadata(params.locale, { title: d.faq.title, description: d.faq.lead, path: "/faq" });
}

export default function FaqPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader title={dict.faq.title} lead={dict.faq.lead} />
      <div className="container max-w-4xl space-y-16 py-16">
        <FaqList items={dict.faq.items} />
        {courses.map((c) => (
          <section key={c.id} aria-labelledby={`faq-${c.id}`}>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2 id={`faq-${c.id}`} className="text-2xl font-semibold">{tr(c.title, locale)}</h2>
              <Link href={href(locale, `/courses/${c.slug}`)} className="link text-sm">{dict.common.learnMore}</Link>
            </div>
            <FaqList items={tr(c.faq, locale)} />
          </section>
        ))}
        <p className="text-ink-muted">
          {dict.contact.lead}{" "}
          <Link href={href(locale, "/contact")} className="link">{dict.nav.contact}</Link>
        </p>
      </div>
    </>
  );
}
