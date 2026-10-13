import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Analytics } from "@vercel/analytics/next";
import { VercelAnalytics } from "@/components/providers/VercelAnalytics";
import { redactAnalyticsQueryParameters } from "@/lib/vercel-analytics";

vi.mock("@vercel/analytics/next", () => ({
  Analytics: vi.fn(() => null),
}));

describe("VercelAnalytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("owns the callback in a client boundary while the root layout stays server-side", () => {
    const wrapper = readFileSync(
      resolve("src/components/providers/VercelAnalytics.tsx"),
      "utf8",
    );
    const layout = readFileSync(resolve("src/app/layout.tsx"), "utf8");

    expect(wrapper).toMatch(/^\s*["']use client["'];/);
    expect(layout).not.toContain("use client");
    expect(layout).not.toContain("beforeSend");
    expect(layout).not.toContain("redactAnalyticsQueryParameters");
    expect(layout).toContain("<VercelAnalytics />");
  });

  it("renders Analytics with the existing redaction callback", () => {
    const { container } = render(<VercelAnalytics />);
    const props = vi.mocked(Analytics).mock.calls[0]?.[0];

    expect(container).toBeEmptyDOMElement();
    expect(Analytics).toHaveBeenCalledOnce();
    expect(props?.beforeSend).toBe(redactAnalyticsQueryParameters);
    expect(props?.beforeSend?.({
      type: "pageview",
      url: "https://legaljobs.ro/auth/callback?code=secret#token",
    })).toEqual({
      type: "pageview",
      url: "https://legaljobs.ro/auth/callback",
    });
  });
});
