---
description: Analyze the full codebase and draw a Mermaid diagram (SVG or ASCII). Default output is SVG; use --ascii for terminal.
---

# Draw Diagram Overview

Analyze the full codebase and generate a Mermaid diagram using beautiful-mermaid. This command scans the entire project -- do NOT pass specific file or directory paths.

## Behavior

1. **Parse arguments**: From `$ARGUMENTS`, interpret:
   - Optional diagram type (flowchart, sequence, class, state, er)
   - Optional `--ascii` flag for terminal-friendly output (default is SVG)
   - **Reject file/directory paths**: If any argument looks like a file path or directory (contains `/`, `.ts`, `.js`, `.py`, or other file extensions, or matches a known directory in the project), stop and respond:
     > "This command analyzes the full codebase. To diagram specific files or directories, use `/beautiful-mermaid-plugin:draw-diagram-part <paths>`."

2. **Analyze code**: Explore the full codebase to understand its overall structure, data flow, module relationships, and architecture. Use the code-analyzer agent if helpful. Focus on high-level architecture rather than individual file internals.

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
