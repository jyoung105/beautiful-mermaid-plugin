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
   - **Ask for paths if missing**: If no file or directory path is provided in `$ARGUMENTS` (only flags or diagram types, or nothing at all), ask the user which files or directories they want to analyze before proceeding. Mention that `/beautiful-mermaid-plugin:draw-diagram-overview` is available for full codebase diagrams.

2. **Analyze code**: Read the specified files or explore the given directories using the code-analyzer agent to perform a **deep analysis**:
   - Trace function call chains to at least 3 levels of depth
   - Document every conditional branch (`if/else`, `switch/case`, guard clauses) with the actual condition expressions (e.g. `user.role === 'admin'`), not generic labels
   - Map data transformation pipelines showing how inputs become outputs at each step
   - Capture loop structures and what they iterate over, accumulate, or transform
   - Document error handling paths (`try/catch`, `.catch()`, error propagation, fallback logic, retry patterns)
   - Identify state transitions and status progressions
   - Trace async flows (Promise chains, async/await sequences, concurrent operations)
   - Note all side effects (I/O, network calls, database queries, cache operations)
   - Capture business logic decision trees with their conditions
   - Follow critical call chains **one level outside the provided scope** if needed to show how the code connects to the rest of the system

3. **Generate Mermaid**: Produce valid Mermaid diagram code (flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, or erDiagram). Use newlines between statements and spaces around arrows (e.g. `A --> B`).
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
