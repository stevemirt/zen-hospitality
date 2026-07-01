"use client";

import { useState, Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendGTMEvent } from "@next/third-parties/google";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import type { UseFormSetValue } from "react-hook-form";
import { leadSchema, type LeadInput } from "@/lib/leadSchema";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import { BackToSection } from "@/components/ui/BackToSection";
import clsx from "clsx";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function UTMCapture({ setValue }: { setValue: UseFormSetValue<LeadInput> }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    for (const key of UTM_KEYS) {
      const val = searchParams.get(key);
      if (val) setValue(key, val);
    }
  }, [searchParams, setValue]);
  return null;
}

export function JoinForm() {
  const t = useTranslations("form");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const fields = t.raw("fields") as Record<keyof LeadInput, string>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { locale: locale as "en" | "es" },
    mode: "onBlur",
  });

  const [submitted, setSubmitted] = useState<"idle" | "ok" | "err">("idle");
  const allValues = watch();

  const onSubmit = async (data: LeadInput) => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted("ok");
      // GTM conversion event — metadata only, no PII (name/email/phone excluded)
      sendGTMEvent({
        event: "generate_lead",
        locale,
        lead_location: data.location,
        lead_rooms: data.rooms,
        lead_bathrooms: data.bathrooms,
        utm_source: data.utm_source ?? "",
        utm_medium: data.utm_medium ?? "",
        utm_campaign: data.utm_campaign ?? "",
      });
      reset();
    } catch {
      setSubmitted("err");
    }
  };

  return (
    <Section id="join" tone="midnight">
      <BackToSection href="#collection" label={nav("backToCollection")} tone="midnight" />
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        {/* Left — editorial intro */}
        <div className="lg:col-span-5">
          <Reveal>
            <div className="flex items-center gap-3 text-[10px] tracking-[0.42em] uppercase text-[#58c3e8] mb-6">
              <span aria-hidden className="h-px w-8 bg-[#58c3e8]" />
              {t("kicker")}
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="title font-medium text-[clamp(2.4rem,5.2vw,4.6rem)] leading-[0.98] tracking-[-0.018em] text-[#eaf1f6] mb-8">
              {t("headlineLine1")}
              <br />
              <span className="italic font-light text-[#58c3e8]">{t("headlineLine2")}</span>
            </h2>
          </Reveal>
          <Reveal delayMs={160}>
            <p className="text-base md:text-lg text-[#eaf1f6]/75 max-w-md leading-relaxed mb-10">
              {t("sub")}
            </p>
          </Reveal>
          <Reveal delayMs={220}>
            <div className="space-y-4 text-sm text-[#eaf1f6]/65 max-w-md">
              <div className="flex items-start gap-3">
                <span aria-hidden className="mt-2 inline-block w-1 h-1 rounded-full bg-[#58c3e8]" />
                <span>{t("trustLine3")}</span>
              </div>
              <div className="flex items-start gap-3">
                <span aria-hidden className="mt-2 inline-block w-1 h-1 rounded-full bg-[#58c3e8]" />
                <span>{t("trustLine1")}</span>
              </div>
              <div className="flex items-start gap-3">
                <span aria-hidden className="mt-2 inline-block w-1 h-1 rounded-full bg-[#58c3e8]" />
                <span>{t("trustLine2")}</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — modern minimal form */}
        <div className="lg:col-span-7">
          {submitted === "ok" ? (
            <Reveal>
              <div className="border-l-2 border-[#58c3e8] pl-8 py-10 max-w-xl">
                <div className="text-[10px] tracking-[0.42em] uppercase text-[#58c3e8] mb-4">
                  {t("receivedLabel")}
                </div>
                <p className="title font-medium text-2xl md:text-3xl text-[#eaf1f6] leading-tight">
                  {t("success")}
                </p>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2" noValidate>
              {/* honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                {...register("website")}
                className="hidden"
              />

              {/* UTM parameter capture */}
              <Suspense fallback={null}>
                <UTMCapture setValue={setValue} />
              </Suspense>

              {/* UTM hidden inputs */}
              {UTM_KEYS.map((key) => (
                <input key={key} type="hidden" {...register(key)} />
              ))}

              <FloatingField
                label={fields.name}
                value={allValues.name as string}
                error={errors.name?.message}
                index="01"
              >
                <input
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  className={floatingInputCls(!!errors.name)}
                />
              </FloatingField>

              <FloatingField
                label={fields.email}
                value={allValues.email as string}
                error={errors.email?.message}
                index="02"
              >
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  {...register("email")}
                  className={floatingInputCls(!!errors.email)}
                />
              </FloatingField>

              <FloatingField
                label={fields.phone}
                value={allValues.phone as string}
                error={errors.phone?.message}
                index="03"
              >
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  {...register("phone")}
                  className={floatingInputCls(!!errors.phone)}
                />
              </FloatingField>

              <FloatingField
                label={fields.location}
                value={allValues.location as string}
                error={errors.location?.message}
                index="04"
              >
                <input
                  type="text"
                  autoComplete="address-level2"
                  {...register("location")}
                  className={floatingInputCls(!!errors.location)}
                />
              </FloatingField>

              <FloatingField
                label={fields.rooms}
                value={String(allValues.rooms ?? "")}
                error={errors.rooms?.message}
                index="05"
              >
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  {...register("rooms")}
                  className={floatingInputCls(!!errors.rooms)}
                />
              </FloatingField>
              <FloatingField
                label={fields.bathrooms}
                value={String(allValues.bathrooms ?? "")}
                error={errors.bathrooms?.message}
                index="06"
              >
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  {...register("bathrooms")}
                  className={floatingInputCls(!!errors.bathrooms)}
                />
              </FloatingField>

              <FloatingField
                label={fields.amenities}
                value={allValues.amenities as string}
                error={errors.amenities?.message}
                index="07"
                textarea
              >
                <textarea
                  rows={3}
                  {...register("amenities")}
                  className={clsx(floatingInputCls(!!errors.amenities), "resize-none")}
                />
              </FloatingField>

              <input type="hidden" {...register("locale")} />

              <div className="pt-8 flex flex-wrap items-center gap-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-3 bg-[#58c3e8] hover:bg-[#eaf1f6] text-[#042b59] px-9 py-4 text-sm font-medium tracking-[0.04em] rounded-full transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_32px_rgba(88,195,232,0.18)] hover:shadow-[0_12px_48px_rgba(88,195,232,0.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eaf1f6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59]"
                >
                  {isSubmitting ? t("submitting") : t("submit")}
                  <span
                    aria-hidden
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#042b59] text-[#58c3e8] text-[11px] transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#58c3e8]/65">
                  {t("privacy")}
                </p>
              </div>

              {submitted === "err" && (
                <p role="alert" aria-live="polite" className="mt-4 text-sm text-[#ff9a82]">
                  {t("error")}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

function FloatingField({
  label,
  value,
  error,
  index,
  textarea,
  noBottomBorder,
  children,
}: {
  label: string;
  value?: string;
  error?: string;
  index: string;
  textarea?: boolean;
  noBottomBorder?: boolean;
  children: React.ReactNode;
}) {
  const filled = Boolean(value && value.length > 0);
  return (
    <div
      className={clsx(
        "relative group",
        !noBottomBorder && "border-b border-[#58c3e8]/15 hover:border-[#58c3e8]/50 focus-within:border-[#58c3e8] transition-colors duration-300",
        noBottomBorder && "bg-[#042b59]"
      )}
    >
      {/* Index in left margin */}
      <span
        aria-hidden
        className="absolute top-5 left-0 text-[9px] tracking-[0.42em] uppercase text-[#58c3e8]/55 font-medium"
      >
        {index}
      </span>
      <label
        className={clsx(
          "absolute left-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none origin-left",
          filled
            ? "top-2 text-[10px] tracking-[0.32em] uppercase text-[#58c3e8]"
            : "top-6 text-base text-[#eaf1f6]/55",
          "group-focus-within:top-2 group-focus-within:text-[10px] group-focus-within:tracking-[0.32em] group-focus-within:uppercase group-focus-within:text-[#58c3e8]"
        )}
      >
        {label}
      </label>
      <div className={clsx("pl-10", textarea ? "pt-7 pb-3" : "")}>{children}</div>
      {error && (
        <span className="block pl-10 pb-2 text-[10px] tracking-[0.22em] uppercase text-[#ff9a82]">
          {error}
        </span>
      )}
    </div>
  );
}

function floatingInputCls(error: boolean) {
  return clsx(
    "w-full bg-transparent text-[#eaf1f6] pt-7 pb-3 outline-none border-0 placeholder-transparent text-base",
    error && "text-[#ff9a82]"
  );
}
