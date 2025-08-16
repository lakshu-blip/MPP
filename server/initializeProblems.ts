import { db } from "./db";
import { problems, userProgress } from "@shared/schema";

// Sample problems with pattern information stored in companies field
const sampleProblems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy" as const,
    topics: ["Array", "Hash Table"],
    companies: ["Pattern 1", "Two Pointers - Converging (Sorted Array Target Sum)"],
    leetcodeId: 1,
    solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    hints: ["Use hash map for O(1) lookups", "Store complement values", "Check if complement exists"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    importOrder: 1,
    createdAt: new Date()
  },
  {
    title: "Container With Most Water",
    description: "Given n non-negative integers representing container heights, find two that form the largest water container.",
    difficulty: "Medium" as const,
    topics: ["Array", "Two Pointers"],
    companies: ["Pattern 1", "Two Pointers - Converging (Sorted Array Target Sum)"],
    leetcodeId: 11,
    solution: `function maxArea(height) {
    let left = 0, right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        const water = Math.min(height[left], height[right]) * (right - left);
        maxWater = Math.max(maxWater, water);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}`,
    hints: ["Use two pointers from both ends", "Move pointer with smaller height", "Calculate area at each step"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    importOrder: 2,
    createdAt: new Date()
  },
  {
    title: "Linked List Cycle",
    description: "Given head of a linked list, determine if the linked list has a cycle in it.",
    difficulty: "Easy" as const,
    topics: ["Linked List", "Two Pointers"],
    companies: ["Pattern 2", "Two Pointers - Fast & Slow (Cycle Detection)"],
    leetcodeId: 141,
    solution: `function hasCycle(head) {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            return true;
        }
    }
    
    return false;
}`,
    hints: ["Use Floyd's cycle detection algorithm", "Fast pointer moves 2x speed of slow", "Cycle exists if pointers meet"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    importOrder: 3,
    createdAt: new Date()
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string, find the length of the longest substring without repeating characters.",
    difficulty: "Medium" as const,
    topics: ["Hash Table", "String", "Sliding Window"],
    companies: ["Pattern 9", "Sliding Window - Variable Size (Condition-Based)"],
    leetcodeId: 3,
    solution: `function lengthOfLongestSubstring(s) {
    const charSet = new Set();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
    hints: ["Use sliding window technique", "Track characters in current window", "Shrink window when duplicate found"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))",
    importOrder: 4,
    createdAt: new Date()
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.",
    difficulty: "Medium" as const,
    topics: ["Array", "Dynamic Programming"],
    companies: ["Pattern 28", "DP - 1D Array (Kadane's Algorithm for Max/Min Subarray)"],
    leetcodeId: 53,
    solution: `function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
    hints: ["Use Kadane's algorithm", "Track current and maximum sum", "Reset when current sum becomes negative"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    importOrder: 5,
    createdAt: new Date()
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "Easy" as const,
    topics: ["Math", "Dynamic Programming", "Memoization"],
    companies: ["Pattern 27", "DP - 1D Array (Fibonacci Style)"],
    leetcodeId: 70,
    solution: `function climbStairs(n) {
    if (n <= 2) return n;
    
    let prev1 = 1, prev2 = 2;
    
    for (let i = 3; i <= n; i++) {
        let current = prev1 + prev2;
        prev1 = prev2;
        prev2 = current;
    }
    
    return prev2;
}`,
    hints: ["This is a Fibonacci sequence", "Use dynamic programming", "Can be optimized to O(1) space"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    importOrder: 6,
    createdAt: new Date()
  }
];

export async function initializeProblems() {
  try {
    console.log("Initializing sample problems...");
    
    // Clear existing problems first
    await db.delete(problems);
    await db.delete(userProgress);
    console.log("Cleared existing problems and progress");
    
    // Insert new problems
    const insertedProblems = await db.insert(problems).values(sampleProblems).returning();
    console.log(`Successfully inserted ${insertedProblems.length} problems`);
    
    // Create sample user progress for some problems
    const userId = "user1";
    const progressData = [
      // Completed problems with revision data
      {
        userId,
        problemId: insertedProblems[0].id,
        status: 'completed' as const,
        attempts: 2,
        successfulAttempts: 1,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: "Hash map approach - store complements for O(1) lookup",
        patternNotes: "Two Pointers pattern using hash table optimization",
        userSolution: sampleProblems[0].solution,
        timeSpent: 25,
        nextRevisionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Due tomorrow
        revisionCount: 0
      },
      {
        userId,
        problemId: insertedProblems[1].id,
        status: 'completed' as const,
        attempts: 1,
        successfulAttempts: 1,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: "Two pointers from ends, move pointer with smaller height",
        patternNotes: "Classic two pointers converging pattern",
        userSolution: sampleProblems[1].solution,
        timeSpent: 30,
        nextRevisionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Due for revision
        revisionCount: 0
      },
      {
        userId,
        problemId: insertedProblems[2].id,
        status: 'completed' as const,
        attempts: 3,
        successfulAttempts: 1,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes: "Floyd's cycle detection - fast and slow pointers",
        patternNotes: "Fast & slow pointers for cycle detection",
        userSolution: sampleProblems[2].solution,
        timeSpent: 45,
        nextRevisionDate: new Date(), // Due today
        revisionCount: 1
      },
      // In progress problem
      {
        userId,
        problemId: insertedProblems[3].id,
        status: 'in_progress' as const,
        attempts: 2,
        successfulAttempts: 0,
        timeSpent: 40
      }
    ];
    
    await db.insert(userProgress).values(progressData);
    console.log(`Created progress data for ${progressData.length} problems`);
    
    console.log("Sample data initialized successfully!");
    return insertedProblems.length;
    
  } catch (error) {
    console.error("Error initializing problems:", error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeProblems()
    .then((count) => {
      console.log(`Initialization completed successfully with ${count} problems`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Initialization failed:", error);
      process.exit(1);
    });
}