import { NextResponse } from "next/server";
import { getSiteState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = getSiteState();
    return NextResponse.json(
      { version: state.version },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Failed to load version" }, { status: 500 });
  }
}
