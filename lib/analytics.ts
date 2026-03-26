export function trackEvent(event: string, metadata?: Record<string, unknown>) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...metadata }),
    }).catch(() => {});
  } catch {}
}
