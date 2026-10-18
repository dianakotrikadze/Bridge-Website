import { PageHeader } from "@/components/PageHeader";
import { PlaceholderChip } from "@/components/ui/Badges";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionaries";
import { tr, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const d = getDictionary(params.locale);
  return pageMetadata(params.locale, { title: d.contact.title, description: d.contact.lead, path: "/contact" });
}

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const c = dict.contact;
  const { contact, links } = siteConfig;
  const missing = <PlaceholderChip label={dict.common.toBeAdded} />;
  const socials = [
    { name: "Facebook", url: links.facebook },
    { name: "Instagram", url: links.instagram },
    { name: "LinkedIn", url: links.linkedin },
  ];

  return (
    <>
      <PageHeader title={c.title} lead={c.lead} />
      <section className="container grid gap-10 py-16 lg:grid-cols-12">
        <dl className="grid gap-px overflow-hidden rounded-card bg-forest/10 shadow-soft sm:grid-cols-2 lg:col-span-8">
          <Row label={c.email}>{contact.email ? <a className="link" href={`mailto:${contact.email}`}>{contact.email}</a> : missing}</Row>
          <Row label={c.phone}>{contact.phone ? <a className="link" href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a> : missing}</Row>
          <Row label={c.location}>{tr(contact.address, locale)}</Row>
          <Row label={c.hours}>{contact.hours ? tr(contact.hours, locale) : missing}</Row>
          <div className="bg-white p-6 sm:col-span-2 sm:p-8">
            <dt className="text-sm text-ink-muted">{c.social}</dt>
            <dd className="mt-2 flex flex-wrap gap-3">
              {socials.map((s) => s.url
                ? <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline min-h-[2.5rem] px-4 text-sm">{s.name}</a>
                : <span key={s.name} className="inline-flex items-center gap-2 text-sm text-ink-muted">{s.name} {missing}</span>)}
            </dd>
          </div>
        </dl>
        <p className="self-start rounded-card bg-sage-50 p-6 text-sm text-ink-muted lg:col-span-4">{c.placeholderNote}</p>
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 sm:p-8">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-forest">{children}</dd>
    </div>
  );
}
