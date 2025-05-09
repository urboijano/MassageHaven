import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  // Safely access auth context with optional chaining
  const auth = useAuth();
  const isAdmin = auth?.isAdmin || false;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path ? "text-accent" : "text-primary";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-primary font-playfair text-2xl font-bold">Massage Haven</span>
          </Link>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-primary hover:text-accent focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex items-center`}>
          <div className="flex flex-col md:flex-row md:mx-6">
            <a 
              href="/" 
              onClick={(e) => {
                if (location === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`my-2 text-sm font-medium md:mx-4 md:my-0 nav-link ${isActive('/')}`}
            >
              Home
            </a>
            <a 
              href="/#services"
              onClick={(e) => {
                if (location === '/') {
                  e.preventDefault();
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`my-2 text-sm font-medium md:mx-4 md:my-0 nav-link ${isActive('/#services')}`}
            >
              Services
            </a>
            <a 
              href="/#about"
              onClick={(e) => {
                if (location === '/') {
                  e.preventDefault();
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`my-2 text-sm font-medium md:mx-4 md:my-0 nav-link ${isActive('/#about')}`}
            >
              About
            </a>
            <a 
              href="/#testimonials"
              onClick={(e) => {
                if (location === '/') {
                  e.preventDefault();
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`my-2 text-sm font-medium md:mx-4 md:my-0 nav-link ${isActive('/#testimonials')}`}
            >
              Testimonials
            </a>
            <a 
              href="/#contact"
              onClick={(e) => {
                if (location === '/') {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`my-2 text-sm font-medium md:mx-4 md:my-0 nav-link ${isActive('/#contact')}`}
            >
              Contact
            </a>
            <Link href="/booking" className={`my-2 text-sm font-medium md:mx-4 md:my-0 nav-link ${isActive('/booking')}`}>
              Book Now
            </Link>
          </div>

          <div className="flex items-center py-2 -mx-1 md:mx-0">
            {isAdmin ? (
              <Link href="/admin">
                <Button variant="accent" className="block w-full md:w-auto">
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button variant="accent" className="block w-full md:w-auto">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}