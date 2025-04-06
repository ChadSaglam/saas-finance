"use client";

import { useState } from "react";
import { 
  FileText, 
  FileCheck, 
  Users, 
  CreditCard, 
  BarChart3,
  Sparkles
} from "lucide-react";

export function FeatureSection() {
  // Track the feature being hovered
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  
  // Feature data with icons
  const features = [
    {
      icon: FileCheck,
      title: "Professional Offers",
      description: "Create detailed price proposals that stand out with custom branding and professional layouts."
    },
    {
      icon: FileText,
      title: "Invoice Generation",
      description: "Generate polished invoices instantly with automatic calculations, tax handling, and payment terms."
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Accept payments online directly through your invoices with integrated payment gateways."
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Organize client information, communication history, and document access in one central location."
    },
    {
      icon: BarChart3,
      title: "Financial Insights",
      description: "Get visual reports on revenue, outstanding invoices, and business performance trends."
    },
    {
      icon: Sparkles,
      title: "AI Automation",
      description: "Let AI help generate content, suggest pricing, and automate repetitive tasks for you."
    }
  ];

  return (
    <section id="features" className="w-full py-20 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Grow Your Business</span>
          </h2>
          <p className="max-w-[800px] text-gray-500 md:text-xl">
            Our platform combines everything you need to create proposals, generate invoices, and manage client relationships.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i} 
                className="group relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-5 transition-colors duration-300 ${
                  hoveredFeature === i 
                    ? "bg-blue-600 text-white" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 h-1 bg-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}