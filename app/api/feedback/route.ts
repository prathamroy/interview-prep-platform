import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language, testResults } = await request.json();

    const passedCount = testResults?.filter((r: any) => r.passed).length || 0;
    const totalTests = testResults?.length || 0;

    // Mock AI feedback when OpenAI is not available
    let feedback = '';

    if (passedCount === totalTests) {
      feedback = `Excellent work! All ${totalTests} test cases passed!\n\n`;
      feedback += `Your solution demonstrates:\n`;
      feedback += `• Correct logic and implementation\n`;
      feedback += `• Good code structure\n\n`;
      feedback += `Consider reviewing:\n`;
      feedback += `• Time complexity: Could this be optimized?\n`;
      feedback += `• Space complexity: Are you using extra memory efficiently?\n`;
      feedback += `• Edge cases: What happens with empty inputs?`;
    } else if (passedCount > 0) {
      feedback = `You're on the right track! ${passedCount}/${totalTests} test cases passed.\n\n`;
      feedback += `Your code handles some cases correctly, but there are edge cases to consider:\n`;
      feedback += `• Check boundary conditions\n`;
      feedback += `• Review your algorithm logic for the failing cases\n`;
      feedback += `• Add console.log statements to debug\n\n`;
      feedback += `Tip: Look at the input/output of failing test cases to identify the pattern.`;
    } else {
      feedback = `Keep going! Let's debug this together.\n\n`;
      feedback += `Common issues to check:\n`;
      feedback += `• Are you returning the correct data type?\n`;
      feedback += `• Is your function signature correct?\n`;
      feedback += `• Have you handled the base case?\n\n`;
      feedback += `Tip: Try running through the logic manually with the test input.`;
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `You are an expert coding interview coach. Analyze this ${language} code and provide constructive feedback.

Code:
\`\`\`${language}
${code}
\`\`\`

Test Results: ${passedCount}/${totalTests} tests passed

Provide feedback on:
1. Code correctness and logic
2. Time and space complexity
3. Code readability and best practices
4. Potential improvements or alternative approaches

Keep the feedback concise (3-5 sentences) and encouraging.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        });

        feedback = completion.choices[0]?.message?.content || feedback;
      } catch (error: any) {
        console.log('OpenAI unavailable, using mock feedback:', error.message);
      }
    }

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error('Feedback error:', error);
    return NextResponse.json({
      feedback: `Focus on the test cases that are failing. Compare your output with the expected output to identify the issue!`,
    });
  }
}