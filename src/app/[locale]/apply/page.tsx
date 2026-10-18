import Link from "next/link";
import { ApplyForm } from "@/components/ApplyForm";
import { PageHeader } from "@/components/PageHeader";
import { courses } from "@/content/courses";
import { getDictionary } from "@/content/dictionaries";
import { href, tr, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

// Demo mode depends on a server env variable, so render per request.
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const d = getDictionary(params.locale);
  return pageMetadata(params.locale, { title: d.apply.title, description: d.apply.lead, path: "/apply" });
}

export default function ApplyPage({ params, searchParams }: { params: { locale: Locale }; searchParams: { course?: string } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const initial = courses.some((c) => c.slug === searchParams.course) ? searchParams.course! : "";
  const demoMode = !process.env.APPLICATIONS_WEBHOOK_URL;

  return (
    <>
      <PageHeader title={dict.apply.title} lead={dict.apply.lead} />
      <div className="container grid gap-12 py-14 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0 rounded-card bg-white p-6 shadow-soft ring-1 ring-forest/5 sm:p-10">
          <ApplyForm locale={locale} dict={dict} initialCourse={initial} demoMode={demoMode} />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <p className="font-semibold text-forest">{dict.nav.courses}</p>
          <ul className="space-y-3">
            {courses.map((c) => (
              <li key={c.id}>
                <Link href={href(locale, `/courses/${c.slug}`)} className="block rounded-2xl border border-forest/10 bg-white/60 p-4 hover:border-forest/30">
                  <span className="block font-semibold text-forest">{tr(c.title, locale)}</span>
                  <span className="text-sm text-ink-muted">{dict.status[c.status]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-ink-muted">
            {dict.coursesSection.notSure}{" "}
            <Link href={href(locale, "/find-your-bridge")} className="link">{dict.common.takeQuiz}</Link>
          </p>
        </aside>
      </div>
    </>
  );
}
