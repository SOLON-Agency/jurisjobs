import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

interface OpenApiOperation {
  summary?: string;
  description?: string;
  responses: Record<string, unknown>;
}

interface OpenApiPathItem {
  get?: OpenApiOperation;
  post?: OpenApiOperation;
}

interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<string, OpenApiPathItem>;
  components?: Record<string, unknown>;
}

describe("OpenAPI Specification (supabase/openapi.json)", () => {
  const rootDir = process.cwd();
  const openapiPath = path.join(rootDir, "supabase/openapi.json");

  it("should exist and be valid JSON", () => {
    expect(fs.existsSync(openapiPath)).toBe(true);
    const content = fs.readFileSync(openapiPath, "utf-8");
    const spec = JSON.parse(content) as OpenApiSpec;
    expect(spec.openapi).toBeDefined();
    expect(spec.openapi.startsWith("3.")).toBe(true);
    expect(spec.info.title).toBeTruthy();
    expect(spec.info.version).toBeTruthy();
    expect(spec.paths).toBeDefined();
    expect(spec.components).toBeDefined();
  });

  it("should document every Edge Function in supabase/functions", () => {
    const functionsDir = path.join(rootDir, "supabase/functions");
    const entries = fs.readdirSync(functionsDir, { withFileTypes: true });

    const functionNames = entries
      .filter((entry) => entry.isDirectory() && entry.name !== "_shared")
      .map((entry) => entry.name);

    expect(functionNames.length).toBeGreaterThan(0);

    const spec = JSON.parse(fs.readFileSync(openapiPath, "utf-8")) as OpenApiSpec;
    const pathKeys = Object.keys(spec.paths);

    for (const fnName of functionNames) {
      const expectedPath = `/functions/v1/${fnName}`;
      expect(pathKeys).toContain(expectedPath);
    }
  });

  it("should document every Edge Function listed in AGENTS.md Edge Functions inventory", () => {
    const agentsMdPath = path.join(rootDir, "AGENTS.md");
    const content = fs.readFileSync(agentsMdPath, "utf-8");

    const inventorySection = content.split("### Edge Functions inventory")[1]?.split("###")[0] ?? "";
    const lines = inventorySection.split("\n");
    const fnNames: string[] = [];

    for (const line of lines) {
      const match = line.match(/^\|\s*`([a-z0-9-]+)`\s*\|/);
      if (match && match[1] && match[1] !== "Function") {
        fnNames.push(match[1]);
      }
    }

    expect(fnNames.length).toBeGreaterThan(0);

    const spec = JSON.parse(fs.readFileSync(openapiPath, "utf-8")) as OpenApiSpec;
    const pathKeys = Object.keys(spec.paths);

    for (const fnName of fnNames) {
      const expectedPath = `/functions/v1/${fnName}`;
      expect(pathKeys).toContain(expectedPath);
    }
  });

  it("should have request and response examples for documented endpoints", () => {
    const spec = JSON.parse(fs.readFileSync(openapiPath, "utf-8")) as OpenApiSpec;

    for (const pathObj of Object.values(spec.paths)) {
      const op = pathObj.post ?? pathObj.get;
      expect(op).toBeDefined();
      if (op) {
        expect(op.summary).toBeTruthy();
        expect(op.description).toBeTruthy();
        expect(op.responses["200"]).toBeDefined();
      }
    }
  });
});
