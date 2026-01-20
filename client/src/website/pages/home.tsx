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
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Naraa
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
              <Link href="/dashboard">
                <Button variant="ghost" className="font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                  Connexion
                </Button>
              </Link>
              <Link href="/dashboard">
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
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-center">Connexion</Button>
              </Link>
              <Link href="/dashboard">
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
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              La gestion comptable <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">réinventée pour demain</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Gagnez du temps sur vos échanges clients, automatisez vos relances et pilotez votre cabinet avec une précision chirurgicale.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-xl shadow-blue-600/25 transition-all hover:scale-105">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 text-lg">
                <Play className="mr-2 h-4 w-4 fill-slate-700" />
                Voir la vidéo
              </Button>
            </div>
          </div>

          {/* Hero Image Mockup */}
          <div className="relative mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-2 shadow-2xl backdrop-blur-sm lg:rounded-3xl lg:p-4">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80" 
                alt="Naraa Dashboard Interface" 
                className="block w-full rounded-xl border border-slate-200 shadow-sm lg:rounded-2xl"
              />
              
              {/* Floating UI Elements */}
              <div className="absolute -right-12 top-20 hidden lg:block animate-bounce duration-[3000ms]">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">TVA Validée</div>
                      <div className="text-xs text-slate-500">Il y a 2 minutes</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[100%]"></div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-12 bottom-40 hidden lg:block animate-bounce duration-[4000ms]">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Nouveau message</div>
                      <div className="text-xs text-slate-500">Client SARL Martin</div>
                    </div>
                  </div>
                </div>
              </div>
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
            <Link href="/dashboard">
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
                <span className="text-xl font-bold text-slate-900">Naraa</span>
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