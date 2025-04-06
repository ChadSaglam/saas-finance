import { Check } from "lucide-react";
import Button from "@/components/ui/Button";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: 19,
      description: "Perfect for freelancers and small businesses just getting started.",
      features: [
        "Create up to 10 invoices/month",
        "3 custom offer templates",
        "Client management",
        "Export to PDF",
        "Email support"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: 49,
      description: "Ideal for growing businesses with more regular invoicing needs.",
      features: [
        "Unlimited invoices",
        "10 custom offer templates",
        "Client portal access",
        "Payment integrations",
        "Team members (up to 3)",
        "Analytics dashboard",
        "Priority support"
      ],
      highlighted: true
    },
    {
      name: "Business",
      price: 99,
      description: "For established businesses that need comprehensive features.",
      features: [
        "Everything in Professional",
        "Unlimited templates",
        "Advanced reporting",
        "API access",
        "Unlimited team members",
        "Custom branding",
        "Dedicated account manager"
      ],
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="w-full py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl">
            Choose the plan that fits your business needs. All plans come with a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative rounded-xl overflow-hidden ${
                plan.highlighted 
                  ? "border-2 border-blue-500 shadow-lg shadow-blue-100" 
                  : "border border-gray-200 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white py-1 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-6 ${plan.highlighted ? "pt-9" : ""}`}>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-500 mb-6">
                  {plan.description}
                </p>
                
                <Button 
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="w-full mb-6"
                >
                  {plan.highlighted ? "Get Started" : "Start Free Trial"}
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center">
                      <Check className={`h-5 w-5 mr-3 ${
                        plan.highlighted 
                          ? "text-blue-500" 
                          : "text-gray-500"
                      }`} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}