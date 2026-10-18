import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { PageHeader } from "@/components/PageHeader";
import { courses } from "@/content/courses";
import { getDictionary } from "@/content/dictionaries";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const d = getDictionary(params.locale);
  return pageMetadata(params.locale, { title: d.coursesSection.title, description: d.coursesSection.lead, path: "/courses" });
}

export default function CoursesPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader title={dict.coursesSection.title} lead={dict.coursesSection.lead}>
        <p className="mt-6 text-[0.98rem]">
          <span className="text-ink-muted">{dict.coursesSection.notSure} </span>
          <Link href={href(locale, "/find-your-bridge")} className="link">{dict.common.takeQuiz}</Link>
        </p>
      </PageHeader>
      <div className="container grid gap-6 py-16 md:grid-cols-2 lg:gap-8 lg:py-20">
        {courses.map((c) => <CourseCard key={c.id} course={c} locale={locale} dict={dict} headingLevel={2} />)}
      </div>
    </>
  );
}
