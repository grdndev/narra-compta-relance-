import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClients, mockDocuments, mockReminders, mockAccountingEntries } from "@/lib/mockData";
import { useRoute } from "wouter";
import { 
  ArrowLeft, Mail, Phone, Building2, Calendar, 
  AlertCircle, CheckCircle2, History, Send, Search, CheckSquare, MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ClientDetail() {
  const [match, params] = useRoute("/clients/:id");
  const { toast } = useToast();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [ignoredEntries, setIgnoredEntries] = useState<string[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  
  const client = mockClients.find(c => c.id === params?.id);
  const documents = mockDocuments.filter(d => d.clientId === params?.id);
  const reminders = mockReminders.filter(r => r.clientId === params?.id);
  
  // Filter entries for this client
  const activeEntries = mockAccountingEntries.filter(e => e.clientId === params?.id && !ignoredEntries.includes(e.id));
  const purchases = activeEntries.filter(e => e.journal === 'ACH');
  const sales = activeEntries.filter(e => e.journal === 'VTE');
  
  // Group by Account for Encaissements view (placeholder logic for now, using existing data structure)
  const entriesByAccount = Object.values(activeEntries.reduce((acc, entry) => {
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

  if (!client) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">Client introuvable</div>
      </Layout>
    );
  }

  const pendingDocs = documents.filter(d => d.status === 'missing');
  
  const handleSendReminder = () => {
    toast({
      title: "Relance envoyée",
      description: `Un email a été envoyé à ${client.email} pour ${selectedDocs.length > 0 ? selectedDocs.length : pendingDocs.length} documents.`,
      duration: 3000,
    });
    setSelectedDocs([]);
  };

  const handleSendEntryReminder = () => {
    setIsEmailModalOpen(false);
    toast({
      title: "Demande envoyée !",
      description: `Un email a été envoyé à ${client.email} pour ${selectedEntries.length} pièces.`,
      className: "bg-green-600 text-white border-none"
    });
    setSelectedEntries([]);
  };

  const toggleDocSelection = (docId: string) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
  };

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

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">{client.company}</h1>
            <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
              <span className="flex items-center gap-1"><UsersIcon className="h-4 w-4" /> {client.name}</span>
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {client.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {client.phone}</span>
            </div>
          </div>
          <div className="ml-auto flex gap-3">
             <Button variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 border shadow-none" onClick={() => {
                 toast({
                     title: "Données supprimées",
                     description: "Les données du client ont été supprimées conformément au RGPD.",
                 });
             }}>
                Supprimer (RGPD)
             </Button>
            <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={() => setIsEmailModalOpen(true)}>
              <Send className="h-4 w-4 mr-2" />
              Relancer le client
            </Button>
          </div>
        </div>

        <Tabs defaultValue="synthesis" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl p-1 bg-white border border-slate-200 shadow-sm mb-6">
            <TabsTrigger value="synthesis" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Synthèse</TabsTrigger>
            <TabsTrigger value="achats-ventes" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Achats / Ventes</TabsTrigger>
            <TabsTrigger value="journaux" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Journaux</TabsTrigger>
            <TabsTrigger value="encaissements" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Encaissements</TabsTrigger>
          </TabsList>

          <TabsContent value="synthesis" className="space-y-8">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
                <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl">
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Gérez l'état des pièces comptables attendues.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="missing" className="w-full">
                      <TabsList className="mb-4 bg-slate-50 rounded-xl p-1">
                        <TabsTrigger value="missing" className="gap-2 rounded-lg">
                          Manquants <Badge variant="secondary" className="bg-orange-100 text-orange-800 ml-1">{pendingDocs.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="all" className="rounded-lg">Tous les documents</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="missing" className="space-y-4">
                        {pendingDocs.length === 0 ? (
                          <div className="text-center py-8 text-slate-500">
                            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                            <p>Tout est à jour ! Aucun document manquant.</p>
                          </div>
                        ) : (
                          pendingDocs.map(doc => (
                            <div key={doc.id} className="flex items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors bg-white shadow-sm">
                              <Checkbox 
                                checked={selectedDocs.includes(doc.id)}
                                onCheckedChange={() => toggleDocSelection(doc.id)}
                                className="mr-4 rounded-md"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-slate-900">{doc.name}</h4>
                                  <Badge variant="outline" className="text-xs font-normal bg-slate-50">Compte {doc.accountCode}</Badge>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                  Échéance : {new Date(doc.dueDate).toLocaleDateString('fr-FR')} • {doc.type}
                                </p>
                              </div>
                              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-3 py-1">
                                En retard
                              </Badge>
                            </div>
                          ))
                        )}
                      </TabsContent>
                      
                      <TabsContent value="all" className="space-y-4">
                        {documents.map(doc => (
                           <div key={doc.id} className="flex items-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900">{doc.name}</h4>
                                <p className="text-sm text-slate-500">{doc.type}</p>
                              </div>
                              <Badge variant={doc.status === 'missing' ? 'destructive' : 'secondary'} className={doc.status === 'missing' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-none' : 'bg-green-100 text-green-700 hover:bg-green-200 border-none'}>
                                {doc.status === 'missing' ? 'Manquant' : 'Reçu'}
                              </Badge>
                            </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl">
                  <CardHeader>
                    <CardTitle>Historique des Relances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-2">
                      {reminders.length === 0 ? (
                        <p className="text-sm text-slate-500 pl-4">Aucune relance effectuée.</p>
                      ) : (
                        reminders.map((reminder) => (
                          <div key={reminder.id} className="relative pl-6">
                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm" />
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-slate-900">
                                {reminder.subject}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(reminder.date).toLocaleDateString('fr-FR')} • Via {reminder.type}
                              </span>
                              <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 h-5 border-slate-200">
                                {reminder.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white border-none rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-white">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Taux de réponse</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Délai moyen</span>
                      <span className="font-bold">3 jours</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                      <div className="bg-blue-500 h-full w-[85%]"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achats-ventes" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-8">
              {/* ACHATS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    Achats
                  </h3>
                  <span className="text-lg font-bold text-slate-600 bg-white shadow-sm border border-slate-100 px-4 py-1 rounded-xl">
                    Total : {purchases.reduce((sum, e) => sum + e.amount, 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
                <EntryTable 
                  entries={purchases} 
                  selectedEntries={selectedEntries}
                  onToggleSelect={toggleEntrySelection}
                  onIgnore={handleIgnoreEntry}
                />
              </div>

              {/* VENTES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    Ventes
                  </h3>
                  <span className="text-lg font-bold text-slate-600 bg-white shadow-sm border border-slate-100 px-4 py-1 rounded-xl">
                    Total : {sales.reduce((sum, e) => sum + e.amount, 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
                <EntryTable 
                  entries={sales} 
                  selectedEntries={selectedEntries}
                  onToggleSelect={toggleEntrySelection}
                  onIgnore={handleIgnoreEntry}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="journaux" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] p-8 text-center text-slate-500">
                Vue Journaux (Intégration à venir - similaire à Achats/Ventes mais groupé par code journal)
             </div>
          </TabsContent>

          <TabsContent value="encaissements" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          </TabsContent>
        </Tabs>

        {/* Action Bar for Analysis */}
        {selectedEntries.length > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-in slide-in-from-bottom-10 fade-in">
            <div className="bg-slate-900 text-white px-2 py-2 rounded-2xl shadow-2xl flex items-center gap-4 pl-6 border border-slate-700">
               <div className="text-sm font-medium">
                  <span className="text-blue-400 font-bold">{selectedEntries.length} pièces sélectionnées</span>
               </div>
               <Button 
                size="lg" 
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-lg shadow-blue-900/50"
                onClick={() => setIsEmailModalOpen(true)}
               >
                 <Send className="h-5 w-5 mr-2" />
                 Demander au client
               </Button>
            </div>
          </div>
        )}

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
                <Input value={client.email} readOnly className="col-span-3 bg-slate-50 border-transparent rounded-xl" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-slate-500">Objet :</Label>
                <Input defaultValue="Relance : Pièces comptables manquantes" className="col-span-3 border-slate-200 rounded-xl" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-slate-500 mt-2">Message :</Label>
                <Textarea 
                  className="col-span-3 min-h-[200px] border-slate-200 rounded-xl font-sans"
                  defaultValue={`Bonjour ${client.name},

Sauf erreur de notre part, nous n'avons pas reçu les justificatifs pour les écritures suivantes :

${selectedEntries.length > 0 
  ? `- ${selectedEntries.length} pièces sélectionnées` 
  : `- Liste des pièces manquantes`
}

Merci de nous les faire parvenir dès que possible.

Cordialement,
Votre Expert-Comptable`}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsEmailModalOpen(false)} className="rounded-xl border-slate-200">Annuler</Button>
              <Button onClick={handleSendEntryReminder} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="h-4 w-4 mr-2" />
                Envoyer l'email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
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
