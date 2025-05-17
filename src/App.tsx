
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DoctorDashboard from "./pages/doctor/Dashboard";
import CreateLabOrder from "./pages/doctor/CreateLabOrder";
import ViewLabResults from "./pages/doctor/ViewLabResults";
import LabDashboard from "./pages/lab/Dashboard";
import EnterResults from "./pages/lab/EnterResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

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
            
            {/* Doctor Routes */}
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/create-order" 
              element={
                <ProtectedRoute role="doctor">
                  <CreateLabOrder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/results" 
              element={
                <ProtectedRoute role="doctor">
                  <ViewLabResults />
                </ProtectedRoute>
              } 
            />
            
            {/* Lab Routes */}
            <Route 
              path="/lab/dashboard" 
              element={
                <ProtectedRoute role="lab">
                  <LabDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lab/enter-results/:orderId" 
              element={
                <ProtectedRoute role="lab">
                  <EnterResults />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
