import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import "./CSS/teamstyle.css"

const Index = () => {
  const navigate = useNavigate();
  if (sessionStorage.getItem('isAuthenticated') === "true") {
    // Redirect to team page
    return <Navigate to="/team"/>;
  }  
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex flex-col items-center justify-center p-6">
     <div className="content initial">
     <h1>GovTech Team</h1>
     <h2>Para visualizar o time completo, efetue o login</h2>
     <Button className="bg-white text-orange-500 hover:bg-gray-100" onClick={() => navigate('/login')}>Entrar</Button>
     </div>
     
   </div>
  )
  
};

export default Index;
