import React from 'react';
import { format } from 'date-fns';

function Post({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-md p-6">
      <header className="mb-4 flex justify-between items-center">
        <time className="text-sm text-gray-500">
          {format(new Date(post.time), 'PPpp')}
        </time>
        {post.views && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{post.views}</span>
          </div>
        )}
      </header>
      
      {post.text && (
        <div className="prose max-w-none mb-4 whitespace-pre-wrap">
          {post.text}
        </div>
      )}
      
      {post.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {post.images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Post image ${index + 1}`}
              className="rounded-lg w-full h-auto object-cover"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default Post;