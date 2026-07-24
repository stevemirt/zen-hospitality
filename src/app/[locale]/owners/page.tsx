import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/editorial/Footer";
import { OwnersHero } from "@/components/editorial/owners/OwnersHero";
import { OwnersPromise } from "@/components/editorial/owners/OwnersPromise";
import { OwnersServices } from "@/components/editorial/owners/OwnersServices";
import { OwnersFeaturedPackage } from "@/components/editorial/owners/OwnersFeaturedPackage";
import { OwnersTrust } from "@/components/editorial/owners/OwnersTrust";
import { OwnersImpact } from "@/components/editorial/owners/OwnersImpact";
import { OwnersFinalCta } from "@/components/editorial/owners/OwnersFinalCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "owners.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "es" ? "es_CR" : "en_US",
    },
  };
}

export default async function OwnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main className="relative">
        <OwnersHero />
        <OwnersPromise />
        <OwnersServices />
        <OwnersFeaturedPackage />
        <OwnersTrust />
        <OwnersImpact />
        <OwnersFinalCta />
      </main>
      <Footer />
    </>
  );
}
