import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isHome = location === "/site-vitrine";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!isHome) return; // If not on home, let the router handle it (or use Link)
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/site-vitrine">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-6 w-6"
                >
                  <path d="M22 4L18 2L15 6L2 8L12 12L6 22L16 16L18 8L22 4Z" />
                  <path d="M15 6L12 12" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Naraa.ai
              </span>
            </div>
          </Link>

          {/* Desktop Menu - moved to right side */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/site-vitrine">
              <span 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Fonctionnalités
              </span>
            </Link>
            <Link href="/site-vitrine/pricing">
              <span className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                Tarifs
              </span>
            </Link>
            <Link href="/site-vitrine/about">
              <span className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                À propos
              </span>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                Connexion
              </Button>
            </Link>
            <Link href="/site-vitrine/demo">
              <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                Réservez une démo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-xl">
          <Link href="/site-vitrine">
            <span className="text-base font-medium text-slate-600 py-2 cursor-pointer">Fonctionnalités</span>
          </Link>
          <Link href="/site-vitrine/pricing">
            <span className="text-base font-medium text-slate-600 py-2 cursor-pointer">Tarifs</span>
          </Link>
          <Link href="/site-vitrine/about">
            <span className="text-base font-medium text-slate-600 py-2 cursor-pointer">À propos</span>
          </Link>
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
            <Link href="/login">
              <Button variant="outline" className="w-full justify-center">Connexion</Button>
            </Link>
            <Link href="/site-vitrine/demo">
              <Button className="w-full justify-center bg-blue-600">Réservez une démo</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}