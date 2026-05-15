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

export const metadata: Metadata = {
  title: {
    default: "Zen Hospitality — Refined hospitality in Costa Rica",
    template: "%s · Zen Hospitality",
  },
  description:
    "Luxury residential management in Costa Rica. Refined hospitality, sustainable operations, and enduring value for property owners.",
  metadataBase: new URL("https://zenhospitality.com"),
  openGraph: {
    title: "Zen Hospitality — Discover the potential of your property",
    description:
      "Luxury residential management in Costa Rica. Refined hospitality, sustainable operations, and enduring value for property owners.",
    type: "website",
    locale: "en_US",
    alternateLocale: "es_CR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zen Hospitality",
    description:
      "Luxury residential management in Costa Rica.",
  },
};

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
