'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex-1 rounded-lg bg-gray-50 p-6">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">
          Please log in to continue.
        </h1>
        <div className="w-full space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>
        <button
          className="mt-6 w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-disabled={isPending}
        >
          Log in
        </button>
        <div
          className="mt-4 h-8 text-sm text-red-500"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      </div>
    </form>
  );
}
