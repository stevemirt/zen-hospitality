import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="relative z-10 bg-[#042b59] border-t border-[#58c3e8]/15">
      <div className="mx-auto max-w-[1700px] px-6 lg:px-10 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 mb-16">
          <div className="md:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logos/logo-dark.png"
              alt="Zen Hospitality"
              className="h-12 md:h-14 w-auto mb-8"
              draggable={false}
            />
            <p className="title font-medium text-xl md:text-2xl text-[#eaf1f6] leading-tight max-w-md tracking-[-0.012em]">
              Refined hospitality.
              <br />
              <span className="text-[#58c3e8] italic font-light">Sustainable operations.</span>
            </p>
            <p className="mt-6 text-sm text-[#eaf1f6]/65 max-w-md leading-relaxed">{t("tagline")}</p>
          </div>

          <div className="md:col-span-3">
            <div className="text-[10px] tracking-[0.42em] uppercase text-[#58c3e8] mb-5">
              Navigate
            </div>
            <ul className="space-y-3 text-sm">
              <li><a href="#who-we-are" className="text-[#eaf1f6]/80 hover:text-[#58c3e8] transition-colors">{nav("whoWeAre")}</a></li>
              <li><a href="#packages" className="text-[#eaf1f6]/80 hover:text-[#58c3e8] transition-colors">{nav("services")}</a></li>
              <li><a href="#operations" className="text-[#eaf1f6]/80 hover:text-[#58c3e8] transition-colors">{nav("operations")}</a></li>
              <li><a href="#join" className="text-[#eaf1f6]/80 hover:text-[#58c3e8] transition-colors">{nav("join")}</a></li>
              <li><a href="#faqs" className="text-[#eaf1f6]/80 hover:text-[#58c3e8] transition-colors">{nav("faqs")}</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-[10px] tracking-[0.42em] uppercase text-[#58c3e8] mb-5">
              Reach us
            </div>
            <a
              href="mailto:hello@zenhospitality.com"
              className="block title font-medium text-lg md:text-xl text-[#eaf1f6] hover:text-[#58c3e8] transition-colors mb-3"
            >
              hello@zenhospitality.com
            </a>
            <div className="text-sm text-[#eaf1f6]/65 leading-relaxed">
              Costa Rica
              <br />
              Open 24 / 7
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#58c3e8]/15 flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.32em] uppercase text-[#eaf1f6]/45">
          <span>{t("legal")}</span>
          <span>N 10°37′ · W 85°45′</span>
        </div>
      </div>
    </footer>
  );
}
