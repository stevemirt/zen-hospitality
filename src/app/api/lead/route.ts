import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/leadSchema";
import {
  renderConfirmationEmail,
  renderLeadNotificationEmail,
} from "@/lib/leadEmails";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", details: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const data = parsed.data;

  // honeypot — pretend success but skip everything
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || "eduardoc@zen-hospitality.com";
  const fromAddress =
    process.env.LEAD_FROM_EMAIL ||
    "Zen Hospitality <no-reply@zen-hospitality.com>";

  const zapierWebhook = "https://hooks.zapier.com/hooks/catch/16194264/4b2x74p/";

  // No key in dev — skip email but still fire Zapier so leads are captured.
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.log("[lead]", {
      ...data,
      _note: "RESEND_API_KEY not set, lead not emailed",
    });
    fetch(zapierWebhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        amenities: data.amenities,
        locale: data.locale ?? "en",
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_term: data.utm_term,
        utm_content: data.utm_content,
      }),
    }).catch((e) => console.error("[lead] zapier webhook failed (dev)", e));
    return NextResponse.json({ ok: true, mode: "logged" });
  }

  const resend = new Resend(apiKey);

  const notification = renderLeadNotificationEmail(data);
  const confirmation = renderConfirmationEmail(data);

  // Fire emails + Zapier webhook in parallel.
  const [notifyResult, confirmResult, zapierResult] = await Promise.allSettled([
    resend.emails.send({
      from: fromAddress,
      to: [notifyTo],
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      replyTo: data.email,
    }),
    resend.emails.send({
      from: fromAddress,
      to: [data.email],
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
      replyTo: notifyTo,
    }),
    fetch(zapierWebhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        amenities: data.amenities,
        locale: data.locale ?? "en",
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_term: data.utm_term,
        utm_content: data.utm_content,
      }),
    }),
  ]);

  // Log any failures (visible in Vercel logs) but don't break the user flow
  // unless the internal notification also failed — that's a real outage.
  if (notifyResult.status === "rejected") {
    console.error("[lead] notify email failed", notifyResult.reason);
  }
  if (confirmResult.status === "rejected") {
    console.error("[lead] confirmation email failed", confirmResult.reason);
  }
  if (zapierResult.status === "rejected") {
    console.error("[lead] zapier webhook failed", zapierResult.reason);
  }

  if (notifyResult.status === "rejected") {
    // Critical: the team didn't get the lead. Return 502 so the client can
    // surface the "try again or email us directly" fallback.
    return NextResponse.json({ error: "notify_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
