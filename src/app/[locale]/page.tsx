import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/ui/Nav";
import { Hero } from "@/components/editorial/Hero";
import { WhoWeAre } from "@/components/editorial/WhoWeAre";
import { PoolBanner } from "@/components/editorial/PoolBanner";
import { WhyCostaRica } from "@/components/editorial/WhyCostaRica";
import { Collection } from "@/components/editorial/Collection";
import { ServicesGrid } from "@/components/editorial/ServicesGrid";
import { TwoPaths } from "@/components/editorial/TwoPaths";
import { Packages } from "@/components/editorial/Packages";
import { CustomizePlan } from "@/components/editorial/CustomizePlan";
import { Operations } from "@/components/editorial/Operations";
import { Journey } from "@/components/editorial/Journey";
import { LocallyRootedAndExperience } from "@/components/editorial/LocallyRootedAndExperience";
import { BeyondTheStay } from "@/components/editorial/BeyondTheStay";
import { FAQs } from "@/components/editorial/FAQs";
import { JoinForm } from "@/components/editorial/JoinForm";
import { Footer } from "@/components/editorial/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const schemaDescription =
    locale === "es"
      ? "Gestión residencial de lujo en Costa Rica. Hospitalidad refinada, operaciones sostenibles y valor duradero para los propietarios."
      : "Luxury residential management in Costa Rica. Refined hospitality, sustainable operations, enduring value for property owners.";

  return (
    <>
      <Nav />
      <main className="relative">
        {/* 1. Hero — aerial resort photo with bold headline */}
        <Hero />

        {/* 2. Who we are — light section with interior banner + values */}
        <WhoWeAre />

        {/* 3. Infinity pool full-bleed photo banner */}
        <PoolBanner />

        {/* 4. Why Costa Rica? — midnight section with animated map + stats */}
        <WhyCostaRica />

        {/* 5. Our Collection — three Zen Reserve cards on midnight */}
        <Collection />

        {/* 6. Services — light grid with line icons */}
        <ServicesGrid />

        {/* 7. Property Management vs Vacation Rentals — photo cards */}
        <TwoPaths />

        {/* 8. Packages — three pricing cards */}
        <Packages />

        {/* 8b. Customize Plan — interactive à-la-carte quote calculator */}
        <CustomizePlan />

        {/* 9. Our Operations — aerial beach banner + 4 nav cards */}
        <Operations />

        {/* 10. Your Property Journey with Zen — 5 steps */}
        <Journey />

        {/* 11. Locally Rooted Approach + Guest Experience */}
        <LocallyRootedAndExperience />

        {/* 12. Beyond the Stay Program — 3 NGOs */}
        <BeyondTheStay />

        {/* 13. FAQs — accordion */}
        <FAQs />

        {/* 14. Join our Collection — form on midnight */}
        <JoinForm />
      </main>
      <Footer />
      <SchemaOrg description={schemaDescription} />
    </>
  );
}

function SchemaOrg({ description }: { description: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zen Hospitality",
    url: "https://zenhospitality.com",
    description,
    areaServed: "Costa Rica",
    sameAs: [],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
