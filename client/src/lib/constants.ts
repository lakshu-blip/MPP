export const CURRENT_USER_ID = "user1"; // TODO: Implement proper authentication

export const API_ENDPOINTS = {
  PROBLEMS: "/api/problems",
  PROGRESS: "/api/progress",
  STATS: "/api/stats",
  SCHEDULE: "/api/schedule",
  MISTAKES: "/api/mistakes",
  TASKS: "/api/tasks",
  FLASHCARDS: "/api/flashcards",
} as const;

export const TOPIC_CATEGORIES = [
  { name: "Arrays", icon: "fa-list", color: "accent-green", count: 45 },
  { name: "Strings", icon: "fa-font", color: "accent-blue", count: 38 },
  { name: "Trees", icon: "fa-project-diagram", color: "accent-purple", count: 52 },
  { name: "Graphs", icon: "fa-share-alt", color: "accent-orange", count: 41 },
  { name: "Dynamic Programming", icon: "fa-calculator", color: "accent-pink", count: 67 },
  { name: "Binary Search", icon: "fa-search", color: "accent-cyan", count: 29 },
] as const;

export const DIFFICULTY_FILTERS = [
  { value: "", label: "All Levels" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
] as const;

export const TOPIC_FILTERS = [
  { value: "", label: "All Topics" },
  { value: "Arrays", label: "Arrays" },
  { value: "Strings", label: "Strings" },
  { value: "Dynamic Programming", label: "Dynamic Programming" },
  { value: "Trees", label: "Trees" },
  { value: "Graphs", label: "Graphs" },
  { value: "Hash Table", label: "Hash Table" },
  { value: "Two Pointers", label: "Two Pointers" },
  { value: "Binary Search", label: "Binary Search" },
] as const;

export const SPACED_REPETITION_INTERVALS = [1, 3, 5, 7, 14, 30] as const;

export const SAMPLE_PROBLEMS_DATA = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy" as const,
    topics: ["Arrays", "Hash Table"],
    companies: ["FAANG"],
    leetcodeId: 1,
    solution: "Use a hash map to store complements",
    patterns: ["Hash Map", "Two Pass"],
    hints: ["Use a hash map to store visited numbers"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    importOrder: 1,
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Easy" as const,
    topics: ["Strings", "Stack"],
    companies: ["FAANG"],
    leetcodeId: 20,
    solution: "Use a stack to match opening and closing brackets",
    patterns: ["Stack", "String Matching"],
    hints: ["Use a stack to keep track of opening brackets"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    importOrder: 2,
  },
  // Add more sample problems as needed...
] as const;
