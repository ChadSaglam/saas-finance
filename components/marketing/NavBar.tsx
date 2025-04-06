"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
    >
      <div className="container flex items-center justify-between h-16 mx-auto px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              SaaSInvoice
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="#features" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="#testimonials" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Testimonials
          </Link>
          <Link href="#pricing" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <div className="ml-4 flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Log In
            </Link>
            <Button size="sm" className="transition-transform hover:scale-105">
              Get Started
            </Button>
          </div>
        </nav>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-blue-600"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col bg-white border-t shadow-lg animate-in fade-in slide-in-from-top duration-300">
          <Link 
            href="#features" 
            className="px-6 py-4 text-gray-700 hover:bg-gray-50 border-b"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="#testimonials" 
            className="px-6 py-4 text-gray-700 hover:bg-gray-50 border-b"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Testimonials
          </Link>
          <Link 
            href="#pricing" 
            className="px-6 py-4 text-gray-700 hover:bg-gray-50 border-b"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <div className="flex flex-col gap-2 p-4">
            <Link 
              href="/login" 
              className="w-full py-2 text-center text-gray-700 border rounded-md hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link 
              href="/register" 
              className="w-full py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}