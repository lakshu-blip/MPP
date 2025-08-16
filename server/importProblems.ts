import { db } from "./db";
import { problems } from "@shared/schema";

// Comprehensive problem data from the BYTS SDE Sheet
const problemData = [
  // I. Two Pointer Patterns
  { pattern: "Two Pointers - Converging", problems: [
    "1. Two Sum", "11. Container With Most Water", "15. 3Sum", "16. 3Sum Closest", "18. 4Sum", 
    "167. Two Sum II - Input Array Is Sorted", "349. Intersection of Two Arrays", "392. Is Subsequence", 
    "881. Boats to Save People", "977. Squares of a Sorted Array", "259. 3Sum Smaller"
  ]},
  { pattern: "Two Pointers - Fast & Slow", problems: [
    "141. Linked List Cycle", "202. Happy Number", "287. Find the Duplicate Number"
  ]},
  { pattern: "Two Pointers - Fixed Separation", problems: [
    "19. Remove Nth Node From End of List", "876. Middle of the Linked List", "2095. Delete the Middle Node of a Linked List"
  ]},
  { pattern: "Two Pointers - In-place Array", problems: [
    "26. Remove Duplicates from Sorted Array", "27. Remove Element", "75. Sort Colors", 
    "80. Remove Duplicates from Sorted Array II", "283. Move Zeroes", "443. String Compression", 
    "905. Sort Array By Parity", "2337. Move Pieces to Obtain a String", "2938. Separate Black and White Balls"
  ]},
  { pattern: "Two Pointers - String Backspaces", problems: ["844. Backspace String Compare"] },
  { pattern: "Two Pointers - Expanding Center", problems: [
    "5. Longest Palindromic Substring", "647. Palindromic Substrings"
  ]},
  { pattern: "Two Pointers - String Reversal", problems: [
    "151. Reverse Words in a String", "344. Reverse String", "345. Reverse Vowels of a String", "541. Reverse String II"
  ]},
  
  // II. Sliding Window Patterns
  { pattern: "Sliding Window - Fixed Size", problems: [
    "346. Moving Average from Data Stream", "643. Maximum Average Subarray I", "2985. Calculate Compressed Mean", 
    "3254. Find the Power of K-Size Subarrays I", "3318. Find X-Sum of All K-Long Subarrays I"
  ]},
  { pattern: "Sliding Window - Variable Size", problems: [
    "3. Longest Substring Without Repeating Characters", "76. Minimum Window Substring", "209. Minimum Size Subarray Sum", 
    "219. Contains Duplicate II", "424. Longest Repeating Character Replacement", "713. Subarray Product Less Than K", 
    "904. Fruit Into Baskets", "1004. Max Consecutive Ones III", "1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", 
    "1493. Longest Subarray of 1's After Deleting One Element"
  ]},
  { pattern: "Sliding Window - Monotonic Queue", problems: [
    "239. Sliding Window Maximum", "862. Shortest Subarray with Sum at Least K", "1696. Jump Game VI"
  ]},
  { pattern: "Sliding Window - Character Frequency", problems: [
    "438. Find All Anagrams in a String", "567. Permutation in String"
  ]},

  // III. Tree Traversal Patterns
  { pattern: "Tree BFS - Level Order", problems: [
    "102. Binary Tree Level Order Traversal", "103. Binary Tree Zigzag Level Order Traversal", 
    "199. Binary Tree Right Side View", "515. Find Largest Value in Each Tree Row", "1161. Maximum Level Sum of a Binary Tree"
  ]},
  { pattern: "Tree DFS - Preorder", problems: [
    "100. Same Tree", "101. Symmetric Tree", "105. Construct Binary Tree from Preorder and Inorder Traversal", 
    "114. Flatten Binary Tree to Linked List", "226. Invert Binary Tree", "257. Binary Tree Paths", "988. Smallest String Starting From Leaf"
  ]},
  { pattern: "Tree DFS - Inorder", problems: [
    "94. Binary Tree Inorder Traversal", "98. Validate Binary Search Tree", "173. Binary Search Tree Iterator", 
    "230. Kth Smallest Element in a BST", "501. Find Mode in Binary Search Tree", "530. Minimum Absolute Difference in BST"
  ]},
  { pattern: "Tree DFS - Postorder", problems: [
    "104. Maximum Depth of Binary Tree", "110. Balanced Binary Tree", "124. Binary Tree Maximum Path Sum", 
    "145. Binary Tree Postorder Traversal", "337. House Robber III", "366. Find Leaves of Binary Tree", 
    "543. Diameter of Binary Tree", "863. All Nodes Distance K in Binary Tree", "1110. Delete Nodes And Return Forest", 
    "2458. Height of Binary Tree After Subtree Removal Queries"
  ]},
  { pattern: "Tree - Lowest Common Ancestor", problems: [
    "235. Lowest Common Ancestor of a Binary Search Tree", "236. Lowest Common Ancestor of a Binary Tree"
  ]},
  { pattern: "Tree - Serialization", problems: [
    "297. Serialize and Deserialize Binary Tree", "572. Subtree of Another Tree", "652. Find Duplicate Subtrees"
  ]},

  // IV. Graph Traversal Patterns
  { pattern: "Graph DFS - Connected Components", problems: [
    "130. Surrounded Regions", "200. Number of Islands", "417. Pacific Atlantic Water Flow", "547. Number of Provinces", 
    "695. Max Area of Island", "733. Flood Fill", "841. Keys and Rooms", "1020. Number of Enclaves", 
    "1254. Number of Closed Islands", "1905. Count Sub Islands", "2101. Detonate the Maximum Bombs"
  ]},
  { pattern: "Graph BFS - Connected Components", problems: [
    "127. Word Ladder", "542. 01 Matrix", "994. Rotting Oranges", "1091. Shortest Path in Binary Matrix"
  ]},
  { pattern: "Graph DFS - Cycle Detection", problems: [
    "207. Course Schedule", "210. Course Schedule II", "802. Find Eventual Safe States", "1059. All Paths from Source Lead to Destination"
  ]},
  { pattern: "Graph BFS - Topological Sort", problems: [
    "207. Course Schedule", "210. Course Schedule II", "269. Alien Dictionary", "310. Minimum Height Trees", 
    "444. Sequence Reconstruction", "1136. Parallel Courses", "1857. Largest Color Value in a Directed Graph", 
    "2050. Parallel Courses III", "2115. Find All Possible Recipes from Given Supplies", "2392. Build a Matrix With Conditions"
  ]},
  { pattern: "Graph - Deep Copy", problems: ["133. Clone Graph"] },
  { pattern: "Graph - Dijkstra's Algorithm", problems: [
    "743. Network Delay Time", "778. Swim in Rising Water", "1514. Path with Maximum Probability", 
    "1631. Path With Minimum Effort", "1976. Number of Ways to Arrive at Destination", 
    "2045. Second Minimum Time to Reach Destination", "2203. Minimum Weighted Subgraph With the Required Paths", 
    "2290. Minimum Obstacle Removal to Reach Corner", "2577. Minimum Time to Visit a Cell In a Grid", "2812. Find the Safest Path in a Grid"
  ]},
  { pattern: "Graph - Bellman-Ford", problems: ["787. Cheapest Flights Within K Stops"] },
  { pattern: "Graph - Union-Find", problems: [
    "200. Number of Islands", "261. Graph Valid Tree", "305. Number of Islands II", 
    "323. Number of Connected Components in an Undirected Graph", "547. Number of Provinces", 
    "684. Redundant Connection", "721. Accounts Merge", "737. Sentence Similarity II", 
    "947. Most Stones Removed with Same Row or Column", "952. Largest Component Size by Common Factor", 
    "959. Regions Cut By Slashes", "1101. The Earliest Moment When Everyone Become Friends"
  ]},

  // V. Dynamic Programming Patterns
  { pattern: "DP - 1D Fibonacci Style", problems: [
    "70. Climbing Stairs", "91. Decode Ways", "198. House Robber", "213. House Robber II", 
    "337. House Robber III", "509. Fibonacci Number", "740. Delete and Earn", "746. Min Cost Climbing Stairs"
  ]},
  { pattern: "DP - Kadane's Algorithm", problems: ["53. Maximum Subarray"] },
  { pattern: "DP - Coin Change", problems: ["322. Coin Change", "377. Combination Sum IV", "518. Coin Change II"] },
  { pattern: "DP - 0/1 Knapsack", problems: ["416. Partition Equal Subset Sum", "494. Target Sum"] },
  { pattern: "DP - Word Break", problems: ["139. Word Break", "140. Word Break II"] },
  { pattern: "DP - Longest Common Subsequence", problems: ["583. Delete Operation for Two Strings", "1143. Longest Common Subsequence"] },
  { pattern: "DP - Edit Distance", problems: ["72. Edit Distance"] },
  { pattern: "DP - Grid Paths", problems: [
    "62. Unique Paths", "63. Unique Paths II", "64. Minimum Path Sum", "120. Triangle", 
    "221. Maximal Square", "931. Minimum Falling Path Sum", "1277. Count Square Submatrices with All Ones"
  ]},
  { pattern: "DP - Interval DP", problems: ["312. Burst Balloons", "546. Remove Boxes"] },
  { pattern: "DP - Catalan Numbers", problems: [
    "95. Unique Binary Search Trees II", "96. Unique Binary Search Trees", "241. Different Ways to Add Parentheses"
  ]},
  { pattern: "DP - Longest Increasing Subsequence", problems: [
    "300. Longest Increasing Subsequence", "354. Russian Doll Envelopes", 
    "1671. Minimum Number of Removals to Make Mountain Array", "2407. Longest Increasing Subsequence II"
  ]},

  // VI. Heap Patterns
  { pattern: "Heap - Top K Elements", problems: [
    "215. Kth Largest Element in an Array", "347. Top K Frequent Elements", "451. Sort Characters By Frequency", 
    "506. Relative Ranks", "703. Kth Largest Element in a Stream", "973. K Closest Points to Origin", 
    "1046. Last Stone Weight", "2558. Take Gifts From the Richest Pile"
  ]},
  { pattern: "Heap - Two Heaps Median", problems: ["295. Find Median from Data Stream", "1825. Finding MK Average"] },
  { pattern: "Heap - K-way Merge", problems: [
    "23. Merge k Sorted Lists", "373. Find K Pairs with Smallest Sums", 
    "378. Kth Smallest Element in a Sorted Matrix", "632. Smallest Range Covering Elements from K Lists"
  ]},
  { pattern: "Heap - Scheduling", problems: [
    "253. Meeting Rooms II", "767. Reorganize String", "857. Minimum Cost to Hire K Workers", 
    "1642. Furthest Building You Can Reach", "1792. Maximum Average Pass Ratio", "1834. Single-Threaded CPU", 
    "1942. The Number of the Smallest Unoccupied Chair", "2402. Meeting Rooms III"
  ]},

  // VII. Backtracking Patterns
  { pattern: "Backtracking - Subsets", problems: [
    "17. Letter Combinations of a Phone Number", "77. Combinations", "78. Subsets", "90. Subsets II"
  ]},
  { pattern: "Backtracking - Permutations", problems: [
    "31. Next Permutation", "46. Permutations", "60. Permutation Sequence"
  ]},
  { pattern: "Backtracking - Combination Sum", problems: ["39. Combination Sum", "40. Combination Sum II"] },
  { pattern: "Backtracking - Parentheses", problems: ["22. Generate Parentheses", "301. Remove Invalid Parentheses"] },
  { pattern: "Backtracking - Word Search", problems: [
    "79. Word Search", "212. Word Search II", "2018. Check if Word Can Be Placed In Crossword"
  ]},
  { pattern: "Backtracking - N-Queens", problems: ["37. Sudoku Solver", "51. N-Queens"] },
  { pattern: "Backtracking - Palindrome Partitioning", problems: ["131. Palindrome Partitioning"] },

  // VIII. Greedy Patterns
  { pattern: "Greedy - Interval Scheduling", problems: [
    "56. Merge Intervals", "57. Insert Interval", "759. Employee Free Time", 
    "986. Interval List Intersections", "2406. Divide Intervals Into Minimum Number of Groups"
  ]},
  { pattern: "Greedy - Jump Game", problems: ["45. Jump Game II", "55. Jump Game"] },
  { pattern: "Greedy - Buy/Sell Stock", problems: [
    "121. Best Time to Buy and Sell Stock", "122. Best Time to Buy and Sell Stock II"
  ]},
  { pattern: "Greedy - Gas Station", problems: ["134. Gas Station"] },
  { pattern: "Greedy - Task Scheduling", problems: ["621. Task Scheduler"] },

  // IX. Binary Search Patterns
  { pattern: "Binary Search - Sorted Array", problems: [
    "35. Search Insert Position", "69. Sqrt(x)", "74. Search a 2D Matrix", "278. First Bad Version", 
    "374. Guess Number Higher or Lower", "540. Single Element in a Sorted Array", "704. Binary Search", 
    "1539. Kth Missing Positive Number"
  ]},
  { pattern: "Binary Search - Rotated Array", problems: [
    "33. Search in Rotated Sorted Array", "81. Search in Rotated Sorted Array II", 
    "153. Find Minimum in Rotated Sorted Array", "162. Find Peak Element", 
    "852. Peak Index in a Mountain Array", "1095. Find in Mountain Array"
  ]},
  { pattern: "Binary Search - Answer Search", problems: [
    "410. Split Array Largest Sum", "774. Minimize Max Distance to Gas Station", "875. Koko Eating Bananas", 
    "1011. Capacity To Ship Packages Within D Days", "1482. Minimum Number of Days to Make m Bouquets", 
    "1760. Minimum Limit of Balls in a Bag", "2064. Minimized Maximum of Products Distributed to Any Store", 
    "2226. Maximum Candies Allocated to K Children"
  ]},
  { pattern: "Binary Search - First/Last Occurrence", problems: [
    "34. Find First and Last Position of Element in Sorted Array", "658. Find K Closest Elements"
  ]},
  { pattern: "Binary Search - Median Arrays", problems: ["4. Median of Two Sorted Arrays"] },

  // X. Stack Patterns
  { pattern: "Stack - Valid Parentheses", problems: [
    "20. Valid Parentheses", "32. Longest Valid Parentheses", "921. Minimum Add to Make Parentheses Valid", 
    "1249. Minimum Remove to Make Valid Parentheses", "1963. Minimum Number of Swaps to Make the String Balanced"
  ]},
  { pattern: "Stack - Monotonic Stack", problems: [
    "402. Remove K Digits", "496. Next Greater Element I", "503. Next Greater Element II", "739. Daily Temperatures", 
    "901. Online Stock Span", "907. Sum of Subarray Minimums", "962. Maximum Width Ramp", 
    "1475. Final Prices With a Special Discount in a Shop", "1673. Find the Most Competitive Subsequence"
  ]},
  { pattern: "Stack - Expression Evaluation", problems: [
    "150. Evaluate Reverse Polish Notation", "224. Basic Calculator", "227. Basic Calculator II", "772. Basic Calculator III"
  ]},
  { pattern: "Stack - Simulation", problems: ["71. Simplify Path", "394. Decode String", "735. Asteroid Collision"] },
  { pattern: "Stack - Min Stack", problems: ["155. Min Stack"] },
  { pattern: "Stack - Largest Rectangle", problems: ["84. Largest Rectangle in Histogram", "85. Maximal Rectangle"] },

  // XI. Bit Manipulation Patterns
  { pattern: "Bitwise XOR", problems: [
    "136. Single Number", "137. Single Number II", "268. Missing Number", "389. Find the Difference"
  ]},
  { pattern: "Bitwise Counting", problems: ["191. Number of 1 Bits", "338. Counting Bits"] },
  { pattern: "Bitwise Power Check", problems: ["231. Power of Two", "342. Power of Four"] },

  // XII. Linked List Patterns
  { pattern: "Linked List - Reversal", problems: [
    "83. Remove Duplicates from Sorted List", "92. Reverse Linked List II", "206. Reverse Linked List", 
    "25. Reverse Nodes in k-Group", "234. Palindrome Linked List", "82. Remove Duplicates from Sorted List II"
  ]},
  { pattern: "Linked List - Merging", problems: ["21. Merge Two Sorted Lists"] },
  { pattern: "Linked List - Addition", problems: ["2. Add Two Numbers", "369. Plus One Linked List"] },
  { pattern: "Linked List - Intersection", problems: ["160. Intersection of Two Linked Lists"] },
  { pattern: "Linked List - Reordering", problems: [
    "24. Swap Nodes in Pairs", "61. Rotate List", "86. Partition List", "143. Reorder List", "328. Odd Even Linked List"
  ]},

  // XIII. Array/Matrix Patterns
  { pattern: "Array - Rotation", problems: ["48. Rotate Image", "189. Rotate Array"] },
  { pattern: "Array - Spiral Traversal", problems: ["54. Spiral Matrix", "885. Spiral Matrix III", "2326. Spiral Matrix IV"] },
  { pattern: "Array - Matrix Zeroes", problems: ["73. Set Matrix Zeroes"] },
  { pattern: "Array - Product Except Self", problems: ["238. Product of Array Except Self"] },
  { pattern: "Array - Plus One", problems: ["66. Plus One"] },
  { pattern: "Array - Merge Sorted", problems: ["88. Merge Sorted Array"] },
  { pattern: "Array - Cyclic Sort", problems: [
    "41. First Missing Positive", "268. Missing Number", "287. Find the Duplicate Number", 
    "442. Find All Duplicates in an Array", "448. Find All Numbers Disappeared in an Array"
  ]},
  { pattern: "Array - Maximum Product", problems: ["152. Maximum Product Subarray"] },

  // XIV. String Patterns
  { pattern: "String - Palindrome", problems: ["9. Palindrome Number", "125. Valid Palindrome", "680. Valid Palindrome II"] },
  { pattern: "String - Anagram", problems: ["49. Group Anagrams", "242. Valid Anagram"] },
  { pattern: "String - Roman Integer", problems: ["13. Roman to Integer"] },
  { pattern: "String - atoi", problems: ["8. String to Integer (atoi)"] },
  { pattern: "String - Multiply", problems: ["43. Multiply Strings"] },
  { pattern: "String - Pattern Matching", problems: [
    "28. Find the Index of the First Occurrence in a String", "214. Shortest Palindrome", 
    "686. Repeated String Match", "796. Rotate String", "3008. Find Beautiful Indices in the Given Array II"
  ]},
  { pattern: "String - Repeated Pattern", problems: ["459. Repeated Substring Pattern"] },

  // XV. Design Patterns
  { pattern: "Design - Data Structures", problems: [
    "146. LRU Cache", "155. Min Stack", "208. Implement Trie (Prefix Tree)", 
    "211. Design Add and Search Words Data Structure", "225. Implement Stack using Queues", 
    "232. Implement Queue using Stacks", "295. Find Median from Data Stream", "460. LFU Cache", 
    "706. Design HashMap", "981. Time Based Key-Value Store"
  ]}
];

