
import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import tecnologo from './../img/Logo.svg'
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const HeaderMenu: React.FC<ProtectedRouteProps> = ({ children }) => {
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
  //menu
  <>
      <div className="headernavbar">
        <img src={tecnologo || ""}/>
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

export default HeaderMenu;
