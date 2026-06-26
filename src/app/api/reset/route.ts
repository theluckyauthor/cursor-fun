import { NextResponse } from "next/server";
import { resetCanvas } from "@/lib/storage";

function isAuthorized(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return true;
  const provided = request.headers.get("x-admin-token");
  return provided === expected;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const state = await resetCanvas();
    return NextResponse.json({ ok: true, version: state.version });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to reset canvas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
