const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts?|messages?)/i,
  /disregard\s+(all\s+)?(previous|prior|above)/i,
  /forget\s+(everything|all|previous|prior)/i,
  /\b(system|developer)\s*(prompt|message|role)\b/i,
  /you\s+are\s+now\s+(a|an|the)\b/i,
  /\bact\s+as\s+(a|an|if)\b/i,
  /\bpretend\s+(to\s+be|you\s+are)\b/i,
  /<\s*\/?\s*(system|assistant|user|tool)\b/i,
  /\[\s*(system|assistant|inst|\/inst)\s*\]/i,
  /\b(reveal|print|show|output|leak)\s+(your|the)\s+(system\s+)?(prompt|instructions?|rules?)/i,
  /override\s+(your|the|all)\s+(instructions?|rules?|settings?)/i,
  /new\s+instructions?\s*:/i,
  /\bdo\s+anything\s+now\b/i,
  /\bjailbreak\b/i,
];

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export interface SanitizeResult {
  ok: boolean;
  value: string;
  reason?: string;
}

/**
 * Cleans visitor text and rejects content that looks like an attempt to
 * hijack the Cloud Agent that later reads these requests. We strip control
 * characters, collapse whitespace, and block known injection phrasings.
 */
export function sanitizeIdea(raw: string): SanitizeResult {
  const stripped = raw.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim();

  if (stripped.length === 0) {
    return { ok: false, value: "", reason: "Please write an actual idea." };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(stripped)) {
      return {
        ok: false,
        value: stripped,
        reason:
          "That looks like an instruction to the system, not a canvas idea. Try describing something to add!",
      };
    }
  }

  const backtickRuns = stripped.match(/`{3,}/g);
  if (backtickRuns) {
    return {
      ok: false,
      value: stripped,
      reason: "Please keep ideas to plain text (no code fences).",
    };
  }

  return { ok: true, value: stripped };
}

export function sanitizeName(raw: string): SanitizeResult {
  const stripped = raw.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim();
  if (stripped.length === 0) {
    return { ok: false, value: "", reason: "Please add your name." };
  }
  return { ok: true, value: stripped };
}

export function sanitizeContact(raw: string): SanitizeResult {
  const stripped = raw.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim();
  return { ok: true, value: stripped };
}
