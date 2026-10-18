import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { FaqList } from "@/components/FaqList";
import { HeroBridge } from "@/components/HeroBridge";
import { Journey } from "@/components/Journey";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { BridgeProgress } from "@/components/quiz/BridgeProgress";
import { siteConfig } from "@/config/site";
import { courses } from "@/content/courses";
import { getDictionary } from "@/content/dictionaries";
import { quizQuestions } from "@/content/quiz";
import { href, tr, type Locale } from "@/lib/i18n";

const pointIcons = [
  <path key="0" d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />,
  <g key="1"><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M3 19c.8-3 2.7-4.5 5-4.5s4.2 1.5 5 4.5M11 19c.8-3 2.7-4.5 5-4.5s4.2 1.5 5 4.5" /></g>,
  <path key="2" d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  <g key="3"><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></g>,
  <g key="4"><circle cx="5" cy="12" r="2.2" /><circle cx="19" cy="6" r="2.2" /><circle cx="19" cy="18" r="2.2" /><path d="M7 11l10-4M7 13l10 4" /></g>,
];

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const dict = getDictionary(locale);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-12 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.08fr_1fr] lg:gap-16 lg:pb-28">
          <div className="motion-safe:animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-forest ring-1 ring-forest/10">
              <span aria-hidden className="h-2 w-2 rounded-full bg-gold" />
              {dict.brand.tagline}
            </p>
            <h1 className="h-display mt-6 max-w-[14ch] lg:max-w-[16ch]">{dict.hero.title}</h1>
            <p className="lead mt-6 max-w-xl">{dict.hero.text}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={href(locale, "/courses")} className="btn btn-primary">{dict.hero.ctaCourses}</Link>
              <Link href={href(locale, "/find-your-bridge")} className="btn btn-outline">{dict.hero.ctaQuiz}</Link>
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-2">
  <svg aria-hidden className="h-4 w-4 flex-none text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              {dict.hero.note}
              </span>
              <span aria-hidden className="hidden text-forest/20 sm:inline">/</span>
              <span className="w-full sm:hidden" />
              {dict.brand.byEduBridge}
            </p>
          </div>
          <div className="mx-auto w-full max-w-xl lg:max-w-none">
            <HeroBridge start={dict.hero.visualStart} end={dict.hero.visualEnd} label={dict.hero.visualLabel} stops={["A2", "B1", "Speak", "Career"]} />
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────── */}
      <section aria-labelledby="about-heading" className="section bg-white">
        <div className="container grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="about-heading" className="h-section">{dict.about.title}</h2>
            <p className="lead mt-5">{dict.about.lead}</p>
            <ImageSlot src={siteConfig.images.about} alt={dict.about.photoCaption} caption={dict.about.photoCaption} placeholderLabel={dict.common.photoPlaceholder} className="mt-10 aspect-[4/3] rounded-card" />
            <Link href={href(locale, "/about")} className="link mt-8 inline-block">{dict.nav.about}</Link>
          </div>
          <ul className="divide-y divide-forest/10 self-center lg:col-span-6 lg:col-start-7">
            {dict.about.points.map((p, i) => (
              <li key={p.title} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                <span aria-hidden className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-sage-100 text-forest">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{pointIcons[i]}</svg>
                </span>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-forest">{p.title}</h3>
                  <p className="mt-1 text-ink-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Courses ──────────────────────────────────────────── */}
      <section aria-labelledby="courses-heading" className="section">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 id="courses-heading" className="h-section">{dict.coursesSection.title}</h2>
              <p className="lead mt-4">{dict.coursesSection.lead}</p>
            </div>
            <p className="text-[0.98rem]">
              <span className="text-ink-muted">{dict.coursesSection.notSure} </span>
              <Link href={href(locale, "/find-your-bridge")} className="link">{dict.common.takeQuiz}</Link>
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
            {courses.map((c) => <CourseCard key={c.id} course={c} locale={locale} dict={dict} />)}
          </div>
        </div>
      </section>

      {/* ── Quiz teaser ──────────────────────────────────────── */}
      <section aria-labelledby="quiz-teaser-heading" className="pb-20 md:pb-28">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] bg-forest px-7 py-12 text-ivory sm:px-12 md:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 id="quiz-teaser-heading" className="h-section !text-ivory">{dict.quizTeaser.title}</h2>
                <p className="mt-4 max-w-lg text-lg text-ivory/85">{dict.quizTeaser.text}</p>
                <p className="mt-3 text-sm text-sage-300">{dict.quizTeaser.meta}</p>
                <Link href={href(locale, "/find-your-bridge")} className="btn btn-gold mt-8">{dict.quiz.start}</Link>
              </div>
              <div aria-hidden className="rounded-3xl bg-ivory/5 p-6 ring-1 ring-ivory/10">
                <BridgeProgress total={7} answered={3} current={3} label="" tone="dark" />
                <p className="mt-6 font-display text-xl text-ivory">{tr(quizQuestions[0].prompt, locale)}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {quizQuestions[0].options.map((o, i) => (
                    <span key={o.id} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${i === 2 ? "bg-ivory text-forest" : "bg-ivory/10 text-ivory/80"}`}>
                      <span className={`h-3.5 w-3.5 flex-none rounded-full border-2 ${i === 2 ? "border-forest bg-gold" : "border-ivory/40"}`} />
                      {tr(o.label, locale)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Journey ──────────────────────────────────────────── */}
      <section aria-labelledby="journey-heading" className="section border-t border-forest/10 bg-sage-50">
        <div className="container">
          <div className="max-w-2xl">
            <h2 id="journey-heading" className="h-section">{dict.journey.title}</h2>
            <p className="lead mt-4">{dict.journey.lead}</p>
          </div>
          <div className="mt-14">
            <Journey dict={dict} />
          </div>
          <div className="mt-16 flex flex-col justify-between gap-6 rounded-card bg-white p-7 shadow-soft sm:p-9 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h3 className="font-sans text-lg font-semibold text-forest">{dict.journey.toolsTitle}</h3>
              <p className="mt-2 text-ink-muted">{dict.journey.toolsText}</p>
            </div>
            {siteConfig.links.studentPortal ? (
              <a href={siteConfig.links.studentPortal} target="_blank" rel="noopener noreferrer" className="btn btn-outline shrink-0">{dict.journey.portalCta}</a>
            ) : (
              <p className="max-w-xs shrink-0 rounded-xl border border-dashed border-forest/25 px-4 py-3 text-sm text-ink-muted">{dict.journey.portalPending}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ preview ──────────────────────────────────────── */}
      <section aria-labelledby="faq-heading" className="section">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="faq-heading" className="h-section">{dict.faq.title}</h2>
            <p className="lead mt-4">{dict.faq.lead}</p>
            <Link href={href(locale, "/faq")} className="link mt-6 inline-block">{dict.nav.faq}</Link>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={dict.faq.items.slice(0, 4)} />
          </div>
        </div>
      </section>

      {/* ── Closing call to action ───────────────────────────── */}
      <section aria-labelledby="cta-heading" className="pb-24">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-gold-100 px-7 py-12 sm:px-12 md:flex-row md:items-center">
            <div>
              <h2 id="cta-heading" className="h-section">{dict.coursePage.applyTitle}</h2>
              <p className="mt-3 max-w-xl text-ink-muted">{dict.coursePage.applyText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={href(locale, "/apply")} className="btn btn-primary">{dict.common.applyNow}</Link>
              <Link href={href(locale, "/contact")} className="btn btn-outline">{dict.nav.contact}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
