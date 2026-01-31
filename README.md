# Beautiful-mermaid-plugin

A [Claude Code](https://code.claude.com/) plugin that renders beautiful Mermaid diagrams (SVG or ASCII) using the [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) library. It provides slash commands, agents, and a skill for analyzing code, generating diagrams, and customizing themes.

## What this plugin does

- **Commands**: Install prerequisites, draw diagrams from code, and format output filenames.
- **Agents**: Code analyzer (read and analyze code for diagrams) and diagram renderer (render Mermaid with beautiful-mermaid).
- **Skill**: Draw beautiful Mermaid with SVG/ASCII, themes, and the built-in render script.

Output format is **SVG by default**; use the **ASCII** option for terminal-friendly text output.

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **Package manager**: npm, bun, or pnpm
- **TypeScript runner**: `tsx` (recommended), `ts-node`, or `bun` (for running the plugin’s render script)

---

## Installing beautiful-mermaid

The plugin uses the [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) library. Install it in your project:

```bash
# npm
npm install beautiful-mermaid

# bun
bun add beautiful-mermaid

# pnpm
pnpm add beautiful-mermaid
```

To run the plugin’s TypeScript render script, install `tsx` (or use `ts-node` / `bun`):

```bash
npm install -D tsx
# or: bun add -d tsx
# or: pnpm add -D tsx
```

You can also use the plugin’s **install** command so Claude Code can install these for you (see below).

---

## Installing this plugin

### Option 1: Install from the marketplace (recommended)

Add the marketplace and install the plugin:

```shell
/plugin marketplace add jyoung105/beautiful-mermaid-plugin
/plugin install beautiful-mermaid-plugin@beautiful-mermaid-marketplace
```

Or install interactively — run `/plugin`, go to the **Discover** tab, and select **beautiful-mermaid-plugin**.

### Option 2: Require it for your team

Add the marketplace to your project's `.claude/settings.json` so team members are automatically prompted to install it when they trust the project folder:

```json
{
  "extraKnownMarketplaces": {
    "beautiful-mermaid-marketplace": {
      "source": {
        "source": "github",
        "repo": "jyoung105/beautiful-mermaid-plugin"
      }
    }
  },
  "enabledPlugins": {
    "beautiful-mermaid-plugin@beautiful-mermaid-marketplace": true
  }
}
```

### Option 3: Load from a local directory (development)

For local development or testing, load the plugin directly from a directory:

```bash
claude --plugin-dir /path/to/beautiful-mermaid-plugin
```

### Updating the plugin

To update to the latest version:

```shell
/plugin marketplace update beautiful-mermaid-marketplace
/plugin update beautiful-mermaid-plugin
```

After installation, restart Claude Code if needed. Run `/help` to see commands under the `beautiful-mermaid-plugin` namespace. See [Discover and install plugins](https://code.claude.com/docs/en/discover-plugins) and [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) for more details.

---

## Using commands

All commands are namespaced as `beautiful-mermaid-plugin:<command>`.

| Command | Description |
|--------|--------------|
| `/beautiful-mermaid-plugin:draw-diagram` | Analyze codebase or files and draw a Mermaid diagram. Default output is **SVG**; add `--ascii` in arguments for terminal/ASCII output. |
| `/beautiful-mermaid-plugin:install-mermaid` | Check and install beautiful-mermaid and a TypeScript runner (e.g. tsx) in the project. |
| `/beautiful-mermaid-plugin:format-filename` | Generate a descriptive filename for diagram output (e.g. `auth-flow-sequence.svg` or `diagram-flowchart.txt`). |

### Examples

- Draw a diagram (SVG by default):  
  `/beautiful-mermaid-plugin:draw-diagram`
- Draw and output ASCII:  
  `/beautiful-mermaid-plugin:draw-diagram --ascii`
- Draw from specific path/diagram type:  
  `/beautiful-mermaid-plugin:draw-diagram src/auth flowchart`
- Install prerequisites:  
  `/beautiful-mermaid-plugin:install-mermaid`
- Get a suggested filename:  
  `/beautiful-mermaid-plugin:format-filename api sequence svg`

---

## Using agents (subagents)

The plugin adds two agents, available in Claude Code’s agent list (e.g. via `/agents`):

| Agent | Purpose |
|-------|--------|
| **code-analyzer** | Reads and analyzes code files or codebase to extract structure, data flows, and relationships for diagram generation (flowcharts, sequence, class, state, ER). |
| **diagram-renderer** | Takes Mermaid source and renders it to SVG or ASCII using beautiful-mermaid and the plugin’s render script. |

You can say things like:

- “Use the code-analyzer agent to analyze `src/api` and summarize it for a sequence diagram.”
- “Use the diagram-renderer agent to render this Mermaid code to `docs/diagram.svg`.”

---

## Using the skill

The plugin includes the **draw-beautiful-mermaid** skill. Claude Code can use it when generating or rendering Mermaid diagrams. It covers:

- Checking/installing beautiful-mermaid
- Using the render script (`skills/draw-beautiful-mermaid/scripts/render.ts`) with `--input`, `--output`, `--theme`, and `--ascii`
- Valid Mermaid syntax (newlines, spaces around arrows)
- Programmatic SVG/ASCII usage

The skill is referenced by the diagram-renderer agent and by the draw-diagram command.

---

## Output format: SVG vs ASCII

- **Default**: Diagrams are rendered as **SVG** and saved to a file (e.g. `.svg`).
- **ASCII**: For terminals or plain-text, use **ASCII**:
  - In **draw-diagram**: include `--ascii` in the arguments, or ask for “ASCII” or “terminal” output.
  - In the **render script**: pass `--ascii` and use a `.txt` output path or stdout.

---

## Themes

SVG rendering supports 15 built-in themes. Use the `--theme` option with the render script (or ask for a theme by name). Examples:

| Theme | Type |
|-------|------|
| `zinc-light`, `zinc-dark` | Default light/dark |
| `tokyo-night`, `tokyo-night-storm`, `tokyo-night-light` | Tokyo Night variants |
| `catppuccin-mocha`, `catppuccin-latte` | Catppuccin |
| `nord`, `nord-light` | Nord |
| `dracula` | Dracula |
| `github-light`, `github-dark` | GitHub |
| `solarized-light`, `solarized-dark` | Solarized |
| `one-dark` | One Dark |

Full list and details: `skills/draw-beautiful-mermaid/references/THEMES.md`.

---

## Plugin layout

```
beautiful-mermaid-plugin/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── LICENSE
├── commands/
│   ├── draw-diagram.md
│   ├── install-mermaid.md
│   └── format-filename.md
├── agents/
│   ├── code-analyzer.md
│   └── diagram-renderer.md
├── skills/
│   └── draw-beautiful-mermaid/
│       ├── SKILL.md
│       ├── references/
│       │   └── THEMES.md
│       └── scripts/
│           └── render.ts
└── README.md
```

---

## Attribution

This plugin uses **[beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid)** by [lukilabs](https://github.com/lukilabs) for rendering Mermaid diagrams as SVGs and ASCII.

- **Repository**: [https://github.com/lukilabs/beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid)
- **License**: MIT  
- **Features**: Flowcharts, state, sequence, class, and ER diagrams; 15 built-in themes; SVG and ASCII/Unicode output; zero DOM dependencies.

The ASCII rendering in beautiful-mermaid is based on [mermaid-ascii](https://github.com/AlexanderGrooff/mermaid-ascii) by Alexander Grooff (ported from Go to TypeScript and extended).

**beautiful-mermaid-plugin** is not affiliated with lukilabs or the beautiful-mermaid project; it is a separate Claude Code plugin that integrates beautiful-mermaid for use inside Claude Code.
