import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { JJButton } from "@/components/common/JJButton";
import { JJIconButton } from "@/components/common/JJIconButton";

function JJTestIcon() {
  return <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg>;
}

describe("shared JJ buttons", () => {
  it("preserves button semantics and labels for primary and secondary actions", () => {
    render(
      <>
        <JJButton appearance="primary" type="submit">Salvează</JJButton>
        <JJButton appearance="secondary" variant="outlined" onClick={() => undefined}>
          Resetează filtrele
        </JJButton>
      </>
    );

    expect(screen.getByRole("button", { name: "Salvează" })).toHaveAttribute("type", "submit");
    expect(screen.getByRole("button", { name: "Resetează filtrele" })).toBeInTheDocument();
  });

  it("renders accessible icon-only actions", () => {
    render(
      <JJIconButton aria-label="Editează profilul">
        <JJTestIcon />
      </JJIconButton>
    );

    expect(screen.getByRole("button", { name: "Editează profilul" })).toBeInTheDocument();
  });
});
