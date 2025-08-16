import { db } from "./db";
import { problems, userProgress } from "@shared/schema";
import { createProblemsWithPatterns } from "./patterns";
import { eq } from "drizzle-orm";

async function importPatternProblems() {
  try {
    console.log("Starting pattern problems import...");
    
    const patternProblems = createProblemsWithPatterns();
    console.log(`Creating ${patternProblems.length} problems with pattern information...`);
    
    // Clear existing problems first
    await db.delete(problems);
    console.log("Cleared existing problems");
    
    // Insert new problems without pattern data (using existing schema)
    const problemsForInsert = patternProblems.map(p => ({
      title: p.title,
      description: p.description,
      difficulty: p.difficulty,
      topics: p.topics,
      companies: [`Pattern ${p.patternNumber}`, p.patternName], // Store pattern info in companies field for now
      leetcodeId: p.leetcodeId,
      solution: p.solution,
      hints: p.hints,
      timeComplexity: p.timeComplexity,
      spaceComplexity: p.spaceComplexity,
      importOrder: p.importOrder
    }));
    
    const insertedProblems = await db.insert(problems).values(problemsForInsert).returning();
    console.log(`Successfully inserted ${insertedProblems.length} problems`);
    
    // Create initial user progress for some problems
    const userId = "user1";
    const initialProgress = insertedProblems.slice(0, 20).map((problem, index) => ({
      userId,
      problemId: problem.id,
      status: index < 10 ? 'completed' as const : 'not_started' as const,
      attempts: index < 10 ? Math.floor(Math.random() * 3) + 1 : 0,
      successfulAttempts: index < 10 ? 1 : 0,
      completedAt: index < 10 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
      notes: index < 10 ? `Solved using pattern approach. Key insight: This problem uses a fundamental algorithmic pattern.` : null,
      userSolution: index < 10 ? problem.solution : null,
      nextRevisionDate: index < 5 ? new Date() : new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
    }));
    
    await db.insert(userProgress).values(initialProgress);
    console.log(`Created initial progress for ${initialProgress.length} problems`);
    
    console.log("Pattern problems import completed successfully!");
    
    console.log("\nImport completed! Problems now contain pattern information in the companies field.");
    
  } catch (error) {
    console.error("Error importing pattern problems:", error);
    throw error;
  }
}

// Run the import if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importPatternProblems()
    .then(() => {
      console.log("Import completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Import failed:", error);
      process.exit(1);
    });
}

export { importPatternProblems };