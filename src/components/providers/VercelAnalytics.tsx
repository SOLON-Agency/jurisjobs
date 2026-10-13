"use client";

import { Analytics } from "@vercel/analytics/next";
import { redactAnalyticsQueryParameters } from "@/lib/vercel-analytics";

/** Keep the beforeSend callback inside the client boundary. */
export function VercelAnalytics() {
  return <Analytics beforeSend={redactAnalyticsQueryParameters} />;
}
