'use client';
import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, Sparkles, ChevronDown, Lightbulb, Target, Code2, GripVertical } from 'lucide-react';

interface CodeEditorProps {
  problemId: string;
  starterCode: { [key: string]: string };
  testCases: any[];
  patterns?: string[];
  hints?: string[];
}

export default function CodeEditor({ 
  problemId, 
  starterCode, 
  testCases,
  patterns = [],
  hints = []
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode.javascript || '');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [showPatterns, setShowPatterns] = useState(false);
  const [aiSolution, setAiSolution] = useState<string>('');
  const [showSolution, setShowSolution] = useState(false);
  const [isGeneratingSolution, setIsGeneratingSolution] = useState(false);
  
  // Resizable panel state
  const [editorHeight, setEditorHeight] = useState(60); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(starterCode[newLanguage] || '');
    setOutput('');
    setFeedback('');
    setTestResults([]);
    setShowSolution(false);
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
          patterns,
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

  const handleShowSolution = async () => {
    setIsGeneratingSolution(true);
    
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          language,
          patterns,
        }),
      });

      const data = await response.json();
      setAiSolution(data.solution || '// Could not generate solution');
      setShowSolution(true);
    } catch (error) {
      setAiSolution('// Error generating solution');
      setShowSolution(true);
    } finally {
      setIsGeneratingSolution(false);
    }
  };

  const showNextHint = () => {
    if (currentHintLevel < hints.length) {
      setCurrentHintLevel(currentHintLevel + 1);
    }
  };

  // Handle mouse drag for resizing
  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const offsetY = e.clientY - containerRect.top;
    const newHeight = (offsetY / containerRect.height) * 100;

    // Constrain between 30% and 80%
    if (newHeight >= 30 && newHeight <= 80) {
      setEditorHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
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

          {/* Patterns Button */}
          {patterns.length > 0 && (
            <button
              onClick={() => setShowPatterns(!showPatterns)}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
            >
              <Target className="h-4 w-4" />
              Patterns
            </button>
          )}

          {/* Hints Button */}
          {hints.length > 0 && (
            <button
              onClick={showNextHint}
              disabled={currentHintLevel >= hints.length}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Lightbulb className="h-4 w-4" />
              Hint ({currentHintLevel}/{hints.length})
            </button>
          )}

          {/* Show Solution Button */}
          <button
            onClick={handleShowSolution}
            disabled={isGeneratingSolution}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isGeneratingSolution ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Code2 className="h-4 w-4" />
            )}
            Show Solution
          </button>
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

      {/* Patterns Display */}
      {showPatterns && patterns.length > 0 && (
        <div className="bg-indigo-900 px-4 py-3 border-b border-indigo-700">
          <div className="flex items-start gap-2">
            <Target className="h-5 w-5 text-indigo-300 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-indigo-100 font-semibold mb-2">Common Patterns for This Problem:</h4>
              <div className="flex flex-wrap gap-2">
                {patterns.map((pattern, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-700 text-indigo-100 rounded-full text-sm font-medium"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
              <p className="text-indigo-200 text-sm mt-2">
                These patterns are commonly used to solve this type of problem efficiently.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hints Display */}
      {currentHintLevel > 0 && hints.length > 0 && (
        <div className="bg-yellow-900 px-4 py-3 border-b border-yellow-700">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-yellow-100 font-semibold mb-2">Hints:</h4>
              {hints.slice(0, currentHintLevel).map((hint, idx) => (
                <p key={idx} className="text-yellow-100 mb-2">
                  {idx + 1}. {hint}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monaco Editor - Resizable */}
      <div style={{ height: `${editorHeight}%` }}>
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

      {/* Draggable Divider */}
      <div
        onMouseDown={handleMouseDown}
        className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize flex items-center justify-center border-y border-gray-600 transition-colors"
        title="Drag to resize"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* Output Panel - Resizable */}
      <div 
        style={{ height: `${100 - editorHeight}%` }}
        className="bg-gray-800 overflow-y-auto"
      >
        <div className="p-4">
          {/* AI Solution Display */}
          {showSolution && aiSolution && (
            <div className="mb-4">
              <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                AI-Generated Solution:
              </h3>
              <div className="bg-gray-900 p-3 rounded border border-red-700">
                <pre className="text-gray-300 whitespace-pre-wrap text-sm overflow-x-auto">{aiSolution}</pre>
              </div>
              <p className="text-yellow-400 text-sm mt-2 flex items-center gap-2">
                <span>⚠️</span>
                <span>Try to solve it yourself first! Use this as a last resort or for learning.</span>
              </p>
            </div>
          )}

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
    </div>
  );
}