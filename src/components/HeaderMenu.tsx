
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import tecnologo from './../img/Logo.svg';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderMenuProps {
  children: React.ReactNode;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ children }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleLogout = () => {
    signOut();
  };
  
  return (
    <>
      <div className="headernavbar">
        <img src={tecnologo || ""} alt="Tecnocomp Logo" />
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
