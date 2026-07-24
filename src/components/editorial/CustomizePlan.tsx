"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendGTMEvent } from "@next/third-parties/google";
import { useTranslations, useLocale } from "next-intl";
import clsx from "clsx";
import { quoteSchema, type QuoteInput } from "@/lib/quoteSchema";
import {
  QUOTE_SERVICE_IDS,
  PRICE_BY_ID,
  computeQuote,
} from "@/lib/quoteServices";
import { UTM_KEYS } from "@/lib/utm";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import { UTMCapture } from "@/components/ui/UTMCapture";
import { FloatingField, floatingInputCls } from "@/components/ui/FloatingField";

type ServiceCopy = { id: string; name: string; unit: string };

const PILL =
  "group inline-flex items-center gap-3 bg-[#58c3e8] hover:bg-[#eaf1f6] text-[#042b59] px-9 py-4 text-sm font-medium tracking-[0.04em] rounded-full transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_8px_32px_rgba(88,195,232,0.18)] hover:shadow-[0_12px_48px_rgba(88,195,232,0.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eaf1f6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59]";

const BACK =
  "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#58c3e8]/70 hover:text-[#58c3e8] transition-colors";

const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function ArrowChip() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#042b59] text-[#58c3e8] text-[11px] transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>
  );
}

