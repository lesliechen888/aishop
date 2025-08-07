'use client';

import Link from 'next/link';
import { useLocalization } from '@/contexts/LocalizationContext';
import { mockUsers } from '@/data/mockData';

const TestAccountsPage = () => {
  const { t } = useLocalization();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Test Accounts for Development
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Use these test accounts to try the login functionality
          </p>
        </div>

        {/* Test Accounts */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Available Test Accounts
          </h2>
          
          <div className="space-y-4">
            {mockUsers.map((user, index) => (
              <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Test Account #{index + 1}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                    <span className="ml-2 text-blue-600 dark:text-blue-400 font-mono">
                      {user.email}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Password:</span>
                    <span className="ml-2 text-green-600 dark:text-green-400 font-mono">
                      {user.password}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/login?email=${encodeURIComponent(user.email)}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Quick Login
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How to Test
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Copy one of the email/password combinations above</li>
            <li>Go to the login page and enter the credentials</li>
            <li>Click "Sign In" to test the authentication</li>
            <li>You should be redirected to the home page upon successful login</li>
            <li>Try entering wrong credentials to test error handling</li>
          </ol>
        </div>

        {/* Features Tested */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
            Features Being Tested
          </h2>
          <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200">
            <li>Email and password validation</li>
            <li>Credential verification against mock database</li>
            <li>Error messages for invalid credentials</li>
            <li>Success messages and page redirection</li>
            <li>Multi-language support for all messages</li>
            <li>Form state management and loading indicators</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="text-center space-x-4">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Go to Register
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestAccountsPage;
