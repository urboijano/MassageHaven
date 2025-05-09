
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/services/ServiceCard";

export default function ServicesPage() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <>
      <Navbar />
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">Our Services</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete range of luxurious treatments designed to provide ultimate relaxation and rejuvenation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No services available</p>
              </div>
            ) : services?.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