function parseProblemTitle(problemStr: string): { leetcodeId: number | null, title: string } {
  const match = problemStr.match(/^(\d+)\.\s*(.+)$/);
  if (match) {
    return {
      leetcodeId: parseInt(match[1]),
      title: match[2].trim()
    };
  }
  return { leetcodeId: null, title: problemStr.trim() };
}

function getTopicFromPattern(pattern: string): string[] {
  const topicMapping: { [key: string]: string[] } = {
    "Two Pointers": ["Arrays", "Two Pointers"],
    "Sliding Window": ["Arrays", "Sliding Window"],
    "Tree": ["Trees", "Binary Tree"],
    "Graph": ["Graphs", "Graph Theory"],
    "DP": ["Dynamic Programming"],
    "Heap": ["Heap", "Priority Queue"],
    "Backtracking": ["Backtracking", "Recursion"],
    "Greedy": ["Greedy"],
    "Binary Search": ["Binary Search"],
    "Stack": ["Stack"],
    "Bitwise": ["Bit Manipulation"],
    "Linked List": ["Linked List"],
    "Array": ["Arrays"],
    "String": ["Strings"],
    "Design": ["Design", "Data Structure"]
  };

  for (const [key, topics] of Object.entries(topicMapping)) {
    if (pattern.includes(key)) {
      return topics;
    }
  }
  return ["Algorithms"];
}

