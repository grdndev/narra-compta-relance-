import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, User, Phone, Mail, Link2, FileText, CheckCircle2, 
  RefreshCw, Plus, Trash2, Save, Moon, Sun, Laptop
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos modifications ont bien été prises en compte.",
      className: "bg-green-600 text-white border-none"
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Paramètres</h1>
          <p className="text-slate-500 mt-1 font-medium">Gérez votre cabinet, vos connexions et vos modèles.</p>
        </div>

        <Tabs defaultValue="cabinet" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl p-1 bg-white border border-slate-200 shadow-sm mb-8">
            <TabsTrigger value="cabinet" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 gap-2">
              <Building2 className="h-4 w-4" /> Mon Cabinet
            </TabsTrigger>
            <TabsTrigger value="connecteurs" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 gap-2">
              <Link2 className="h-4 w-4" /> Connecteurs
            </TabsTrigger>
            <TabsTrigger value="modeles" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 gap-2">
              <FileText className="h-4 w-4" /> Modèles
            </TabsTrigger>
            <TabsTrigger value="apparence" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 gap-2">
              <Moon className="h-4 w-4" /> Apparence
            </TabsTrigger>
          </TabsList>

          {/* =======================
              ONGLET CABINET
             ======================= */}
          <TabsContent value="cabinet" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Cabinet Identification */}
              <Card className="md:col-span-1 border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl h-fit">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    Identification du Cabinet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Raison Sociale</Label>
                    <Input defaultValue="Cabinet Expertis & Co" className="rounded-xl border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Forme Juridique</Label>
                    <Input defaultValue="SELARL" className="rounded-xl border-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SIREN</Label>
                      <Input defaultValue="999 888 777" className="rounded-xl border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label>Code APE</Label>
                      <Input defaultValue="6920Z" className="rounded-xl border-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Textarea defaultValue="12 Avenue des Champs-Élysées, 75008 Paris" className="rounded-xl border-slate-200 min-h-[80px]" />
                  </div>
                </CardContent>
              </Card>

              {/* Collaborators */}
              <div className="md:col-span-2 space-y-6">
                <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        Collaborateurs
                      </CardTitle>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Plus className="h-4 w-4 mr-2" /> Ajouter
                      </Button>
                    </div>
                    <CardDescription>Gérez les accès de vos collaborateurs au dossier.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">AD</div>
                             <div>
                               <p className="font-bold text-slate-900">Admin Cabinet</p>
                               <p className="text-sm text-slate-500">admin@cabinet.fr</p>
                             </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Administrateur</Badge>
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">JD</div>
                             <div>
                               <p className="font-bold text-slate-900">Julie Dubois</p>
                               <p className="text-sm text-slate-500">julie.d@cabinet.fr</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-slate-600 border-slate-200">Collaborateur</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                       </div>

                       <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">PM</div>
                             <div>
                               <p className="font-bold text-slate-900">Pierre Martin</p>
                               <p className="text-sm text-slate-500">pierre.m@cabinet.fr</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-slate-600 border-slate-200">Expert-Comptable</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button size="lg" onClick={handleSave} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 px-8 shadow-lg shadow-slate-900/20">
                <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
              </Button>
            </div>
          </TabsContent>

          {/* =======================
              ONGLET CONNECTEURS
             ======================= */}
          <TabsContent value="connecteurs" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6">
              <Card className="border-blue-200 bg-blue-50/30 rounded-3xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-slate-700 text-lg">SC</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Sage Coala</CardTitle>
                        <CardDescription>Connexion active • Dernière synchro : il y a 5 min</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 bg-green-100 px-4 py-1.5 rounded-full text-sm font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      Connecté
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between border-t border-blue-100 pt-4 mt-2">
                    <div className="text-sm text-slate-600 font-medium">
                      <span className="font-bold text-blue-600 text-lg">142</span> écritures synchronisées aujourd'hui.
                    </div>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 rounded-xl border-blue-200 text-blue-700">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Forcer la synchronisation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="opacity-75 grayscale hover:grayscale-0 transition-all duration-300 rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-green-600 text-lg">QB</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Quickbooks</CardTitle>
                        <CardDescription>Connecteur disponible</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl">Connecter</Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* =======================
              ONGLET MODÈLES
             ======================= */}
          <TabsContent value="modeles" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">Relance standard par Email</CardTitle>
                <CardDescription>
                  Ce modèle est utilisé pour la première relance automatique.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Objet de l'email</Label>
                  <Input defaultValue="Rappel : Documents comptables manquants" className="rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label>Corps du message</Label>
                  <Textarea 
                    className="min-h-[300px] font-mono text-sm rounded-xl border-slate-200 p-4"
                    defaultValue={`Bonjour {nom_client},

Sauf erreur de notre part, nous n'avons pas reçu les documents suivants pour votre dossier {nom_entreprise} :

{liste_documents}

Merci de nous les faire parvenir dès que possible afin de finaliser votre comptabilité.

Cordialement,
Votre Expert-Comptable`}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer le modèle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* =======================
              ONGLET APPARENCE
             ======================= */}
          <TabsContent value="apparence" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Moon className="h-5 w-5 text-blue-500" />
                  Mode Sombre
                </CardTitle>
                <CardDescription>
                  Choisissez l'apparence de l'interface.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 hover:bg-slate-50 transition-all ${
                      theme === "light" ? "border-blue-500 bg-blue-50/50" : "border-slate-200 bg-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-center w-full h-24 bg-slate-100 rounded-lg mb-4 border border-slate-200 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sun className="h-8 w-8 text-orange-500" />
                      </div>
                    </div>
                    <span className="font-semibold text-slate-900">Clair</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 hover:bg-slate-800 hover:text-white transition-all ${
                      theme === "dark" ? "border-blue-500 bg-slate-900 text-white" : "border-slate-200 bg-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-center w-full h-24 bg-slate-900 rounded-lg mb-4 border border-slate-700 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Moon className="h-8 w-8 text-blue-400" />
                      </div>
                    </div>
                    <span className="font-semibold">Sombre</span>
                  </button>

                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 hover:bg-slate-50 transition-all ${
                      theme === "system" ? "border-blue-500 bg-blue-50/50" : "border-slate-200 bg-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-center w-full h-24 bg-gradient-to-br from-slate-100 to-slate-900 rounded-lg mb-4 border border-slate-200 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Laptop className="h-8 w-8 text-slate-500 mix-blend-difference" />
                      </div>
                    </div>
                    <span className="font-semibold text-slate-900">Système</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
