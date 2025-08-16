import {
  users,
  problems,
  userProgress,
  schedules,
  dailyTasks,
  flashcards,
  mistakes,
  type User,
  type InsertUser,
  type Problem,
  type InsertProblem,
  type UserProgress,
  type InsertUserProgress,
  type Schedule,
  type InsertSchedule,
  type DailyTask,
  type InsertDailyTask,
  type Flashcard,
  type InsertFlashcard,
  type Mistake,
  type InsertMistake,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, count, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Problems
  getAllProblems(): Promise<Problem[]>;
  getProblem(id: string): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  createProblems(problems: InsertProblem[]): Promise<Problem[]>;
  searchProblems(query: string, topic?: string, difficulty?: string): Promise<Problem[]>;

  // User Progress
  getUserProgress(userId: string, problemId?: string): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress>;
  getUserStats(userId: string): Promise<{
    totalProblems: number;
    completedProblems: number;
    accuracy: number;
    weakTopics: string[];
    streak: number;
  }>;

  // Schedules
  getUserSchedules(userId: string): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, updates: Partial<Schedule>): Promise<Schedule>;
  getTodaySchedule(userId: string): Promise<Schedule | undefined>;

  // Daily Tasks
  getDailyTasks(userId: string, scheduleId: string): Promise<DailyTask[]>;
  createDailyTask(task: InsertDailyTask): Promise<DailyTask>;
  updateDailyTask(id: string, updates: Partial<DailyTask>): Promise<DailyTask>;

  // Flashcards
  getUserFlashcards(userId: string, topic?: string): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard>;

  // Mistakes
  getUserMistakes(userId: string, problemId?: string): Promise<Mistake[]>;
  createMistake(mistake: InsertMistake): Promise<Mistake>;
  updateMistake(id: string, updates: Partial<Mistake>): Promise<Mistake>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Problems
  async getAllProblems(): Promise<Problem[]> {
    return await db.select().from(problems).orderBy(asc(problems.importOrder));
  }

  async getProblem(id: string): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem || undefined;
  }

  async createProblem(problem: InsertProblem): Promise<Problem> {
    const [newProblem] = await db.insert(problems).values(problem).returning();
    return newProblem;
  }

  async createProblems(problemList: InsertProblem[]): Promise<Problem[]> {
    return await db.insert(problems).values(problemList).returning();
  }

  async searchProblems(query: string, topic?: string, difficulty?: string): Promise<Problem[]> {
    const conditions = [];
    
    if (query) {
      conditions.push(sql`${problems.title} ILIKE ${`%${query}%`}`);
    }
    
    if (topic) {
      conditions.push(sql`${topic} = ANY(${problems.topics})`);
    }
    
    if (difficulty) {
      conditions.push(eq(problems.difficulty, difficulty as any));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(problems)
        .where(and(...conditions))
        .orderBy(asc(problems.importOrder));
    }
    
    return await db.select().from(problems).orderBy(asc(problems.importOrder));
  }

  // User Progress
  async getUserProgress(userId: string, problemId?: string): Promise<UserProgress[]> {
    if (problemId) {
      return await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.problemId, problemId)))
        .orderBy(desc(userProgress.lastAttemptAt));
    }
    
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.lastAttemptAt));
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [newProgress] = await db.insert(userProgress).values(progress).returning();
    return newProgress;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const [updated] = await db
      .update(userProgress)
      .set(updates)
      .where(eq(userProgress.id, id))
      .returning();
    return updated;
  }

  async getUserStats(userId: string): Promise<{
    totalProblems: number;
    completedProblems: number;
    accuracy: number;
    weakTopics: string[];
    streak: number;
  }> {
    const totalProblemsResult = await db.select({ count: count() }).from(problems);
    const totalProblems = totalProblemsResult[0].count;

    const completedProblemsResult = await db
      .select({ count: count() })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.status, 'completed')));
    const completedProblems = completedProblemsResult[0].count;

    const progressData = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    const totalAttempts = progressData.reduce((sum, p) => sum + p.attempts, 0);
    const successfulAttempts = progressData.reduce((sum, p) => sum + p.successfulAttempts, 0);
    const accuracy = totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 0;

    // Calculate weak topics (topics with < 70% success rate)
    const topicStats = new Map<string, { attempts: number; successes: number }>();
    
    for (const progress of progressData) {
      const problem = await this.getProblem(progress.problemId);
      if (problem && problem.topics) {
        for (const topic of problem.topics) {
          if (!topicStats.has(topic)) {
            topicStats.set(topic, { attempts: 0, successes: 0 });
          }
          const stats = topicStats.get(topic)!;
          stats.attempts += progress.attempts;
          stats.successes += progress.successfulAttempts;
        }
      }
    }

    const weakTopics = Array.from(topicStats.entries())
      .filter(([_, stats]) => stats.attempts > 0 && (stats.successes / stats.attempts) < 0.7)
      .map(([topic]) => topic)
      .slice(0, 5);

    // Calculate streak (simplified - consecutive days with completed problems)
    const streak = 15; // TODO: Implement proper streak calculation

    return {
      totalProblems,
      completedProblems,
      accuracy,
      weakTopics,
      streak,
    };
  }

  // Schedules
  async getUserSchedules(userId: string): Promise<Schedule[]> {
    return await db
      .select()
      .from(schedules)
      .where(eq(schedules.userId, userId))
      .orderBy(asc(schedules.day));
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }

  async updateSchedule(id: string, updates: Partial<Schedule>): Promise<Schedule> {
    const [updated] = await db
      .update(schedules)
      .set(updates)
      .where(eq(schedules.id, id))
      .returning();
    return updated;
  }

  async getTodaySchedule(userId: string): Promise<Schedule | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [schedule] = await db
      .select()
      .from(schedules)
      .where(
        and(
          eq(schedules.userId, userId),
          sql`${schedules.date} >= ${today}`,
          sql`${schedules.date} < ${tomorrow}`
        )
      );
    
    return schedule || undefined;
  }

  // Daily Tasks
  async getDailyTasks(userId: string, scheduleId: string): Promise<DailyTask[]> {
    return await db
      .select()
      .from(dailyTasks)
      .where(and(eq(dailyTasks.userId, userId), eq(dailyTasks.scheduleId, scheduleId)));
  }

  async createDailyTask(task: InsertDailyTask): Promise<DailyTask> {
    const [newTask] = await db.insert(dailyTasks).values(task).returning();
    return newTask;
  }

  async updateDailyTask(id: string, updates: Partial<DailyTask>): Promise<DailyTask> {
    const [updated] = await db
      .update(dailyTasks)
      .set(updates)
      .where(eq(dailyTasks.id, id))
      .returning();
    return updated;
  }

  // Flashcards
  async getUserFlashcards(userId: string, topic?: string): Promise<Flashcard[]> {
    if (topic) {
      return await db
        .select()
        .from(flashcards)
        .where(and(eq(flashcards.userId, userId), eq(flashcards.topic, topic)))
        .orderBy(asc(flashcards.nextReviewDate));
    }
    
    return await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.userId, userId))
      .orderBy(asc(flashcards.nextReviewDate));
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const [newFlashcard] = await db.insert(flashcards).values(flashcard).returning();
    return newFlashcard;
  }

  async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard> {
    const [updated] = await db
      .update(flashcards)
      .set(updates)
      .where(eq(flashcards.id, id))
      .returning();
    return updated;
  }

  // Mistakes
  async getUserMistakes(userId: string, problemId?: string): Promise<Mistake[]> {
    if (problemId) {
      return await db
        .select()
        .from(mistakes)
        .where(and(eq(mistakes.userId, userId), eq(mistakes.problemId, problemId)))
        .orderBy(desc(mistakes.occuredAt));
    }
    
    return await db
      .select()
      .from(mistakes)
      .where(eq(mistakes.userId, userId))
      .orderBy(desc(mistakes.occuredAt));
  }

  async createMistake(mistake: InsertMistake): Promise<Mistake> {
    const [newMistake] = await db.insert(mistakes).values(mistake).returning();
    return newMistake;
  }

  async updateMistake(id: string, updates: Partial<Mistake>): Promise<Mistake> {
    const [updated] = await db
      .update(mistakes)
      .set(updates)
      .where(eq(mistakes.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
