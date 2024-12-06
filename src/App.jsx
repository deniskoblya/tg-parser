import React, { useState, useEffect } from 'react';
import Post from './components/Post';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import ParserInput from './components/ParserInput';
import { fetchPosts } from './api/telegram';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [url, setUrl] = useState('https://t.me/s/truexanewsua');

  const handleParse = async (inputUrl) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPosts(inputUrl);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    handleParse(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ParserInput 
        defaultUrl={url}
        onUrlChange={setUrl}
        onParse={() => handleParse(url)}
        isLoading={loading}
      />

      <h1 className="text-3xl font-bold text-center mb-8">
        Telegram Channel Parser
      </h1>

      <div className="max-w-4xl mx-auto">
        {loading && <LoadingSpinner />}
        
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={handleRetry}
            retrying={retrying}
          />
        )}
        
        {!loading && !error && (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <Post key={post.time + index} post={post} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                Enter a Telegram channel URL and click Parse to fetch posts
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;