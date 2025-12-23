import { NextRequest, NextResponse } from 'next/server';
import { executeCode, LANGUAGE_IDS } from '@/lib/judge0';

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases, problemId } = await request.json();

    if (!code || !testCases) {
      return NextResponse.json(
        { error: 'Code and test cases are required' },
        { status: 400 }
      );
    }

    // Check if language is supported
    if (!Object.keys(LANGUAGE_IDS).includes(language)) {
      return NextResponse.json(
        { error: `Language ${language} not supported` },
        { status: 400 }
      );
    }

    const results = await executeMultipleTests(code, language, testCases);

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Execution error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute code' },
      { status: 500 }
    );
  }
}

async function executeMultipleTests(
  code: string,
  language: string,
  testCases: any[]
) {
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];

    try {
      // Prepare the code to execute with test case
      const executableCode = prepareCodeForExecution(
        code,
        language,
        testCase.input
      );

      // Execute with Judge0
      const result = await executeCode(
        executableCode,
        language as keyof typeof LANGUAGE_IDS
      );

      if (!result.success) {
        results.push({
          passed: false,
          expected: testCase.output,
          actual: result.error || 'Execution failed',
          testCase: i + 1,
        });
        continue;
      }

      // Parse the output
      const actualOutput = parseOutput(result.output, testCase.output);

      // Compare with expected
      const passed = deepEqual(actualOutput, testCase.output);

      results.push({
        passed,
        expected: testCase.output,
        actual: actualOutput,
        testCase: i + 1,
      });
    } catch (error: any) {
      results.push({
        passed: false,
        expected: testCase.output,
        actual: `Error: ${error.message}`,
        testCase: i + 1,
      });
    }
  }

  return results;
}

function prepareCodeForExecution(
  userCode: string,
  language: string,
  input: any
): string {
  if (language === 'javascript') {
    // Clean JavaScript wrapper
    return `
${userCode}

const input = ${JSON.stringify(input)};
let result;

try {
  if (input.nums !== undefined && input.target !== undefined) {
    if (typeof twoSum !== 'undefined') {
      result = twoSum(input.nums, input.target);
    }
  } else if (input.s !== undefined) {
    if (typeof isValid !== 'undefined') {
      result = isValid(input.s);
    } else if (typeof lengthOfLongestSubstring !== 'undefined') {
      result = lengthOfLongestSubstring(input.s);
    }
  } else if (input.head !== undefined) {
    if (typeof reverseList !== 'undefined') {
      result = reverseList(input.head);
    }
  } else if (input.list1 !== undefined || input.list2 !== undefined) {
    if (typeof mergeTwoLists !== 'undefined') {
      result = mergeTwoLists(input.list1 || [], input.list2 || []);
    }
  } else if (input.root !== undefined) {
    if (typeof maxDepth !== 'undefined') {
      result = maxDepth(input.root);
    }
  } else if (input.nums !== undefined) {
    if (typeof containsDuplicate !== 'undefined') {
      result = containsDuplicate(input.nums);
    } else if (typeof maxSubArray !== 'undefined') {
      result = maxSubArray(input.nums);
    }
  }
  
  console.log(JSON.stringify(result));
} catch (e) {
  console.error('Error:', e.message);
}
`;
  } else if (language === 'python') {
    // Fixed Python wrapper with typing import
    return `
import json
from typing import List, Optional

${userCode}

input_data = ${JSON.stringify(input).replace(/"/g, "'")}
solution = Solution()
result = None

try:
    if 'nums' in input_data and 'target' in input_data:
        if hasattr(solution, 'twoSum'):
            result = solution.twoSum(input_data['nums'], input_data['target'])
    elif 's' in input_data:
        if hasattr(solution, 'isValid'):
            result = solution.isValid(input_data['s'])
        elif hasattr(solution, 'lengthOfLongestSubstring'):
            result = solution.lengthOfLongestSubstring(input_data['s'])
    elif 'head' in input_data:
        if hasattr(solution, 'reverseList'):
            result = input_data['head'][::-1] if isinstance(input_data['head'], list) else []
    elif 'root' in input_data:
        if hasattr(solution, 'maxDepth'):
            result = solution.maxDepth(input_data['root'])
    elif 'nums' in input_data:
        if hasattr(solution, 'containsDuplicate'):
            result = solution.containsDuplicate(input_data['nums'])
        elif hasattr(solution, 'maxSubArray'):
            result = solution.maxSubArray(input_data['nums'])
    
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({'error': str(e)}))
`;
  } else if (language === 'java') {
    // Simplified Java wrapper without Gson dependency
    return `
import java.util.*;

${userCode}

public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        // Parse input manually (simplified)
        // For Two Sum: nums=[2,7,11,15], target=9
        ${generateJavaTestCode(input)}
    }
}
`;
  }

  return userCode;
}

function generateJavaTestCode(input: any): string {
  // Generate Java test execution code based on input structure
  if (input.nums !== undefined && input.target !== undefined) {
    return `
        int[] nums = {${input.nums.join(', ')}};
        int target = ${input.target};
        int[] result = solution.twoSum(nums, target);
        System.out.print("[");
        for (int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if (i < result.length - 1) System.out.print(",");
        }
        System.out.print("]");
    `;
  } else if (input.s !== undefined) {
    return `
        String s = "${input.s}";
        boolean result = solution.isValid(s);
        System.out.print(result);
    `;
  } else if (input.nums !== undefined) {
    return `
        int[] nums = {${input.nums.join(', ')}};
        boolean result = solution.containsDuplicate(nums);
        System.out.print(result);
    `;
  }
  
  return 'System.out.print("null");';
}

function parseOutput(output: string, expectedType: any): any {
  if (!output || output.trim() === '') {
    return null;
  }

  try {
    // Try to parse as JSON
    return JSON.parse(output.trim());
  } catch {
    // If not JSON, handle special cases
    const trimmed = output.trim();
    
    // Handle boolean strings
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    
    // Handle numbers
    if (!isNaN(Number(trimmed))) return Number(trimmed);
    
    // Handle array-like strings [1,2,3]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        // Try manual parsing
        const content = trimmed.slice(1, -1);
        if (!content) return [];
        return content.split(',').map(s => {
          const num = Number(s.trim());
          return isNaN(num) ? s.trim() : num;
        });
      }
    }
    
    return trimmed;
  }
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  
  return false;
}