
import { User } from "../types";

interface UserCardProps {
  user: User;
  rank: number;
  isLoading?: boolean;
}

const UserCard = ({ user, rank, isLoading = false }: UserCardProps) => {
  // Generate stable user avatar based on user ID
  const avatarSrc = `https://avatars.dicebear.com/api/open-peeps/${user.id || "placeholder"}.svg`;

  if (isLoading) {
    return (
      <div className="analytics-card animate-pulse-slow">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-200"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        </div>
      </div>
    );
  }

  // Determine badge color based on rank
  const getBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-analytics-yellow";
    if (rank === 2) return "bg-slate-200 text-slate-700";
    if (rank === 3) return "bg-amber-100 text-amber-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="analytics-card animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16">
          <img
            src={avatarSrc}
            alt={`${user.name}'s avatar`}
            className="h-16 w-16 rounded-full border border-analytics-lightGray bg-white object-cover"
          />
          <span
            className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full ${getBadgeColor(
              rank
            )} text-xs font-bold`}
          >
            {rank}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-analytics-gray">@{user.username}</p>
        </div>
        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-analytics-lightGray">
          <span className="text-lg font-bold text-analytics-blue">
            {user.postCount || 0}
          </span>
          <span className="text-xs text-analytics-gray">posts</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
