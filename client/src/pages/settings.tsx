import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, User, Phone, Mail, Link2, FileText, CheckCircle2, 
  RefreshCw, Plus, Trash2, Save 
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

export default function Settings() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([
    { id: 1, type: 'Principal', name: 'Jean Dupont', role: 'PDG', email: 'jean@techsol.fr', phone: '06 12 34 56 78', pref: 'email' },
    { id: 2, type: 'Secondaire', name: 'Sophie Martin', role: 'Comptable', email: 'compta@techsol.fr', phone: '06 98 76 54 32', pref: 'email' }
  ]);

  const handleSave = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos modifications ont bien été prises en compte.",
      className: "bg-green-600 text-white border-none"
    });
  };

  const addContact = () => {
    setContacts([...contacts, { id: Date.now(), type: 'Autre', name: '', role: '', email: '', phone: '', pref: 'email' }]);
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Paramètres</h1>
          <p className="text-slate-500 mt-1 font-medium">Gérez votre portefeuille, vos connexions et vos modèles.</p>
        </div>

        <Tabs defaultValue="portefeuille" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-white border border-slate-200 shadow-sm mb-8">
            <TabsTrigger value="portefeuille" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 gap-2">
              <Building2 className="h-4 w-4" /> Portefeuille Client
            </TabsTrigger>
            <TabsTrigger value="connecteurs" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 gap-2">
              <Link2 className="h-4 w-4" /> Connecteurs
            </TabsTrigger>
            <TabsTrigger value="modeles" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 gap-2">
              <FileText className="h-4 w-4" /> Modèles de Relance
            </TabsTrigger>
          </TabsList>

          {/* =======================
              ONGLET PORTEFEUILLE
             ======================= */}
          <TabsContent value="portefeuille" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Client Identification */}
              <Card className="md:col-span-1 border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl h-fit">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    Identification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Dénomination Sociale</Label>
                    <Input defaultValue="TechSolutions SAS" className="rounded-xl border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Forme Juridique</Label>
                    <Input defaultValue="SAS" className="rounded-xl border-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SIREN</Label>
                      <Input defaultValue="123 456 789" className="rounded-xl border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label>Code APE</Label>
                      <Input defaultValue="6201Z" className="rounded-xl border-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date de création</Label>
                    <Input type="date" defaultValue="2020-01-15" className="rounded-xl border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse Siège</Label>
                    <Textarea defaultValue="15 Rue de la République, 75001 Paris" className="rounded-xl border-slate-200 min-h-[80px]" />
                  </div>
                </CardContent>
              </Card>

              {/* Contacts */}
              <div className="md:col-span-2 space-y-6">
                {contacts.map((contact, index) => (
                  <Card key={contact.id} className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl relative group">
                    {index > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 rounded-xl"
                        onClick={() => removeContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <User className={`h-5 w-5 ${contact.type === 'Principal' ? 'text-blue-500' : 'text-slate-400'}`} />
                        Contact {contact.type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nom / Prénom</Label>
                          <Input defaultValue={contact.name} className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                          <Label>Fonction</Label>
                          <Input defaultValue={contact.role} className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input defaultValue={contact.email} className="pl-10 rounded-xl border-slate-200" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Téléphone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input defaultValue={contact.phone} className="pl-10 rounded-xl border-slate-200" />
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label>Canal préféré</Label>
                          <div className="flex gap-4">
                            <Button variant="outline" className={`flex-1 rounded-xl ${contact.pref === 'email' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`}>Email</Button>
                            <Button variant="outline" className={`flex-1 rounded-xl ${contact.pref === 'phone' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`}>Téléphone</Button>
                            <Button variant="outline" className={`flex-1 rounded-xl ${contact.pref === 'whatsapp' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`}>WhatsApp</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button variant="outline" className="w-full rounded-2xl border-dashed border-2 border-slate-200 py-8 hover:bg-slate-50 hover:border-slate-300 text-slate-500 gap-2" onClick={addContact}>
                  <Plus className="h-5 w-5" /> Ajouter un autre contact
                </Button>
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
        </Tabs>
      </div>
    </Layout>
  );
}
