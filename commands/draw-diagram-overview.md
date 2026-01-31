---
description: Analyze the full codebase and draw a Mermaid diagram (SVG or ASCII). Performs deep code analysis including logic flow, branching, and data transformations. Default output is SVG; use --ascii for terminal.
---

# Draw Diagram Overview

Analyze the full codebase and generate a Mermaid diagram using beautiful-mermaid. This command scans the entire project -- do NOT pass specific file or directory paths.

## Behavior

1. **Parse arguments**: From `$ARGUMENTS`, interpret:
   - Optional diagram type (flowchart, sequence, class, state, er)
   - Optional `--ascii` flag for terminal-friendly output (default is SVG)
   - **Reject file/directory paths**: If any argument looks like a file path or directory (contains `/`, `.ts`, `.js`, `.py`, or other file extensions, or matches a known directory in the project), stop and respond:
     > "This command analyzes the full codebase. To diagram specific files or directories, use `/beautiful-mermaid-plugin:draw-diagram-part <paths>`."

2. **Analyze code**: Use parallel analysis to explore the full codebase efficiently.

   **Step 2a — Discover project structure:**
   - Use Glob to find all code files in the project
   - Apply the same exclusion patterns defined in the code-analyzer agent: dependency directories (`node_modules/`, `vendor/`, `venv/`, `__pycache__/`, `.pytest_cache/`), build output (`dist/`, `build/`, `.next/`, `.nuxt/`, `out/`, `.output/`), VCS and caches (`.git/`, `.svn/`, `.hg/`, `.turbo/`, `.parcel-cache/`, `.cache/`), coverage (`coverage/`, `.nyc_output/`), binary/non-code files (images, fonts, PDFs), lock files, generated code (`.d.ts`, `.map`)
   - Identify primary modules, packages, or feature directories
   - Count total files

   **Step 2b — Partition by module/domain:**
   - Group files by top-level directory, package, or domain (e.g., `src/auth/`, `src/api/`, `src/database/`)
   - Choose partition count based on total file count:
     - **1–15 files**: 2–3 partitions
     - **16–60 files**: 3–5 partitions
     - **61–150 files**: 5–8 partitions
     - **150+ files**: 8–10 partitions (warn user about scope size)
   - For very large codebases (200+ files), focus partitions on:
     1. Entry points (`main`, `index`, `server`, `app`)
     2. Core business logic modules
     3. API handlers and routes
     4. Data models and database layer
     5. Critical utility modules
   - Each partition should be a cohesive module or domain

   **Step 2c — Launch parallel code-analyzer agents:**
   - Create one Task (code-analyzer agent) per partition
   - Launch ALL Tasks in a **single message** with multiple Task tool calls (this runs them in parallel)
   - Each agent analyzes its assigned module/domain with deep analysis:
     - Identify entry points and core business logic within the module
     - Trace function call chains to at least 3 levels of depth
     - Document every conditional branch with actual condition expressions
     - Map data transformation pipelines
     - Capture loop structures and state transitions
     - Document error handling paths
     - Trace async flows and side effects
     - Capture business logic decision trees
     - Note inter-module dependencies (calls to code outside this partition)

   **Step 2d — Merge analysis results:**
   - Collect the structured analysis from each parallel agent
   - Identify cross-module interactions and dependencies
   - Create a unified analysis showing:
     - High-level module structure and relationships
     - Entry points and main flow paths
     - Critical business logic with detailed internal flows
     - Data flow across module boundaries
     - Error handling strategies

   **Step 2e — Prioritize for diagram readability:**
   - For large codebases, focus the final diagram on system architecture and critical detailed flows
   - Still include internal logic detail for selected critical paths (not just boxes)
   - Trace the most complex and important modules in full detail

3. **Generate Mermaid**: Using the unified analysis (merged from parallel agents), produce valid Mermaid diagram code (flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, or erDiagram). Use newlines between statements and spaces around arrows (e.g. `A --> B`).
   - Use descriptive node labels that explain what each step does (not just function names)
   - Include actual condition expressions on decision branches (e.g. `-- user.role === 'admin' -->`)
   - Use subgraph groupings to organize modules and logical sections
   - Add notes for complex data transformations
   - Include both happy-path and error-path flows

4. **Render**: Use the diagram-renderer agent or the plugin's render script at `skills/draw-beautiful-mermaid/scripts/render.ts`:
   - **Default (SVG)**: Render to an `.svg` file. Suggest a descriptive filename or use the format-filename command.
   - **ASCII**: If `--ascii` or "ascii" appears in arguments, render to ASCII/Unicode and output to terminal or a `.txt` file.

5. **Output**: Save the file in the project (e.g. `docs/` or project root) and confirm the path to the user.

## Render script usage

From the project root, with the plugin loaded from path `PLUGIN_PATH` (e.g. `./beautiful-mermaid-plugin` when using `--plugin-dir`):

```bash
# SVG (default)
npx tsx PLUGIN_PATH/skills/draw-beautiful-mermaid/scripts/render.ts --input "<mermaid code or .mmd file>" --output diagram.svg --theme tokyo-night

# ASCII
npx tsx PLUGIN_PATH/skills/draw-beautiful-mermaid/scripts/render.ts --input "<mermaid code or .mmd file>" --output diagram.txt --ascii
```

Ensure `beautiful-mermaid` is installed in the project (use `/beautiful-mermaid-plugin:install-mermaid` if needed).
