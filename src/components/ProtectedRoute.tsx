
import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  
  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };
  
  if (!isAuthenticated) {
    // Redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Tecnocomp</h1>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-orange-600" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      {children}
    </>
  );
};

export default ProtectedRoute;
