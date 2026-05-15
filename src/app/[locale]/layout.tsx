import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const META = {
  en: {
    title: "Zen Hospitality — Refined hospitality in Costa Rica",
    description:
      "Luxury residential management in Costa Rica. Refined hospitality, sustainable operations, and enduring value for property owners.",
    ogTitle: "Zen Hospitality — Discover the potential of your property",
    twitterDesc: "Luxury residential management in Costa Rica.",
    htmlLocale: "en_US",
    altLocale: "es_CR",
  },
  es: {
    title: "Zen Hospitality — Hospitalidad refinada en Costa Rica",
    description:
      "Gestión residencial de lujo en Costa Rica. Hospitalidad refinada, operaciones sostenibles y valor duradero para los propietarios.",
    ogTitle: "Zen Hospitality — Descubra el potencial de su propiedad",
    twitterDesc: "Gestión residencial de lujo en Costa Rica.",
    htmlLocale: "es_CR",
    altLocale: "en_US",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale as keyof typeof META] ?? META.en;
  return {
    title: {
      default: m.title,
      template: "%s · Zen Hospitality",
    },
    description: m.description,
    metadataBase: new URL("https://zenhospitality.com"),
    openGraph: {
      title: m.ogTitle,
      description: m.description,
      type: "website",
      locale: m.htmlLocale,
      alternateLocale: m.altLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: "Zen Hospitality",
      description: m.twitterDesc,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        {/* Hero image preload — the single most impactful LCP optimization */}
        <link
          rel="preload"
          as="image"
          href="/zen/aerial-resort.jpg"
          // @ts-expect-error - fetchpriority is a valid HTML attribute, not yet typed in React
          fetchpriority="high"
        />
        {/* Pre-hydration scroll lock — disables browser's scroll restoration
            and pins to top BEFORE React mounts. Mobile Safari/Chrome queue
            the auto-restore before useEffect can run, so we must beat them
            inline. Hash anchors are preserved for deep links. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if("scrollRestoration" in history){history.scrollRestoration="manual"}if(!location.hash){window.scrollTo(0,0)}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ScrollToTop />
          {children}
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
