import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CodeEditor from '@/components/CodeEditor';

async function getProblem(id: string) {
  const problem = await prisma.problem.findUnique({
    where: { id },
  });
  
  if (!problem) {
    notFound();
  }
  
  return problem;
}

export default async function ProblemPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const problem = await getProblem(id);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Problem Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {problem.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/2 overflow-y-auto bg-white border-r border-gray-200 p-6">
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-sm text-gray-700 whitespace-pre-wrap mb-8">
              {problem.description}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Cases</h2>
            <div className="space-y-4">
              {JSON.parse(problem.testCases).map((testCase: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">Input:</span>
                    <pre className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border border-gray-200">
                      {JSON.stringify(testCase.input, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Expected Output:</span>
                    <pre className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border border-gray-200">
                      {JSON.stringify(testCase.output, null, 2)}
                    </pre>
                  </div>
                  {testCase.explanation && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Explanation:</span>
                      <p className="mt-1 text-sm text-gray-600">{testCase.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="w-1/2 flex flex-col bg-gray-900">
          <CodeEditor 
            problemId={problem.id}
            starterCode={JSON.parse(problem.starterCode)}
            testCases={JSON.parse(problem.testCases)}
          />
        </div>
      </div>
    </div>
  );
}