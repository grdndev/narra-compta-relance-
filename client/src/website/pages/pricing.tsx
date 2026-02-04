import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      <Navbar />

      {/* Pricing Section Content */}
      <section className="pt-20 pb-12 bg-slate-50 border-b border-slate-200 min-h-[calc(100vh-400px)] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-6">
              Tarifs
            </h2>
            <h3 className="text-xl font-semibold text-blue-600 mb-6">
              Bénéficiez d'un prix adapté à vos besoins et objectifs
            </h3>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Vous avez déjà une GED et souhaitez la conserver ?
              <br/>
              Naraa.fr s’adapte à votre organisation et propose des options de personnalisation selon les pratiques de votre cabinet.
            </p>
            <Link href="/site-vitrine/quote">
              <Button size="lg" className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800">
                Demander un devis personnalisé
              </Button>
            </Link>
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
            Rejoignez les experts-comptables qui ont choisi naraa.fr pour moderniser leur relation client.
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