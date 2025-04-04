
import { useState, useEffect } from 'react';
import { User } from '../types';
import { getTopUsers } from '../services/api';
import UserCard from '../components/UserCard';
import { BarChart3 } from 'lucide-react';

const TopUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const topUsers = await getTopUsers(5);
      setUsers(topUsers);
      setError(null);
    } catch (err) {
      setError('Error fetching top users. Please try again later.');
      console.error('Error fetching top users:', err);
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
        <BarChart3 className="mr-2 h-6 w-6 text-analytics-blue" />
        <h1 className="text-2xl font-bold">Top Users by Post Count</h1>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-red-100 p-4 text-red-800">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid gap-6">
        {loading
          ? Array(5)
              .fill(0)
              .map((_, index) => (
                <UserCard 
                  key={`loading-${index}`}
                  user={{ id: 0, name: '', username: '', email: '' }}
                  rank={index + 1}
                  isLoading={true}
                />
              ))
          : users.map((user, index) => (
              <UserCard 
                key={user.id}
                user={user}
                rank={index + 1}
              />
            ))}
      </div>
      
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

export default TopUsers;
