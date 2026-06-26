import type { PendingRequest, PendingRequestsFile } from "./types";
import { getPendingRequests, writePendingRequests } from "./site-state";

const GITHUB_API = "https://api.github.com";

function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  return { token, repo };
}

async function readFromGitHub(): Promise<PendingRequestsFile> {
  const config = githubConfig();
  if (!config) throw new Error("GitHub not configured");

  const res = await fetch(
    `${GITHUB_API}/repos/${config.repo}/contents/data/pending-requests.json`,
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

  const body = (await res.json()) as { content: string; sha: string };
  const content = Buffer.from(body.content, "base64").toString("utf-8");
  return JSON.parse(content) as PendingRequestsFile;
}

async function writeToGitHub(data: PendingRequestsFile): Promise<void> {
  const config = githubConfig();
  if (!config) throw new Error("GitHub not configured");

  const getRes = await fetch(
    `${GITHUB_API}/repos/${config.repo}/contents/data/pending-requests.json`,
    {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
      },
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
    `${GITHUB_API}/repos/${config.repo}/contents/data/pending-requests.json`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add request from ${data.requests.at(-1)?.name ?? "visitor"}`,
        content,
        sha,
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${err}`);
  }
}

export async function loadPendingRequests(): Promise<PendingRequestsFile> {
  if (githubConfig()) {
    return readFromGitHub();
  }
  return getPendingRequests();
}

export async function addPendingRequest(
  name: string,
  idea: string,
): Promise<PendingRequest> {
  const request: PendingRequest = {
    id: crypto.randomUUID(),
    name: name.trim(),
    idea: idea.trim(),
    submittedAt: new Date().toISOString(),
    status: "pending",
  };

  if (githubConfig()) {
    const data = await readFromGitHub();
    data.requests.push(request);
    await writeToGitHub(data);
    return request;
  }

  const data = getPendingRequests();
  data.requests.push(request);
  writePendingRequests(data);
  return request;
}

