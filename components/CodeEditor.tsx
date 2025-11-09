'use client';
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, Sparkles, ChevronDown } from 'lucide-react';

interface CodeEditorProps {
  problemId: string;
  starterCode: { [key: string]: string };
  testCases: any[];
}

export default function CodeEditor({ problemId, starterCode, testCases }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode.javascript || '');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(starterCode[newLanguage] || '');
    setOutput('');
    setFeedback('');
    setTestResults([]);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running tests...');
    setTestResults([]);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases,
          problemId,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setTestResults(data.results);
        const passedCount = data.results.filter((r: any) => r.passed).length;
        setOutput(`${passedCount}/${data.results.length} test cases passed`);
      }
    } catch (error) {
      setOutput('Error executing code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleGetFeedback = async () => {
    setIsFeedbackLoading(true);
    setFeedback('Analyzing your code...');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId,
          testResults,
        }),
      });

      const data = await response.json();
      setFeedback(data.feedback || 'Unable to generate feedback at this time.');
    } catch (error) {
      setFeedback('Error generating feedback. Please try again.');
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  return (
    <>
      {/* Editor Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded text-sm font-medium cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleGetFeedback}
            disabled={isFeedbackLoading || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isFeedbackLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            AI Feedback
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run Code
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output Panel */}
      <div className="h-64 bg-gray-800 border-t border-gray-700 overflow-y-auto">
        <div className="p-4">
          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">Test Results:</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded ${
                      result.passed ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        Test Case {index + 1}: {result.passed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    </div>
                    {!result.passed && (
                      <div className="text-sm text-gray-300">
                        <div>Expected: {JSON.stringify(result.expected)}</div>
                        <div>Got: {JSON.stringify(result.actual)}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Feedback */}
          {feedback && (
            <div className="mb-4">
              <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Feedback:
              </h3>
              <div className="bg-gray-900 p-3 rounded border border-purple-700 text-gray-300 whitespace-pre-wrap">
                {feedback}
              </div>
            </div>
          )}

          {/* General Output */}
          {output && !testResults.length && (
            <div>
              <h3 className="text-white font-semibold mb-2">Output:</h3>
              <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}