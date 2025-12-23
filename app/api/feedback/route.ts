import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { code, language, testResults, patterns } = await request.json();

    const passedCount = testResults?.filter((r: any) => r.passed).length || 0;
    const totalTests = testResults?.length || 0;

    // If OpenAI is not configured, provide helpful mock feedback
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        feedback: generateMockFeedback(passedCount, totalTests, patterns),
      });
    }

    // Real OpenAI feedback
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const patternContext = patterns && patterns.length > 0 
      ? `\nCommon patterns for this problem: ${patterns.join(', ')}`
      : '';

    const prompt = `You are an expert coding interview coach. Analyze this ${language} code and provide constructive feedback.

Code:
\`\`\`${language}
${code}
\`\`\`

Test Results: ${passedCount}/${totalTests} tests passed${patternContext}

Provide feedback covering:
1. **Correctness**: Did the solution work? If not, what's the issue?
2. **Pattern Recognition**: Which algorithmic patterns were used (${patterns?.join(', ') || 'any'})?
3. **Complexity**: Time and space complexity analysis
4. **Code Quality**: Readability, variable names, best practices
5. **Improvements**: Specific suggestions for optimization or alternative approaches

Keep feedback concise (5-7 sentences), encouraging, and actionable. Focus on learning.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.7,
    });

    const feedback = completion.choices[0]?.message?.content || 
      generateMockFeedback(passedCount, totalTests, patterns);

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error('Feedback error:', error);
    
    // Fallback to mock feedback on error
    const { testResults, patterns } = await request.json();
    const passedCount = testResults?.filter((r: any) => r.passed).length || 0;
    const totalTests = testResults?.length || 0;
    
    return NextResponse.json({
      feedback: generateMockFeedback(passedCount, totalTests, patterns),
    });
  }
}

function generateMockFeedback(passedCount: number, totalTests: number, patterns?: string[]): string {
  const patternText = patterns && patterns.length > 0 
    ? ` This problem commonly uses patterns like ${patterns.join(' and ')}.`
    : '';

  if (passedCount === totalTests) {
    return `🎉 Excellent work! All ${totalTests} test cases passed!${patternText}

Your solution demonstrates correct logic and implementation. Consider reviewing:
- **Time Complexity**: Could this be optimized? Are there any nested loops?
- **Space Complexity**: Are you using extra memory efficiently?
- **Edge Cases**: Have you considered empty inputs or extreme values?
- **Code Clarity**: Are variable names descriptive?

To get real AI-powered feedback with detailed analysis, add your OpenAI API key to the environment variables.`;
  } else if (passedCount > 0) {
    return `👍 You're on the right track! ${passedCount}/${totalTests} test cases passed.${patternText}

Your code handles some cases correctly. To fix the failing tests:
- **Review the Logic**: Check your algorithm for the specific inputs that failed
- **Boundary Conditions**: Are you handling edge cases like empty arrays or single elements?
- **Pattern Application**: Make sure you're applying the right algorithmic approach
- **Debug Strategy**: Add console.log statements to trace your logic

Tip: Look at the expected vs actual output for failing tests to identify the pattern.

For personalized AI feedback, configure your OpenAI API key.`;
  } else {
    return `💪 Keep going! Let's debug this together.${patternText}

Common issues to check:
- **Function Signature**: Is your function name correct? Does it match the starter code?
- **Return Type**: Are you returning the right data type (array, number, boolean)?
- **Logic Flow**: Walk through your algorithm step-by-step with a sample input
- **Syntax Errors**: Check for missing brackets, semicolons, or typos

Debugging tip: Start with the simplest test case and trace through your code manually.

Connect OpenAI API for intelligent, personalized code analysis and suggestions.`;
  }
}