import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { JJCard } from "@/components/common/JJCard";

describe("JJCard", () => {
  it("renders an outlined card and forwards Paper semantics and children", () => {
    const { container } = render(
      <JJCard component="article" aria-label="Card demo" data-testid="card">
        <h2>Reusable content</h2>
      </JJCard>,
    );

    expect(screen.getByRole("article", { name: "Card demo" })).toHaveTextContent("Reusable content");
    expect(screen.getByTestId("card")).toHaveClass("MuiPaper-outlined");
    expect(container.firstElementChild).toHaveAttribute("data-testid", "card");
  });

  it("accepts custom padding, accent color, and caller sx", () => {
    render(
      <JJCard data-testid="custom-card" padding={4} hoverColor="#c3ae61" sx={{ bgcolor: "rgb(1, 2, 3)" }}>
        Flexible surface
      </JJCard>,
    );

    expect(screen.getByTestId("custom-card")).toHaveClass("MuiPaper-outlined");
  });

  it("supports a static card when the hover treatment is disabled", () => {
    render(<JJCard data-testid="static-card" hoverEffect={false}>Static card</JJCard>);

    expect(screen.getByTestId("static-card")).toHaveClass("MuiPaper-outlined");
  });
});
