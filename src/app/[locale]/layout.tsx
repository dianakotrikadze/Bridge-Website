import "@fontsource-variable/noto-sans-georgian/wdth.css";
import "@fontsource-variable/noto-serif-georgian/wdth.css";
import "../globals.css";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, localeNames, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return { metadataBase: new URL(siteConfig.url), ...pageMetadata(params.locale), icons: { icon: "/icon.svg" } };
}

export const viewport: Viewport = { themeColor: "#1E3B2C", width: "device-width", initialScale: 1 };

export default function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = getDictionary(locale);

  return (
    <html lang={localeNames[locale].htmlLang}>
      <body className="flex min-h-screen flex-col">
        <Header locale={locale} dict={dict} />
        <main id="main" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
