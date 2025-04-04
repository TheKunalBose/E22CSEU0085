
import { User, Post, Comment } from '../types';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Caching mechanism to reduce API calls
const cache = {
  users: null as User[] | null,
  posts: null as Post[] | null,
  comments: null as Comment[] | null,
  lastFetched: {
    users: 0,
    posts: 0,
    comments: 0
  }
};

// Cache expiration time (5 minutes in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const fetchUsers = async (): Promise<User[]> => {
  const now = Date.now();
  
  // Return cached data if it's fresh
  if (cache.users && now - cache.lastFetched.users < CACHE_EXPIRATION) {
    return cache.users;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    
    const users = await response.json();
    cache.users = users;
    cache.lastFetched.users = now;
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return cache.users || [];
  }
};

export const fetchPosts = async (): Promise<Post[]> => {
  const now = Date.now();
  
  // Return cached data if it's fresh
  if (cache.posts && now - cache.lastFetched.posts < CACHE_EXPIRATION) {
    return cache.posts;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    
    const posts = await response.json();
    // Add a timestamp for sorting in feed
    const postsWithTimestamp = posts.map((post: Post) => ({
      ...post,
      timestamp: Date.now() - Math.floor(Math.random() * 86400000) // Random time within last 24 hours
    }));
    
    cache.posts = postsWithTimestamp;
    cache.lastFetched.posts = now;
    
    return postsWithTimestamp;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return cache.posts || [];
  }
};

export const fetchComments = async (): Promise<Comment[]> => {
  const now = Date.now();
  
  // Return cached data if it's fresh
  if (cache.comments && now - cache.lastFetched.comments < CACHE_EXPIRATION) {
    return cache.comments;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/comments`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    
    const comments = await response.json();
    cache.comments = comments;
    cache.lastFetched.comments = now;
    
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return cache.comments || [];
  }
};

export const fetchPostComments = async (postId: number): Promise<Comment[]> => {
  try {
    // First check if we already have all comments cached
    if (cache.comments) {
      return cache.comments.filter(comment => comment.postId === postId);
    }
    
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) throw new Error(`Failed to fetch comments for post ${postId}`);
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
};

// Function to get top users with most posts
export const getTopUsers = async (limit = 5): Promise<User[]> => {
  try {
    const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);
    
    // Count posts per user
    const userPostCounts = posts.reduce((acc: Record<number, number>, post: Post) => {
      acc[post.userId] = (acc[post.userId] || 0) + 1;
      return acc;
    }, {});
    
    // Add post count to each user
    const usersWithPostCount = users.map(user => ({
      ...user,
      postCount: userPostCounts[user.id] || 0
    }));
    
    // Sort users by post count in descending order
    return usersWithPostCount
      .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error getting top users:', error);
    return [];
  }
};

// Function to get trending posts (posts with most comments)
export const getTrendingPosts = async (): Promise<Post[]> => {
  try {
    const [posts, comments, users] = await Promise.all([
      fetchPosts(),
      fetchComments(),
      fetchUsers()
    ]);
    
    // Count comments per post
    const postCommentCounts = comments.reduce((acc: Record<number, number>, comment: Comment) => {
      acc[comment.postId] = (acc[comment.postId] || 0) + 1;
      return acc;
    }, {});
    
    // Create a map of users for quick lookup
    const userMap = users.reduce((map: Record<number, User>, user: User) => {
      map[user.id] = user;
      return map;
    }, {});
    
    // Add comment count and user data to each post
    const postsWithCommentCount = posts.map(post => ({
      ...post,
      commentCount: postCommentCounts[post.id] || 0,
      user: userMap[post.userId]
    }));
    
    // Find the maximum comment count
    const maxCommentCount = Math.max(...Object.values(postCommentCounts));
    
    // Return posts with the maximum comment count
    return postsWithCommentCount.filter(post => post.commentCount === maxCommentCount);
    
  } catch (error) {
    console.error('Error getting trending posts:', error);
    return [];
  }
};

// Function to get feed posts with user and comment data
export const getFeedPosts = async (): Promise<Post[]> => {
  try {
    const [posts, users, comments] = await Promise.all([
      fetchPosts(),
      fetchUsers(),
      fetchComments()
    ]);
    
    // Create a map of users for quick lookup
    const userMap = users.reduce((map: Record<number, User>, user: User) => {
      map[user.id] = user;
      return map;
    }, {});
    
    // Group comments by post ID
    const commentsByPost = comments.reduce((acc: Record<number, Comment[]>, comment: Comment) => {
      if (!acc[comment.postId]) {
        acc[comment.postId] = [];
      }
      acc[comment.postId].push(comment);
      return acc;
    }, {});
    
    // Add user and comments to each post
    const enrichedPosts = posts.map(post => ({
      ...post,
      user: userMap[post.userId],
      comments: commentsByPost[post.id] || [],
      commentCount: (commentsByPost[post.id] || []).length
    }));
    
    // Sort by timestamp (newest first)
    return enrichedPosts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
  } catch (error) {
    console.error('Error getting feed posts:', error);
    return [];
  }
};
