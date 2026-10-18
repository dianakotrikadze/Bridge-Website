import { Quiz } from "@/components/quiz/Quiz";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const d = getDictionary(params.locale);
  return pageMetadata(params.locale, { title: d.quiz.title, description: d.quiz.subtitle, path: "/find-your-bridge" });
}

export default function QuizPage({ params }: { params: { locale: Locale } }) {
  const dict = getDictionary(params.locale);
  return (
    <div className="relative">
      <div aria-hidden className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-sage-100 to-transparent" />
      <div className="container relative py-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <Quiz locale={params.locale} dict={dict} />
        </div>
      </div>
    </div>
  );
}
