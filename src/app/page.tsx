import { HomeClient } from "@/components/HomeClient";
import { getSiteState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const state = getSiteState();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return <HomeClient state={state} siteUrl={siteUrl} />;
}
