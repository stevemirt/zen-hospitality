import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { renderOwnersOutreachEmail } from "@/lib/outreachEmails";

export const runtime = "nodejs";

const outreachSchema = z.object({
  to: z.string().email(),
  locale: z.enum(["en", "es"]).default("en"),
  // Optional — reserved for future personalization
  name: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = outreachSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", details: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const { to, locale } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    process.env.LEAD_FROM_EMAIL ||
    "Zen Hospitality <no-reply@grupo-zen.com>";
  const replyToAddress =
    process.env.LEAD_NOTIFY_EMAIL || "eduardoc@zen-hospitality.com";

  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.log("[outreach] RESEND_API_KEY not set — would send to", to, "locale", locale);
    return NextResponse.json({ ok: true, mode: "logged" });
  }

  const resend = new Resend(apiKey);
  const { subject, html, text } = renderOwnersOutreachEmail(locale);

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html,
      text,
      replyTo: replyToAddress,
    });
    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("[outreach] resend error", err);
    return NextResponse.json({ error: "email_failed" }, { status: 502 });
  }
}
