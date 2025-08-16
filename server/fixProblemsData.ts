import { db } from "./db";
import { problems } from "@shared/schema";
import { eq } from "drizzle-orm";

async function fixProblemsData() {
  try {
    console.log("Updating problems with pattern data...");
    
    // Update existing problems with pattern information
    const problemUpdates = [
      { id: 'prob-1', patternNumber: 1, patternName: 'Two Pointers - Converging' },
      { id: 'prob-2', patternNumber: 1, patternName: 'Two Pointers - Converging' },
      { id: 'prob-3', patternNumber: 2, patternName: 'Two Pointers - Fast & Slow' },
      { id: 'prob-4', patternNumber: 9, patternName: 'Sliding Window - Variable Size' },
      { id: 'prob-5', patternNumber: 28, patternName: 'DP - 1D Array (Kadane Algorithm)' },
      { id: 'prob-6', patternNumber: 27, patternName: 'DP - 1D Array (Fibonacci Style)' }
    ];
    
    for (const update of problemUpdates) {
      await db
        .update(problems)
        .set({
          patterns: [`Pattern ${update.patternNumber}`, update.patternName]
        })
        .where(eq(problems.id, update.id));
      console.log(`Updated ${update.id} with pattern ${update.patternNumber}`);
    }
    
    console.log("Pattern data updated successfully!");
  } catch (error) {
    console.error("Error updating pattern data:", error);
  }
}

fixProblemsData()
  .then(() => {
    console.log("Fix completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fix failed:", error);
    process.exit(1);
  });