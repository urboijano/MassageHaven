import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  rating: number;
  initials: string;
}

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      content:
        "The deep tissue massage at Massage Haven was exactly what I needed. My therapist was attentive, professional, and addressed all my problem areas. I left feeling completely renewed and have already booked my next appointment!",
      author: "Rodel C.",
      role: "Regular Client - 3 years",
      rating: 5,
      initials: "RC",
    },
    {
      id: 2,
      content:
        "The hot stone therapy at Massage Haven is absolutely divine. The ambiance, the service, and the technique were all impeccable. It was the most relaxing 90 minutes I've had in years. Highly recommend for anyone dealing with stress!",
      author: "Rhomar M.",
      role: "New Client",
      rating: 5,
      initials: "RM",
    },
    {
      id: 3,
      content:
        "I treated myself to the Luxury Facial for my birthday and was blown away by the results. My skin looked and felt amazing afterward, and the therapist was knowledgeable about what products would work best for my skin type. Can't wait to come back!",
      author: "Adrian A.",
      role: "Regular Client - 1 year",
      rating: 4.5,
      initials: "AA",
    },
  ];

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-accent"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }

    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-accent"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }

    return stars;
  };

  return (
    <div className="testimonial-slider relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-all duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-6">
              <Card className="bg-secondary bg-opacity-30 p-8">
                <div className="flex items-center mb-6">
                  <div className="text-accent flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  {testimonial.content}
                </p>
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                      <span className="font-bold">{testimonial.initials}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goToPrev}
        className="testimonial-nav-button -left-4 md:-left-8"
        aria-label="Previous testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="testimonial-nav-button -right-4 md:-right-8"
        aria-label="Next testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full bg-accent transition-standard ${
              currentIndex === index
                ? "opacity-100"
                : "opacity-50 hover:opacity-75"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
