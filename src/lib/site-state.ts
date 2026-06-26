import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { PendingRequestsFile, SiteState } from "./types";

const dataDir = join(process.cwd(), "data");

export function getSiteState(): SiteState {
  const raw = readFileSync(join(dataDir, "site-state.json"), "utf-8");
  return JSON.parse(raw) as SiteState;
}

export function writeSiteState(state: SiteState): void {
  writeFileSync(
    join(dataDir, "site-state.json"),
    JSON.stringify(state, null, 2) + "\n",
    "utf-8",
  );
}

export function getPendingRequests(): PendingRequestsFile {
  const raw = readFileSync(join(dataDir, "pending-requests.json"), "utf-8");
  return JSON.parse(raw) as PendingRequestsFile;
}

export function writePendingRequests(data: PendingRequestsFile): void {
  writeFileSync(
    join(dataDir, "pending-requests.json"),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8",
  );
}
