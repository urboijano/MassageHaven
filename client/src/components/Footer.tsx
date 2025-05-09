import { Link } from "wouter";
import { useLocation } from 'wouter';
import { useQuery } from "@tanstack/react-query";
import { Settings } from "@shared/schema";

export default function Footer() {
  const [location] = useLocation();

  const handleScroll = (e, id) => {
    if (location === '/') {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-xl font-bold mb-4">Massage Haven</h3>
            <p className="mb-4 opacity-80">Your sanctuary for wellness and rejuvenation in the heart of the city.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-standard">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-accent transition-standard">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-accent transition-standard">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-accent transition-standard">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" onClick={(e) => handleScroll(e, 'home')} className="opacity-80 hover:opacity-100 hover:text-accent transition-standard">Home</a></li>
              <li><a href="/#services" onClick={(e) => handleScroll(e, 'services')} className="opacity-80 hover:opacity-100 hover:text-accent transition-standard">Services</a></li>
              <li><a href="/#about" onClick={(e) => handleScroll(e, 'about')} className="opacity-80 hover:opacity-100 hover:text-accent transition-standard">About Us</a></li>
              <li><a href="/#testimonials" onClick={(e) => handleScroll(e, 'testimonials')} className="opacity-80 hover:opacity-100 hover:text-accent transition-standard">Testimonials</a></li>
              <li><Link href="/booking" className="opacity-80 hover:opacity-100 hover:text-accent transition-standard">Book Now</Link></li>
            </ul>
          </div>

          <div id="contact"> {/* Added ID for contact section */}
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-3 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="opacity-80">{settings?.address}</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-3 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="opacity-80">{settings?.phone}</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-3 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="opacity-80">{settings?.contactEmail}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Hours</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="opacity-80">Monday - Friday</span>
                <span className="opacity-80">{settings?.mondayToFridayEnabled ? `${settings?.mondayToFridayOpen} - ${settings?.mondayToFridayClose}` : 'Closed'}</span>
              </li>
              <li className="flex justify-between">
                <span className="opacity-80">Saturday</span>
                <span className="opacity-80">{settings?.saturdayEnabled ? `${settings?.saturdayOpen} - ${settings?.saturdayClose}` : 'Closed'}</span>
              </li>
              <li className="flex justify-between">
                <span className="opacity-80">Sunday</span>
                <span className="opacity-80">{settings?.sundayEnabled ? `${settings?.sundayOpen} - ${settings?.sundayClose}` : 'Closed'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="opacity-80 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Massage Haven. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link 
              href="/privacy-policy" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm opacity-80 hover:opacity-100 transition-standard"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-of-service" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm opacity-80 hover:opacity-100 transition-standard"
            >
              Terms of Service
            </Link>
            <Link 
              href="/cookie-policy" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm opacity-80 hover:opacity-100 transition-standard"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}