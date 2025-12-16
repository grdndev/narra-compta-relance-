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
import { mockAccountingEntries, mockClients, mockDocuments } from "@/lib/mockData";
import { Search, Filter, MoreVertical, Mail, Send, CheckSquare, Square, MessageSquare, Bird } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Clients() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"clients" | "achats-ventes" | "journaux" | "encaissements">("clients");
  const [minAmount, setMinAmount] = useState<number>(0);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [ignoredEntries, setIgnoredEntries] = useState<string[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Accounting Data Logic
  const activeEntries = mockAccountingEntries.filter(e => !ignoredEntries.includes(e.id));
  const filteredEntries = activeEntries.filter(e => e.amount >= minAmount);
  const missingDocsCount = filteredEntries.length;
  
  // Group by Account
  const entriesByAccount = Object.values(filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.account]) {
      acc[entry.account] = {
        account: entry.account,
        label: entry.accountLabel,
        entries: [],
        totalAmount: 0,
        count: 0
      };
    }
    acc[entry.account].entries.push(entry);
    acc[entry.account].totalAmount += entry.amount;
    acc[entry.account].count += 1;
    return acc;
  }, {} as Record<string, { account: string, label: string, entries: typeof mockAccountingEntries, totalAmount: number, count: number }>));

  const toggleEntrySelection = (id: string) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter(e => e !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };

  const handleIgnoreEntry = (id: string) => {
    setIgnoredEntries([...ignoredEntries, id]);
    toast({
      title: "Écriture ignorée",
      description: "Cette écriture ne sera plus relancée.",
    });
  };

  const handleSendEmail = () => {
    setIsEmailModalOpen(false);
    toast({
      title: "Demande envoyée !",
      description: `Un email a été envoyé à demo@elo.io pour ${selectedEntries.length > 0 ? selectedEntries.length : missingDocsCount} pièces.`,
      className: "bg-green-600 text-white border-none"
    });
    setSelectedEntries([]);
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

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Relances Clients</h1>
            <p className="text-slate-500 mt-1 font-medium">Gérez vos dossiers et les pièces manquantes.</p>
          </div>
          
          {viewMode !== "clients" && (
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-2 px-3">
                  <Bird className="h-5 w-5 text-blue-500 animate-pulse" />
                  <div className="text-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase">Dernier envoi</p>
                    <p className="text-slate-800 font-bold">Hier à 14:30</p>
                  </div>
               </div>
               <div className="h-8 w-px bg-slate-100"></div>
               <div className="flex items-center gap-2 px-3">
                  <span className="text-sm font-medium text-slate-600">Montant min. :</span>
                  <div className="relative w-24">
                    <Input 
                      type="number" 
                      value={minAmount} 
                      onChange={(e) => setMinAmount(Number(e.target.value))}
                      className="h-8 rounded-lg pl-6 pr-2 text-right"
                      placeholder="0"
                    />
                    <span className="absolute left-2 top-1.5 text-slate-400 text-xs">€</span>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-full max-w-4xl">
            <TabsList className="grid w-full grid-cols-4 rounded-2xl p-1 bg-white border border-slate-200 shadow-sm">
              <TabsTrigger value="clients" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Vue Clients</TabsTrigger>
              <TabsTrigger value="achats-ventes" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Achats / Ventes</TabsTrigger>
              <TabsTrigger value="journaux" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Journaux</TabsTrigger>
              <TabsTrigger value="encaissements" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Encaissements</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === "clients" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex items-center gap-4 bg-white">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Rechercher un client, entreprise ou secteur..." 
                    className="pl-10 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="text-sm font-medium text-slate-500 ml-auto bg-slate-50 px-3 py-1 rounded-full">
                  {filteredClients.length} dossiers trouvés
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-50">
                    <TableHead className="w-[50px] pl-4">
                      <Checkbox 
                        checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                        onCheckedChange={toggleSelectAll}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md border-slate-300"
                      />
                    </TableHead>
                    <TableHead className="w-[300px] text-slate-500 font-semibold">Client / Entreprise</TableHead>
                    <TableHead className="text-slate-500 font-semibold">Secteur</TableHead>
                    <TableHead className="text-slate-500 font-semibold">État des pièces</TableHead>
                    <TableHead className="text-slate-500 font-semibold">Dernier Contact</TableHead>
                    <TableHead className="text-right pr-4 text-slate-500 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="group hover:bg-blue-50/30 border-slate-50 transition-colors">
                      <TableCell className="pl-4">
                        <Checkbox 
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={() => toggleSelectClient(client.id)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md border-slate-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/clients/${client.id}`} className="block">
                          <div className="flex flex-col cursor-pointer">
                            <span className="text-slate-800 font-bold group-hover:text-blue-600 transition-colors">
                              {client.company}
                            </span>
                            <span className="text-slate-500 font-normal text-sm">
                              {client.name}
                            </span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium text-slate-600 bg-slate-50 border-slate-200 rounded-lg px-2.5 py-1">
                          {client.sector}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {client.pendingDocs > 0 ? (
                          <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg px-2.5 py-1 shadow-sm">
                            {client.pendingDocs} manquants
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100 border border-green-100 rounded-lg px-2.5 py-1 shadow-sm">
                            À jour
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium text-sm">
                        {new Date(client.lastContact).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                              <DropdownMenuItem className="rounded-lg cursor-pointer">
                                <Link href={`/clients/${client.id}`} className="flex w-full">Voir le dossier</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg cursor-pointer">Modifier</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-700">Archiver</DropdownMenuItem>
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
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Detailed Analysis Views */}
            {viewMode === "achats-ventes" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                      Achats
                    </h3>
                    <span className="text-lg font-bold text-slate-600 bg-slate-100 px-4 py-1 rounded-xl">
                      Total : {filteredEntries.filter(e => e.journal === 'ACH').reduce((sum, e) => sum + e.amount, 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                  <EntryTable 
                    entries={filteredEntries.filter(e => e.journal === 'ACH')} 
                    selectedEntries={selectedEntries}
                    onToggleSelect={toggleEntrySelection}
                    onIgnore={handleIgnoreEntry}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                      Ventes
                    </h3>
                    <span className="text-lg font-bold text-slate-600 bg-slate-100 px-4 py-1 rounded-xl">
                      Total : {filteredEntries.filter(e => e.journal === 'VTE').reduce((sum, e) => sum + e.amount, 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                  <EntryTable 
                    entries={filteredEntries.filter(e => e.journal === 'VTE')} 
                    selectedEntries={selectedEntries}
                    onToggleSelect={toggleEntrySelection}
                    onIgnore={handleIgnoreEntry}
                  />
                </div>
              </div>
            )}

            {viewMode === "encaissements" && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="w-[150px] font-bold text-slate-600">N° de compte</TableHead>
                      <TableHead className="font-bold text-slate-600">Libellé compte</TableHead>
                      <TableHead className="text-center font-bold text-slate-600">Justificatifs manquants</TableHead>
                      <TableHead className="text-right font-bold text-slate-600 pr-8">Montant Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entriesByAccount.map((group) => (
                      <AccountGroupRow 
                        key={group.account} 
                        group={group} 
                        selectedEntries={selectedEntries}
                        onToggleSelect={toggleEntrySelection}
                        onIgnore={handleIgnoreEntry}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Action Bar for Analysis */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
              <div className="bg-slate-900 text-white px-2 py-2 rounded-2xl shadow-2xl flex items-center gap-4 pl-6 border border-slate-700">
                 <div className="text-sm font-medium">
                    {selectedEntries.length > 0 
                      ? <span className="text-blue-400 font-bold">{selectedEntries.length} pièces sélectionnées</span>
                      : "Aucune sélection"
                    }
                 </div>
                 <Button 
                  size="lg" 
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-lg shadow-blue-900/50"
                  onClick={() => setIsEmailModalOpen(true)}
                  disabled={selectedEntries.length === 0 && missingDocsCount === 0}
                 >
                   <Send className="h-5 w-5 mr-2" />
                   Demander au client
                 </Button>
              </div>
            </div>

            {/* Email Modal */}
            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
              <DialogContent className="sm:max-w-[600px] rounded-3xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-800">Envoyer une relance</DialogTitle>
                  <DialogDescription>
                    Vérifiez et personnalisez le message avant l'envoi.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-slate-500">À :</Label>
                    <Input value="demo@elo.io" readOnly className="col-span-3 bg-slate-50 border-transparent rounded-xl" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-slate-500">Objet :</Label>
                    <Input defaultValue="Relance : Pièces comptables manquantes" className="col-span-3 border-slate-200 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right text-slate-500 mt-2">Message :</Label>
                    <Textarea 
                      className="col-span-3 min-h-[200px] border-slate-200 rounded-xl font-sans"
                      defaultValue={`Bonjour,

Sauf erreur de notre part, nous n'avons pas reçu les justificatifs pour les écritures suivantes :

${selectedEntries.length > 0 
  ? `- ${selectedEntries.length} pièces sélectionnées` 
  : `- ${missingDocsCount} pièces manquantes au total`
}

Merci de nous les faire parvenir dès que possible.

Cordialement,
Votre Expert-Comptable`}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setIsEmailModalOpen(false)} className="rounded-xl border-slate-200">Annuler</Button>
                  <Button onClick={handleSendEmail} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer l'email
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </Layout>
  );
}

function EntryTable({ entries, selectedEntries, onToggleSelect, onIgnore }: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-slate-50">
            <TableHead className="w-[50px] pl-6"><Checkbox /></TableHead>
            <TableHead className="font-bold text-slate-600">Date</TableHead>
            <TableHead className="font-bold text-slate-600">Libellé</TableHead>
            <TableHead className="font-bold text-slate-600">Compte</TableHead>
            <TableHead className="text-right font-bold text-slate-600">Montant</TableHead>
            <TableHead className="text-center font-bold text-slate-600">Urgence</TableHead>
            <TableHead className="text-right pr-6 font-bold text-slate-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-slate-400">Aucune écriture trouvée.</TableCell>
            </TableRow>
          ) : (
            entries.map((entry: any) => (
              <TableRow key={entry.id} className="group hover:bg-blue-50/20 border-slate-50 transition-colors">
                <TableCell className="pl-6">
                  <Checkbox 
                    checked={selectedEntries.includes(entry.id)}
                    onCheckedChange={() => onToggleSelect(entry.id)}
                    className="rounded-md border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </TableCell>
                <TableCell className="font-medium text-slate-700">{new Date(entry.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className="font-medium text-slate-900">{entry.label}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-slate-500 bg-slate-50 border-slate-200">
                    {entry.account}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-slate-800">
                  {entry.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </TableCell>
                <TableCell className="text-center">
                  {entry.isUrgent && (
                    <Badge variant="destructive" className="bg-red-100 text-red-600 hover:bg-red-200 border-none shadow-none">
                      Urgent
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => onIgnore(entry.id)}
                    >
                      <CheckSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function AccountGroupRow({ group, selectedEntries, onToggleSelect, onIgnore }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow className="hover:bg-slate-50 cursor-pointer border-slate-100" onClick={() => setIsOpen(!isOpen)}>
        <TableCell className="font-bold text-blue-600 pl-6">{group.account}</TableCell>
        <TableCell className="font-medium text-slate-800">{group.label}</TableCell>
        <TableCell className="text-center">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
            {group.count} manquants
          </Badge>
        </TableCell>
        <TableCell className="text-right font-bold text-slate-900 pr-8">
          {group.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow className="bg-slate-50/30">
          <TableCell colSpan={4} className="p-0">
            <div className="pl-12 pr-4 py-4 border-l-4 border-blue-500/20 ml-6 my-2">
              <div className="flex items-center gap-2 mb-4 text-blue-600 font-medium">
                <Search className="h-4 w-4" />
                Détail des écritures non lettrées
              </div>
              <EntryTable 
                entries={group.entries} 
                selectedEntries={selectedEntries}
                onToggleSelect={onToggleSelect}
                onIgnore={onIgnore}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
