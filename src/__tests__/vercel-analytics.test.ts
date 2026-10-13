import { describe, expect, it } from "vitest";
import { redactAnalyticsQueryParameters } from "@/lib/vercel-analytics";

describe("redactAnalyticsQueryParameters", () => {
  it("removes query parameters and fragments from page-view URLs", () => {
    const event = {
      type: "pageview" as const,
      url: "https://legaljobs.ro/auth/callback?code=secret&state=private#token",
    };

    expect(redactAnalyticsQueryParameters(event)).toEqual({
      type: "pageview",
      url: "https://legaljobs.ro/auth/callback",
    });
  });

  it("preserves the route path for URLs without query parameters", () => {
    const event = {
      type: "pageview" as const,
      url: "https://legaljobs.ro/dashboard/profile",
    };

    expect(redactAnalyticsQueryParameters(event)).toEqual(event);
  });

  it("applies the same URL redaction to custom events", () => {
    const event = {
      type: "event" as const,
      url: "https://legaljobs.ro/jobs?filter=private",
    };

    expect(redactAnalyticsQueryParameters(event)).toEqual({
      type: "event",
      url: "https://legaljobs.ro/jobs",
    });
  });
});
