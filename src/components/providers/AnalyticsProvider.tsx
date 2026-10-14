"use client";

import { Analytics } from "@vercel/analytics/next";
import { redactAnalyticsQueryParameters } from "@/lib/vercel-analytics";

export function AnalyticsProvider() {
  return <Analytics beforeSend={redactAnalyticsQueryParameters} />;
}
