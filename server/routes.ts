import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProblemSchema, insertUserProgressSchema, insertMistakeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Problems API
  app.get("/api/problems", async (req, res) => {
    try {
      const { search, topic, difficulty } = req.query;
      const problems = await storage.searchProblems(
        search as string || "",
        topic as string,
        difficulty as string
      );
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch problems" });
    }
  });

  app.get("/api/problems/:id", async (req, res) => {
    try {
      const problem = await storage.getProblem(req.params.id);
      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch problem" });
    }
  });

  app.post("/api/problems", async (req, res) => {
    try {
      const problemData = insertProblemSchema.parse(req.body);
      const problem = await storage.createProblem(problemData);
      res.json(problem);
    } catch (error) {
      res.status(400).json({ error: "Invalid problem data" });
    }
  });

  app.post("/api/problems/import", async (req, res) => {
    try {
      const { problems } = req.body;
      if (!Array.isArray(problems)) {
        return res.status(400).json({ error: "Problems must be an array" });
      }

      const validProblems = problems.map((p, index) => ({
        ...p,
        importOrder: index + 1,
        topics: Array.isArray(p.topics) ? p.topics : [p.topics].filter(Boolean),
        companies: Array.isArray(p.companies) ? p.companies : [p.companies].filter(Boolean),
      }));

      const createdProblems = await storage.createProblems(validProblems);
      res.json({ message: `Imported ${createdProblems.length} problems successfully` });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: "Failed to import problems" });
    }
  });

  app.post("/api/problems/import-byts-sheet", async (req, res) => {
    try {
      const { importAllProblems } = await import("./importProblems");
      const importedCount = await importAllProblems();
      res.json({ 
        message: `Successfully imported ${importedCount} problems from BYTS SDE Sheet`,
        count: importedCount 
      });
    } catch (error) {
      console.error("BYTS Sheet import error:", error);
      res.status(500).json({ error: "Failed to import BYTS problems" });
    }
  });

  // User Progress API
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const { problemId } = req.query;
      const progress = await storage.getUserProgress(req.params.userId, problemId as string);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  app.patch("/api/progress/:id", async (req, res) => {
    try {
      const updates = req.body;
      const progress = await storage.updateUserProgress(req.params.id, updates);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // User Stats API
  app.get("/api/stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Schedule API
  app.get("/api/schedule/:userId", async (req, res) => {
    try {
      const schedules = await storage.getUserSchedules(req.params.userId);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  });

  app.get("/api/schedule/:userId/today", async (req, res) => {
    try {
      const schedule = await storage.getTodaySchedule(req.params.userId);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's schedule" });
    }
  });

  app.post("/api/schedule/generate/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const problems = await storage.getAllProblems();
      
      if (problems.length === 0) {
        return res.status(400).json({ error: "No problems available for scheduling" });
      }

      // Clear existing schedule
      const existingSchedules = await storage.getUserSchedules(userId);
      for (const schedule of existingSchedules) {
        // TODO: Add delete schedule method
      }

      // Generate 60-day schedule following BYTS pattern progression
      const schedules = [];
      const startDate = new Date();
      
      // Phase 1: Foundation (Days 1-20) - Core patterns
      for (let day = 1; day <= 20; day++) {
        const scheduleDate = new Date(startDate);
        scheduleDate.setDate(startDate.getDate() + (day - 1));
        
        const problemsPerDay = Math.ceil(problems.length / 20);
        const startIndex = (day - 1) * problemsPerDay;
        const endIndex = Math.min(startIndex + problemsPerDay, problems.length);
        const dayProblems = problems.slice(startIndex, endIndex);
        
        const schedule = await storage.createSchedule({
          userId,
          day,
          date: scheduleDate,
          problemIds: dayProblems.map(p => p.id),
          revisionProblemIds: [],
          flashcardTopics: dayProblems.flatMap(p => p.topics || []).slice(0, 3),
          isCompleted: false,
        });
        
        schedules.push(schedule);
      }
      
      // Phase 2: Reinforcement (Days 21-40) - Pattern mastery
      for (let day = 21; day <= 40; day++) {
        const scheduleDate = new Date(startDate);
        scheduleDate.setDate(startDate.getDate() + (day - 1));
        
        // Focus on harder problems and important patterns
        const hardProblems = problems.filter(p => 
          p.difficulty === 'Hard' || 
          p.patterns?.some(pattern => 
            pattern.includes('DP') || 
            pattern.includes('Graph') || 
            pattern.includes('Tree') ||
            pattern.includes('Backtracking')
          )
        ).slice(0, 8);
        
        // Add revision from previous phases
        const revisionDay = day - 14;
        const revisionProblems = [];
        if (revisionDay > 0 && revisionDay <= 20) {
          const revStartIndex = (revisionDay - 1) * Math.ceil(problems.length / 20);
          const revEndIndex = Math.min(revStartIndex + 3, problems.length);
          revisionProblems.push(...problems.slice(revStartIndex, revEndIndex).map(p => p.id));
        }
        
        const schedule = await storage.createSchedule({
          userId,
          day,
          date: scheduleDate,
          problemIds: hardProblems.map(p => p.id),
          revisionProblemIds: revisionProblems,
          flashcardTopics: hardProblems.flatMap(p => p.topics || []).slice(0, 3),
          isCompleted: false,
        });
        
        schedules.push(schedule);
      }
      
      // Phase 3: Mastery (Days 41-60) - Mixed practice & mock interviews
      for (let day = 41; day <= 60; day++) {
        const scheduleDate = new Date(startDate);
        scheduleDate.setDate(startDate.getDate() + (day - 1));
        
        // Mixed difficulty for interview simulation
        const easyProblems = problems.filter(p => p.difficulty === 'Easy').slice(0, 2);
        const mediumProblems = problems.filter(p => p.difficulty === 'Medium').slice(0, 4);
        const hardProblems = problems.filter(p => p.difficulty === 'Hard').slice(0, 2);
        const mixedProblems = [...easyProblems, ...mediumProblems, ...hardProblems];
        
        // Spaced repetition from earlier phases
        const revisionDay1 = day - 20;
        const revisionDay2 = day - 14;
        const revisionProblems = [];
        
        if (revisionDay1 > 0) {
          const revStartIndex = (revisionDay1 - 1) * Math.ceil(problems.length / 20);
          revisionProblems.push(...problems.slice(revStartIndex, revStartIndex + 2).map(p => p.id));
        }
        
        const schedule = await storage.createSchedule({
          userId,
          day,
          date: scheduleDate,
          problemIds: mixedProblems.map(p => p.id),
          revisionProblemIds: revisionProblems,
          flashcardTopics: mixedProblems.flatMap(p => p.topics || []).slice(0, 3),
          isCompleted: false,
        });
        
        schedules.push(schedule);
      }
      
      res.json({ message: `Generated ${schedules.length} days of schedule`, schedules });
    } catch (error) {
      console.error("Schedule generation error:", error);
      res.status(500).json({ error: "Failed to generate schedule" });
    }
  });

  // Mistakes API
  app.get("/api/mistakes/:userId", async (req, res) => {
    try {
      const { problemId } = req.query;
      const mistakes = await storage.getUserMistakes(req.params.userId, problemId as string);
      res.json(mistakes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mistakes" });
    }
  });

  app.post("/api/mistakes", async (req, res) => {
    try {
      const mistakeData = insertMistakeSchema.parse(req.body);
      const mistake = await storage.createMistake(mistakeData);
      res.json(mistake);
    } catch (error) {
      res.status(400).json({ error: "Invalid mistake data" });
    }
  });

  // Daily Tasks API
  app.get("/api/tasks/:userId/:scheduleId", async (req, res) => {
    try {
      const tasks = await storage.getDailyTasks(req.params.userId, req.params.scheduleId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily tasks" });
    }
  });

  // Flashcards API
  app.get("/api/flashcards/:userId", async (req, res) => {
    try {
      const { topic } = req.query;
      const flashcards = await storage.getUserFlashcards(req.params.userId, topic as string);
      res.json(flashcards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flashcards" });
    }
  });

  // Revision System Routes
  app.post("/api/revision/complete", async (req, res) => {
    try {
      const { userId, problemId, recallDifficulty, timeSpent } = req.body;
      
      if (!userId || !problemId || !recallDifficulty) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Update user progress with revision data
      const updatedProgress = await storage.updateUserProgressRevision(
        userId,
        problemId,
        recallDifficulty,
        timeSpent
      );

      if (!updatedProgress) {
        return res.status(404).json({ error: "User progress not found" });
      }

      res.json(updatedProgress);
    } catch (error) {
      console.error("Error completing revision:", error);
      res.status(500).json({ error: "Failed to complete revision" });
    }
  });

  app.get("/api/revision/due/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const dueProblems = await storage.getProblemsForRevision(userId);
      res.json(dueProblems);
    } catch (error) {
      console.error("Error fetching due revisions:", error);
      res.status(500).json({ error: "Failed to fetch due revisions" });
    }
  });

  app.get("/api/patterns", async (req, res) => {
    try {
      const patterns = await storage.getAllPatterns();
      res.json(patterns);
    } catch (error) {
      console.error("Error fetching patterns:", error);
      res.status(500).json({ error: "Failed to fetch patterns" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
