import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-standard group">
      <div className="relative h-64 overflow-hidden">
        <img 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-standard"
          src={service.imageUrl} 
          alt={service.name} 
        />
        <div className="absolute inset-0 bg-primary bg-opacity-20 group-hover:bg-opacity-10 transition-standard"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-playfair font-bold text-primary mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-accent font-bold">₱{service.price} / {service.duration} min</span>
          <Link href="/booking">
            <Button variant="link" className="text-primary hover:text-accent font-medium flex items-center">
              Book Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
