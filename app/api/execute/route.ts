import { NextRequest, NextResponse } from 'next/server';

const JUDGE0_LANGUAGE_IDS: { [key: string]: number } = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java
};

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases } = await request.json();

    if (!code || !testCases) {
      return NextResponse.json(
        { error: 'Code and test cases are required' },
        { status: 400 }
      );
    }

    // Check if Judge0 is configured
    if (!process.env.JUDGE0_API_KEY || !process.env.JUDGE0_HOST) {
      return NextResponse.json({
        error: 'Judge0 API not configured. Add JUDGE0_API_KEY and JUDGE0_HOST to environment variables.',
      }, { status: 500 });
    }

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      try {
        const result = await executeWithJudge0(code, language, testCase, i + 1);
        results.push(result);
      } catch (error: any) {
        results.push({
          passed: false,
          expected: testCase.output,
          actual: `Error: ${error.message}`,
          testCase: i + 1,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Execution error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute code' },
      { status: 500 }
    );
  }
}

async function executeWithJudge0(code: string, language: string, testCase: any, testNumber: number) {
  const languageId = JUDGE0_LANGUAGE_IDS[language];
  
  if (!languageId) {
    throw new Error(`Language ${language} not supported`);
  }

  // Prepare code with test case
  const wrappedCode = wrapCodeWithTest(code, language, testCase);

  // Submit to Judge0
  const submissionResponse = await fetch(
    `https://${process.env.JUDGE0_HOST}/submissions?base64_encoded=false&wait=true`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY!,
        'X-RapidAPI-Host': process.env.JUDGE0_HOST!,
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: wrappedCode,
        stdin: '',
      }),
    }
  );

  if (!submissionResponse.ok) {
    const errorText = await submissionResponse.text();
    throw new Error(`Judge0 API request failed: ${errorText}`);
  }

  const result = await submissionResponse.json();

  // Parse output and check if it matches expected
  let actualOutput;
  
  if (result.status.id === 3) { // Accepted
    try {
      const output = result.stdout?.trim() || 'null';
      actualOutput = JSON.parse(output);
    } catch {
      actualOutput = result.stdout?.trim();
    }
  } else if (result.status.id === 6) { // Compilation Error
    throw new Error(`Compilation error: ${result.compile_output || 'Unknown compilation error'}`);
  } else if (result.status.id === 11) { // Runtime Error
    throw new Error(`Runtime error: ${result.stderr || result.message || 'Unknown runtime error'}`);
  } else {
    throw new Error(result.stderr || result.status.description || 'Execution failed');
  }

  const passed = JSON.stringify(actualOutput) === JSON.stringify(testCase.output);

  return {
    passed,
    expected: testCase.output,
    actual: actualOutput,
    testCase: testNumber,
  };
}

function wrapCodeWithTest(code: string, language: string, testCase: any): string {
  const input = testCase.input;

  if (language === 'javascript') {
    return `
${code}

// Test execution
const input = ${JSON.stringify(input)};
let result;

try {
  if (typeof twoSum !== 'undefined') {
    result = twoSum(input.nums, input.target);
  } else if (typeof isValid !== 'undefined') {
    result = isValid(input.s);
  } else if (typeof containsDuplicate !== 'undefined') {
    result = containsDuplicate(input.nums);
  } else if (typeof maxSubArray !== 'undefined') {
    result = maxSubArray(input.nums);
  } else if (typeof lengthOfLongestSubstring !== 'undefined') {
    result = lengthOfLongestSubstring(input.s);
  } else if (typeof reverseList !== 'undefined') {
    result = reverseList(input.head);
  } else if (typeof mergeTwoLists !== 'undefined') {
    result = mergeTwoLists(input.list1, input.list2);
  } else if (typeof maxDepth !== 'undefined') {
    result = maxDepth(input.root);
  }
  
  console.log(JSON.stringify(result));
} catch (error) {
  console.log(JSON.stringify({ error: error.message }));
}
    `.trim();
  }

  if (language === 'python') {
    // Check if code already has typing import
    const hasTypingImport = code.includes('from typing import');
    const typingImport = hasTypingImport ? '' : 'from typing import List, Optional\n\n';
    
    return `
${typingImport}${code}

# Test execution
import json
import sys

input_data = ${JSON.stringify(input)}

try:
    solution = Solution()
    result = None
    
    if 'nums' in input_data and 'target' in input_data:
        result = solution.twoSum(input_data['nums'], input_data['target'])
    elif 's' in input_data:
        if hasattr(solution, 'isValid'):
            result = solution.isValid(input_data['s'])
        elif hasattr(solution, 'lengthOfLongestSubstring'):
            result = solution.lengthOfLongestSubstring(input_data['s'])
    elif 'nums' in input_data:
        if hasattr(solution, 'containsDuplicate'):
            result = solution.containsDuplicate(input_data['nums'])
        elif hasattr(solution, 'maxSubArray'):
            result = solution.maxSubArray(input_data['nums'])
    elif 'head' in input_data:
        result = solution.reverseList(input_data['head'])
    elif 'list1' in input_data and 'list2' in input_data:
        result = solution.mergeTwoLists(input_data['list1'], input_data['list2'])
    elif 'root' in input_data:
        result = solution.maxDepth(input_data['root'])
    
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    `.trim();
  }

  if (language === 'java') {
    return `
import java.util.*;

${code}

public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        // Parse input
        ${generateJavaTestCode(input)}
    }
}
    `.trim();
  }

  return code;
}

function generateJavaTestCode(input: any): string {
  // Simple Java test generation
  if (input.nums && input.target !== undefined) {
    return `
        int[] nums = ${JSON.stringify(input.nums).replace(/\[/g, '{').replace(/]/g, '}')};
        int target = ${input.target};
        int[] result = solution.twoSum(nums, target);
        System.out.println(java.util.Arrays.toString(result));
    `;
  }
  
  return 'System.out.println("[]");';
}