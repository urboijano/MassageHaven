import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import BookingPage from "@/pages/BookingPage";
import LoginPage from "@/pages/admin/LoginPage";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Bookings from "@/pages/admin/Bookings";
import Services from "@/pages/admin/Services";
import ServiceStats from "@/pages/admin/ServiceStats";
import Staff from "@/pages/admin/Staff";
import Settings from "@/pages/admin/Settings";
import { useAuth } from "@/contexts/AuthContext";

// Simple component to handle admin dashboard rendering
const AdminDashboardPage = () => {
  const auth = useAuth();
  const isAdmin = auth?.isAdmin || localStorage.getItem("isAdmin") === "true";
  
  // Add a console log to help with debugging
  console.log("AdminDashboardPage - isAdmin:", isAdmin);
  
  return isAdmin ? (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  ) : (
    <LoginPage />
  );
};

// Simple component to handle admin bookings rendering
const AdminBookingsPage = () => {
  const auth = useAuth();
  const isAdmin = auth?.isAdmin || localStorage.getItem("isAdmin") === "true";
  
  return isAdmin ? (
    <AdminLayout>
      <Bookings />
    </AdminLayout>
  ) : (
    <LoginPage />
  );
};

// Simple component to handle admin services rendering
const AdminServicesPage = () => {
  const auth = useAuth();
  const isAdmin = auth?.isAdmin || localStorage.getItem("isAdmin") === "true";
  
  return isAdmin ? (
    <AdminLayout>
      <Services />
    </AdminLayout>
  ) : (
    <LoginPage />
  );
};

// Simple component to handle service stats rendering
const AdminServiceStatsPage = () => {
  const auth = useAuth();
  const isAdmin = auth?.isAdmin || localStorage.getItem("isAdmin") === "true";
  
  return isAdmin ? (
    <AdminLayout>
      <ServiceStats />
    </AdminLayout>
  ) : (
    <LoginPage />
  );
};

// Simple component to handle admin staff rendering
const AdminStaffPage = () => {
  const auth = useAuth();
  const isAdmin = auth?.isAdmin || localStorage.getItem("isAdmin") === "true";
  
  return isAdmin ? (
    <AdminLayout>
      <Staff />
    </AdminLayout>
  ) : (
    <LoginPage />
  );
};

// Simple component to handle admin settings rendering
const AdminSettingsPage = () => {
  const auth = useAuth();
  const isAdmin = auth?.isAdmin || localStorage.getItem("isAdmin") === "true";
  
  return isAdmin ? (
    <AdminLayout>
      <Settings />
    </AdminLayout>
  ) : (
    <LoginPage />
  );
};

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/booking" component={BookingPage} />
        <Route path="/admin/login" component={LoginPage} />
        
        {/* Admin routes with individual handler components */}
        <Route path="/admin" component={AdminDashboardPage} />
        <Route path="/admin/bookings" component={AdminBookingsPage} />
        <Route path="/admin/services" component={AdminServicesPage} />
        <Route path="/admin/service-stats" component={AdminServiceStatsPage} />
        <Route path="/admin/staff" component={AdminStaffPage} />
        <Route path="/admin/settings" component={AdminSettingsPage} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
