import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-standard group bg-secondary bg-opacity-5">
      <div className="p-6">
        <h3 className="text-xl font-playfair font-bold text-primary mb-3">{service.name}</h3>
        <p className="text-gray-600 mb-4 min-h-[60px]">{service.description}</p>
        <div className="flex justify-between items-center pt-4 border-t border-secondary border-opacity-20">
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