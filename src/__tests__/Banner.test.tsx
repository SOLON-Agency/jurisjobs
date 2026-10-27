import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { JJBanner } from "@/components/common/JJBanner";

describe("JJBanner", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders an accessible CTA section with descriptive links", () => {
    render(
      <JJBanner
        title="Hai pe JurisJobs"
        description="Recrutare juridică într-un singur loc."
        actions={[
          { label: "Postează un anunț", href: "/anunt" },
          { label: "Explorează anunțuri", href: "/jobs", variant: "outlined", endIcon: null },
        ]}
      />
    );

    expect(screen.getByRole("region", { name: "Hai pe JurisJobs" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Postează un anunț" })).toHaveAttribute("href", "/anunt");
    expect(screen.getByRole("link", { name: "Explorează anunțuri" })).toHaveAttribute("href", "/jobs");
  });

  it("renders contextual notices with their requested live-region role", () => {
    render(
      <JJBanner variant="notice" severity="warning" role="status">
        Verifică adresa de e-mail.
      </JJBanner>
    );

    expect(screen.getByRole("status")).toHaveTextContent("Verifică adresa de e-mail.");
  });
});
