import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCampaigns, mockClients, mockTeamMembers, Campaign } from "@/lib/mockData";
import { Plus, Megaphone, Calendar, Users, Send, BarChart2, Eye, XCircle, CheckCircle2, Clock, Filter } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function Campaigns() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [teamFilter, setTeamFilter] = useState("all");
  
  // Team filtering helpers
  const associates = mockTeamMembers.filter(m => m.role === 'associate');
  const collaborators = mockTeamMembers.filter(m => m.role === 'collaborator');

  const getFilteredClientsByTeam = () => {
    if (teamFilter === 'all') return mockClients;
    if (teamFilter === 'associates') {
      const associateIds = associates.map(a => a.id);
      return mockClients.filter(c => associateIds.includes(c.managerId));
    }
    if (teamFilter === 'collaborators') {
      const collaboratorIds = collaborators.map(c => c.id);
      return mockClients.filter(c => collaboratorIds.includes(c.managerId));
    }
    return mockClients.filter(c => c.managerId === teamFilter);
  };

  const teamFilteredClients = getFilteredClientsByTeam();
  
  // Target States
  const [targetType, setTargetType] = useState<'all' | 'sector' | 'client'>('all');
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

  const [newCampaignName, setNewCampaignName] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Follow-up state
  const [followUpType, setFollowUpType] = useState<string>("none");
  const [customDays, setCustomDays] = useState<string>("14");

  const handleCreateCampaign = () => {
    // Calculate recipient count based on target type
    let count = 0;
    let sector = "Tous les clients";

    if (targetType === 'all') {
      count = mockClients.filter(c => c.status === 'active').length;
      sector = "All";
    } else if (targetType === 'sector') {
      count = selectedSector === 'All' 
        ? mockClients.filter(c => c.status === 'active').length
        : mockClients.filter(c => c.sector === selectedSector && c.status === 'active').length;
      sector = selectedSector;
    } else if (targetType === 'client') {
      count = selectedClientIds.length;
      sector = "Sélection personnalisée";
    }

    const newCampaign: Campaign = {
      id: `c${campaigns.length + 1}`,
      name: newCampaignName || "Nouvelle Campagne",
      status: 'scheduled',
      recipientCount: count,
      targetSector: sector,
      sentDate: new Date().toISOString().split('T')[0],
      openRate: 0,
      followUpDelay: null
    };

    setCampaigns([newCampaign, ...campaigns]);
    setNewCampaignOpen(false);
    setNewCampaignName("");
    // Reset states
    setTargetType('all');
    setSelectedSector("All");
    setSelectedClientIds([]);
    
    toast({
      title: "Campagne créée",
      description: "Votre campagne a été programmée avec succès.",
    });
  };

  const toggleClientSelection = (clientId: string) => {
    setSelectedClientIds(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAllClients = () => {
    if (selectedClientIds.length === mockClients.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(mockClients.map(c => c.id));
    }
  };

  const handleSaveFollowUp = () => {
    if (!selectedCampaign) return;

    let delay: number | 'immediate' | null = null;
    if (followUpType === 'immediate') delay = 'immediate';
    else if (followUpType === '3') delay = 3;
    else if (followUpType === '7') delay = 7;
    else if (followUpType === 'custom') delay = parseInt(customDays) || 14;

    const updatedCampaigns = campaigns.map(c => 
      c.id === selectedCampaign.id 
        ? { ...c, followUpDelay: delay }
        : c
    );
    
    setCampaigns(updatedCampaigns);
    setSelectedCampaign({ ...selectedCampaign, followUpDelay: delay });

    toast({
      title: "Configuration enregistrée",
      description: "Les paramètres de relance ont été mis à jour.",
    });
  };
  
  const openDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    // Initialize follow-up state from campaign
    if (campaign.followUpDelay === 'immediate') {
      setFollowUpType('immediate');
    } else if (campaign.followUpDelay === 3) {
      setFollowUpType('3');
    } else if (campaign.followUpDelay === 7) {
      setFollowUpType('7');
    } else if (typeof campaign.followUpDelay === 'number') {
      setFollowUpType('custom');
      setCustomDays(campaign.followUpDelay.toString());
    } else {
      setFollowUpType('none');
    }
    setDetailsOpen(true);
  };

  const getRecipientsForCampaign = (campaign: Campaign) => {
    const targets = teamFilteredClients.filter(c => {
      if (c.status !== 'active') return false;
      return campaign.targetSector === 'All' || c.sector === campaign.targetSector;
    });

    // Simulate open status deterministically based on client ID and campaign ID
    return targets.map(client => {
      const seed = client.id.charCodeAt(0) + campaign.id.charCodeAt(0);
      // If campaign is not sent, nobody opened
      if (campaign.status !== 'sent') {
        return { ...client, hasOpened: false, sentStatus: 'pending' };
      }
      
      const hasOpened = (seed % 100) < (campaign.openRate || 0);
      return { 
        ...client, 
        hasOpened,
        sentStatus: 'sent'
      };
    });
  };

  // Stats based on team filter
  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;
  const scheduledCampaigns = campaigns.filter(c => c.status === 'scheduled').length;
  const avgOpenRate = campaigns.filter(c => c.status === 'sent' && c.openRate).length > 0
    ? Math.round(campaigns.filter(c => c.status === 'sent').reduce((acc, c) => acc + (c.openRate || 0), 0) / campaigns.filter(c => c.status === 'sent').length)
    : 0;
  const totalRecipients = teamFilteredClients.filter(c => c.status === 'active').length;

  const sectors = Array.from(new Set(mockClients.map(c => c.sector)));

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Campagnes</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Envoyez des messages groupés (CFE, TVA, Informations).</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Team Filter */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="border-none h-auto p-0 focus:ring-0 w-[180px] font-medium text-slate-700 dark:text-slate-300 bg-transparent">
                  <SelectValue placeholder="Tout le cabinet" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 dark:bg-slate-900 shadow-lg max-h-[400px]">
                  <SelectItem value="all" className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800 font-semibold">
                    🏢 Tout le cabinet
                  </SelectItem>
                  <SelectItem value="associates" className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800 font-semibold text-purple-600 dark:text-purple-400">
                    👔 Tous les Associés ({associates.length})
                  </SelectItem>
                  <SelectItem value="collaborators" className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800 font-semibold text-teal-600 dark:text-teal-400">
                    👥 Tous les Collaborateurs ({collaborators.length})
                  </SelectItem>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase">Associés</div>
                  {associates.map(member => (
                    <SelectItem key={member.id} value={member.id} className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800 pl-4">
                      {member.name}
                    </SelectItem>
                  ))}
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase">Collaborateurs</div>
                  {collaborators.map(member => (
                    <SelectItem key={member.id} value={member.id} className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800 pl-4">
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <Input 
                    id="name" 
                    placeholder="Ex: Rappel CFE 2024" 
                    className="col-span-3"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right mt-2">
                    Cible
                  </Label>
                  <div className="col-span-3 space-y-4">
                    <RadioGroup value={targetType} onValueChange={(v: any) => setTargetType(v)} className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="t-all" />
                        <Label htmlFor="t-all" className="font-normal cursor-pointer">Tous les clients</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sector" id="t-sector" />
                        <Label htmlFor="t-sector" className="font-normal cursor-pointer">Par secteur d'activité</Label>
                      </div>
                      
                      {targetType === 'sector' && (
                        <div className="pl-6 animate-in slide-in-from-top-2 duration-200">
                          <Select value={selectedSector} onValueChange={setSelectedSector}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un secteur" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">Tous les secteurs</SelectItem>
                              {sectors.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="client" id="t-client" />
                        <Label htmlFor="t-client" className="font-normal cursor-pointer">Par client (Sélection manuelle)</Label>
                      </div>

                      {targetType === 'client' && (
                        <div className="pl-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                           <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto space-y-2 bg-slate-50/50">
                              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 mb-2 sticky top-0 bg-slate-50 z-10">
                                <Checkbox 
                                  id="select-all" 
                                  checked={selectedClientIds.length === mockClients.length && mockClients.length > 0}
                                  onCheckedChange={handleSelectAllClients}
                                />
                                <Label htmlFor="select-all" className="font-semibold text-xs uppercase text-slate-500 cursor-pointer">Tout sélectionner</Label>
                              </div>
                              {mockClients.filter(c => c.status === 'active').map(client => (
                                <div key={client.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`c-${client.id}`} 
                                    checked={selectedClientIds.includes(client.id)}
                                    onCheckedChange={() => toggleClientSelection(client.id)}
                                  />
                                  <Label htmlFor={`c-${client.id}`} className="font-normal text-sm cursor-pointer w-full truncate">
                                    {client.company} <span className="text-slate-400 text-xs">({client.name})</span>
                                  </Label>
                                </div>
                              ))}
                           </div>
                           <p className="text-xs text-slate-500 mt-1 text-right">
                             {selectedClientIds.length} client{selectedClientIds.length > 1 ? 's' : ''} sélectionné{selectedClientIds.length > 1 ? 's' : ''}
                           </p>
                        </div>
                      )}
                    </RadioGroup>
                  </div>
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
        </div>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-blue-600" />
                {selectedCampaign?.name}
              </DialogTitle>
              <DialogDescription>
                Détails et statistiques de la campagne
              </DialogDescription>
            </DialogHeader>
            
            {selectedCampaign && (
              <Tabs defaultValue="stats" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                  <TabsTrigger value="recipients">Destinataires</TabsTrigger>
                  <TabsTrigger value="followup">Relance Auto</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stats" className="mt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Envoyés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedCampaign.recipientCount}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Taux d'ouverture</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{selectedCampaign.openRate}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Statut</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant={selectedCampaign.status === 'sent' ? 'default' : 'secondary'}>
                          {selectedCampaign.status === 'sent' ? 'Envoyée' : 'Programmée'}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="recipients" className="flex-1 min-h-0 relative mt-4">
                  <ScrollArea className="h-full border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Entreprise</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getRecipientsForCampaign(selectedCampaign).map((recipient) => (
                          <TableRow key={recipient.id}>
                            <TableCell className="font-medium">{recipient.company}</TableCell>
                            <TableCell>{recipient.name}</TableCell>
                            <TableCell>
                              {selectedCampaign.status !== 'sent' ? (
                                <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">
                                  En attente
                                </Badge>
                              ) : recipient.hasOpened ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none flex w-fit items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  Ouvert
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-slate-500 flex w-fit items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Envoyé
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="followup" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-slate-500" />
                        Configuration de la relance
                      </CardTitle>
                      <CardDescription>
                        Programmez une relance automatique pour les destinataires n'ayant pas ouvert l'email.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <Label>Délai de relance</Label>
                        <RadioGroup value={followUpType} onValueChange={setFollowUpType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <RadioGroupItem value="none" id="none" className="peer sr-only" />
                            <Label
                              htmlFor="none"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <XCircle className="mb-2 h-6 w-6 text-slate-400" />
                              Aucune relance
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="immediate" id="immediate" className="peer sr-only" />
                            <Label
                              htmlFor="immediate"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <Send className="mb-2 h-6 w-6 text-blue-500" />
                              Immédiat
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="3" id="3" className="peer sr-only" />
                            <Label
                              htmlFor="3"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <Calendar className="mb-2 h-6 w-6 text-purple-500" />
                              J+3
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="7" id="7" className="peer sr-only" />
                            <Label
                              htmlFor="7"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <Calendar className="mb-2 h-6 w-6 text-purple-500" />
                              J+7
                            </Label>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                             <RadioGroupItem value="custom" id="custom" className="peer sr-only" />
                             <Label
                              htmlFor="custom"
                              className="flex flex-row items-center gap-4 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                            >
                              <div className="flex flex-col items-center flex-shrink-0">
                                <Clock className="mb-2 h-6 w-6 text-orange-500" />
                                Personnalisé
                              </div>
                              <div className="flex-1 space-y-2">
                                <p className="text-sm text-muted-foreground">Choisir le nombre de jours</p>
                                <div className="flex items-center gap-2">
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    max="90"
                                    value={customDays}
                                    onChange={(e) => setCustomDays(e.target.value)}
                                    className="w-24"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFollowUpType('custom');
                                    }}
                                  />
                                  <span className="text-sm">jours après l'envoi</span>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button onClick={handleSaveFollowUp} className="bg-slate-900 text-white">
                          Enregistrer la configuration
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card 
              key={campaign.id} 
              className="hover:shadow-md transition-all cursor-pointer hover:border-blue-200 active:scale-95 duration-200"
              onClick={() => openDetails(campaign)}
            >
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
                  {campaign.openRate !== undefined && (
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
