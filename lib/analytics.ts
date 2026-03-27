export function trackEvent(event: string, metadata?: Record<string, unknown>) {
  try {
    import("./api-config").then(({ BASE_URL }) => {
      fetch(`${BASE_URL}/api/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, ...metadata }),
      }).catch(() => {});
    }).catch(() => {});
  } catch {}
}
