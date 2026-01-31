---
description: Analyze specific files or directories and draw a Mermaid diagram (SVG or ASCII). Default output is SVG; use --ascii for terminal.
---

# Draw Diagram Part

Analyze specific files or directories and generate a Mermaid diagram using beautiful-mermaid. You must provide at least one file or directory path.

## Behavior

1. **Parse arguments**: From `$ARGUMENTS`, interpret:
   - **Required** file paths or directories to analyze (at least one)
   - Optional diagram type (flowchart, sequence, class, state, er)
   - Optional `--ascii` flag for terminal-friendly output (default is SVG)
   - **Reject empty paths**: If no file or directory path is provided in `$ARGUMENTS` (only flags or diagram types, or nothing at all), stop and respond:
     > "This command requires specific file or directory paths. To diagram the full codebase, use `/beautiful-mermaid-plugin:draw-diagram-overview`."

2. **Analyze code**: Read the specified files or explore the given directories to understand structure, data flow, or relationships within that scope. Use the code-analyzer agent if helpful. Focus the analysis on the provided paths only.

3. **Generate Mermaid**: Produce valid Mermaid diagram code (flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, or erDiagram). Use newlines between statements and spaces around arrows (e.g. `A --> B`).

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
