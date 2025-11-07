'use client';

import { useState, useEffect } from 'react';
import { validatePassword, setAuthenticated, isAuthenticated } from '@/lib/auth';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    if (isAuthenticated()) {
      setIsAuth(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (validatePassword(password)) {
      setAuthenticated();
      setIsAuth(true);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Access</h1>
              <p className="text-gray-600">Please enter the password to view survey responses</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder="Enter password"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Access Dashboard
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/survey"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Submit a survey response →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
