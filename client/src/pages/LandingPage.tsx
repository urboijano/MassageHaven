import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/testimonials/TestimonialSlider";
import ServiceCard from "@/components/services/ServiceCard";
import { Service } from "@shared/schema";

export default function LandingPage() {
  const [showAllServices, setShowAllServices] = useState(false);
  const {
    data: services,
    isLoading: servicesLoading,
    error,
  } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    onError: (err) => {
      console.error("Error fetching services:", err);
    },
  });

  // Debug logging
  console.log("Services data:", services);

  if (error) {
    console.error("Error loading services:", error);
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen bg-gradient-to-b from-secondary/30 to-primary/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(200,158,111,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="hero-content max-w-2xl">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-shadow leading-tight">
              Experience Tranquility <br />
              at Massage Haven
            </h1>
            <p className="text-xl mb-8 text-shadow opacity-90">
              Indulge in luxurious treatments designed to rejuvenate your body,
              mind, and spirit.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/booking">
                <Button variant="accent" size="lg">
                  Book Now
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white"
                >
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white">
          <a
            href="#services"
            className="flex flex-col items-center text-sm animate-bounce"
          >
            <span className="mb-2">Discover More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our range of luxurious treatments designed to provide
              ultimate relaxation and rejuvenation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No services available</p>
              </div>
            ) : (
              (services || [])
                .slice(0, showAllServices ? undefined : 3)
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowAllServices(!showAllServices)}
            >
              {showAllServices ? "Show Less" : "View All Services"}
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="about" className="py-20 bg-secondary bg-opacity-30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-6">
                Experience Tranquility Like Never Before
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                At Massage Haven, we believe in the transformative power of
                touch and relaxation. Our sanctuary offers a respite from the
                demands of everyday life, where you can immerse yourself in a
                world of tranquility and rejuvenation.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Each of our treatments is crafted with precision and care,
                delivered by skilled therapists who understand the unique needs
                of your body and spirit.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="text-accent mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-2">
                      Expert Therapists
                    </h3>
                    <p className="text-gray-600">
                      Highly trained professionals with years of experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-accent mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-2">
                      Premium Products
                    </h3>
                    <p className="text-gray-600">
                      Organic, sustainable ingredients for all treatments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-accent mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-2">
                      Easy Booking
                    </h3>
                    <p className="text-gray-600">
                      Convenient online scheduling system.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-accent mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-2">
                      Satisfaction Guaranteed
                    </h3>
                    <p className="text-gray-600">
                      Your wellness is our top priority.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="#approach"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("approach")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center text-accent font-medium hover:underline"
              >
                Learn more about our approach
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow-lg h-64 md:h-80">
                <img
                  src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700"
                  alt="Serene massage room"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "path/to/fallback-image.jpg";
                  }}
                />
              </div>

              <div className="rounded-lg overflow-hidden shadow-lg h-64 md:h-80 transform translate-y-8">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700"
                  alt="Relaxation lounge"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "path/to/fallback-image.jpg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section id="approach" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-8 text-center">
              Our Approach to Wellness
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  Holistic Treatment
                </h3>
                <p className="text-gray-600 mb-6">
                  We believe in treating not just the symptoms but the whole
                  person. Our therapeutic approaches combine ancient wisdom with
                  modern techniques to provide comprehensive healing
                  experiences.
                </p>

                <h3 className="text-xl font-bold text-primary mb-4">
                  Personalized Care
                </h3>
                <p className="text-gray-600">
                  Every client receives a treatment plan tailored to their
                  specific needs and goals. We take time to understand your
                  lifestyle, stress factors, and wellness objectives.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  Premium Products
                </h3>
                <p className="text-gray-600 mb-6">
                  We use only the highest quality, organic products in our
                  treatments. Our commitment to sustainability means we choose
                  products that are good for both you and the environment.
                </p>

                <h3 className="text-xl font-bold text-primary mb-4">
                  Continuous Education
                </h3>
                <p className="text-gray-600">
                  Our therapists regularly update their skills and knowledge
                  through professional development programs, ensuring you
                  receive the most effective and current treatment methods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover why clients choose Massage Haven for their wellness
              journey.
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* Call To Action */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')",
        }}
      >
        <div className="absolute inset-0 bg-primary bg-opacity-70"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
              Begin Your Wellness Journey Today
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Experience the perfect blend of ancient techniques and modern
              approaches to wellness at Massage Haven.
            </p>
            <Link href="/booking">
              <Button variant="accent" size="lg">
                Book Your Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
