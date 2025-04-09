'use client';

import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div 
            className={`space-y-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm bg-blue-50 text-blue-800 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              New Feature: AI-Powered Invoice Suggestions
              <ChevronRight size={14} className="text-blue-400" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl">
                Simplify Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Client Billing</span> Process
              </h1>
              <p className="text-gray-600 md:text-xl max-w-[600px]">
                Create professional price offers and invoices in minutes. Save time, get paid faster, and focus on what matters most—your business.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-base font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
                >
                  Watch Demo
                </Link>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 gap-8">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-blue-500" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-blue-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <div className="aspect-video overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              <div className="relative w-full h-full">
                <img 
                  src="https://placehold.co/1200x675/f5f8ff/4f77e2?text=Dashboard+Preview"
                  alt="SaaSInvoice Dashboard Preview" 
                  className="w-full h-full object-cover"
                />

                <div className="absolute -right-12 top-12 w-64 rounded-lg bg-white p-4 shadow-lg border border-gray-100 rotate-6 hidden md:block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Invoice Paid</p>
                      <p className="text-xs text-gray-500">$1,200.00 received</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-12 bottom-12 w-64 rounded-lg bg-white p-4 shadow-lg border border-gray-100 -rotate-6 hidden md:block">
                  <div className="mb-2 text-sm font-medium">Monthly Revenue</div>
                  <div className="text-2xl font-bold">$24,500</div>
                  <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 top-1/2 right-1/2 w-1/2 aspect-square bg-blue-100 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -z-10 bottom-0 right-0 w-1/3 aspect-square bg-indigo-100 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-gray-100">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm">TRUSTED BY BUSINESSES WORLDWIDE</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-70">
            {['Acme Inc', 'Globex', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne'].map((company, i) => (
              <div key={i} className="text-gray-400 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}