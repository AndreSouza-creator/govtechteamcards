
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Team from "./pages/Team";
import MemberDetail from "./pages/MemberDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import HeaderMenu from "./components/HeaderMenu";
import AddTeamMember from "./pages/AddTeamMember";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
            element={<AddTeamMember />} 
          />
          <Route path="/member/:name" element={<MemberDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
