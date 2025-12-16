import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Templates() {
  const { toast } = useToast();
  const [emailSubject, setEmailSubject] = useState("Rappel : Documents comptables manquants");
  const [emailBody, setEmailBody] = useState(`Bonjour {nom_client},

Sauf erreur de notre part, nous n'avons pas reçu les documents suivants pour votre dossier {nom_entreprise} :

{liste_documents}

Merci de nous les faire parvenir dès que possible afin de finaliser votre comptabilité.

Cordialement,
Votre Expert-Comptable`);

  const handleSave = () => {
    toast({
      title: "Modèle sauvegardé",
      description: "Le modèle de relance par email a été mis à jour.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Modèles de Relance</h1>
          <p className="text-slate-500 mt-2">Personnalisez les messages envoyés automatiquement à vos clients.</p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="notification">Notification App</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Relance standard par Email</CardTitle>
                <CardDescription>
                  Ce modèle est utilisé pour la première relance automatique.
                  Utilisez les variables <span className="font-mono text-xs bg-slate-100 p-1 rounded">{`{nom_client}`}</span>, <span className="font-mono text-xs bg-slate-100 p-1 rounded">{`{nom_entreprise}`}</span>, et <span className="font-mono text-xs bg-slate-100 p-1 rounded">{`{liste_documents}`}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Objet de l'email</Label>
                  <Input 
                    id="subject" 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Corps du message</Label>
                  <Textarea 
                    id="body" 
                    className="min-h-[300px] font-mono text-sm"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-slate-800">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer le modèle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sms">
            <Card>
              <CardHeader>
                <CardTitle>Relance par SMS</CardTitle>
                <CardDescription>Messages courts pour les rappels urgents.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  Fonctionnalité SMS à venir prochainement.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
