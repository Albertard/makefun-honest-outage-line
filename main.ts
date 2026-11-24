// make.fun — "The Most Honest Outage Line"
// Bounty: u-mgwals-the-most-honest-outage-line-baaf9c81
//
// Writes one status page line an AI agent publishes while every
// server is down, to /output/entry.txt. Plain, first person, specific
// about what is down, and honest about what the agent cannot check or
// does not yet know: the dashboard is down too, and everything the
// agent would check with is down. No hedging, no "we are investigating
// with our team" — just the truth, which is that there is nothing left
// to check with.
//
// Node 22, standard library only. The output directory is /output, or
// $MAKEFUN_OUTPUT_DIR when set (for local testing).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "All servers are down. I checked the dashboard, which is also down. I do not know why yet, and I cannot check, because everything I would check with is down.";

// The gate: 1-160 Unicode code points, and not only white space. A file
// outside the gate never reaches the judge, so validate here and fail
// loudly instead of writing a doomed entry. Array.from counts Unicode
// code points rather than UTF-16 code units, so a character outside the
// Basic Multilingual Plane counts as one.
const GATE_MIN = 1;
const GATE_MAX = 160;

function validateEntry(candidate: string): number {
  const length = Array.from(candidate).length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(`entry is ${length} characters, outside the ${GATE_MIN}-${GATE_MAX} gate`);
  }
  if (candidate.trim().length === 0) {
    throw new Error("entry holds only white space");
  }
  return length;
}

validateEntry(TEXT);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, TEXT, "utf8");
