import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Make the auth context type have all properties optional
type AuthContextType = {
  isAdmin?: boolean;
  login?: (username: string, password: string) => Promise<boolean>;
  logout?: () => void;
};

// Initialize with empty object instead of undefined
const AuthContext = createContext<AuthContextType>({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is already logged in on mount
  useEffect(() => {
    const admin = localStorage.getItem("isAdmin");
    if (admin === "true") {
      setIsAdmin(true);
    }
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, we'll implement a simple login check
      // In a real app, this would make an API call to verify credentials
      if (username === "admin" && password === "password") {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
        toast({
          title: "Login successful",
          description: "Welcome to Massage Haven Admin",
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Show loading for at least 1 second
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    setLocation("/");
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, isLoading }}>
      {children}
      {isLoading && <PageLoading />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
