import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/booking/BookingForm";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "@shared/schema";

export default function BookingPage() {
  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });
  return (
    <>
      <Navbar />
      
      <section id="booking" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">Book Your Visit</h1>
              <p className="text-lg text-gray-600">Select your preferred service, date, and time for your visit to Massage Haven.</p>
            </div>
            
            <BookingForm />
            
            {/* Additional Information */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-accent bg-opacity-20 p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-primary text-lg">Hours of Operation</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>{settings?.mondayToFridayEnabled ? `${settings?.mondayToFridayOpen} - ${settings?.mondayToFridayClose}` : 'Closed'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>{settings?.saturdayEnabled ? `${settings?.saturdayOpen} - ${settings?.saturdayClose}` : 'Closed'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday:</span>
                      <span>{settings?.sundayEnabled ? `${settings?.sundayOpen} - ${settings?.sundayClose}` : 'Closed'}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-accent bg-opacity-20 p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-primary text-lg">Booking Policy</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>Appointments can be scheduled up to 30 days in advance</li>
                    <li>24-hour cancellation notice required</li>
                    <li>15-minute grace period for late arrivals</li>
                    <li>Please arrive 15 minutes early for your first visit</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-accent bg-opacity-20 p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-primary text-lg">Contact Us</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>Phone: {settings?.phone}</li>
                    <li>Email: {settings?.contactEmail}</li>
                    <li>Address: {settings?.address}</li>
                    <li>For urgent matters, please call directly</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
