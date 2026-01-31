---
name: draw-beautiful-mermaid
description: Generates beautiful, themeable Mermaid diagrams (SVG/ASCII) using the beautiful-mermaid library. Handles installation and rendering.
---

# Draw Beautiful Mermaid

This skill allows you to render Mermaid diagrams as high-quality SVGs or ASCII art using the `beautiful-mermaid` library. It is designed to replace default, plain Mermaid rendering with visually superior, themed output.

## Installation Check

Before rendering, always check if `beautiful-mermaid` is installed in the user's project.

1.  Check `package.json` for `beautiful-mermaid`.
2.  If missing, ask the user or install it:
    ```bash
    npm install beautiful-mermaid
    # or
    bun add beautiful-mermaid
    # or
    pnpm add beautiful-mermaid
    ```

## Usage

### 1. Using the Helper Script

This skill provides a helper script `scripts/render.ts` to quickly render diagrams.

**Syntax:**
```bash
npx tsx .claude/skills/draw-beautiful-mermaid/scripts/render.ts --input $'graph TD\n  A --> B' --output diagram.svg --theme tokyo-night
```

**Important:** The `beautiful-mermaid` parser requires newlines between lines (not semicolons) and spaces around arrows (`A --> B`, not `A-->B`). Use `$'...\n...'` in bash to embed newlines, or pass a `.mmd` file path instead.

**Options:**
- `--input, -i`: Mermaid diagram code (string) or path to a `.mmd` file.
- `--output, -o`: Output file path (default: `output.svg`). Extensions `.svg` or `.txt` determine format.
- `--theme, -t`: Theme name (see `references/THEMES.md`). Default: `zinc-light` (light) or `zinc-dark` (dark).
- `--ascii, -a`: Force ASCII output (for terminal display).

### 2. Programmatic Usage (in User Code)

If you are writing a script for the user:

**SVG Output:**
```typescript
import { renderMermaid, THEMES } from 'beautiful-mermaid';

const svg = await renderMermaid(`
  graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
`, THEMES['tokyo-night']);
// Save 'svg' string to file
```

**ASCII Output:**
```typescript
import { renderMermaidAscii } from 'beautiful-mermaid';

const ascii = renderMermaidAscii(`graph LR\n  A --> B`);
console.log(ascii);
```

## Examples

### Beautiful SVG (Dark Mode)
```bash
npx tsx .claude/skills/draw-beautiful-mermaid/scripts/render.ts -i $'graph TD\n  A --> B' -o diagram.svg -t tokyo-night
```

### ASCII for Terminal
```bash
npx tsx .claude/skills/draw-beautiful-mermaid/scripts/render.ts -i $'graph TD\n  A --> B' --ascii
```

## Edge Cases

- **Missing input**: If no input is provided, the script will error.
- **Invalid Mermaid**: `beautiful-mermaid` may throw an error if the syntax is invalid. Handle this by showing the error to the user.
- **Environment**: Ensure the environment supports running TypeScript (e.g., via `tsx`, `ts-node`, or `bun`). If not, compiling to JS or running via `node` (if bundled) is necessary.
