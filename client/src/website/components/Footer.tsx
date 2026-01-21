import { Link, useLocation } from "wouter";

export function Footer() {
  const [location] = useLocation();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
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
              <span className="text-xl font-bold text-slate-900">Naraa.ai</span>
            </div>
            <p className="text-slate-500 max-w-xs leading-relaxed">
              La plateforme tout-en-un pour les experts-comptables modernes. Automatisez, collaborez et développez votre cabinet.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Produit</h4>
            <ul className="space-y-3">
              <li><a href={location.pathname === "/site-vitrine" ? "#features" : "/site-vitrine#features"} className="text-slate-500 hover:text-blue-600 transition-colors">Fonctionnalités</a></li>
              <li><Link href="/site-vitrine/pricing"><span className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">Tarifs</span></Link></li>
              <li><Link href="/site-vitrine/about"><span className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">À propos</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Entreprise</h4>
            <ul className="space-y-3">
              <li><Link href="/login"><span className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">Connexion</span></Link></li>
              <li><Link href="/site-vitrine/demo"><span className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">Réservez une démo</span></Link></li>
              <li><Link href="/site-vitrine/contact"><span className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">Contact</span></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 Naraa SAS. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}