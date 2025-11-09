export const problems = [
    {
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
      difficulty: "Easy",
      category: "Array",
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
        python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Your code here\n        pass",
        java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}"
      })
    },
    {
      title: "Valid Parentheses",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
      difficulty: "Easy",
      category: "Stack",
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
        python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Your code here\n        pass",
        java: "class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}"
      })
    },
    {
      title: "Reverse Linked List",
      description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      difficulty: "Easy",
      category: "Linked List",
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
        python: "class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Your code here\n        pass",
        java: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n    }\n}"
      })
    }
  ];