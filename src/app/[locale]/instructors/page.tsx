import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { PlaceholderChip } from "@/components/ui/Badges";
import { instructors, instructorPlaceholderCount } from "@/content/instructors";
import { getDictionary } from "@/content/dictionaries";
import { tr, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const d = getDictionary(params.locale);
  return pageMetadata(params.locale, { title: d.instructors.title, description: d.instructors.lead, path: "/instructors" });
}

export default function InstructorsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const t = dict.instructors;
  return (
    <>
      <PageHeader title={t.title} lead={t.lead} />
      <section className="container py-16">
        {instructors.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((p) => (
              <li key={p.name.en} className="overflow-hidden rounded-card bg-white shadow-soft">
                <div className="relative aspect-[4/3] bg-sage-100">
                  {p.photo && <Image src={p.photo} alt={tr(p.name, locale)} fill className="object-cover" sizes="(min-width:1024px) 33vw, 100vw" />}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold">{tr(p.name, locale)}</h2>
                  <p className="text-sm text-sage-600">{tr(p.role, locale)}</p>
                  <p className="mt-3 text-ink-muted">{tr(p.bio, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: instructorPlaceholderCount }, (_, i) => (
                <li key={i} className="rounded-card border-2 border-dashed border-forest/15 bg-white/60 p-6">
                  <div aria-hidden className="grid aspect-[4/3] place-items-center rounded-2xl bg-sage-50">
                    <svg className="h-16 w-16 text-sage-300" viewBox="0 0 64 64" fill="currentColor"><circle cx="32" cy="24" r="12" /><path d="M10 58c2-12 11-18 22-18s20 6 22 18z" /></svg>
                  </div>
                  <h2 className="mt-5 font-sans text-lg font-semibold text-forest">{t.cardTitle}</h2>
                  <p className="mt-1 text-[0.95rem] text-ink-muted">{t.cardText}</p>
                  <div className="mt-4"><PlaceholderChip label={dict.common.placeholder} /></div>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-ink-muted">{t.editNote}</p>
          </>
        )}
      </section>
    </>
  );
}
