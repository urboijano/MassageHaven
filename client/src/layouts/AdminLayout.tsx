import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [, setLocation] = useLocation();
  
  // Safely access auth context using optional chaining
  const auth = useAuth();
  
  useEffect(() => {
    // Check both auth context and localStorage
    const isLoggedIn = auth?.isAdmin || localStorage.getItem("isAdmin") === "true";
    console.log("AdminLayout - Auth check:", isLoggedIn);
    setIsAdmin(!!isLoggedIn);  // Convert to boolean to avoid TypeScript error
  }, [auth?.isAdmin]);

  // Do not have a second redirect effect, as it can create redirect loops

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-playfair font-bold">Massage Haven Admin</h1>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Content Area */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
