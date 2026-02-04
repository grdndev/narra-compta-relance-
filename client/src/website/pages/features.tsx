import { Link } from "wouter";
import { 
  ArrowRight, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  MessageSquare, 
  FileText,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      <Navbar />

      {/* Process Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 p-8 md:p-12">
              <div className="grid md:grid-cols-8 gap-6 items-center">
                
                {/* Step 1: Detection */}
                <div className="md:col-span-2 relative group h-full">
                  <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-indigo-600/30 hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        01
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Détection</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Analyse automatique des écritures comptables non lettrées
                    </p>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="md:col-span-1 hidden md:flex justify-center text-slate-300">
                  <ArrowRight className="h-6 w-6" />
                </div>

                {/* Step 2: Relance */}
                <div className="md:col-span-2 relative group h-full">
                  <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-indigo-600/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden h-full">
                    <div className="flex items-start justify-between mb-4 relative">
                      <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center relative">
                        <Zap className="h-5 w-5 relative z-10" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                        02
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Relance</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Envoi ciblé par Email/SMS + Traçabilité des échanges
                    </p>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="md:col-span-1 hidden md:flex justify-center text-slate-300">
                  <ArrowRight className="h-6 w-6" />
                </div>

                {/* Step 3: Collecte */}
                <div className="md:col-span-2 relative group h-full">
                  <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-green-600/30 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors duration-300">
                        <CheckCircle2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        03
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Collecte</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Réception et classement automatique dans la GED
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-6">
              Gagnez jusqu’à 80% de temps sur les relances clients
            </h2>
            <p className="text-lg text-slate-600">
              naraa.fr diminue votre temps administratif afin de vous concentrer sur des missions à forte valeur ajoutée.
            </p>
          </div>

          <div className="relative min-h-[800px] lg:min-h-[600px] flex items-center justify-center">
            {/* Connecting Lines (Desktop only) */}
            <svg className="absolute inset-0 w-full h-full hidden lg:block pointer-events-none z-0" viewBox="0 0 1000 600">
              <defs>
                <linearGradient id="lineGradient" x1="500" y1="300" x2="200" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="lineGradient2" x1="500" y1="300" x2="800" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="lineGradient3" x1="500" y1="300" x2="800" y2="450" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="lineGradient4" x1="500" y1="300" x2="200" y2="450" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="lineGradient5" x1="500" y1="300" x2="500" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              <path d="M500 300 L500 130" stroke="url(#lineGradient5)" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M500 300 L250 180" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M500 300 L750 180" stroke="url(#lineGradient2)" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M500 300 L750 420" stroke="url(#lineGradient3)" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M500 300 L250 420" stroke="url(#lineGradient4)" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Center Logo Hub */}
            <div className="relative z-20 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-20"></div>
                <div className="h-24 w-24 md:h-32 md:w-32 bg-white rounded-full shadow-2xl shadow-blue-600/30 border-4 border-slate-50 flex items-center justify-center relative z-10">
                  <div className="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-10 w-10 md:h-12 md:w-12 text-white"
                    >
                      <path d="M22 4L18 2L15 6L2 8L12 12L6 22L16 16L18 8L22 4Z" />
                      <path d="M15 6L12 12" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">naraa.fr</h3>
              <p className="text-sm text-slate-500 font-medium">Cœur du système</p>
            </div>

            {/* Features Positioning */}
            
            {/* 1. Top Center */}
            <div className="lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2 z-20 mb-8 lg:mb-0 w-full max-w-sm">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center hover:scale-105 transition-transform duration-300 relative group">
                <div className="inline-flex h-12 w-12 rounded-xl bg-blue-50 items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Tableau de Bord 360°</h3>
                <p className="text-sm text-slate-600">Visualisez l'état d'avancement de toutes vos relances en un coup d'œil.</p>
              </div>
            </div>

            {/* 2. Top Right */}
            <div className="lg:absolute lg:top-[15%] lg:right-[5%] lg:w-80 z-20 mb-8 lg:mb-0 w-full max-w-sm">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 lg:text-left text-center hover:scale-105 transition-transform duration-300 relative group">
                <div className="inline-flex h-12 w-12 rounded-xl bg-yellow-50 items-center justify-center text-yellow-600 mb-4 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Relances Intelligentes</h3>
                <p className="text-sm text-slate-600">Automatisez la collecte par Email/SMS. Fini la chasse aux factures.</p>
              </div>
            </div>

            {/* 3. Bottom Right */}
            <div className="lg:absolute lg:bottom-[15%] lg:right-[5%] lg:w-80 z-20 mb-8 lg:mb-0 w-full max-w-sm">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 lg:text-left text-center hover:scale-105 transition-transform duration-300 relative group">
                <div className="inline-flex h-12 w-12 rounded-xl bg-purple-50 items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Portail Client</h3>
                <p className="text-sm text-slate-600">Espace collaboratif moderne pour déposer les pièces ou conservation de votre GED</p>
              </div>
            </div>

            {/* 4. Bottom Left */}
            <div className="lg:absolute lg:bottom-[15%] lg:left-[5%] lg:w-80 z-20 mb-8 lg:mb-0 w-full max-w-sm">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 lg:text-right text-center hover:scale-105 transition-transform duration-300 relative group">
                <div className="inline-flex h-12 w-12 rounded-xl bg-indigo-50 items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors ml-auto">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Messagerie Unifiée</h3>
                <p className="text-sm text-slate-600">Centralisez tous les échanges par email avec vos clients.</p>
              </div>
            </div>

            {/* 5. Top Left */}
            <div className="lg:absolute lg:top-[15%] lg:left-[5%] lg:w-80 z-20 mb-8 lg:mb-0 w-full max-w-sm">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 lg:text-right text-center hover:scale-105 transition-transform duration-300 relative group">
                <div className="inline-flex h-12 w-12 rounded-xl bg-green-50 items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors ml-auto">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sécurité</h3>
                <p className="text-sm text-slate-600">Données sécurisées, hébergement en Europe, respect du RGPD.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-slate-900 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-20" />

        <div className="max-w-4xl mx-auto px-4 relative text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Prêt à transformer votre cabinet ?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Rejoignez les experts-comptables qui ont choisi Naraa pour moderniser leur relation client.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/site-vitrine/demo">
              <Button size="lg" className="h-16 px-10 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-lg font-bold">
                Réservez une démo
              </Button>
            </Link>
            <Link href="/site-vitrine/contact">
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-slate-700 text-white hover:bg-slate-800 text-lg">
                Contacter l'équipe
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Aucune carte bancaire requise • Essai gratuit 14 jours
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}