function getDifficultyFromLeetcodeId(leetcodeId: number | null): 'Easy' | 'Medium' | 'Hard' {
  if (!leetcodeId) return 'Medium';
  
  // Common easy problems (1-100 range with some exceptions)
  const easyProblems = [1, 9, 13, 20, 21, 26, 27, 35, 53, 66, 69, 70, 83, 88, 94, 100, 101, 104, 108, 110, 111, 112, 118, 119, 121, 125, 136, 141, 155, 160, 167, 168, 169, 171, 172, 175, 189, 190, 191, 193, 195, 196, 197, 198, 202, 203, 204, 205, 206, 217, 219, 225, 226, 231, 232, 234, 235, 237, 242, 243, 246, 252, 257, 258, 263, 266, 268, 270, 276, 278, 283, 290, 292, 293, 303, 326, 339, 342, 344, 345, 346, 349, 350, 359, 367, 374, 383, 387, 389, 392, 401, 404, 405, 408, 409, 412, 414, 415, 422, 427, 434, 437, 438, 441, 443, 447, 448, 453, 455, 459, 461, 463, 475, 476, 482, 485, 492, 496, 500, 501, 504, 506, 507, 509, 511, 512, 520, 521, 530, 532, 538, 541, 543, 551, 557, 559, 563, 566, 572, 575, 581, 589, 594, 598, 599, 605, 606, 617, 628, 633, 637, 643, 645, 653, 657, 661, 665, 669, 671, 674, 680, 682, 686, 687, 690, 693, 694, 696, 697, 700, 703, 704, 705, 706, 707, 709, 716, 717, 720, 724, 728, 733, 734, 735, 744, 746, 747, 748, 758, 760, 762, 766, 771, 783, 784, 788, 796, 804, 806, 811, 812, 819, 821, 824, 830, 832, 836, 844, 849, 852, 859, 860, 867, 868, 872, 874, 876, 883, 884, 888, 892, 893, 896, 897, 905, 908, 914, 917, 922, 925, 929, 933, 937, 938, 941, 942, 944, 949, 953, 961, 965, 970, 976, 977, 985, 988, 989, 993, 997, 999];
  
  // Common hard problems
  const hardProblems = [4, 10, 23, 25, 30, 32, 37, 41, 42, 44, 45, 51, 52, 57, 60, 65, 68, 72, 76, 84, 85, 87, 89, 97, 115, 123, 124, 126, 127, 128, 132, 140, 145, 149, 154, 158, 164, 174, 188, 212, 214, 218, 220, 224, 233, 239, 295, 297, 301, 312, 315, 321, 336, 354, 363, 381, 407, 410, 420, 425, 428, 432, 440, 446, 460, 465, 466, 472, 480, 483, 488, 489, 493, 502, 514, 517, 527, 546, 552, 564, 568, 587, 591, 629, 630, 632, 656, 668, 679, 683, 689, 699, 711, 719, 736, 741, 745, 753, 757, 761, 765, 768, 770, 772, 773, 780, 782, 787, 793, 798, 805, 818, 827, 829, 834, 839, 847, 850, 854, 862, 864, 878, 887, 895, 899, 906, 913, 920, 924, 927, 928, 943, 952, 956, 964, 968, 975, 987, 992, 1000];

  if (easyProblems.includes(leetcodeId)) return 'Easy';
  if (hardProblems.includes(leetcodeId)) return 'Hard';
  return 'Medium';
}

