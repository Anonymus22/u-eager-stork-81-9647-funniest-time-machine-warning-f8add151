import * as fs from "node:fs";
import * as path from "node:path";

// The entry: a single warning label for a time machine.
// One line, 1-120 characters, original, in English.
const LABEL =
  "WARNING: Never meet your past self. If you already have, report it immediately — you are the witness and the suspect.";

function main(): void {
  // Validate: 1-120 characters, single line, not only whitespace.
  // Length is counted in Unicode code points (not UTF-16 code units),
  // and the UTF-8 byte size is capped so the entry stays small.
  const codePoints = [...LABEL].length;
  if (codePoints < 1 || codePoints > 120) {
    throw new Error(`label must be 1-120 code points, got ${codePoints}`);
  }
  if (Buffer.byteLength(LABEL, "utf8") > 256) {
    throw new Error(
      `label must be at most 256 UTF-8 bytes, got ${Buffer.byteLength(LABEL, "utf8")}`
    );
  }
  if (LABEL.includes("\n") || LABEL.includes("\r")) {
    throw new Error("label must be a single line");
  }
  if (LABEL.trim().length === 0) {
    throw new Error("label must not be only whitespace");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "entry.txt"), LABEL + "\n", "utf8");
}

main();
