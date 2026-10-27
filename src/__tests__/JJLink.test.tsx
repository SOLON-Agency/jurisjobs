import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { JJLink } from "@/components/common/JJLink";

describe("JJLink", () => {
  it("renders internal links with jj-link class and href", () => {
    render(<JJLink href="/register">Creează unul</JJLink>);
    const link = screen.getByRole("link", { name: "Creează unul" });
    expect(link).toHaveAttribute("href", "/register");
    expect(link).toHaveClass("jj-link");
  });

  it("announces external links opening in a new tab", () => {
    render(<JJLink href="https://example.com">Site extern</JJLink>);
    const link = screen.getByRole("link", {
      name: /Site extern.*se deschide în tab nou/,
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer nofollow");
  });

  it("renders mailto links without new-tab screen reader suffix", () => {
    render(<JJLink href="mailto:test@example.com">test@example.com</JJLink>);
    const link = screen.getByRole("link", { name: "test@example.com" });
    expect(link).toHaveAttribute("href", "mailto:test@example.com");
    expect(link).not.toHaveAttribute("target");
  });
});
