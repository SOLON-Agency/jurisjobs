// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const hook = fileURLToPath(new URL("../../.githooks/pre-commit", import.meta.url));

describe("pre-commit build gate", () => {
  let directory;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), "jurisjobs-pre-commit-"));
    writeFileSync(join(directory, "npm"), `#!/bin/sh
printf 'npm %s\\n' "$*"
exit "$BUILD_EXIT_CODE"
`, { mode: 0o755 });
  });

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  it.each(["0", "42"])("enforces the build result (exit %s), even with SKIP_BUILD=1", (exitCode) => {
    const result = spawnSync("/bin/sh", [hook], {
      cwd: directory,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${directory}:${process.env.PATH}`,
        BUILD_EXIT_CODE: exitCode,
        SKIP_BUILD: "1",
        SKIP_ENV_SYNC: "1",
        SKIP_CODEGEN: "1",
        SKIP_VERCEL_ENV_PULL: "1",
        SKIP_DEPLOY: "1",
        SKIP_MIGRATIONS: "1",
      },
    });

    expect(result.error).toBeUndefined();
    expect(result.stdout.match(/^npm run build$/gm)).toHaveLength(1);
    if (exitCode === "0") {
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Build passed");
      expect(result.stdout).toContain("SKIP_DEPLOY=1");
    } else {
      expect(result.status).toBe(1);
      expect(result.stdout).toContain("Build failed");
      expect(result.stdout).not.toContain("SKIP_DEPLOY=1");
      expect(result.stdout).not.toContain("SKIP_MIGRATIONS=1");
    }
  });
});
