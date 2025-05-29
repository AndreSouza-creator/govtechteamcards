
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Team from "./pages/Team";
import AddTeamMember from "./pages/AddTeamMember";
import MemberDetail from "./pages/MemberDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import HeaderMenu from "./components/HeaderMenu";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/team" 
              element={
                <HeaderMenu>
                  <Team />
                </HeaderMenu>
              } 
            />
            <Route 
              path="/add-team-member" 
              element={
                <HeaderMenu>
                  <AddTeamMember />
                </HeaderMenu>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <HeaderMenu>
                  <AdminPanel />
                </HeaderMenu>
              } 
            />
            <Route path="/member/:name" element={<MemberDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
