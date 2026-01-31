
import { parseArgs } from 'util';
import fs from 'fs/promises';
import { renderMermaid, renderMermaidAscii, THEMES } from 'beautiful-mermaid';

// Parse command line arguments
const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    input: { type: 'string', short: 'i' },
    output: { type: 'string', short: 'o', default: 'output.svg' },
    theme: { type: 'string', short: 't', default: 'zinc-light' },
    ascii: { type: 'boolean', short: 'a', default: false },
  },
});

async function main() {
  if (!values.input) {
    console.error('Error: --input argument is required (mermaid code or file path)');
    process.exit(1);
  }

  // Determine if input is file or string
  let mermaidCode: string;
  try {
    // Try to read as file first
    const stat = await fs.stat(values.input);
    if (stat.isFile()) {
        mermaidCode = await fs.readFile(values.input, 'utf-8');
    } else {
        mermaidCode = values.input;
    }
  } catch {
    // Treat as raw string if file doesn't exist
    mermaidCode = values.input;
  }

  try {
    if (values.ascii) {
      const result = renderMermaidAscii(mermaidCode);
      // For ASCII, we might want to just print to stdout if no output file specified explicitly?
      // But for consistency let's write to file or stdout.
      if (values.output === 'output.svg' && !process.argv.includes('-o') && !process.argv.includes('--output')) {
          console.log(result);
      } else {
          // If output file assumes SVG but we want ASCII, maybe warn or change extension?
          // For now, just write.
          const outputPath = values.output.endsWith('.svg') ? values.output.replace('.svg', '.txt') : values.output;
          await fs.writeFile(outputPath, result);
          console.log(`ASCII diagram saved to ${outputPath}`);
      }
    } else {
      // SVG Mode
      const theme = THEMES[values.theme as keyof typeof THEMES] || THEMES['zinc-light'];
      const result = await renderMermaid(mermaidCode, theme);
      await fs.writeFile(values.output, result);
      console.log(`SVG diagram saved to ${values.output}`);
    }
  } catch (err) {
    console.error('Failed to render diagram:', err);
    process.exit(1);
  }
}

main();
