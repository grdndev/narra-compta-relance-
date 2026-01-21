import { Link } from "wouter";
import { ArrowLeft, Target, Lightbulb, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Redonner du temps aux <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">experts-comptables</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Naraa.ai est née d'une conviction simple : la valeur d'un expert-comptable réside dans le conseil, pas dans la chasse aux factures manquantes.
            </p>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 flex items-center justify-center relative overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="text-center">
                  <div className="inline-flex h-20 w-20 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-sm border border-white/20 mb-6">
                    <Lightbulb className="h-10 w-10 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">L'idée originale</h3>
                  <p className="text-slate-300">Née sur le terrain, pour le terrain</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-2xl -z-10"></div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">La Genèse de Naraa.ai</h2>
              <div className="space-y-6 text-lg text-slate-600">
                <p>
                  Tout a commencé par un constat partagé par de nombreux cabinets : jusqu'à <strong>30% du temps</strong> des collaborateurs est consacré à des tâches administratives à faible valeur ajoutée, notamment la relance des pièces comptables.
                </p>
                <p>
                  Frustrés de voir des experts passer leurs journées à envoyer des emails de rappel plutôt qu'à accompagner leurs clients, nous avons décidé de créer une solution radicalement différente.
                </p>
                <p>
                  Naraa.ai n'est pas juste un "autre logiciel de comptabilité". C'est un assistant intelligent qui automatise la relation client administrative pour libérer le potentiel humain des cabinets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-600 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Nos Valeurs</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Ce qui nous guide au quotidien pour construire le futur de la profession comptable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Simplicité Radicale</h3>
              <p className="text-slate-300">
                Nous pensons que la technologie doit s'effacer. Nos outils sont conçus pour être pris en main en quelques minutes, sans formation complexe.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Proximité Humaine</h3>
              <p className="text-slate-300">
                L'automatisation ne doit pas déshumaniser. Au contraire, elle doit recréer du lien en supprimant les frictions administratives.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 mb-6">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence Métier</h3>
              <p className="text-slate-300">
                Nous connaissons vos contraintes (délais fiscaux, RGPD, exigence client). Notre solution est taillée sur mesure pour votre réalité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Envie d'en savoir plus ?
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Discutons de vos enjeux et voyons comment Naraa.ai peut s'intégrer à votre cabinet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/site-vitrine/contact">
              <Button size="lg" className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg">
                Contactez-nous
              </Button>
            </Link>
            <Link href="/site-vitrine">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 text-lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}