async function importAllProblems() {
  console.log("Starting import of problems from BYTS SDE Sheet...");
  
  let importOrder = 1;
  const allProblems = [];

  for (const patternGroup of problemData) {
    const { pattern, problems: problemList } = patternGroup;
    const topics = getTopicFromPattern(pattern);

    for (const problemStr of problemList) {
      const { leetcodeId, title } = parseProblemTitle(problemStr);
      const difficulty = getDifficultyFromLeetcodeId(leetcodeId);
      
      const problem = {
        title,
        description: `Problem from ${pattern} pattern. LeetCode problem focusing on ${topics.join(', ').toLowerCase()} concepts.`,
        difficulty,
        topics,
        companies: ["FAANG", "Google", "Amazon", "Facebook", "Apple", "Microsoft"],
        leetcodeId,
        solution: `Approach: Use ${pattern.toLowerCase()} technique to solve this problem efficiently.`,
        patterns: [pattern],
        hints: [`Consider using ${pattern.toLowerCase()} approach`, "Think about the time and space complexity"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        importOrder
      };

      allProblems.push(problem);
      importOrder++;
    }
  }

  console.log(`Prepared ${allProblems.length} problems for import...`);

  // Insert problems in batches
  const batchSize = 50;
  let imported = 0;

  for (let i = 0; i < allProblems.length; i += batchSize) {
    const batch = allProblems.slice(i, i + batchSize);
    
    try {
      await db.insert(problems).values(batch).onConflictDoNothing();
      imported += batch.length;
      console.log(`Imported batch ${Math.floor(i / batchSize) + 1}: ${imported}/${allProblems.length} problems`);
    } catch (error) {
      console.error(`Error importing batch ${Math.floor(i / batchSize) + 1}:`, error);
    }
  }

  console.log(`Import complete! Total problems imported: ${imported}`);
  return imported;
}

export { importAllProblems };