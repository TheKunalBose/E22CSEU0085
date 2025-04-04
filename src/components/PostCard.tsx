
import { useState } from 'react';
import { Post, Comment } from '../types';
import { MessageSquare, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface PostCardProps {
  post: Post;
  isTrending?: boolean;
  isLoading?: boolean;
}

const PostCard = ({ post, isTrending = false, isLoading = false }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  
  // Generate stable post image based on post ID
  const imageId = post.id ? post.id % 100 : 0;
  const imageSrc = `https://picsum.photos/seed/${imageId}/600/400`;
  
  // Generate stable user avatar based on user ID
  const avatarSrc = post.user?.id 
    ? `https://avatars.dicebear.com/api/open-peeps/${post.user.id}.svg`
    : `https://avatars.dicebear.com/api/open-peeps/placeholder.svg`;

  if (isLoading) {
    return (
      <div className="analytics-card animate-pulse-slow">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="h-4 w-32 rounded bg-gray-200"></div>
          </div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-32 rounded-md bg-gray-200"></div>
          <div className="flex justify-between">
            <div className="h-6 w-16 rounded bg-gray-200"></div>
            <div className="h-6 w-16 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // Format timestamp
  const formattedDate = post.timestamp
    ? new Date(post.timestamp).toLocaleString()
    : 'Unknown date';
  
  // Truncate post body if it's too long
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className={`analytics-card ${isTrending ? 'border-2 border-analytics-blue' : ''} animate-fade-in`}>
      {isTrending && (
        <div className="absolute -top-3 left-4 rounded-full bg-analytics-blue px-3 py-1 text-xs text-white">
          Trending 🔥
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post.user && (
              <>
                <img 
                  src={avatarSrc}
                  alt={`${post.user.name}'s avatar`}
                  className="h-10 w-10 rounded-full"
                />
                <span className="font-semibold">{post.user.name}</span>
              </>
            )}
          </div>
          <span className="text-xs text-analytics-gray">{formattedDate}</span>
        </div>
        
        <h3 className="text-xl font-bold capitalize">{post.title}</h3>
        
        <p className="text-analytics-gray">{truncateText(post.body, 150)}</p>
        
        <img 
          src={imageSrc}
          alt={`Post ${post.id} image`}
          className="h-auto w-full rounded-md object-cover"
          loading="lazy"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4 text-analytics-blue" />
            <span className="text-sm font-medium">{post.commentCount || 0} comments</span>
          </div>
          
          {(post.comments && post.comments.length > 0) && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-sm font-medium text-analytics-blue hover:underline"
            >
              <span>{showComments ? 'Hide' : 'Show'} comments</span>
              {showComments ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        {showComments && post.comments && (
          <div className="space-y-3 rounded-md bg-analytics-lightGray p-4">
            {post.comments.map((comment: Comment) => (
              <div key={comment.id} className="rounded-md bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{comment.name.split(' ')[0]}</span>
                  <span className="text-xs text-analytics-gray">{comment.email}</span>
                </div>
                <p className="mt-1 text-sm text-analytics-gray">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
