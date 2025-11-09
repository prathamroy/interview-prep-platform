import Link from 'next/link';
import { ArrowRight, Code, Zap, BarChart3, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Coding Interviews with{' '}
            <span className="text-blue-600">AI-Powered</span> Practice
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Practice coding problems, get instant AI feedback, and track your progress 
            to ace your next technical interview.
          </p>
          <Link
            href="/problems"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Practicing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Code,
              title: 'Code Execution',
              description: 'Run your code instantly with multiple language support'
            },
            {
              icon: Brain,
              title: 'AI Feedback',
              description: 'Get personalized feedback and suggestions powered by AI'
            },
            {
              icon: Zap,
              title: 'Smart Hints',
              description: 'Progressive hints that guide you without spoiling the solution'
            },
            {
              icon: BarChart3,
              title: 'Track Progress',
              description: 'Monitor your improvement and identify areas to focus on'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}