import { useState } from "react";
import { MoveRight, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../auth/store/authStore";

export const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setView, clearAlerts } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "text-sm font-bold text-blue-600 transition-colors"
      : "text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">

              <Link to="/">AI FormFlow</Link>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={getLinkClass("/")}>{t("nav.product")}</Link>
            <Link to="/solutions" className={getLinkClass("/solutions")}>{t("nav.solutions")}</Link>
            {/* <Link to="/solutions" className={getLinkClass("/enterprise") || "text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"}>{t("nav.enterprise", "Enterprise")}</Link> */}
            <Link to="/pricing" className={getLinkClass("/pricing") || "text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"}>{t("nav.pricing")}</Link>
            {/* <Link to="/" className={getLinkClass("/pricing") || "text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"}>{t("nav.pricing")}</Link> */}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => {
                clearAlerts();
                setView("login");
                navigate("/auth");
              }}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t("nav.login")}
            </button>
            <Link
              to="/auth"
              onClick={() => {
                clearAlerts();
                setView("login");
              }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              {t("nav.get_started")}
              <MoveRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-6 flex flex-col space-y-6">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`block ${getLinkClass("/")}`}>{t("nav.product")}</Link>
            <Link to="/solutions" onClick={() => setIsMobileMenuOpen(false)} className={`block ${getLinkClass("/solutions")}`}>{t("nav.solutions")}</Link>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`block ${getLinkClass("/pricing") || "text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"}`}>{t("nav.pricing")}</Link>
            
            <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  clearAlerts();
                  setView("login");
                  navigate("/auth");
                }}
                className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                {t("nav.login")}
              </button>
              <Link
                to="/auth"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  clearAlerts();
                  setView("login");
                }}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                {t("nav.get_started")}
                <MoveRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

