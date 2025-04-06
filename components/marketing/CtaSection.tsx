import { ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

export function CtaSection() {
  return (
    <section className="w-full py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to Streamline Your Business?
            </h2>
            <p className="text-blue-100 text-lg max-w-[90%]">
              Join thousands of businesses that are saving time, getting paid faster, and improving client relationships with SaaSInvoice.
            </p>
            
            <div className="space-y-3">
              {[
                "Create professional invoices and offers in minutes",
                "Get paid faster with online payment processing",
                "Track income and expenses in real-time",
                "Manage client relationships with ease"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-300 flex-shrink-0" />
                  <span className="text-blue-50">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-3">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800"
              >
                Start Your Free Trial 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-blue-200 mt-3">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                14-day free trial
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Create your account</h4>
                  <div className="h-12 bg-white/20 rounded-md backdrop-blur-sm"></div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Business information</h4>
                  <div className="h-24 bg-white/20 rounded-md backdrop-blur-sm"></div>
                </div>
                
                <Button 
                  className="w-full bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                >
                  Get Started
                </Button>
              </div>
            </div>
            
            <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}