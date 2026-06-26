import { NextResponse } from "next/server";
import { addPendingRequest, loadPendingRequests } from "@/lib/storage";

export async function GET() {
  try {
    const data = await loadPendingRequests();
    const pending = data.requests.filter((r) => r.status === "pending");
    return NextResponse.json({ requests: pending });
  } catch {
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; idea?: string };
    const name = body.name?.trim();
    const idea = body.idea?.trim();

    if (!name || !idea) {
      return NextResponse.json(
        { error: "Name and idea are required" },
        { status: 400 },
      );
    }

    if (name.length > 40 || idea.length > 280) {
      return NextResponse.json(
        { error: "Name or idea is too long" },
        { status: 400 },
      );
    }

    const created = await addPendingRequest(name, idea);
    return NextResponse.json({ request: created }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to submit request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
