export interface ProblemWithProgress {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies: string[];
  leetcodeId?: number;
  solution?: string;
  patterns?: string[];
  hints?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  status?: 'not_started' | 'in_progress' | 'completed' | 'revision_needed';
  attempts?: number;
  successfulAttempts?: number;
  lastAttemptAt?: string;
  completedAt?: string;
  successRate?: number;
}

export interface DashboardStats {
  totalProblems: number;
  completedProblems: number;
  accuracy: number;
  weakTopics: string[];
  streak: number;
}

export interface TodayTask {
  type: 'new_problem' | 'revision' | 'flashcard';
  problem?: ProblemWithProgress;
  topic?: string;
  completed: boolean;
}

export interface ScheduleDay {
  id: string;
  day: number;
  date: string;
  problems: ProblemWithProgress[];
  revisionProblems: ProblemWithProgress[];
  flashcardTopics: string[];
  isCompleted: boolean;
  completedCount: number;
  totalCount: number;
}

export interface Activity {
  id: string;
  type: 'completed' | 'revised' | 'pattern_noted';
  description: string;
  timestamp: string;
  difficulty?: string;
  problemTitle?: string;
}

export const DIFFICULTY_COLORS = {
  Easy: 'accent-pink',
  Medium: 'accent-orange',
  Hard: 'accent-purple',
} as const;

export const STATUS_COLORS = {
  not_started: 'text-muted',
  in_progress: 'accent-blue',
  completed: 'accent-green',
  revision_needed: 'accent-purple',
} as const;

export const TOPIC_ICONS = {
  Arrays: 'fa-list',
  Strings: 'fa-font',
  'Dynamic Programming': 'fa-calculator',
  Trees: 'fa-project-diagram',
  Graphs: 'fa-share-alt',
  'Hash Table': 'fa-hashtag',
  'Two Pointers': 'fa-arrows-alt-h',
  'Binary Search': 'fa-search',
  Sorting: 'fa-sort',
  'Linked List': 'fa-link',
  Stack: 'fa-layer-group',
  Queue: 'fa-list-ol',
  Heap: 'fa-mountain',
  'Bit Manipulation': 'fa-cog',
  Math: 'fa-calculator',
  Recursion: 'fa-recycle',
  Backtracking: 'fa-undo',
  'Sliding Window': 'fa-window-maximize',
  Greedy: 'fa-hand-holding-usd',
  'Union Find': 'fa-network-wired',
} as const;
