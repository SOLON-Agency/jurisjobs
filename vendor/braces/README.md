# Local `braces` dependency patch

This directory contains `braces` 3.0.3 (MIT licensed) with a 128-level nesting
guard at parse and AST entry points. The local package version is
`3.0.4-jurisjobs.1`. It mitigates [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm),
which has no published upstream patch as of 2026-10-13.

The root `package.json` overrides transitive `braces` requests to the adjacent
`braces-3.0.4-jurisjobs.1.tgz` tarball, packed from this source directory.
Keep the override until an upstream patched release is available and verified.
When removing it, rerun `npm audit`, lint, unit tests, and the production build.
