import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leadSchema";
import { Resend } from "resend";

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

  // honeypot — pretend success
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL || "hello@zenhospitality.com";
  const from = process.env.LEAD_FROM_EMAIL || "Zen Hospitality <onboarding@resend.dev>";

  // If no email service configured, log and accept — frictionless dev experience.
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.log("[lead]", { ...data, _note: "RESEND_API_KEY not set, lead not emailed" });
    return NextResponse.json({ ok: true, mode: "logged" });
  }

  try {
    const resend = new Resend(apiKey);
    const html = renderLeadHtml(data);

    await resend.emails.send({
      from,
      to: [to],
      subject: `New Zen lead: ${data.name} — ${data.location}`,
      replyTo: data.email,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] resend error", err);
    return NextResponse.json({ error: "email_failed" }, { status: 502 });
  }
}

function renderLeadHtml(d: {
  name: string;
  email: string;
  phone: string;
  location: string;
  rooms: number;
  bathrooms: number;
  amenities: string;
  locale?: string;
}) {
  const esc = (s: string | number) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  return `
  <div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#042b59;line-height:1.55">
    <h2 style="font-weight:700;letter-spacing:-0.01em">New lead — Zen Hospitality</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><b>Name</b></td><td>${esc(d.name)}</td></tr>
      <tr><td><b>Email</b></td><td>${esc(d.email)}</td></tr>
      <tr><td><b>Phone</b></td><td>${esc(d.phone)}</td></tr>
      <tr><td><b>Location</b></td><td>${esc(d.location)}</td></tr>
      <tr><td><b>Rooms</b></td><td>${esc(d.rooms)}</td></tr>
      <tr><td><b>Bathrooms</b></td><td>${esc(d.bathrooms)}</td></tr>
      <tr><td valign="top"><b>Amenities</b></td><td>${esc(d.amenities).replace(/\n/g, "<br/>")}</td></tr>
      <tr><td><b>Locale</b></td><td>${esc(d.locale ?? "")}</td></tr>
    </table>
  </div>
  `;
}
