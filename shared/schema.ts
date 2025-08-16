import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const difficultyEnum = pgEnum('difficulty', ['Easy', 'Medium', 'Hard']);
export const statusEnum = pgEnum('status', ['not_started', 'in_progress', 'completed', 'revision_needed']);
export const taskTypeEnum = pgEnum('task_type', ['new_problem', 'revision', 'flashcard']);
export const revisionStepEnum = pgEnum('revision_step', ['problem_recall', 'pattern_notes', 'code_review']);
export const recallDifficultyEnum = pgEnum('recall_difficulty', ['easy', 'medium', 'hard']);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
});

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  type: text("type"), // FAANG, MANG, etc.
});

export const problems = pgTable("problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  topics: text("topics").array().notNull(), // Array of topic names
  companies: text("companies").array().notNull(), // Array of company names - will be replaced with pattern info
  leetcodeId: integer("leetcode_id"),
  solution: text("solution"), // Optimal solution
  alternativeSolutions: jsonb("alternative_solutions"), // Array of alternative approaches
  patterns: text("patterns").array(), // Algorithm patterns
  patternNumber: integer("pattern_number"), // Pattern number from BYTS (e.g., 1, 2, 3...)
  patternName: text("pattern_name"), // Pattern name from BYTS (e.g., "Two Pointers - Converging")
  hints: text("hints").array(),
  timeComplexity: text("time_complexity"),
  spaceComplexity: text("space_complexity"),
  importOrder: integer("import_order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  problemId: varchar("problem_id").references(() => problems.id, { onDelete: "cascade" }).notNull(),
  status: statusEnum("status").notNull().default('not_started'),
  attempts: integer("attempts").notNull().default(0),
  successfulAttempts: integer("successful_attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent").default(0), // in minutes
  mistakes: jsonb("mistakes"), // Array of mistake details
  notes: text("notes"), // User's personal notes about the problem
  patternNotes: text("pattern_notes"), // One-liner explaining the pattern/logic
  userSolution: text("user_solution"), // User's code with comments
  revisionCount: integer("revision_count").default(0),
  nextRevisionDate: timestamp("next_revision_date"),
  lastRecallDifficulty: recallDifficultyEnum("last_recall_difficulty"), // How hard was the last recall
  revisionInterval: integer("revision_interval").default(1), // Current interval in days
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  day: integer("day").notNull(), // 1-60
  date: timestamp("date").notNull(),
  problemIds: text("problem_ids").array().notNull(),
  revisionProblemIds: text("revision_problem_ids").array().notNull(),
  flashcardTopics: text("flashcard_topics").array().notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const dailyTasks = pgTable("daily_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  scheduleId: varchar("schedule_id").references(() => schedules.id, { onDelete: "cascade" }).notNull(),
  taskType: taskTypeEnum("task_type").notNull(),
  problemId: varchar("problem_id").references(() => problems.id),
  topic: text("topic"), // for flashcards
  currentRevisionStep: revisionStepEnum("current_revision_step").default('problem_recall'),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent").default(0),
});

export const flashcards = pgTable("flashcards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  topic: text("topic").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  pattern: text("pattern"),
  difficulty: difficultyEnum("difficulty").notNull(),
  reviewCount: integer("review_count").default(0),
  successCount: integer("success_count").default(0),
  lastReviewedAt: timestamp("last_reviewed_at"),
  nextReviewDate: timestamp("next_review_date"),
  isActive: boolean("is_active").default(true),
});

export const mistakes = pgTable("mistakes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  problemId: varchar("problem_id").references(() => problems.id, { onDelete: "cascade" }).notNull(),
  mistakeType: text("mistake_type").notNull(), // logical, syntax, approach, etc.
  description: text("description").notNull(),
  solution: text("solution"),
  patternNumber: integer("pattern_number"), // Pattern number that was missed
  patternName: text("pattern_name"), // Pattern name that was missed
  occuredAt: timestamp("occured_at").defaultNow(),
  isResolved: boolean("is_resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
});

// New table for revision sessions
export const revisionSessions = pgTable("revision_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  problemId: varchar("problem_id").references(() => problems.id, { onDelete: "cascade" }).notNull(),
  sessionDate: timestamp("session_date").defaultNow(),
  currentStep: revisionStepEnum("current_step").notNull().default('problem_recall'),
  recallDifficulty: recallDifficultyEnum("recall_difficulty"),
  timeSpentOnRecall: integer("time_spent_on_recall").default(0), // seconds
  notesReviewed: boolean("notes_reviewed").default(false),
  codeReviewed: boolean("code_reviewed").default(false),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  schedules: many(schedules),
  dailyTasks: many(dailyTasks),
  flashcards: many(flashcards),
  mistakes: many(mistakes),
  revisionSessions: many(revisionSessions),
}));

export const problemsRelations = relations(problems, ({ many }) => ({
  userProgress: many(userProgress),
  dailyTasks: many(dailyTasks),
  mistakes: many(mistakes),
  revisionSessions: many(revisionSessions),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [userProgress.problemId],
    references: [problems.id],
  }),
}));

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  user: one(users, {
    fields: [schedules.userId],
    references: [users.id],
  }),
  dailyTasks: many(dailyTasks),
}));

export const dailyTasksRelations = relations(dailyTasks, ({ one }) => ({
  user: one(users, {
    fields: [dailyTasks.userId],
    references: [users.id],
  }),
  schedule: one(schedules, {
    fields: [dailyTasks.scheduleId],
    references: [schedules.id],
  }),
  problem: one(problems, {
    fields: [dailyTasks.problemId],
    references: [problems.id],
  }),
}));

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  user: one(users, {
    fields: [flashcards.userId],
    references: [users.id],
  }),
}));

export const mistakesRelations = relations(mistakes, ({ one }) => ({
  user: one(users, {
    fields: [mistakes.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [mistakes.problemId],
    references: [problems.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
});

export const insertDailyTaskSchema = createInsertSchema(dailyTasks).omit({
  id: true,
});

export const insertFlashcardSchema = createInsertSchema(flashcards).omit({
  id: true,
});

export const insertMistakeSchema = createInsertSchema(mistakes).omit({
  id: true,
});

export const insertRevisionSessionSchema = createInsertSchema(revisionSessions).omit({
  id: true,
});

export const revisionSessionsRelations = relations(revisionSessions, ({ one }) => ({
  user: one(users, {
    fields: [revisionSessions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [revisionSessions.problemId],
    references: [problems.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type DailyTask = typeof dailyTasks.$inferSelect;
export type InsertDailyTask = z.infer<typeof insertDailyTaskSchema>;

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

export type Mistake = typeof mistakes.$inferSelect;
export type InsertMistake = z.infer<typeof insertMistakeSchema>;

export type RevisionSession = typeof revisionSessions.$inferSelect;
export type InsertRevisionSession = z.infer<typeof insertRevisionSessionSchema>;

export type Topic = typeof topics.$inferSelect;
export type Company = typeof companies.$inferSelect;
