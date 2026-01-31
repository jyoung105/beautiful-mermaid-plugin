---
description: Generate a descriptive filename for diagram output (SVG or ASCII).
---

# Format Filename

Generate a clear, consistent filename for saving a diagram produced by the mermaid-plugin.

## Behavior

1. **Parse $ARGUMENTS**: Optional context (e.g. "auth-flow", "api"), optional diagram type (e.g. "flowchart", "sequence"), optional extension hint ("svg" or "txt"/"ascii"). If omitted, use sensible defaults.

2. **Pattern**: Use:
   - `{context}-{diagram-type}-{timestamp}.{ext}`
   - **context**: From arguments or infer from recent conversation (e.g. "auth", "user-service"). Default: "diagram".
   - **diagram-type**: flowchart, sequence, class, state, er. Default: "flowchart".
   - **timestamp**: Compact date-time, e.g. `20250131-143022` (YYYYMMDD-HHMMSS) or omit if user prefers simpler names.
   - **ext**: `svg` for SVG output, `txt` for ASCII output.

3. **Output**: Propose the filename (e.g. `auth-flow-sequence-20250131.svg` or `user-service-flowchart.txt`) and optionally a suggested directory (e.g. `docs/diagrams/`). If the user asked for a path only, return the path; otherwise state the suggested filename and that it can be used as the `--output` value for the render script.

## Examples

- No args → `diagram-flowchart.svg` (or with timestamp)
- "api sequence" → `api-sequence.svg`
- "state ascii" → `state-state.txt` or `diagram-state.txt`
