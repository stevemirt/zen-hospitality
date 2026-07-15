import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PipedriveChat } from "@/components/ui/PipedriveChat";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { GoogleTagManager } from "@next/third-parties/google";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const META = {
  en: {
    title: "Property Management Costa Rica | Property Zen Hospitality",
    description:
      "Maximize your rental income with premier property management in Costa Rica. Trust Property Zen Hospitality for expert care, booking, and maintenance.",
    ogTitle: "Zen Hospitality · Discover the potential of your property",
    twitterDesc: "Luxury residential management in Costa Rica.",
    htmlLocale: "en_US",
    altLocale: "es_CR",
  },
  es: {
    title: "Administración de Propiedades Costa Rica | Property Zen Hospitality",
    description:
      "Optimice sus rentas vacacionales con expertos en administración de propiedades en Costa Rica. Cuidado integral, reservas y mantenimiento profesional.",
    ogTitle: "Zen Hospitality · Descubra el potencial de su propiedad",
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
  const BASE = "https://property.zen-hospitality.com";
  const canonicalUrl = locale === "en" ? `${BASE}/` : `${BASE}/${locale}`;

  return {
    title: {
      default: m.title,
      template: "%s · Zen Hospitality",
    },
    description: m.description,
    metadataBase: new URL(BASE),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${BASE}/`,
        es: `${BASE}/es`,
        "x-default": `${BASE}/`,
      },
    },
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
            and pins scroll to 0 at MULTIPLE phases to defeat iOS Safari's
            late restore (which fires AFTER body paint, even with
            scrollRestoration=manual on some versions).

            Strategy: pin at head-time, DOMContentLoaded, load, and four
            setTimeout milestones (0/50/150/300ms). Stops as soon as the
            user touches/scrolls so we never fight a real interaction.
            Hash anchors preserved for deep links. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if("scrollRestoration" in history){history.scrollRestoration="manual"}var isReload=false;try{var n=performance.getEntriesByType("navigation")[0];isReload=n&&n.type==="reload"}catch(_){}if(!isReload&&location.hash)return;var u=false;var m=function(){u=true};window.addEventListener("touchstart",m,{passive:true,once:true});window.addEventListener("wheel",m,{passive:true,once:true});window.addEventListener("keydown",m,{once:true});var p=function(){if(u)return;if(location.hash){try{history.replaceState(null,"",location.pathname+location.search)}catch(_){}}if(window.scrollY!==0)window.scrollTo(0,0)};p();document.addEventListener("DOMContentLoaded",p);window.addEventListener("load",p);setTimeout(p,0);setTimeout(p,50);setTimeout(p,150);setTimeout(p,300);setTimeout(p,600)}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleTagManager gtmId="GTM-NXXSSNSP" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ScrollToTop />
          {children}
          <WhatsAppButton />
          <PipedriveChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