export function CustomizePlan() {
  const t = useTranslations("customizePlan");
  const tForm = useTranslations("form");
  const locale = useLocale();
  const fields = tForm.raw("fields") as Record<string, string>;
  const services = t.raw("services") as ServiceCopy[];

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState<"idle" | "ok" | "err">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      locale: locale as "en" | "es",
      services: [],
      subtotal: 0,
      vat: 0,
      total: 0,
    },
    mode: "onBlur",
  });
  const allValues = watch();

  // Ordered, stable list of selected ids + live quote math.
  const ids = useMemo(
    () => QUOTE_SERVICE_IDS.filter((id) => selected.has(id)),
    [selected]
  );
  const { subtotal, vat, total } = computeQuote(ids);

  // Keep the RHF values in sync with the calculator so they validate + submit.
  useEffect(() => {
    setValue("services", ids);
    setValue("subtotal", subtotal);
    setValue("vat", vat);
    setValue("total", total);
  }, [ids, subtotal, vat, total, setValue]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onSubmit = async (data: QuoteInput) => {
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted("ok");
      // GTM conversion event — metadata only, no PII.
      sendGTMEvent({
        event: "generate_quote",
        locale,
        quote_total: total,
        quote_service_count: ids.length,
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
    <Section id="customize-plan" tone="midnight" spacing="compact">
      <Reveal>
        <div className="mx-auto max-w-4xl">
          <article className="relative overflow-hidden border border-[#58c3e8]/20 bg-gradient-to-br from-[#0a3a73] via-[#042b59] to-[#0a3a73] p-8 md:p-12 shadow-[0_24px_80px_rgba(88,195,232,0.20)]">
            {/* Top hairline accent */}
            <span
              aria-hidden
              className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#58c3e8] to-transparent"
            />
            {/* Breathing glow */}
            <div
              aria-hidden
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#58c3e8]/12 blur-3xl pointer-events-none zen-glow-breath"
            />

            <div className="relative">
              {/* ── Step 0 — intro / start gate ── */}
              {step === 0 && (
                <div className="text-center py-6 md:py-10">
                  <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
                    <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
                    {t("kicker")}
                    <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
                  </div>
                  <h3 className="h-display text-[clamp(2rem,4.5vw,3.4rem)] text-[#eaf1f6] mb-5">
                    {t("headlineLine1")}
                    <br />
                    <span className="h-italic text-[#58c3e8]">
                      {t("headlineLine2")}
                    </span>
                  </h3>
                  <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/70 max-w-xl mx-auto mb-10">
                    {t("descriptor")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={PILL}
                  >
                    {t("start")}
                    <ArrowChip />
                  </button>
                </div>
              )}

              {/* ── Step 1 — calculator ── */}
              {step === 1 && (
                <div>
                  <div className="mb-8">
                    <div className="h-kicker text-[#58c3e8] mb-4 inline-flex items-center gap-3">
                      <span aria-hidden className="h-px w-8 bg-[#58c3e8]" />
                      {t("kicker")}
                    </div>
                    <p className="h-display text-2xl md:text-3xl text-[#eaf1f6]">
                      {t("selectPrompt")}
                    </p>
                  </div>

                  <ul className="border-y border-[#58c3e8]/12 divide-y divide-[#58c3e8]/12">
                    {services.map((s) => {
                      const checked = selected.has(s.id);
                      const price = PRICE_BY_ID[s.id] ?? 0;
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={checked}
                            onClick={() => toggle(s.id)}
                            className="group w-full flex items-center gap-4 py-4 text-left"
                          >
                            <span
                              className={clsx(
                                "relative shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-[4px] border transition-all duration-300",
                                checked
                                  ? "bg-[#58c3e8] border-[#58c3e8]"
                                  : "border-[#58c3e8]/40 group-hover:border-[#58c3e8]"
                              )}
                            >
                              {checked && (
                                <svg
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  stroke="#042b59"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-3.5 h-3.5"
                                >
                                  <path d="M3 8.5l3 3 7-8" />
                                </svg>
                              )}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-[#eaf1f6] text-base md:text-lg">
                                {s.name}
                              </span>
                              <span className="block text-[11px] uppercase tracking-[0.18em] text-[#eaf1f6]/45">
                                {s.unit}
                              </span>
                            </span>
                            <span
                              className={clsx(
                                "shrink-0 h-display text-lg md:text-xl transition-colors",
                                checked ? "text-[#58c3e8]" : "text-[#eaf1f6]/70"
                              )}
                            >
                              {money(price)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Totals */}
                  <div className="mt-8 ml-auto max-w-sm space-y-3">
                    <div className="flex items-baseline justify-between text-[#eaf1f6]/70">
                      <span className="text-sm">{t("subtotalLabel")}</span>
                      <span className="text-sm">{money(subtotal)}</span>
                    </div>
                    <div className="flex items-baseline justify-between text-[#eaf1f6]/70">
                      <span className="text-sm">{t("vatLabel")}</span>
                      <span className="text-sm">{money(vat)}</span>
                    </div>
                    <div className="flex items-baseline justify-between pt-3 border-t border-[#58c3e8]/25">
                      <span className="text-sm uppercase tracking-[0.2em] text-[#eaf1f6]">
                        {t("totalLabel")}
                      </span>
                      <span className="h-display text-2xl md:text-3xl text-[#58c3e8]">
                        USD {money(total)}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#eaf1f6]/45 text-right">
                      {t("estimateNote")}
                    </p>
                  </div>

                  {/* Nav */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className={BACK}
                    >
                      ← {t("back")}
                    </button>
                    <button
                      type="button"
                      disabled={ids.length === 0}
                      onClick={() => setStep(2)}
                      className={PILL}
                    >
                      {t("continue")}
                      <ArrowChip />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2 — lead form ── */}
              {step === 2 &&
                (submitted === "ok" ? (
                  <div className="border-l-2 border-[#58c3e8] pl-8 py-10 max-w-xl">
                    <div className="text-[10px] tracking-[0.42em] uppercase text-[#58c3e8] mb-4">
                      {tForm("receivedLabel")}
                    </div>
                    <p className="title font-medium text-2xl md:text-3xl text-[#eaf1f6] leading-tight">
                      {t("success")}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Selection summary */}
                    <div className="mb-8 border border-[#58c3e8]/20 bg-[#042b59]/40 p-5 md:p-6">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#58c3e8]">
                          {t("summaryTitle")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className={BACK}
                        >
                          ← {t("back")}
                        </button>
                      </div>
                      <ul className="flex flex-wrap gap-2 mb-5">
                        {ids.map((id) => {
                          const name =
                            services.find((s) => s.id === id)?.name ?? id;
                          return (
                            <li
                              key={id}
                              className="text-xs text-[#eaf1f6]/85 bg-[#58c3e8]/10 border border-[#58c3e8]/20 rounded-full px-3 py-1"
                            >
                              {name}
                            </li>
                          );
                        })}
                      </ul>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm uppercase tracking-[0.2em] text-[#eaf1f6]/70">
                          {t("totalLabel")}
                        </span>
                        <span className="h-display text-xl md:text-2xl text-[#58c3e8]">
                          USD {money(total)}
                        </span>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-2"
                      noValidate
                    >
                      {/* honeypot */}
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden
                        {...register("website")}
                        className="hidden"
                      />

                      {/* UTM capture */}
                      <Suspense fallback={null}>
                        <UTMCapture setValue={setValue} />
                      </Suspense>
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
                          className={clsx(
                            floatingInputCls(!!errors.amenities),
                            "resize-none"
                          )}
                        />
                      </FloatingField>

                      <input type="hidden" {...register("locale")} />

                      <div className="pt-8 flex flex-wrap items-center gap-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={PILL}
                        >
                          {isSubmitting ? t("submitting") : t("submit")}
                          <ArrowChip />
                        </button>
                        <p className="text-[10px] uppercase tracking-[0.32em] text-[#58c3e8]/65">
                          {tForm("privacy")}
                        </p>
                      </div>

                      {submitted === "err" && (
                        <p
                          role="alert"
                          aria-live="polite"
                          className="mt-4 text-sm text-[#ff9a82]"
                        >
                          {t("error")}
                        </p>
                      )}
                    </form>
                  </div>
                ))}
            </div>
          </article>
        </div>
      </Reveal>
    </Section>
  );
}
