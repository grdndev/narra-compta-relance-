import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCampaigns, mockClients } from "@/lib/mockData";
import { Plus, Megaphone, Calendar, Users, Send, BarChart2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Campaigns() {
  const { toast } = useToast();
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState("All");

  const handleCreateCampaign = () => {
    setNewCampaignOpen(false);
    toast({
      title: "Campagne créée",
      description: "Votre campagne a été programmée avec succès.",
    });
  };

  const sectors = Array.from(new Set(mockClients.map(c => c.sector)));

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Campagnes</h1>
            <p className="text-slate-500 mt-2">Envoyez des messages groupés (CFE, TVA, Informations).</p>
          </div>
          <Dialog open={newCampaignOpen} onOpenChange={setNewCampaignOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 text-white hover:bg-slate-800">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Campagne
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle campagne</DialogTitle>
                <DialogDescription>
                  Envoyez un message à un groupe de clients spécifique.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input id="name" placeholder="Ex: Rappel CFE 2024" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sector" className="text-right">
                    Cible
                  </Label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Tous les clients</SelectItem>
                      {sectors.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Objet
                  </Label>
                  <Input id="subject" placeholder="Objet de l'email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="message" className="text-right mt-2">
                    Message
                  </Label>
                  <Textarea id="message" placeholder="Votre message..." className="col-span-3 min-h-[150px]" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewCampaignOpen(false)}>Annuler</Button>
                <Button onClick={handleCreateCampaign} className="bg-slate-900 text-white">Envoyer la campagne</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold text-slate-900">
                    {campaign.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Cible : {campaign.targetSector === 'All' ? 'Tous les clients' : `Secteur ${campaign.targetSector}`}
                  </CardDescription>
                </div>
                <div className={`p-2 rounded-full ${
                  campaign.status === 'sent' ? 'bg-green-100 text-green-600' :
                  campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {campaign.status === 'sent' ? <Send className="h-4 w-4" /> :
                   campaign.status === 'scheduled' ? <Calendar className="h-4 w-4" /> :
                   <Megaphone className="h-4 w-4" />}
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{campaign.recipientCount}</p>
                    <p className="text-xs text-slate-500">Destinataires</p>
                  </div>
                  {campaign.openRate && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">{campaign.openRate}%</p>
                      <p className="text-xs text-slate-500">Taux d'ouverture</p>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Badge variant={
                    campaign.status === 'sent' ? 'default' : 
                    campaign.status === 'scheduled' ? 'secondary' : 'outline'
                  } className={
                    campaign.status === 'sent' ? 'bg-green-600 hover:bg-green-700' : ''
                  }>
                    {campaign.status === 'sent' ? 'Envoyée' : 
                     campaign.status === 'scheduled' ? 'Programmée' : 'Brouillon'}
                  </Badge>
                  {campaign.sentDate && (
                    <span className="text-xs text-slate-400">
                      {new Date(campaign.sentDate).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
