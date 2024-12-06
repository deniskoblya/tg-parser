import React from 'react';

function ErrorMessage({ message, onRetry, retrying }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-2xl w-full">
        <div className="flex flex-col">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading posts
              </h3>
              <p className="mt-2 text-sm text-red-700">
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={onRetry}
            disabled={retrying}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {retrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;