import axios from 'axios';

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';

// Language IDs for Judge0
export const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java
};

interface SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

export async function executeCode(
  code: string,
  language: keyof typeof LANGUAGE_IDS,
  input: string = ''
): Promise<{
  success: boolean;
  output: string;
  error?: string;
  time?: string;
  memory?: number;
}> {
  if (!process.env.RAPIDAPI_KEY) {
    throw new Error('RapidAPI key not configured');
  }

  try {
    const languageId = LANGUAGE_IDS[language];

    // Step 1: Create submission
    const submissionResponse = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id: languageId,
        stdin: input,
      },
      {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const result: SubmissionResult = submissionResponse.data;

    // Check status
    if (result.status.id === 3) {
      // Accepted
      return {
        success: true,
        output: result.stdout?.trim() || '',
        time: result.time,
        memory: result.memory,
      };
    } else if (result.status.id === 6) {
      // Compilation Error
      return {
        success: false,
        output: '',
        error: `Compilation Error: ${result.stderr || 'Unknown error'}`,
      };
    } else if (result.status.id === 5) {
      // Time Limit Exceeded
      return {
        success: false,
        output: '',
        error: 'Time Limit Exceeded (>5 seconds)',
      };
    } else if (result.status.id === 11 || result.status.id === 12) {
      // Runtime Error
      return {
        success: false,
        output: '',
        error: `Runtime Error: ${result.stderr || 'Unknown error'}`,
      };
    } else {
      // Other errors
      return {
        success: false,
        output: '',
        error: `Error: ${result.status.description}`,
      };
    }
  } catch (error: any) {
    console.error('Judge0 execution error:', error);
    return {
      success: false,
      output: '',
      error: error.response?.data?.message || error.message || 'Execution failed',
    };
  }
}