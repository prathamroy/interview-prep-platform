import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases } = await request.json();

    // Mock execution for now - we'll implement real execution later
    // This simulates running the code against test cases
    
    const results = testCases.map((testCase: any, index: number) => {
      // Simulate random pass/fail for demo purposes
      const passed = Math.random() > 0.3; // 70% pass rate for demo
      
      return {
        passed,
        expected: testCase.output,
        actual: passed ? testCase.output : null,
        testCase: index + 1,
      };
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}