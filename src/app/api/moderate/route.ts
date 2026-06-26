import { NextResponse } from "next/server";
import { rejectRequest, removeElement } from "@/lib/storage";

function isAuthorized(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return true;
  const provided = request.headers.get("x-admin-token");
  return provided === expected;
}

type ModerateBody =
  | { action: "hide-element"; elementId: string }
  | { action: "reject-request"; requestId: string };

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ModerateBody;
  try {
    body = (await request.json()) as ModerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    switch (body.action) {
      case "hide-element": {
        if (!body.elementId) {
          return NextResponse.json(
            { error: "elementId is required" },
            { status: 400 },
          );
        }
        const state = await removeElement(body.elementId);
        return NextResponse.json({ ok: true, version: state.version });
      }
      case "reject-request": {
        if (!body.requestId) {
          return NextResponse.json(
            { error: "requestId is required" },
            { status: 400 },
          );
        }
        await rejectRequest(body.requestId);
        return NextResponse.json({ ok: true });
      }
      default: {
        const _exhaustive: never = body;
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 },
        );
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Moderation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
