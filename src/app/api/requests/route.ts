import { NextResponse } from "next/server";
import { addPendingRequest, loadPendingRequests } from "@/lib/storage";
import { sanitizeContact, sanitizeIdea, sanitizeName } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    const data = await loadPendingRequests();
    const pending = data.requests.filter((r) => r.status === "pending");
    return NextResponse.json({ requests: pending });
  } catch {
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 });
  }
}

function clientId(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "anonymous";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      idea?: string;
      contact?: string;
    };

    const name = sanitizeName(body.name ?? "");
    if (!name.ok) {
      return NextResponse.json({ error: name.reason }, { status: 400 });
    }

    const idea = sanitizeIdea(body.idea ?? "");
    if (!idea.ok) {
      return NextResponse.json({ error: idea.reason }, { status: 400 });
    }

    const contact = sanitizeContact(body.contact ?? "");

    if (name.value.length > 40) {
      return NextResponse.json({ error: "Name is too long" }, { status: 400 });
    }
    if (idea.value.length > 280) {
      return NextResponse.json({ error: "Idea is too long" }, { status: 400 });
    }
    if (contact.value.length > 80) {
      return NextResponse.json({ error: "Contact is too long" }, { status: 400 });
    }

    const limit = checkRateLimit(clientId(request));
    if (!limit.allowed) {
      const mins = Math.ceil(limit.retryAfterMs / 60000);
      return NextResponse.json(
        { error: `Easy there! Try again in about ${mins} minute(s).` },
        { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } },
      );
    }

    const created = await addPendingRequest(name.value, idea.value, contact.value);
    return NextResponse.json({ request: created }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to submit request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
