
import { useState, useEffect } from 'react';
import { Post } from '../types';
import { getTrendingPosts } from '../services/api';
import PostCard from '../components/PostCard';
import { TrendingUp } from 'lucide-react';

const TrendingPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const trendingPosts = await getTrendingPosts();
      setPosts(trendingPosts);
      setError(null);
    } catch (err) {
      setError('Error fetching trending posts. Please try again later.');
      console.error('Error fetching trending posts:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      <div className="mb-8 flex items-center">
        <TrendingUp className="mr-2 h-6 w-6 text-analytics-blue" />
        <h1 className="text-2xl font-bold">Trending Posts</h1>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-red-100 p-4 text-red-800">
          <p>{error}</p>
        </div>
      )}
      
      {posts.length > 0 && !loading && (
        <div className="mb-6 rounded-md bg-blue-50 p-4 text-analytics-blue">
          <p className="flex items-center">
            <span className="mr-2 text-2xl">🔥</span>
            Found {posts.length} trending {posts.length === 1 ? 'post' : 'posts'} with {posts[0]?.commentCount} comments each
          </p>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        {loading
          ? Array(2)
              .fill(0)
              .map((_, index) => (
                <PostCard
                  key={`loading-${index}`}
                  post={{ id: 0, userId: 0, title: '', body: '' }}
                  isTrending={true}
                  isLoading={true}
                />
              ))
          : posts.map((post) => (
              <PostCard 
                key={post.id}
                post={post}
                isTrending={true}
              />
            ))}
      </div>
      
      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-xl text-analytics-gray">No trending posts found</p>
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={fetchData}
          className="inline-flex items-center rounded-md bg-analytics-blue px-4 py-2 text-white transition-colors hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default TrendingPosts;
