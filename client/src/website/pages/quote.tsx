import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function QuotePage() {
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
        title: "Demande envoyée",
        description: "Notre équipe vous recontactera sous 24h.",
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Demande reçue !</h2>
            <p className="text-slate-600 mb-8">
              Merci de votre intérêt pour naraa.fr. Un membre de notre équipe va étudier votre besoin et vous recontactera très prochainement.
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
            <Link href="/site-vitrine/pricing">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 -ml-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux tarifs
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-8 text-white text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Demander un devis personnalisé</h1>
              <p className="text-slate-300 max-w-lg mx-auto">
                Remplissez ce formulaire pour recevoir une proposition adaptée à la taille et aux besoins de votre cabinet.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom <span className="text-red-500">*</span></Label>
                  <Input id="firstName" required placeholder="Marie" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom <span className="text-red-500">*</span></Label>
                  <Input id="lastName" required placeholder="Victoire" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email professionnel <span className="text-red-500">*</span></Label>
                  <Input id="email" type="email" required placeholder="marie.victoire@cabinet.fr" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone <span className="text-red-500">*</span></Label>
                  <Input id="phone" type="tel" required placeholder="06 12 34 56 78" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Nom du cabinet <span className="text-red-500">*</span></Label>
                <Input id="company" required placeholder="Cabinet Victoire & Associés" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="collaborators">Nombre de collaborateurs</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 collaborateurs</SelectItem>
                      <SelectItem value="6-20">6-20 collaborateurs</SelectItem>
                      <SelectItem value="21-50">21-50 collaborateurs</SelectItem>
                      <SelectItem value="50+">Plus de 50 collaborateurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="software">Logiciel de production</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acd">ACD Groupe</SelectItem>
                      <SelectItem value="sage">Sage Coala / Genapi</SelectItem>
                      <SelectItem value="cegid">Cegid Loop / Quadra</SelectItem>
                      <SelectItem value="myunisoft">MyUnisoft</SelectItem>
                      <SelectItem value="quickbooks">QuickBooks</SelectItem>
                      <SelectItem value="pennylane">Pennylane</SelectItem>
                      <SelectItem value="fulll">Fulll</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message ou besoins spécifiques</Label>
                <Textarea 
                  id="message" 
                  placeholder="Dites-nous en plus sur vos besoins actuels (ex: volume de dossiers, problématiques de relance...)"
                  className="min-h-[120px]"
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
                    "Envoyer la demande"
                  )}
                </Button>
                <p className="text-xs text-slate-500 text-center mt-4">
                  En soumettant ce formulaire, vous acceptez que naraa.fr traite vos données conformément à notre politique de confidentialité.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}