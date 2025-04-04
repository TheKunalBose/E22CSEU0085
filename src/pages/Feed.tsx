
import { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { getFeedPosts } from '../services/api';
import PostCard from '../components/PostCard';
import { RefreshCcw } from 'lucide-react';

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const feedPosts = await getFeedPosts();
      setPosts(feedPosts);
      setError(null);
    } catch (err) {
      setError('Error fetching feed posts. Please try again later.');
      console.error('Error fetching feed posts:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const startPolling = () => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Poll for new data every 30 seconds
    pollingIntervalRef.current = window.setInterval(fetchData, 30 * 1000);
  };
  
  useEffect(() => {
    fetchData();
    startPolling();
    
    // Clean up on component unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <RefreshCcw className="mr-2 h-6 w-6 text-analytics-blue" />
          <h1 className="text-2xl font-bold">Live Feed</h1>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center rounded-md bg-analytics-blue px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-red-100 p-4 text-red-800">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-2 flex items-center space-x-2 text-sm text-analytics-gray">
        <RefreshCcw className="h-4 w-4" />
        <span>Auto-refreshing every 30 seconds</span>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && posts.length === 0
          ? Array(6)
              .fill(0)
              .map((_, index) => (
                <PostCard
                  key={`loading-${index}`}
                  post={{ id: 0, userId: 0, title: '', body: '' }}
                  isLoading={true}
                />
              ))
          : posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
      </div>
      
      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-xl text-analytics-gray">No posts found</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
