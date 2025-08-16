// Pattern data extracted from BYTS SDE Sheet
export const PATTERNS = [
  // Two Pointer Patterns
  {
    number: 1,
    name: "Two Pointers - Converging (Sorted Array Target Sum)",
    problems: [
      { title: "Two Sum", leetcodeId: 1 },
      { title: "Container With Most Water", leetcodeId: 11 },
      { title: "3Sum", leetcodeId: 15 },
      { title: "3Sum Closest", leetcodeId: 16 },
      { title: "4Sum", leetcodeId: 18 },
      { title: "Two Sum II - Input Array Is Sorted", leetcodeId: 167 },
      { title: "Intersection of Two Arrays", leetcodeId: 349 },
      { title: "Is Subsequence", leetcodeId: 392 },
      { title: "Boats to Save People", leetcodeId: 881 },
      { title: "Squares of a Sorted Array", leetcodeId: 977 },
      { title: "3Sum Smaller", leetcodeId: 259 }
    ]
  },
  {
    number: 2,
    name: "Two Pointers - Fast & Slow (Cycle Detection)",
    problems: [
      { title: "Linked List Cycle", leetcodeId: 141 },
      { title: "Happy Number", leetcodeId: 202 },
      { title: "Find the Duplicate Number", leetcodeId: 287 }
    ]
  },
  {
    number: 3,
    name: "Two Pointers - Fixed Separation (Nth Node from End)",
    problems: [
      { title: "Remove Nth Node From End of List", leetcodeId: 19 },
      { title: "Middle of the Linked List", leetcodeId: 876 },
      { title: "Delete the Middle Node of a Linked List", leetcodeId: 2095 }
    ]
  },
  // Sliding Window Patterns
  {
    number: 8,
    name: "Sliding Window - Fixed Size (Subarray Calculation)",
    problems: [
      { title: "Moving Average from Data Stream", leetcodeId: 346 },
      { title: "Maximum Average Subarray I", leetcodeId: 643 }
    ]
  },
  {
    number: 9,
    name: "Sliding Window - Variable Size (Condition-Based)",
    problems: [
      { title: "Longest Substring Without Repeating Characters", leetcodeId: 3 },
      { title: "Minimum Window Substring", leetcodeId: 76 },
      { title: "Minimum Size Subarray Sum", leetcodeId: 209 },
      { title: "Contains Duplicate II", leetcodeId: 219 },
      { title: "Longest Repeating Character Replacement", leetcodeId: 424 },
      { title: "Subarray Product Less Than K", leetcodeId: 713 },
      { title: "Fruit Into Baskets", leetcodeId: 904 },
      { title: "Max Consecutive Ones III", leetcodeId: 1004 }
    ]
  },
  // Tree Patterns
  {
    number: 12,
    name: "Tree BFS - Level Order Traversal",
    problems: [
      { title: "Binary Tree Level Order Traversal", leetcodeId: 102 },
      { title: "Binary Tree Zigzag Level Order Traversal", leetcodeId: 103 },
      { title: "Binary Tree Right Side View", leetcodeId: 199 },
      { title: "Find Largest Value in Each Tree Row", leetcodeId: 515 },
      { title: "Maximum Level Sum of a Binary Tree", leetcodeId: 1161 }
    ]
  },
  {
    number: 13,
    name: "Tree DFS - Recursive Preorder Traversal",
    problems: [
      { title: "Same Tree", leetcodeId: 100 },
      { title: "Symmetric Tree", leetcodeId: 101 },
      { title: "Construct Binary Tree from Preorder and Inorder Traversal", leetcodeId: 105 },
      { title: "Flatten Binary Tree to Linked List", leetcodeId: 114 },
      { title: "Invert Binary Tree", leetcodeId: 226 },
      { title: "Binary Tree Paths", leetcodeId: 257 }
    ]
  },
  // Dynamic Programming Patterns
  {
    number: 27,
    name: "DP - 1D Array (Fibonacci Style)",
    problems: [
      { title: "Climbing Stairs", leetcodeId: 70 },
      { title: "Decode Ways", leetcodeId: 91 },
      { title: "House Robber", leetcodeId: 198 },
      { title: "House Robber II", leetcodeId: 213 },
      { title: "Fibonacci Number", leetcodeId: 509 },
      { title: "Delete and Earn", leetcodeId: 740 },
      { title: "Min Cost Climbing Stairs", leetcodeId: 746 }
    ]
  },
  {
    number: 28,
    name: "DP - 1D Array (Kadane's Algorithm for Max/Min Subarray)",
    problems: [
      { title: "Maximum Subarray", leetcodeId: 53 }
    ]
  },
  // More patterns can be added following the same structure...
];

// Function to get pattern by number
export function getPattern(patternNumber: number) {
  return PATTERNS.find(p => p.number === patternNumber);
}

// Function to get all patterns with their problem counts
export function getAllPatternsWithCounts() {
  return PATTERNS.map(pattern => ({
    number: pattern.number,
    name: pattern.name,
    count: pattern.problems.length
  }));
}

// Function to create mock problems with pattern information
export function createProblemsWithPatterns() {
  const problems: any[] = [];
  
  PATTERNS.forEach(pattern => {
    pattern.problems.forEach((problem, index) => {
      problems.push({
        title: problem.title,
        description: `Solve ${problem.title} using the ${pattern.name} pattern.`,
        difficulty: index % 3 === 0 ? 'Easy' : index % 3 === 1 ? 'Medium' : 'Hard',
        topics: [pattern.name.split(' - ')[0]], // Extract main topic
        companies: [], // Will be replaced with pattern info
        leetcodeId: problem.leetcodeId,
        patternNumber: pattern.number,
        patternName: pattern.name,
        solution: `// ${pattern.name} Solution\n// Time Complexity: O(n)\n// Space Complexity: O(1)\n\nfunction solve() {\n  // Implementation here\n}`,
        hints: [`Use ${pattern.name} approach`, "Think about the pattern", "Consider edge cases"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        importOrder: problems.length + 1
      });
    });
  });
  
  return problems;
}