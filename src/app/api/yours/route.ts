import { NextResponse } from "next/server";
import { findContributor } from "@/lib/agent-prompt";
import { getSiteState } from "@/lib/site-state";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return NextResponse.json(
      { error: "name query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const state = getSiteState();
    const contributor = findContributor(state.contributors, name);

    if (!contributor) {
      return NextResponse.json({ name, prompts: [] });
    }

    const prompts = contributor.prompts
      .filter((p) => p.version != null)
      .sort((a, b) => (b.version ?? 0) - (a.version ?? 0));

    return NextResponse.json({
      name: contributor.name,
      contact: contributor.contact,
      prompts,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load shipments" }, { status: 500 });
  }
}
