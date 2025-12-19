import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockClients } from "@/lib/mockData";
import { Search, Filter, MoreVertical, Mail, Send, Plus, Building2, User, Phone, Info } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Clients() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedClientForReminder, setSelectedClientForReminder] = useState<any>(null);
  
  const [reminderChannels, setReminderChannels] = useState<{email: boolean, sms: boolean, whatsapp: boolean}>({
    email: true,
    sms: false,
    whatsapp: false
  });

  const [reminderContent, setReminderContent] = useState<{email: string, sms: string, whatsapp: string}>({
    email: "Bonjour,\n\nSauf erreur de notre part, nous n'avons pas reçu les documents suivants pour la clôture comptable.\n\nMerci de nous les transmettre au plus vite.\n\nCordialement,\nVotre Expert-Comptable",
    sms: "Bonjour, sauf erreur, il nous manque des documents comptables urgents. Merci de vérifier vos emails. Cdt, Votre Expert-Comptable",
    whatsapp: "Bonjour, il nous manque quelques documents pour votre comptabilité. Pourriez-vous vérifier ? Merci !"
  });

  const handleOpenReminderDialog = (client: any) => {
    setSelectedClientForReminder(client);
    setReminderContent({
        email: `Bonjour ${client.name},\n\nSauf erreur de notre part, nous n'avons pas reçu les documents suivants pour la clôture comptable.\n\nMerci de nous les transmettre au plus vite.\n\nCordialement,\nVotre Expert-Comptable`,
        sms: `Bonjour ${client.name}, sauf erreur, il nous manque des documents comptables urgents. Merci de vérifier vos emails. Cdt`,
        whatsapp: `Bonjour ${client.name}, il nous manque quelques documents pour votre comptabilité. Pourriez-vous vérifier ? Merci !`
    });
    setReminderDialogOpen(true);
  };

  const handleSendReminder = () => {
      const channels = Object.entries(reminderChannels)
        .filter(([_, checked]) => checked)
        .map(([channel]) => channel);

      if (channels.length === 0) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner au moins un canal.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Relance envoyée",
        description: `La relance a été envoyée à ${selectedClientForReminder?.company} via ${channels.join(', ')}.`,
        className: "bg-green-600 text-white border-none"
      });
      setReminderDialogOpen(false);
      setSelectedClientForReminder(null);
      setReminderChannels({ email: true, sms: false, whatsapp: false });
  };


  // Client List Logic
  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const toggleSelectClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const handleBulkReminder = () => {
    toast({
      title: "Relances envoyées",
      description: `${selectedClients.length} clients ont été relancés pour leurs documents manquants.`,
      className: "bg-green-600 text-white border-none"
    });
    setSelectedClients([]);
  };

  const handleCreateClient = () => {
    setIsNewClientDialogOpen(false);
    toast({
      title: "Dossier créé",
      description: "Le nouveau dossier client a été ajouté avec succès.",
      className: "bg-blue-600 text-white border-none"
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Relances Clients</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Gérez vos dossiers et les pièces manquantes.</p>
          </div>
          
          <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Dossier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-3xl p-6 dark:bg-slate-900 dark:border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white">Créer un nouveau dossier</DialogTitle>
                <DialogDescription className="dark:text-slate-400">
                  Ajoutez un nouveau client à votre portefeuille pour commencer le suivi.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" /> Informations Entreprise
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Raison Sociale</Label>
                      <Input placeholder="Ex: Ma Société SAS" className="rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">SIREN</Label>
                      <Input placeholder="123 456 789" className="rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Secteur d'activité</Label>
                      <Select>
                        <SelectTrigger className="rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl dark:bg-slate-900 dark:border-slate-800">
                          <SelectItem value="btp" className="dark:text-slate-300 dark:focus:bg-slate-800">BTP</SelectItem>
                          <SelectItem value="restauration" className="dark:text-slate-300 dark:focus:bg-slate-800">Restauration</SelectItem>
                          <SelectItem value="services" className="dark:text-slate-300 dark:focus:bg-slate-800">Services</SelectItem>
                          <SelectItem value="commerce" className="dark:text-slate-300 dark:focus:bg-slate-800">Commerce</SelectItem>
                          <SelectItem value="sante" className="dark:text-slate-300 dark:focus:bg-slate-800">Santé</SelectItem>
                          <SelectItem value="autre" className="dark:text-slate-300 dark:focus:bg-slate-800">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Forme Juridique</Label>
                      <Input placeholder="Ex: SAS, SARL..." className="rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" /> Contact Principal
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Nom complet</Label>
                      <Input placeholder="Jean Dupont" className="rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Fonction</Label>
                      <Input placeholder="Gérant" className="rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Email</Label>
                      <Input type="email" placeholder="jean@societe.com" className="rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Téléphone</Label>
                      <Input type="tel" placeholder="06 12 34 56 78" className="rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewClientDialogOpen(false)} className="rounded-xl border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Annuler</Button>
                <Button onClick={handleCreateClient} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le dossier
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 bg-white dark:bg-slate-900">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher un client, entreprise ou secteur..." 
                  className="pl-10 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl transition-all dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:bg-slate-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-auto bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                {filteredClients.length} dossiers trouvés
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-50 dark:border-slate-800">
                  <TableHead className="w-[50px] pl-4">
                    <Checkbox 
                      checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                      onCheckedChange={toggleSelectAll}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md border-slate-300 dark:border-slate-600"
                    />
                  </TableHead>
                  <TableHead className="w-[300px] text-slate-500 dark:text-slate-400 font-semibold">Client / Entreprise</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 font-semibold">SIREN</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 font-semibold">Secteur</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 font-semibold">État des pièces</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 font-semibold">Dernier Contact</TableHead>
                  <TableHead className="text-right pr-4 text-slate-500 dark:text-slate-400 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 border-slate-50 dark:border-slate-800 transition-colors">
                    <TableCell className="pl-4">
                      <Checkbox 
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => toggleSelectClient(client.id)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md border-slate-300 dark:border-slate-600"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-between group/link">
                          <Link href={`/clients/${client.id}`} className="block flex-1">
                            <div className="flex flex-col cursor-pointer">
                              <span className="text-slate-800 dark:text-white font-bold group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
                                {client.company}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 font-normal text-sm">
                                {client.name}
                              </span>
                            </div>
                          </Link>
                          <Link href={`/clients/${client.id}`}>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Info className="h-4 w-4" />
                              </Button>
                          </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 font-mono text-sm">
                      {client.siren}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1">
                        {client.sector}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.pendingDocs > 0 ? (
                        <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-lg px-2.5 py-1 shadow-sm">
                          {client.pendingDocs} manquants
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-900/50 rounded-lg px-2.5 py-1 shadow-sm">
                          À jour
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300 font-medium text-sm">
                      {new Date(client.lastContact).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded-lg"
                          onClick={() => handleOpenReminderDialog(client)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white rounded-lg">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-slate-100 dark:border-slate-800 dark:bg-slate-900 shadow-xl">
                            <DropdownMenuItem className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800">
                              <Link href={`/clients/${client.id}`} className="flex w-full">Voir le dossier</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800">Modifier</DropdownMenuItem>
                            <DropdownMenuSeparator className="dark:bg-slate-800" />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400 rounded-lg cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700 dark:focus:text-red-300">Archiver</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Bulk Actions */}
          {selectedClients.length > 0 && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-in slide-in-from-bottom-10 fade-in">
              <Button onClick={handleBulkReminder} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-lg shadow-blue-900/50">
                <Send className="h-5 w-5 mr-2" />
                Relancer {selectedClients.length} clients
              </Button>
            </div>
          )}
        </div>

        {/* Reminder Dialog with Channels and Editable Content */}
        <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-3xl dark:bg-slate-900 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Relancer {selectedClientForReminder?.company}</DialogTitle>
              <DialogDescription className="dark:text-slate-400">
                Personnalisez et envoyez vos messages via les canaux sélectionnés.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* EMAIL SECTION */}
              <div className={`border rounded-xl p-4 transition-all ${reminderChannels.email ? 'border-blue-200 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className="flex items-center space-x-2 mb-3">
                    <Checkbox 
                      id="email" 
                      checked={reminderChannels.email}
                      onCheckedChange={(checked) => setReminderChannels({...reminderChannels, email: checked as boolean})}
                    />
                    <Label htmlFor="email" className="flex-1 cursor-pointer font-semibold dark:text-slate-200 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                    </Label>
                </div>
                {reminderChannels.email && (
                    <div className="pl-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Message Email</Label>
                        <Textarea 
                            value={reminderContent.email}
                            onChange={(e) => setReminderContent({...reminderContent, email: e.target.value})}
                            className="bg-white dark:bg-slate-950 dark:border-slate-800 min-h-[120px] text-sm"
                        />
                    </div>
                )}
              </div>

              {/* SMS SECTION */}
              <div className={`border rounded-xl p-4 transition-all ${reminderChannels.sms ? 'border-purple-200 bg-purple-50/30 dark:border-purple-900/50 dark:bg-purple-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className="flex items-center space-x-2 mb-3">
                    <Checkbox 
                      id="sms" 
                      checked={reminderChannels.sms}
                      onCheckedChange={(checked) => setReminderChannels({...reminderChannels, sms: checked as boolean})}
                    />
                    <Label htmlFor="sms" className="flex-1 cursor-pointer font-semibold dark:text-slate-200 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> SMS
                    </Label>
                </div>
                {reminderChannels.sms && (
                    <div className="pl-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Message SMS</Label>
                        <Textarea 
                            value={reminderContent.sms}
                            onChange={(e) => setReminderContent({...reminderContent, sms: e.target.value})}
                            className="bg-white dark:bg-slate-950 dark:border-slate-800 min-h-[60px] text-sm"
                            maxLength={160}
                        />
                        <p className="text-xs text-slate-400 mt-1 text-right">{reminderContent.sms.length}/160</p>
                    </div>
                )}
              </div>

              {/* WHATSAPP SECTION */}
              <div className={`border rounded-xl p-4 transition-all ${reminderChannels.whatsapp ? 'border-green-200 bg-green-50/30 dark:border-green-900/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className="flex items-center space-x-2 mb-3">
                    <Checkbox 
                      id="whatsapp" 
                      checked={reminderChannels.whatsapp}
                      onCheckedChange={(checked) => setReminderChannels({...reminderChannels, whatsapp: checked as boolean})}
                    />
                    <Label htmlFor="whatsapp" className="flex-1 cursor-pointer font-semibold dark:text-slate-200 flex items-center gap-2">
                        <Send className="h-4 w-4" /> WhatsApp
                    </Label>
                </div>
                {reminderChannels.whatsapp && (
                    <div className="pl-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Message WhatsApp</Label>
                        <Textarea 
                            value={reminderContent.whatsapp}
                            onChange={(e) => setReminderContent({...reminderContent, whatsapp: e.target.value})}
                            className="bg-white dark:bg-slate-950 dark:border-slate-800 min-h-[80px] text-sm"
                        />
                    </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReminderDialogOpen(false)} className="rounded-xl dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Annuler</Button>
              <Button onClick={handleSendReminder} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                <Send className="mr-2 h-4 w-4" /> Envoyer {Object.values(reminderChannels).filter(Boolean).length > 0 ? `(${Object.values(reminderChannels).filter(Boolean).length})` : ''}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
