
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { migrateTeamMembersToSupabase } from "@/utils/migrateTeamMembersToSupabase";
import "./CSS/teamstyle.css";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // Trigger migration of team members data to Supabase
    migrateTeamMembersToSupabase();
  }, []);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  if (user) {
    // Redirect to team page if user is logged in
    return <Navigate to="/team" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex flex-col items-center justify-center p-6">
      <div className="content initial">
        <h1>GovTech Team</h1>
        <h2>Para visualizar o time completo, efetue o login</h2>
        <Button className="bg-white text-orange-500 hover:bg-gray-100" onClick={() => navigate('/login')}>Entrar</Button>
      </div>
    </div>
  );
};

export default Index;
