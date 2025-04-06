"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export function TestimonialSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" 
        ? -current.offsetWidth 
        : current.offsetWidth;
      
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const testimonials = [
    {
      quote: "SaaSInvoice has completely transformed how we handle client billing. We've reduced the time spent on invoicing by 70% and get paid faster.",
      name: "Sarah Johnson",
      title: "CEO, Design Studio",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The ability to generate professional price offers that automatically convert to invoices has streamlined our sales process enormously.",
      name: "Michael Chen",
      title: "Sales Director, TechCorp",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "As a freelancer, keeping track of invoices was always a pain point. SaaSInvoice made it simple and I now have a complete overview of my finances.",
      name: "Emma Garcia",
      title: "Independent Consultant",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      quote: "The client management features alone are worth the price. Having everything in one place has made our team much more efficient.",
      name: "David Wilson",
      title: "Operations Manager, ServicePro",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg"
    }
  ];

  return (
    <section id="testimonials" className="w-full py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Quote className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Loved by Businesses Everywhere
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl">
            Don't just take our word for it. Here's what our customers have to say.
          </p>
        </div>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 md:-left-5"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 md:-right-5"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Testimonial Slider */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x"
          >
            {testimonials.map((testimonial, i) => (
              <div 
                key={i}
                className="min-w-[300px] md:min-w-[400px] flex-shrink-0 snap-center bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100"
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="mb-6">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}