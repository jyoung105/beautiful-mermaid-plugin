---
description: Analyze specific files or directories and draw a Mermaid diagram (SVG or ASCII). Performs deep code analysis including logic flow, branching, and data transformations. Default output is SVG; use --ascii for terminal.
---

# Draw Diagram Part

Analyze specific files or directories and generate a Mermaid diagram using beautiful-mermaid. You must provide at least one file or directory path.

## Behavior

1. **Parse arguments**: From `$ARGUMENTS`, interpret:
   - **Required** file paths or directories to analyze (at least one)
   - Optional diagram type (flowchart, sequence, class, state, er)
   - Optional `--ascii` flag for terminal-friendly output (default is SVG)

   **Mandatory path validation** — BEFORE any analysis:
   - Check that `$ARGUMENTS` contains at least one file or directory path
   - If no path is found (only flags, diagram types, or nothing at all), **STOP immediately** — do NOT invoke the code-analyzer agent, do NOT glob or read any files
   - Respond: "Please specify file or directory paths to analyze. Example: `/beautiful-mermaid-plugin:draw-diagram-part src/auth` or `/beautiful-mermaid-plugin:draw-diagram-part src/server.ts`. For full codebase analysis, use `/beautiful-mermaid-plugin:draw-diagram-overview`."
   - Wait for the user to provide paths before continuing

2. **Analyze code**: Determine the analysis strategy based on scope size.

   ### Single File
   If only one file is provided, use a single code-analyzer agent for deep analysis.

   ### Directory or Multiple Files — Parallel Analysis
   If a directory is provided, or multiple files are specified:

   **Step 2a — Discover files:**
   - Use Glob to find all code files in the provided path(s)
   - Apply the same exclusion patterns defined in the code-analyzer agent: dependency directories (`node_modules/`, `vendor/`, `venv/`, `__pycache__/`, `.pytest_cache/`), build output (`dist/`, `build/`, `.next/`, `.nuxt/`, `out/`, `.output/`), VCS and caches (`.git/`, `.svn/`, `.hg/`, `.turbo/`, `.parcel-cache/`, `.cache/`), coverage (`coverage/`, `.nyc_output/`), binary/non-code files (images, fonts, PDFs), lock files, generated code (`.d.ts`, `.map`)
   - Count total files found

   **Step 2b — Partition:**
   - Group files by subdirectory or logical domain (e.g., controllers together, models together)
   - Choose agent count based on file count:
     - **1–5 files**: 1 code-analyzer agent
     - **6–30 files**: 2–3 code-analyzer agents
     - **31–100 files**: 4–6 code-analyzer agents
     - **100+ files**: Warn the user about scope size, then use 6–10 code-analyzer agents

   **Step 2c — Launch parallel code-analyzer agents:**
   - Create one Task (code-analyzer agent) per partition
   - Launch ALL Tasks in a **single message** with multiple Task tool calls (this runs them in parallel)
   - Each agent receives its specific file list and performs deep analysis:
     - Trace function call chains to at least 3 levels of depth
     - Document every conditional branch with actual condition expressions
     - Map data transformation pipelines
     - Capture loop structures and state transitions
     - Document error handling paths
     - Trace async flows and side effects
     - Capture business logic decision trees
     - Follow critical call chains **one level outside scope** to show system connections

   **Step 2d — Merge results:**
   - Collect the structured analysis from each parallel agent
   - Identify cross-partition dependencies (functions in partition A calling functions in partition B)
   - Create a unified analysis preserving all logic details from each partition

   ### Analysis Quality Requirements (All Strategies)
   Regardless of whether one or many agents are used, maintain deep analysis quality:
   - Every conditional branch with actual condition expressions (not generic labels)
   - Data transformation pipelines traced step-by-step
   - Error paths alongside happy paths
   - Loop structures, state transitions, and async flows captured
   - Business logic decision trees fully documented

3. **Generate Mermaid**: Using the analysis (merged from parallel agents if applicable), produce valid Mermaid diagram code (flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, or erDiagram). Use newlines between statements and spaces around arrows (e.g. `A --> B`).
   - Use descriptive node labels that explain what each step does (not just function names)
   - Include actual condition expressions on decision branches (e.g. `-- user.role === 'admin' -->`), not generic labels like "check condition"
   - Use subgraph groupings for logical sections (e.g. `subgraph Error Handling`)
   - Add notes for data transformations and complex logic
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
