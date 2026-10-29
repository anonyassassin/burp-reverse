export type ResponseData = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
};

const SECURITY_HEADERS = [
  "content-security-policy",
  "strict-transport-security",
  "x-frame-options",
  "x-content-type-options",
];

export function analyzeHeaders(headers: Record<string, string>): string[] {
  const lower = Object.keys(headers).map((k) => k.toLowerCase());
  return SECURITY_HEADERS.filter((h) => !lower.includes(h)).map(
    (h) => `Missing security header: ${h}`
  );
}

export function checkReflection(payload: string, body: string): string[] {
  if (!payload) return [];
  return body.includes(payload)
    ? ["⚠ Input reflected in response body (possible XSS surface)"]
    : [];
}

export function diffResponses(a: string, b: string): string[] {
  const la = a.split("\n");
  const lb = b.split("\n");
  const out: string[] = [];
  const max = Math.max(la.length, lb.length);
  for (let i = 0; i < max; i++) {
    if (la[i] !== lb[i]) {
      out.push(`L${i + 1}: "${la[i] ?? ""}" → "${lb[i] ?? ""}"`);
      if (out.length >= 50) break;
    }
  }
  return out;
}
