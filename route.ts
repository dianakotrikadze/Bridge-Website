import { NextResponse } from "next/server";
import { sanitize, validateApplication, type ApplicationData } from "@/lib/application";

/**
 * POST /api/apply
 *
 * Validates on the server, then forwards to APPLICATIONS_WEBHOOK_URL
 * (Google Apps Script, CRM, Zapier/Make, your own API...).
 *
 * Responses:
 *   200 { ok: true, mode: "stored" } – the backend confirmed it saved the application
 *   200 { ok: true, mode: "demo" }   – no backend configured; NOTHING was stored
 *   400 { ok: false, errors }        – validation failed
 *   502 { ok: false, error }         – backend failed; NOTHING confirmed
 *
 * Credentials live only in server environment variables, never in the browser.
 */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: ApplicationData;
  try {
    body = (await req.json()) as ApplicationData;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Normalise types defensively — never trust the client.
  const data: ApplicationData = {
    fullName: String(body.fullName ?? ""),
    email: String(body.email ?? ""),
    dob: String(body.dob ?? ""),
    course: String(body.course ?? ""),
    level: String(body.level ?? ""),
    goals: String(body.goals ?? ""),
    schedule: Array.isArray(body.schedule) ? body.schedule.map(String) : [],
    consent: body.consent === true,
    guardianName: String(body.guardianName ?? ""),
    guardianEmail: String(body.guardianEmail ?? ""),
    guardianConsent: body.guardianConsent === true,
    locale: body.locale === "en" ? "en" : "ka",
    website: String(body.website ?? ""),
  };

  // Honeypot: bots fill hidden fields. Pretend success without storing.
  if (data.website) return NextResponse.json({ ok: true, mode: "demo" });

  const errors = validateApplication(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 400 });

  const webhook = process.env.APPLICATIONS_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ ok: true, mode: "demo" });

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.APPLICATIONS_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.APPLICATIONS_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({ ...sanitize(data), submittedAt: new Date().toISOString(), source: "bridge-academy-website" }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ ok: true, mode: "stored" });
  } catch (err) {
    console.error("[apply] backend error:", err);
    return NextResponse.json({ ok: false, error: "backend_failed" }, { status: 502 });
  }
}
