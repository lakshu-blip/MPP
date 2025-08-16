#!/usr/bin/env tsx

import { importAllProblems } from "../server/importProblems";

async function main() {
  try {
    console.log("Starting BYTS SDE Sheet import...");
    const importedCount = await importAllProblems();
    console.log(`✅ Successfully imported ${importedCount} problems!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

main();