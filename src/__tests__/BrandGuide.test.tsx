import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrandGuide } from "@/app/(public)/brand/BrandGuide";
import { Footer } from "@/components/layout/Footer";

describe("BrandGuide", () => {
  const writeText = vi.fn<(...args: string[]) => Promise<void>>();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private readonly callback: IntersectionObserverCallback) {}

        observe(target: Element) {
          this.callback(
            [{ isIntersecting: true, intersectionRatio: 1, target } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
        }

        unobserve() {}
        disconnect() {}
        takeRecords() { return []; }
      },
    );
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  it("renders the brand palette and Saira typography specimen", () => {
    render(<BrandGuide />);

    expect(screen.getByRole("heading", { name: "O identitate cu rădăcini." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cinci culori. O singură voce." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Saira, cu caracter." })).toBeInTheDocument();
    expect(screen.getByText("#03170c")).toBeInTheDocument();
    expect(screen.getByText("#2d6a4f")).toBeInTheDocument();
  });

  it("copies a palette value and announces confirmation", async () => {
    render(<BrandGuide />);
    fireEvent.click(screen.getByRole("button", { name: "Copiază codul #c3ae61 pentru Auriu" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("#c3ae61"));
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Codul #c3ae61 pentru Auriu a fost copiat.");
    });
  });

  it("changes the specimen weight with keyboard-operable buttons", () => {
    render(<BrandGuide />);
    const selectedWeight = screen.getByRole("button", { name: "600" });
    const heavierWeight = screen.getByRole("button", { name: "800" });

    expect(selectedWeight).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(heavierWeight);
    expect(heavierWeight).toHaveAttribute("aria-pressed", "true");
    expect(selectedWeight).toHaveAttribute("aria-pressed", "false");
  });

  it("links to the brand guide from the public footer", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Identitate de brand" })).toHaveAttribute("href", "/brand");
  });

});
