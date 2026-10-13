import type { BeforeSendEvent } from "@vercel/analytics/next";

/** Keep page paths for analytics while excluding potentially sensitive query values. */
export function redactAnalyticsQueryParameters(
  event: BeforeSendEvent,
): BeforeSendEvent {
  const [url] = event.url.split(/[?#]/, 1);

  return {
    ...event,
    url: url ?? event.url,
  };
}
