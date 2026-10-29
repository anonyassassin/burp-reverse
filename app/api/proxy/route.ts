import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url, method, headers, body } = payload || {};

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url, {
      method: method || "GET",
      headers: headers || {},
      body: method && method !== "GET" ? body : undefined,
      redirect: "manual",
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    const text = await res.text();
    const resHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      resHeaders[k] = v;
    });

    return NextResponse.json({
      status: res.status,
      statusText: res.statusText || "",
      headers: resHeaders,
      body: text.slice(0, 20000),
    });
  } catch (e: any) {
    const msg = e?.name === "AbortError" ? "Request timed out (12s)" : e?.message || "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
