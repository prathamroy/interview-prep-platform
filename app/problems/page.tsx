import Link from 'next/link';
import { Clock, Target } from 'lucide-react';
import { problems as problemsData } from '@/data/problems';

// Create problems with sequential IDs for routing
const problems = problemsData.map((p, idx) => ({
  id: `problem-${idx + 1}`,
  title: p.title,
  description: p.description,
  difficulty: p.difficulty,
  category: p.category,
  createdAt: new Date(),
}));

export default function ProblemsPage() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Coding Problems
          </h1>
          <p className="text-gray-600">
            Choose a problem to start practicing. Get AI-powered feedback on your solutions!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Problems</p>
                <p className="text-2xl font-bold text-gray-900">{problems.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Easy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {problems.filter(p => p.difficulty === 'Easy').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Medium</p>
                <p className="text-2xl font-bold text-gray-900">
                  {problems.filter(p => p.difficulty === 'Medium').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              href={`/problems/${problem.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                      {problem.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {problem.category}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    {problem.description.split('\n')[0]}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Solve
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}