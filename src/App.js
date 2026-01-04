// src/App.js
import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState(null);
  const [serverMsg, setServerMsg] = useState(null);

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const [loadingHealth, setLoadingHealth] = useState(true);
  const [loadingServerMsg, setLoadingServerMsg] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState(null);

  const API_BASE = (process.env.REACT_APP_API_BASE || "https://api.ruudjuffermans.nl").replace(/\/$/, "");

  const endpoints = useMemo(
    () => ({
      health: `${API_BASE}/health`,
      serverMessage: `${API_BASE}/servermessage`,
      listMessages: `${API_BASE}/dbmessages`,
      createMessage: `${API_BASE}/dbmessage`,
    }),
    [API_BASE]
  );
  const safeJson = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(
        `Expected JSON but got "${contentType || "unknown"}". First 120 chars: ${text.slice(
          0,
          120
        )}`
      );
    }
    return res.json();
  };

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch(endpoints.health);
      if (!res.ok) throw new Error(`Health HTTP ${res.status}`);
      const data = await safeJson(res);
      setHealth(data);
    } catch (e) {
      setError((prev) => prev || e.message);
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchServerMsg = async () => {
    setLoadingServerMsg(true);
    try {
      const res = await fetch(endpoints.serverMessage);
      if (!res.ok) throw new Error(`Server message HTTP ${res.status}`);
      const data = await safeJson(res);
      setServerMsg(data);
    } catch (e) {
      setError((prev) => prev || e.message);
    } finally {
      setLoadingServerMsg(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch(endpoints.listMessages);
      if (!res.ok) throw new Error(`List messages HTTP ${res.status}`);
      const data = await safeJson(res);
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError((prev) => prev || e.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  const createMessage = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = content.trim();
    if (!trimmed) {
      setError("Please enter a message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(endpoints.createMessage, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!res.ok) {
        const maybeJson = await res.text();
        throw new Error(`Create message HTTP ${res.status}: ${maybeJson.slice(0, 200)}`);
      }

      const created = await safeJson(res);
      setContent("");

      // Optimistic prepend
      setMessages((prev) => [created, ...prev]);

      // Optional: re-fetch to ensure order/consistency
      // await fetchMessages();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Load everything on first render
    fetchHealth();
    fetchServerMsg();
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>CRA + Express + Postgres</h1>

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      <section style={{ marginTop: 20 }}>
        <h2>Service Status</h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, minWidth: 260 }}>
            <h3 style={{ marginTop: 0 }}>Health</h3>
            {loadingHealth ? (
              <p>Loading…</p>
            ) : health ? (
              <>
                <p>
                  <strong>status:</strong> {health.status}
                </p>
                <p>
                  <strong>db:</strong> {health.db}
                </p>
              </>
            ) : (
              <p>Unavailable</p>
            )}
            <button onClick={fetchHealth} style={{ marginTop: 8 }}>
              Refresh
            </button>
          </div>

          <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, minWidth: 260 }}>
            <h3 style={{ marginTop: 0 }}>Server message</h3>
            {loadingServerMsg ? (
              <p>Loading…</p>
            ) : serverMsg ? (
              <>
                <p>{serverMsg.message}</p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>{serverMsg.timestamp}</p>
              </>
            ) : (
              <p>Unavailable</p>
            )}
            <button onClick={fetchServerMsg} style={{ marginTop: 8 }}>
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>Messages (Postgres)</h2>

        <form onSubmit={createMessage} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a message…"
            style={{ flex: 1, padding: 10 }}
            disabled={submitting}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Add"}
          </button>
          <button type="button" onClick={fetchMessages} disabled={loadingMessages || submitting}>
            Refresh
          </button>
        </form>

        {loadingMessages ? (
          <p>Loading messages…</p>
        ) : messages.length === 0 ? (
          <p>No messages yet. Add one above.</p>
        ) : (
          <div style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: 12,
                  borderTop: "1px solid #eee",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>#{m.id}</strong>
                  <span style={{ fontSize: 12, opacity: 0.75 }}>
                    {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                  </span>
                </div>
                <div style={{ marginTop: 6 }}>{m.content}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 28, fontSize: 12, opacity: 0.8 }}>
        <p>
          Notes: This frontend uses relative URLs (<code>/dbmessages</code>, <code>/dbmessage</code>)
          so it works behind Dokploy/Traefik without CORS. If you route the API under <code>/api</code>
          later, adjust the endpoint paths accordingly.
        </p>
      </section>
    </div>
  );
}

export default App;
