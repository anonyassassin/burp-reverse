"use client";
import { useState } from "react";
import {
  analyzeHeaders,
  checkReflection,
  diffResponses,
  type ResponseData,
} from "@/lib/analyze";

export default function Home() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [method, setMethod] = useState("GET");
  const [payload, setPayload] = useState('{"title":"reqLab","body":"hello","userId":1}');
  const [res, setRes] = useState<ResponseData | null>(null);
  const [prev, setPrev] = useState<ResponseData | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [diff, setDiff] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    setHints([]);
    setDiff([]);
    try {
      const r = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          method,
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: method !== "GET" ? payload : undefined,
        }),
      });

      if (!r.ok) {
        const t = await r.text();
        setHints([`Proxy returned ${r.status}: ${t.slice(0, 200)}`]);
        return;
      }

      const data = await r.json();
      if (data.error) {
        setHints([`Error: ${data.error}`]);
        return;
      }

      if (res) setPrev(res);
      setRes(data as ResponseData);

      const h = [
        ...analyzeHeaders(data.headers || {}),
        ...checkReflection(payload, data.body || ""),
      ];
      setHints(h.length ? h : ["No obvious issues detected."]);

      if (res) setDiff(diffResponses(res.body, data.body));
    } catch (e: any) {
      setHints([`Client error: ${e?.message || String(e)}`]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="wrap">
      <header>
        <h1>ReqLab</h1>
        <span className="badge">HTTP Inspector</span>
      </header>

      <section className="card">
        <h2>Request</h2>
        <div className="row">
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {["GET", "POST", "PUT", "DELETE"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <input value={url} onChange={(e) => setUrl(e.target.value)} />
          <button onClick={send} disabled={loading}>
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
        {method !== "GET" && (
          <textarea
            placeholder='{"key":"value"}'
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={4}
          />
        )}
      </section>

      <div className="grid">
        <section className="card">
          <h2>Response</h2>
          {res ? (
            <>
              <div className="status">
                {res.status} {res.statusText}
              </div>
              <details open>
                <summary>Headers</summary>
                <pre>{JSON.stringify(res.headers, null, 2)}</pre>
              </details>
              <details open>
                <summary>Body</summary>
                <pre>{res.body}</pre>
              </details>
            </>
          ) : (
            <p className="muted">Send a request to inspect the response.</p>
          )}
        </section>

        <section className="card">
          <h2>Hints</h2>
          <ul>
            {hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
            {!hints.length && <li className="muted">—</li>}
          </ul>

          <h2 style={{ marginTop: 16 }}>Diff vs previous</h2>
          {diff.length ? (
            <pre className="diff">{diff.join("\n")}</pre>
          ) : (
            <p className="muted">Send twice to compare.</p>
          )}
        </section>
      </div>
    </main>
  );
}
