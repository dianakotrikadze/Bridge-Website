import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { FaqList } from "@/components/FaqList";
import { ItemList } from "@/components/ui/ItemList";
import { StatusBadge, TbcBadge } from "@/components/ui/Badges";
import { courses, getCourse, type Course } from "@/content/courses";
import { getDictionary } from "@/content/dictionaries";
import { href, locales, tr, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) => courses.map((c) => ({ locale, slug: c.slug })));
}

export function generateMetadata({ params }: { params: { locale: Locale; slug: string } }) {
  const course = getCourse(params.slug);
  if (!course) return {};
  return pageMetadata(params.locale, { title: tr(course.title, params.locale), description: tr(course.summary, params.locale), path: `/courses/${course.slug}` });
}

const heroTone: Record<Course["tone"], string> = {
  sage: "bg-sage-100",
  forest: "bg-forest text-ivory",
  gold: "bg-gold-100",
  ivory: "bg-white",
};

export default function CoursePage({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale } = params;
  const course = getCourse(params.slug);
  if (!course) notFound();
  const dict = getDictionary(locale);
  const t = dict.coursePage;
  const dark = course.tone === "forest";
  const tbc = dict.common.subjectToConfirmation;
  const applyHref = course.externalApplicationUrl ?? href(locale, `/apply?course=${course.slug}`);

  const sections = [
    { id: "for", title: t.whoFor },
    { id: "outcomes", title: t.outcomes },
    { id: "week", title: t.weekly },
    { id: "syllabus", title: t.syllabus },
    { id: "method", title: t.methodology },
    { id: "resources", title: t.resources },
    { id: "assessment", title: t.assessment },
    { id: "certificate", title: t.certificate },
    { id: "entry", title: t.entry },
    { id: "faq", title: t.faq },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: tr(course.title, locale),
    description: tr(course.summary, locale),
    inLanguage: locale,
    provider: { "@type": "EducationalOrganization", name: "Bridge Academy", parentOrganization: { "@type": "Organization", name: "EduBridge" } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className={`${heroTone[course.tone]} border-b border-forest/10`}>
        <div className="container py-12 md:py-16">
          <nav aria-label="Breadcrumb" className={`text-sm ${dark ? "text-ivory/70" : "text-ink-muted"}`}>
            <ol className="flex flex-wrap gap-2">
              <li><Link className="hover:underline" href={href(locale)}>{dict.nav.home}</Link><span aria-hidden className="ml-2">/</span></li>
              <li><Link className="hover:underline" href={href(locale, "/courses")}>{dict.nav.courses}</Link><span aria-hidden className="ml-2">/</span></li>
              <li aria-current="page" className="font-semibold">{tr(course.title, locale)}</li>
            </ol>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-sm font-semibold ${dark ? "text-sage-300" : "text-sage-600"}`}>{tr(course.programme, locale)}</span>
                <StatusBadge status={course.status} dict={dict} />
              </div>
              <h1 className={`h-display mt-4 ${dark ? "!text-ivory" : ""}`}>{tr(course.title, locale)}</h1>
              <p className={`lead mt-5 max-w-2xl ${dark ? "!text-ivory/85" : ""}`}>{tr(course.summary, locale)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={applyHref} className={`btn ${dark ? "btn-gold" : "btn-primary"}`}>{dict.common.applyNow}</a>
                <Link href={href(locale, "/find-your-bridge")} className={`btn ${dark ? "btn-ghost-light" : "btn-outline"}`}>{dict.common.takeQuiz}</Link>
              </div>
            </div>
            <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-3xl ${dark ? "bg-ivory/15" : "bg-forest/10"}`}>
              {course.facts.map((f, i) => (
                <div key={f.key} className={`p-4 sm:p-5 ${i === course.facts.length - 1 && course.facts.length % 2 ? "col-span-2" : ""} ${dark ? "bg-forest" : heroTone[course.tone] === "bg-white" ? "bg-ivory" : "bg-white"}`}>
                  <dt className={`text-sm ${dark ? "text-ivory/70" : "text-ink-muted"}`}>{dict.facts[f.key]}</dt>
                  <dd className="mt-0.5 font-semibold">
                    {f.tbc ? <span className={dark ? "text-gold" : "text-gold-600"}>{tbc}</span> : tr(f.value, locale)}
                  </dd>
                </div>
              ))}
              {course.startDate && (
                <div className={`p-4 sm:p-5 ${dark ? "bg-forest" : heroTone[course.tone] === "bg-white" ? "bg-ivory" : "bg-white"}`}>
                  <dt className={`text-sm ${dark ? "text-ivory/70" : "text-ink-muted"}`}>{t.startDate}</dt>
                  <dd className="mt-0.5 font-semibold">{new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", { dateStyle: "long" }).format(new Date(course.startDate))}</dd>
                </div>
              )}
              {course.fee && (
                <div className={`p-4 sm:p-5 ${dark ? "bg-forest" : heroTone[course.tone] === "bg-white" ? "bg-ivory" : "bg-white"}`}>
                  <dt className={`text-sm ${dark ? "text-ivory/70" : "text-ink-muted"}`}>{t.fee}</dt>
                  <dd className="mt-0.5 font-semibold">{tr(course.fee, locale)}</dd>
                </div>
              )}
              {(!course.startDate || !course.fee) && (
                <div className={`col-span-2 p-4 text-sm sm:p-5 ${dark ? "bg-forest text-ivory/80" : heroTone[course.tone] === "bg-white" ? "bg-ivory text-ink-muted" : "bg-white text-ink-muted"}`}>
                  {t.startNote}
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      <div className="container grid gap-12 py-14 lg:grid-cols-[14rem_1fr] lg:gap-16 lg:py-20">
        {/* On this page */}
        <nav aria-label={t.onThisPage} className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold text-forest">{t.onThisPage}</p>
          <ul className="-mx-1 mt-3 flex gap-2 overflow-x-auto pb-2 text-sm lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible">
            {sections.map((s) => (
              <li key={s.id} className="shrink-0">
                <a href={`#${s.id}`} className="block whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-ink-muted ring-1 ring-forest/10 hover:text-forest lg:whitespace-normal lg:rounded-lg lg:bg-transparent lg:px-2 lg:ring-0 lg:hover:bg-sage-100">{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 max-w-3xl space-y-16">
          <section aria-labelledby="overview">
            <h2 id="overview" className="sr-only">{t.overview}</h2>
            <p className="text-xl leading-relaxed text-ink">{tr(course.intro, locale)}</p>
            <p className="mt-6 rounded-2xl border border-dashed border-gold-600/40 bg-gold-100/40 px-5 py-4 text-sm text-ink-muted">{t.confirmationNote}</p>
          </section>

          <Block id="for" title={t.whoFor}><ItemList items={tr(course.audience, locale)} tbcLabel={tbc} /></Block>
          <Block id="outcomes" title={t.outcomes}><ItemList items={tr(course.outcomes, locale)} tbcLabel={tbc} marker="check" /></Block>

          <Block id="week" title={t.weekly}>
            <ol className="grid gap-4 sm:grid-cols-3">
              {tr(course.weekly, locale).map((w, i) => (
                <li key={i} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-forest/5">
                  <p className="font-semibold text-forest">{w.title}</p>
                  <p className="mt-2 text-[0.95rem] text-ink-muted">{w.text}</p>
                  {w.tbc && <div className="mt-3 -ml-2"><TbcBadge label={tbc} /></div>}
                </li>
              ))}
            </ol>
          </Block>

          <Block id="syllabus" title={t.syllabus}>
            <p className="mb-6 text-sm text-gold-600">{tr(course.syllabusNote, locale)}</p>
            <div className="space-y-4">
              {tr(course.syllabus, locale).map((m) => (
                <div key={m.title} className="grid gap-3 rounded-2xl border border-forest/10 p-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <h3 className="font-sans text-base font-semibold text-forest">{m.title}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {m.items.map((it) => <li key={it} className="rounded-full bg-sage-50 px-3 py-1 text-sm ring-1 ring-sage-300">{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Block>

          <Block id="method" title={t.methodology}><ItemList items={tr(course.methodology, locale)} tbcLabel={tbc} /></Block>
          <Block id="resources" title={t.resources}><ItemList items={tr(course.resources, locale)} tbcLabel={tbc} /></Block>
          <Block id="assessment" title={t.assessment}><ItemList items={tr(course.assessment, locale)} tbcLabel={tbc} /></Block>
          <Block id="certificate" title={t.certificate}><ItemList items={tr(course.certificate, locale)} tbcLabel={tbc} /></Block>
          <Block id="entry" title={t.entry}><ItemList items={tr(course.entry, locale)} tbcLabel={tbc} marker="check" /></Block>
          <Block id="faq" title={t.faq}><FaqList items={tr(course.faq, locale)} /></Block>

          <section aria-labelledby="apply-cta" className="rounded-[2rem] bg-forest p-8 text-ivory sm:p-10">
            <h2 id="apply-cta" className="h-section !text-ivory">{t.applyTitle}</h2>
            <p className="mt-3 text-ivory/85">{t.applyText}</p>
            <a href={applyHref} className="btn btn-gold mt-7">{dict.common.applyNow}</a>
          </section>
        </div>
      </div>

      {/* Other courses */}
      <section aria-labelledby="other-courses" className="border-t border-forest/10 bg-white py-16">
        <div className="container">
          <h2 id="other-courses" className="text-2xl font-semibold">{t.otherCourses}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {courses.filter((c) => c.id !== course.id).map((c) => (
              <li key={c.id}>
                <Link href={href(locale, `/courses/${c.slug}`)} className="group block h-full rounded-2xl border border-forest/10 p-5 transition-colors hover:border-forest/40 hover:bg-sage-50">
                  <span className="text-sm text-ink-muted">{tr(c.levelTag, locale)}</span>
                  <span className="mt-1 block font-display text-xl text-forest">{tr(c.title, locale)}</span>
                  <span className="mt-2 block text-sm text-ink-muted">{tr(c.summary, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-28">
      <h2 id={id} className="mb-6 text-[1.75rem] font-semibold">{title}</h2>
      {children}
    </section>
  );
}
