---
description: Install beautiful-mermaid and verify prerequisites for the mermaid-plugin.
---

# Install Mermaid Prerequisites

Ensure the project has the `beautiful-mermaid` library and a way to run the plugin's TypeScript render script.

## Steps

1. **Check for beautiful-mermaid**: Look at `package.json` for a dependency on `beautiful-mermaid`. If present, skip to step 3.

2. **Install beautiful-mermaid**: Detect the package manager from the project (presence of `package-lock.json`, `bun.lock`, or `pnpm-lock.yaml`) and run:
   - **npm**: `npm install beautiful-mermaid`
   - **bun**: `bun add beautiful-mermaid`
   - **pnpm**: `pnpm add beautiful-mermaid`
   If no lockfile exists, use npm by default.

3. **Ensure TypeScript can run**: The plugin's render script is `skills/draw-beautiful-mermaid/scripts/render.ts`. The user needs one of:
   - `tsx` (recommended): `npm install -D tsx` or `bun add -d tsx` or `pnpm add -D tsx`
   - `ts-node`: already common in TypeScript projects
   - `bun`: can run `.ts` directly
   If none is available, suggest installing `tsx` as a dev dependency.

4. **Verify**: Run a quick render (e.g. minimal diagram) or `node -e "require('beautiful-mermaid')"` (or equivalent) to confirm the package is usable.

Report what was installed or that everything was already in place.
