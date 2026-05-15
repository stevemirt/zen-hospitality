"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import clsx from "clsx";

const SECTIONS = [
  { key: "whoWeAre", href: "#who-we-are" },
  { key: "services", href: "#packages" },
  { key: "operations", href: "#operations" },
  { key: "join", href: "#join" },
  { key: "faqs", href: "#faqs" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled || menuOpen ? "bg-black/70 backdrop-blur-xl" : ""
        )}
      >
        <div className="mx-auto max-w-[1700px] flex items-center justify-between px-6 lg:px-10 h-24 md:h-28">
          {/* Real PNG logo — bigger, prominent */}
          <Link
            href="/"
            className="block shrink-0 transition-all duration-300 hover:opacity-80 active:scale-95"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logos/logo-dark.png"
              alt="Zen Hospitality"
              className="h-14 md:h-16 lg:h-20 w-auto select-none"
              draggable={false}
            />
          </Link>

          <div className="flex items-center gap-5 md:gap-7">
            <LocaleSwitch current={locale} pathname={pathname} />

            {/* Burger toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-nav-menu"
              className="relative w-12 h-12 inline-flex items-center justify-center group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59]"
            >
              <span
                className={clsx(
                  "absolute h-[1.4px] w-7 bg-[#eaf1f6] transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]",
                  menuOpen ? "rotate-45" : "-translate-y-1.5"
                )}
              />
              <span
                className={clsx(
                  "absolute h-[1.4px] w-7 bg-[#eaf1f6] transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]",
                  menuOpen ? "-rotate-45" : "translate-y-1.5"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen overlay menu */}
      <div
        id="primary-nav-menu"
        className={clsx(
          "fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.7,0,0.3,1)]",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#042b59]" />
        {/* Subtle photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/zen/aerial-beach.jpg"
          alt=""
          className={clsx(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-[1800ms] ease-out",
            menuOpen ? "scale-100 opacity-30" : "scale-110 opacity-0"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#042b59]/85 via-[#042b59]/65 to-black/85" />

        {/* Menu content */}
        <div className="relative h-full flex flex-col px-6 md:px-10 pt-32 md:pt-36 pb-16">
          <nav className="flex-1 mx-auto w-full max-w-[1700px]">
            <ul className="space-y-3 md:space-y-5">
              {SECTIONS.map((s, i) => (
                <li
                  key={s.key}
                  className={clsx(
                    "transition-all duration-700 ease-[cubic-bezier(0.7,0,0.3,1)]",
                    menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: menuOpen ? `${0.25 + i * 0.08}s` : "0s" }}
                >
                  <a
                    href={s.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-baseline gap-6 md:gap-10 text-[#eaf1f6] hover:text-[#58c3e8] transition-colors duration-300"
                  >
                    <span className="text-[10px] md:text-xs tracking-[0.42em] uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                      0{i + 1}
                    </span>
                    <span className="title font-medium text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.02] tracking-[-0.018em]">
                      {t(s.key)}
                    </span>
                    <span
                      aria-hidden
                      className="hidden md:inline-block flex-1 h-px bg-[#eaf1f6]/15 group-hover:bg-[#58c3e8]/50 transition-colors"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div
            className={clsx(
              "mx-auto w-full max-w-[1700px] flex flex-wrap items-end justify-between gap-6 text-[10px] tracking-[0.32em] uppercase text-[#eaf1f6]/55 transition-all duration-700",
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: menuOpen ? "0.7s" : "0s" }}
          >
            <div>
              <div className="opacity-60 mb-1">Visit</div>
              <a
                href="mailto:hello@zenhospitality.com"
                className="text-[#58c3e8] tracking-[0.22em] normal-case text-sm hover:text-[#eaf1f6] transition-colors"
              >
                hello@zenhospitality.com
              </a>
            </div>
            <div className="text-right">
              <div className="opacity-60 mb-1">Locale</div>
              <div className="title text-sm tracking-[0.22em] normal-case text-[#eaf1f6]">
                Costa Rica · {locale.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function LocaleSwitch({ current, pathname }: { current: string; pathname: string }) {
  const other = current === "en" ? "es" : "en";
  return (
    <Link
      href={pathname || "/"}
      locale={other}
      className="group inline-flex items-center gap-1 min-h-11 px-2 text-[10px] uppercase tracking-[0.32em] text-[#eaf1f6]/85 hover:text-[#58c3e8] transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59]"
      aria-label={`Switch language to ${other.toUpperCase()}`}
    >
      <span className="text-[#58c3e8]">{current.toUpperCase()}</span>
      <span aria-hidden className="opacity-50">/</span>
      <span className="opacity-50 group-hover:opacity-100 transition-opacity">{other.toUpperCase()}</span>
    </Link>
  );
}
