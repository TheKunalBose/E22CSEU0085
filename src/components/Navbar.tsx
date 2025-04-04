
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, TrendingUp, RefreshCcw } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link-active' : '';
  };
  
  return (
    <nav className="fixed top-0 left-0 z-10 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-analytics-blue">
              SocialMetrics
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                <BarChart3 className="h-5 w-5" />
                Top Users
              </Link>
              <Link to="/trending" className={`nav-link ${isActive('/trending')}`}>
                <TrendingUp className="h-5 w-5" />
                Trending Posts
              </Link>
              <Link to="/feed" className={`nav-link ${isActive('/feed')}`}>
                <RefreshCcw className="h-5 w-5" />
                Live Feed
              </Link>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div className="block md:hidden">
            <div className="flex space-x-2">
              <Link 
                to="/" 
                className={`rounded-md p-2 ${isActive('/') ? 'bg-analytics-lightGray text-analytics-blue' : 'text-gray-500'}`}
              >
                <BarChart3 className="h-5 w-5" />
              </Link>
              <Link 
                to="/trending" 
                className={`rounded-md p-2 ${isActive('/trending') ? 'bg-analytics-lightGray text-analytics-blue' : 'text-gray-500'}`}
              >
                <TrendingUp className="h-5 w-5" />
              </Link>
              <Link 
                to="/feed" 
                className={`rounded-md p-2 ${isActive('/feed') ? 'bg-analytics-lightGray text-analytics-blue' : 'text-gray-500'}`}
              >
                <RefreshCcw className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
