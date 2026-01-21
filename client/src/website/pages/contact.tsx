import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Message envoyé",
        description: "Notre équipe vous répondra dans les plus brefs délais.",
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Message reçu !</h2>
            <p className="text-slate-600 mb-8">
              Merci de nous avoir contactés. Un membre de l'équipe Naraa.ai traitera votre demande et reviendra vers vous très rapidement.
            </p>
            <Link href="/site-vitrine">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/site-vitrine">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 -ml-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au site
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-8 text-white text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Contactez l'équipe</h1>
              <p className="text-slate-300 max-w-lg mx-auto">
                Une question sur nos offres ? Besoin d'une démo ? N'hésitez pas à nous écrire.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom <span className="text-red-500">*</span></Label>
                  <Input id="firstName" required placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom <span className="text-red-500">*</span></Label>
                  <Input id="lastName" required placeholder="Dupont" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" required placeholder="jean.dupont@cabinet.fr" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet <span className="text-red-500">*</span></Label>
                <Input id="subject" required placeholder="Demande d'information..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="message" 
                  required
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="min-h-[150px]"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}