import { StudioClient } from "@/components/StudioClient";
import { getSiteState } from "@/lib/site-state";
import { loadPendingRequests } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const state = getSiteState();
  const pending = await loadPendingRequests();

  return (
    <StudioClient
      version={state.version}
      requests={pending.requests.filter((r) => r.status === "pending")}
    />
  );
}
