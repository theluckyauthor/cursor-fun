import type { PendingRequest, PendingRequestsFile, SiteState } from "./types";
import {
  getPendingRequests,
  getSiteState,
  writePendingRequests,
  writeSiteState,
} from "./site-state";
import { DEFAULT_ELEMENTS, DEFAULT_THEME } from "./default-canvas";

const GITHUB_API = "https://api.github.com";
const PENDING_PATH = "data/pending-requests.json";
const STATE_PATH = "data/site-state.json";

function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  return { token, repo };
}

async function readJsonFromGitHub<T>(path: string): Promise<T> {
  const config = githubConfig();
  if (!config) throw new Error("GitHub not configured");

  const res = await fetch(
    `${GITHUB_API}/repos/${config.repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`GitHub read failed: ${res.status}`);
  }

  const body = (await res.json()) as { content: string };
  const content = Buffer.from(body.content, "base64").toString("utf-8");
  return JSON.parse(content) as T;
}

async function writeJsonToGitHub(
  path: string,
  data: unknown,
  message: string,
): Promise<void> {
  const config = githubConfig();
  if (!config) throw new Error("GitHub not configured");

  const getRes = await fetch(
    `${GITHUB_API}/repos/${config.repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    },
  );

  let sha: string | undefined;
  if (getRes.ok) {
    const existing = (await getRes.json()) as { sha: string };
    sha = existing.sha;
  }

  const content = Buffer.from(JSON.stringify(data, null, 2) + "\n").toString(
    "base64",
  );

  const res = await fetch(
    `${GITHUB_API}/repos/${config.repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, content, sha }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${err}`);
  }
}

export async function loadPendingRequests(): Promise<PendingRequestsFile> {
  if (githubConfig()) {
    return readJsonFromGitHub<PendingRequestsFile>(PENDING_PATH);
  }
  return getPendingRequests();
}

export async function addPendingRequest(
  name: string,
  idea: string,
  contact?: string,
): Promise<PendingRequest> {
  const request: PendingRequest = {
    id: crypto.randomUUID(),
    name: name.trim(),
    contact: contact?.trim() || undefined,
    idea: idea.trim(),
    submittedAt: new Date().toISOString(),
    status: "pending",
  };

  if (githubConfig()) {
    const data = await readJsonFromGitHub<PendingRequestsFile>(PENDING_PATH);
    data.requests.push(request);
    await writeJsonToGitHub(
      PENDING_PATH,
      data,
      `Add request from ${request.name}`,
    );
    return request;
  }

  const data = getPendingRequests();
  data.requests.push(request);
  writePendingRequests(data);
  return request;
}

async function loadSiteState(): Promise<SiteState> {
  if (githubConfig()) {
    return readJsonFromGitHub<SiteState>(STATE_PATH);
  }
  return getSiteState();
}

/**
 * Clears the canvas back to the immaculate blank state while preserving the
 * timeline history and contributor wall. Bumps the version and logs the reset.
 */
export async function resetCanvas(): Promise<SiteState> {
  const current = await loadSiteState();
  const nextVersion = current.version + 1;

  const reset: SiteState = {
    ...current,
    version: nextVersion,
    theme: { ...DEFAULT_THEME },
    elements: DEFAULT_ELEMENTS.map((e) => ({ ...e })),
    timeline: [
      ...current.timeline,
      {
        version: nextVersion,
        title: "Canvas reset",
        description: "The canvas was cleared back to a blank slate.",
        timestamp: new Date().toISOString(),
      },
    ],
  };

  if (githubConfig()) {
    await writeJsonToGitHub(STATE_PATH, reset, `Reset canvas (v${nextVersion})`);
  } else {
    writeSiteState(reset);
  }

  return reset;
}
