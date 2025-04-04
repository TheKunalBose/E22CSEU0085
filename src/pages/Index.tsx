
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This page is now just a redirect to the Top Users page
const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting to dashboard...</p>
    </div>
  );
};

export default Index;
