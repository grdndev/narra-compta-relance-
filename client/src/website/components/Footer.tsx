import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
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
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Intégrations</a></li>
              <li><Link href="/site-vitrine/pricing"><span className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">Tarifs</span></Link></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Nouveautés</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Entreprise</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">À propos</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Carrières</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Contact</a></li>
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