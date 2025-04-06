import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container px-4 md:px-6 mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                SaaSInvoice
              </h3>
            </div>
            <p className="text-gray-500 mb-4 max-w-xs">
              Professional invoicing and client management software for businesses of all sizes.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Integrations', 'FAQ', 'Changelog'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-500 hover:text-blue-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              {['About us', 'Blog', 'Careers', 'Contact', 'Media kit'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-500 hover:text-blue-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Terms', 'Privacy', 'Cookies', 'Licenses', 'Settings'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-500 hover:text-blue-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SaaSInvoice. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button className="text-gray-500 text-sm hover:text-blue-600">
              Privacy Policy
            </button>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <button className="text-gray-500 text-sm hover:text-blue-600">
              Terms of Service
            </button>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <button className="text-gray-500 text-sm hover:text-blue-600">
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}