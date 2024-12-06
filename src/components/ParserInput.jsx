import React from 'react';

function ParserInput({ defaultUrl, onUrlChange, onParse, isLoading }) {
  return (
    <div className="mb-8 max-w-2xl mx-auto">
      <div className="flex gap-4">
        <input
          type="text"
          value={defaultUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Enter Telegram channel URL (e.g., https://t.me/s/channelname)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={onParse}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Parsing...' : 'Parse'}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Note: URL should be in format https://t.me/s/channelname
      </p>
    </div>
  );
}

export default ParserInput;