import { NextResponse } from "next/server";
import { Resend } from "resend";
import { quoteSchema } from "@/lib/quoteSchema";
import { computeQuote, serviceLabel } from "@/lib/quoteServices";
import {
  renderQuoteConfirmationEmail,
  renderQuoteNotificationEmail,
} from "@/lib/quoteEmails";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", details: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const input = parsed.data;

  // honeypot — pretend success but skip everything
  if (input.website && input.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const locale = input.locale ?? "en";

  // Recompute the quote server-side from the selected services — never trust
  // the client-sent subtotal/vat/total (anti-tamper). These are the figures
  // used in the emails and the webhook.
  const { subtotal, vat, total } = computeQuote(input.services);
  const services_label = serviceLabel(input.services, "en");

  // Full, authoritative record for emails + webhook.
  const data = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    location: input.location,
    rooms: input.rooms,
    bathrooms: input.bathrooms,
    amenities: input.amenities,
    locale,
    services: input.services,
    subtotal,
    vat,
    total,
  };

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || "eduardoc@zen-hospitality.com";
  const fromAddress =
    process.env.LEAD_FROM_EMAIL ||
    "Zen Hospitality <no-reply@zen-hospitality.com>";

  // Separate webhook so calculator leads never mix with the normal form flow.
  const quoteWebhook = process.env.ZAPIER_QUOTE_WEBHOOK_URL;

  const webhookPayload = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    location: input.location,
    rooms: input.rooms,
    bathrooms: input.bathrooms,
    amenities: input.amenities,
    locale,
    date: input.date ?? new Date().toISOString(),
    utm_source: input.utm_source,
    utm_medium: input.utm_medium,
    utm_campaign: input.utm_campaign,
    utm_term: input.utm_term,
    utm_content: input.utm_content,
    services: input.services,
    services_label,
    subtotal,
    vat,
    total,
  };

  const fireWebhook = () =>
    quoteWebhook
      ? fetch(quoteWebhook, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(webhookPayload),
        })
      : Promise.resolve(null);

  // No key in dev — skip email but still fire the webhook so leads are captured.
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.log("[quote]", {
      ...webhookPayload,
      _note: quoteWebhook
        ? "RESEND_API_KEY not set, quote not emailed"
        : "RESEND_API_KEY and ZAPIER_QUOTE_WEBHOOK_URL not set, quote logged only",
    });
    fireWebhook().catch((e) =>
      console.error("[quote] webhook failed (dev)", e)
    );
    return NextResponse.json({ ok: true, mode: "logged" });
  }

  const resend = new Resend(apiKey);
  const notification = renderQuoteNotificationEmail(data);
  const confirmation = renderQuoteConfirmationEmail(data);

  // Fire both emails + webhook in parallel.
  const [notifyResult, confirmResult, webhookResult] = await Promise.allSettled([
    resend.emails.send({
      from: fromAddress,
      to: [notifyTo],
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      replyTo: input.email,
    }),
    resend.emails.send({
      from: fromAddress,
      to: [input.email],
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
      replyTo: notifyTo,
    }),
    fireWebhook(),
  ]);

  if (notifyResult.status === "rejected") {
    console.error("[quote] notify email failed", notifyResult.reason);
  }
  if (confirmResult.status === "rejected") {
    console.error("[quote] confirmation email failed", confirmResult.reason);
  }
  if (webhookResult.status === "rejected") {
    console.error("[quote] webhook failed", webhookResult.reason);
  }

  if (notifyResult.status === "rejected") {
    // Critical: the team didn't get the quote. Surface the fallback to the user.
    return NextResponse.json({ error: "notify_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
