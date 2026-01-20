import { useState } from "react";
import { Link } from "wouter";
import { 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  MessageSquare, 
  FileText,
  Menu,
  X,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
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

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Fonctionnalités</a>
              <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Avantages</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Témoignages</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Tarifs</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                  Connexion
                </Button>
              </Link>
              <Link href="/">
                <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                  Demander une démo
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
            <a href="#features" className="text-base font-medium text-slate-600 py-2">Fonctionnalités</a>
            <a href="#benefits" className="text-base font-medium text-slate-600 py-2">Avantages</a>
            <a href="#pricing" className="text-base font-medium text-slate-600 py-2">Tarifs</a>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <Link href="/">
                <Button variant="outline" className="w-full justify-center">Connexion</Button>
              </Link>
              <Link href="/">
                <Button className="w-full justify-center bg-blue-600">Demander une démo</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />

          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Nouveau : Découvrez l'Assistant IA pour vos journaux
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 max-w-5xl mx-auto">
              L'outil de relance des pièces manquantes <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">pour les experts-comptables</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Gagnez du temps sur vos échanges clients, automatisez vos relances et pilotez votre cabinet avec une précision chirurgicale.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link href="/">
                <Button size="lg" className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-xl shadow-blue-600/25 transition-all hover:scale-105">
                  Demander une démo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image Mockup - Professional B2B Style */}
          <div className="relative mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {/* Main Container */}
            <div className="relative rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50">
              
              {/* Header Bar */}
              <div className="h-10 border-b border-slate-100 bg-slate-50 flex items-center px-4 gap-2 rounded-t-xl">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
              </div>

              {/* Floating UI Elements - Positioned relative to the main container but outside the overflow */}
              <div className="absolute -right-20 top-8 hidden lg:block animate-[bounce_4s_infinite] z-20">
                <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 max-w-[200px] transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Docs manquants</div>
                      <div className="text-[10px] text-slate-500">Dossier SARL Dupond</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[75%]"></div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-16 top-32 hidden lg:block animate-[bounce_5s_infinite] delay-700 z-20">
                <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 max-w-[200px] transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Client inactif</div>
                      <div className="text-[10px] text-slate-500">Relance activée</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-12 hidden lg:block animate-[bounce_6s_infinite] delay-1000 z-20">
                <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 max-w-[180px] transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Taux d'ouverture</div>
                      <div className="text-[10px] text-slate-500">Campagne mars</div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-xl font-bold text-slate-900">84%</div>
                    <div className="text-[10px] text-green-600 flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded-full">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      +12%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 overflow-hidden rounded-b-xl">
                <div className="grid md:grid-cols-8 gap-6 items-center">
                  
                  {/* Step 1: Detection */}
                  <div className="md:col-span-2 relative group h-full">
                    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-indigo-600/30 hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden">
                      {/* Scanning Animation */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] -translate-y-full" />
                      
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
                    <ArrowRight className="h-6 w-6 animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>

                  {/* Step 2: Relance */}
                  <div className="md:col-span-2 relative group h-full">
                    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-indigo-600/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden h-full">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                      
                      <div className="flex items-start justify-between mb-4 relative">
                        <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center relative">
                          <Zap className="h-5 w-5 relative z-10" />
                          <div className="absolute inset-0 bg-indigo-600 rounded-lg animate-ping opacity-20 group-hover:opacity-40"></div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                          02
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">Relance</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Envoi ciblé par Email, SMS ou WhatsApp selon préférence
                      </p>
                    </div>
                  </div>

                  {/* Arrow 2 */}
                  <div className="md:col-span-1 hidden md:flex justify-center text-slate-300">
                    <ArrowRight className="h-6 w-6 animate-[pulse_2s_ease-in-out_infinite] delay-500" />
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
              
              {/* Subtle background grid */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Recommandé par plus de 500 cabinets d'expertise
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mock Logos - simple text for now */}
            <span className="text-xl font-bold text-slate-400">ACD Groupe</span>
            <span className="text-xl font-bold text-slate-400">Sage</span>
            <span className="text-xl font-bold text-slate-400">Cegid</span>
            <span className="text-xl font-bold text-slate-400">MyUnisoft</span>
            <span className="text-xl font-bold text-slate-400">QuickBooks</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-6">
              Tout ce dont vous avez besoin pour <br/>piloter votre cabinet
            </h2>
            <p className="text-lg text-slate-600">
              Naraa centralise vos outils et fluidifie vos processus pour vous permettre de vous concentrer sur le conseil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6 text-yellow-500" />,
                title: "Relances Intelligentes",
                desc: "Automatisez la collecte des pièces manquantes par Email, SMS ou WhatsApp. Fini la chasse aux factures."
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
                title: "Tableau de Bord 360°",
                desc: "Visualisez l'état d'avancement de tous vos dossiers en un coup d'œil. Identifiez les points de blocage instantanément."
              },
              {
                icon: <Users className="h-6 w-6 text-purple-500" />,
                title: "Portail Client Collaboratif",
                desc: "Offrez à vos clients un espace moderne pour déposer leurs pièces et suivre leur activité en temps réel."
              },
              {
                icon: <Shield className="h-6 w-6 text-green-500" />,
                title: "Sécurité Bancaire",
                desc: "Données chiffrées de bout en bout, hébergement souverain et conformité RGPD garantie."
              },
              {
                icon: <FileText className="h-6 w-6 text-red-500" />,
                title: "GED Intégrée",
                desc: "Classement automatique des documents, reconnaissance OCR et recherche plein texte performante."
              },
              {
                icon: <MessageSquare className="h-6 w-6 text-indigo-500" />,
                title: "Messagerie Unifiée",
                desc: "Centralisez tous les échanges avec vos clients au même endroit, qu'ils viennent par mail ou chat."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-6">
              Tarifs
            </h2>
            <h3 className="text-xl font-semibold text-blue-600 mb-6">
              Bénéficiez d'un prix adapté à vos besoins et objectifs
            </h3>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Nos solutions sont conçues pour un déploiement rapide et un retour sur investissement immédiat. Nos prix sont flexibles, en fonction des volumes traités et des caractéristiques de votre projet.
            </p>
            <Link href="/">
              <Button size="lg" className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800">
                Demander un devis personnalisé
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
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
            <Link href="/">
              <Button size="lg" className="h-16 px-10 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-lg font-bold">
                Demander une démo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-slate-700 text-white hover:bg-slate-800 text-lg">
              Contacter l'équipe
            </Button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Aucune carte bancaire requise • Essai gratuit 14 jours
          </p>
        </div>
      </section>

      {/* Footer */}
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
                <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Tarifs</a></li>
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
              <a href="#" className="text-slate-400 hover:text-slate-600">Confidentialité</a>
              <a href="#" className="text-slate-400 hover:text-slate-600">CGV</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}