import { Globe, Share2, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20 shrink-0">
          <div className="lg:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-8">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FormFlow AI</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 font-medium leading-relaxed text-sm">
              The world's most intelligent form infrastructure for high-growth teams.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 font-sm">Platform</h4>
            <ul className="space-y-4">
              <li><a href="/#features" className="text-gray-500 font-medium hover:text-blue-600 text-xs transition-colors">Features</a></li>
              <li><a href="/#integrations" className="text-gray-500 font-medium hover:text-blue-600 text-xs transition-colors">Integrations</a></li>
              <li><Link to="/" className="text-gray-500 font-medium hover:text-blue-600 text-xs">Security</Link></li>
              <li><Link to="/" className="text-gray-500 font-medium hover:text-blue-600 text-xs">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 font-sm">Solutions</h4>
            <ul className="space-y-4">
              <li><Link to="/solutions" className="text-blue-600 font-medium text-xs">Enterprise</Link></li>
              <li><Link to="/solutions" className="text-gray-500 font-medium hover:text-blue-600 text-xs">Financial Services</Link></li>
              <li><Link to="/solutions" className="text-gray-500 font-medium hover:text-blue-600 text-xs">Healthcare</Link></li>
              <li><Link to="/solutions" className="text-gray-500 font-medium hover:text-blue-600 text-xs">GovTech</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold text-gray-900 mb-6 font-sm">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 font-medium hover:text-blue-600 text-xs">About Us</Link></li>
              <li><Link to="/" className="text-gray-500 font-medium hover:text-blue-600 text-xs">Careers</Link></li>
              <li><Link to="/" className="text-gray-500 font-medium hover:text-blue-600 text-xs">Press</Link></li>
              <li><Link to="/" className="text-gray-500 font-medium hover:text-blue-600 text-xs">Contact</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold text-gray-900 mb-6 font-sm">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 font-medium hover:text-blue-600 text-xs">Help Center</Link></li>
              <li><Link to="/" className="text-gray-500 font-medium hover:text-blue-600 text-xs">Documentation</Link></li>
              <li><Link to="/" className="text-gray-500 font-medium hover:text-blue-600 text-xs">API Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs font-medium">© 2026 FormFlow AI Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all"><Globe className="w-4 h-4" /></Link>
            <Link to="/" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all"><Share2 className="w-4 h-4" /></Link>
            <Link to="/" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all"><Smartphone className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
