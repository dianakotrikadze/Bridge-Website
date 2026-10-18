import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionaries";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const d = getDictionary(params.locale);
  return pageMetadata(params.locale, { title: d.aboutPage.title, description: d.aboutPage.lead, path: "/about" });
}

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const a = dict.aboutPage;
  const [edu, academy, separate] = a.sections;

  return (
    <>
      <PageHeader title={a.title} lead={a.lead} />

      <section className="container py-16 md:py-24">
        {/* Relationship diagram: EduBridge → Bridge Academy */}
        <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <article className="rounded-card bg-forest p-8 text-ivory sm:p-10">
            <p className="text-sm text-sage-300">{a.eduBridgeKicker}</p>
            <h2 className="mt-2 text-3xl font-semibold !text-ivory">{edu.title}</h2>
            <p className="mt-4 text-ivory/85">{edu.text}</p>
            <div className="mt-6">
              {siteConfig.links.eduBridge ? (
                <a href={siteConfig.links.eduBridge} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">{a.eduBridgeLink}</a>
              ) : (
                <span className="rounded border border-dashed border-ivory/30 px-2 py-1 text-sm text-ivory/70">{a.eduBridgeLink}: {dict.common.toBeAdded}</span>
              )}
            </div>
          </article>
          <div aria-hidden className="flex items-center justify-center">
            <svg className="h-16 w-24 rotate-90 text-gold lg:rotate-0" viewBox="0 0 96 64" fill="none">
              <path d="M6 48 Q48 4 90 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M2 52h92" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              {[22, 36, 48, 60, 74].map((x) => <line key={x} x1={x} x2={x} y1={52} y2={48 - 4 * ((x - 6) / 84) * (1 - (x - 6) / 84) * 44 + 3} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />)}
            </svg>
          </div>
          <article className="rounded-card bg-sage-100 p-8 sm:p-10">
            <p className="text-sm text-sage-600">{dict.brand.byEduBridge}</p>
            <h2 className="mt-2 text-3xl font-semibold">{academy.title}</h2>
            <p className="mt-4 text-ink-muted">{academy.text}</p>
            <Link href={href(locale, "/courses")} className="btn btn-primary mt-6">{dict.common.allCourses}</Link>
          </article>
        </div>

        <aside className="mt-8 rounded-card border-2 border-gold/50 bg-gold-100/50 p-8 sm:p-10" aria-labelledby="separate">
          <h2 id="separate" className="text-2xl font-semibold">{separate.title}</h2>
          <p className="mt-3 max-w-3xl">{separate.text}</p>
        </aside>
      </section>

      <section aria-labelledby="values" className="border-t border-forest/10 bg-white py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="values" className="h-section">{a.valuesTitle}</h2>
            <ImageSlot src={siteConfig.images.community} alt={dict.about.photoCaption} caption={dict.about.photoCaption} placeholderLabel={dict.common.photoPlaceholder} className="mt-8 aspect-[4/3] rounded-card" />
          </div>
          <dl className="grid gap-x-10 gap-y-8 self-center sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {a.values.map((v) => (
              <div key={v.title} className="border-t-2 border-gold pt-4">
                <dt className="font-display text-2xl text-forest">{v.title}</dt>
                <dd className="mt-2 text-ink-muted">{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
