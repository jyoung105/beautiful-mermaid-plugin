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

2. **Analyze code**: Explore the full codebase to understand its architecture, logic flow, data transformations, and behavior. Use the code-analyzer agent to perform a **deep analysis**:
   - Identify entry points, core business logic modules, and API handlers as primary targets
   - Trace function call chains to at least 3 levels of depth with inputs, outputs, and branching conditions
   - Document every conditional branch (`if/else`, `switch/case`, guard clauses) with actual condition expressions
   - Map data transformation pipelines showing how inputs become outputs at each step
   - Capture loop structures and what they iterate over, accumulate, or transform
   - Document error handling paths (`try/catch`, `.catch()`, fallback logic, retry patterns)
   - Identify state transitions and status progressions
   - Trace async flows (Promise chains, async/await, concurrent operations)
   - Note all side effects (I/O, network calls, database queries, cache operations)
   - Capture business logic decision trees with their conditions
   - For large codebases: prioritize the most critical and complex modules to keep the diagram readable, but still trace their internal logic rather than just showing boxes

3. **Generate Mermaid**: Produce valid Mermaid diagram code (flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, or erDiagram). Use newlines between statements and spaces around arrows (e.g. `A --> B`).
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
