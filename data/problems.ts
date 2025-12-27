export const problems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    difficulty: "Easy",
    category: "Array",
    patterns: JSON.stringify(["Hash Map", "Array Traversal"]),
    hints: JSON.stringify([
      "Think about what you need to find for each number - you're looking for target - current number",
      "Can you store the numbers you've seen in a way that allows O(1) lookup?",
      "A hash map can store numbers as keys and their indices as values"
    ]),
    testCases: JSON.stringify([
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        output: [0, 1],
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        output: [1, 2]
      },
      {
        input: { nums: [3, 3], target: 6 },
        output: [0, 1]
      }
    ]),
    starterCode: JSON.stringify({
      javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Your code here\n};",
      python: "from typing import List\n\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Your code here\n        pass",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}"
    })
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: "Easy",
    category: "Stack",
    patterns: JSON.stringify(["Stack", "String Parsing"]),
    hints: JSON.stringify([
      "What data structure follows Last-In-First-Out (LIFO) principle?",
      "When you see an opening bracket, what should you expect next?",
      "Use a stack to keep track of opening brackets, and match them with closing brackets"
    ]),
    testCases: JSON.stringify([
      {
        input: { s: "()" },
        output: true
      },
      {
        input: { s: "()[]{}" },
        output: true
      },
      {
        input: { s: "(]" },
        output: false
      }
    ]),
    starterCode: JSON.stringify({
      javascript: "/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    // Your code here\n};",
      python: "from typing import List\n\nclass Solution:\n    def isValid(self, s: str) -> bool:\n        # Your code here\n        pass",
      java: "class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}"
    })
  },
  {
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    difficulty: "Easy",
    category: "Linked List",
    patterns: JSON.stringify(["Two Pointers", "Linked List Manipulation", "Iteration"]),
    hints: JSON.stringify([
      "You need to reverse the direction of all next pointers",
      "Keep track of three pointers: previous, current, and next",
      "Iterate through the list, reversing one pointer at a time"
    ]),
    testCases: JSON.stringify([
      {
        input: { head: [1, 2, 3, 4, 5] },
        output: [5, 4, 3, 2, 1]
      },
      {
        input: { head: [1, 2] },
        output: [2, 1]
      },
      {
        input: { head: [] },
        output: []
      }
    ]),
    starterCode: JSON.stringify({
      javascript: "/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nvar reverseList = function(head) {\n    // Your code here\n};",
      python: "from typing import List\n\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Your code here\n        pass",
      java: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n    }\n}"
    })
  },
  {
    title: "Contains Duplicate",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.\n\nExample 1:\nInput: nums = [1,2,3,1]\nOutput: true\n\nExample 2:\nInput: nums = [1,2,3,4]\nOutput: false\n\nExample 3:\nInput: nums = [1,1,1,3,3,4,3,2,4,2]\nOutput: true",
    difficulty: "Easy",
    category: "Array",
    patterns: JSON.stringify(["Hash Set", "Sorting"]),
    hints: JSON.stringify([
      "What data structure allows O(1) lookup to check if we've seen a number before?",
      "A Set can store unique elements - if we try to add a duplicate, we know we found one",
      "Alternative: Sort the array first, then check adjacent elements"
    ]),
    testCases: JSON.stringify([
      {
        input: { nums: [1, 2, 3, 1] },
        output: true,
        explanation: "The number 1 appears twice"
      },
      {
        input: { nums: [1, 2, 3, 4] },
        output: false,
        explanation: "All elements are distinct"
      },
      {
        input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] },
        output: true,
        explanation: "Multiple duplicates exist"
      }
    ]),
    starterCode: JSON.stringify({
      javascript: "/**\n * @param {number[]} nums\n * @return {boolean}\n */\nvar containsDuplicate = function(nums) {\n    // Your code here\n};",
      python: "from typing import List\n\nclass Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        # Your code here\n        pass",
      java: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n    }\n}"
    })
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.\n\nExample 1:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n\nExample 2:\nInput: nums = [1]\nOutput: 1\n\nExample 3:\nInput: nums = [5,4,-1,7,8]\nOutput: 23",
    difficulty: "Medium",
    category: "Array",
    patterns: JSON.stringify(["Dynamic Programming", "Kadane's Algorithm", "Divide and Conquer"]),
    hints: JSON.stringify([
      "At each position, you have two choices: extend the previous subarray or start a new subarray",
      "Keep track of the maximum sum ending at each position",
      "This is a classic application of Kadane's Algorithm - the current max is either the current element alone or current element + previous max"
    ]),
    testCases: JSON.stringify([
      {
        input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
        output: 6,
        explanation: "Subarray [4,-1,2,1] has the largest sum 6"
      },
      {
        input: { nums: [1] },
        output: 1,
        explanation: "Single element is the maximum subarray"
      },
      {
        input: { nums: [5, 4, -1, 7, 8] },
        output: 23,
        explanation: "The entire array is the maximum subarray"
      }
    ]),
    starterCode: JSON.stringify({
      javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar maxSubArray = function(nums) {\n    // Your code here\n};",
      python: "from typing import List\n\nclass Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        # Your code here\n        pass",
      java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n    }\n}"
    })
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.\n\nExample 1:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.\n\nExample 2:\nInput: s = \"bbbbb\"\nOutput: 1\nExplanation: The answer is \"b\", with the length of 1.\n\nExample 3:\nInput: s = \"pwwkew\"\nOutput: 3\nExplanation: The answer is \"wke\", with the length of 3.",
    difficulty: "Medium",
    category: "String",
    patterns: JSON.stringify(["Sliding Window", "Hash Map", "Two Pointers"]),
    hints: JSON.stringify([
      "Use a sliding window approach with two pointers - expand the window when characters are unique",
      "Use a Set or Map to track characters in the current window",
      "When you find a duplicate, shrink the window from the left until the duplicate is removed"
    ]),
    testCases: JSON.stringify([
      {
        input: { s: "abcabcbb" },
        output: 3,
        explanation: "The longest substring is 'abc' with length 3"
      },
      {
        input: { s: "bbbbb" },
        output: 1,
        explanation: "The longest substring is 'b' with length 1"
      },
      {
        input: { s: "pwwkew" },
        output: 3,
        explanation: "The longest substring is 'wke' with length 3"
      }
    ]),
    starterCode: JSON.stringify({
      javascript: "/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    // Your code here\n};",
      python: "from typing import List\n\nclass Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Your code here\n        pass",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n    }\n}"
    })
  },
  {
    title: "Merge Two Sorted Lists",
    description: "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\nExample 1:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]\n\nExample 2:\nInput: list1 = [], list2 = []\nOutput: []\n\nExample 3:\nInput: list1 = [], list2 = [0]\nOutput: [0]",
    difficulty: "Easy",
    category: "Linked List",
    patterns: JSON.stringify(["Two Pointers", "Linked List Manipulation", "Recursion"]),
    hints: JSON.stringify([
      "Use a dummy node to simplify the logic of building the result list",
      "Compare the values of the current nodes from both lists and attach the smaller one",
      "Move the pointer of the list from which you took the node, and repeat"
    ]),
    testCases: JSON.stringify([
      {
        input: { list1: [1, 2, 4], list2: [1, 3, 4] },
        output: [1, 1, 2, 3, 4, 4],
        explanation: "Merge both sorted lists into one"
      },
      {
        input: { list1: [], list2: [] },
        output: [],
        explanation: "Both lists are empty"
      },
      {
        input: { list1: [], list2: [0] },
        output: [0],
        explanation: "One list is empty"
      }
    ]),
    starterCode: JSON.stringify({
      javascript: "/**\n * @param {ListNode} list1\n * @param {ListNode} list2\n * @return {ListNode}\n */\nvar mergeTwoLists = function(list1, list2) {\n    // Your code here\n};",
      python: "from typing import List\n\nclass Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        # Your code here\n        pass",
      java: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Your code here\n    }\n}"
    })
  },
  {
    title: "Maximum Depth of Binary Tree",
    description: "Given the root of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: 3\n\nExample 2:\nInput: root = [1,null,2]\nOutput: 2",
    difficulty: "Easy",
    category: "Tree",
    patterns: JSON.stringify(["DFS", "BFS", "Recursion", "Tree Traversal"]),
    hints: JSON.stringify([
      "Think recursively - the depth of a tree is 1 + the maximum depth of its subtrees",
      "Base case: if the node is null, the depth is 0",
      "For each node, calculate max(depth of left subtree, depth of right subtree) + 1"
    ]),
    testCases: JSON.stringify([
      {
        input: { root: [3, 9, 20, null, null, 15, 7] },
        output: 3,
        explanation: "The maximum depth is 3 (root -> 20 -> 15)"
      },
      {
        input: { root: [1, null, 2] },
        output: 2,
        explanation: "The maximum depth is 2 (root -> 2)"
      },
      {
        input: { root: [] },
        output: 0,
        explanation: "Empty tree has depth 0"
      }
    ]),
    starterCode: JSON.stringify({
      javascript: "/**\n * @param {TreeNode} root\n * @return {number}\n */\nvar maxDepth = function(root) {\n    // Your code here\n};",
      python: "from typing import List\n\nclass Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        # Your code here\n        pass",
      java: "class Solution {\n    public int maxDepth(TreeNode root) {\n        // Your code here\n    }\n}"
    })
  }
];