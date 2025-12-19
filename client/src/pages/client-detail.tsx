import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClients, mockDocuments, mockReminders, mockAccountingEntries } from "@/lib/mockData";
import { useRoute } from "wouter";
import { 
  ArrowLeft, Mail, Phone, Building2, Calendar, 
  AlertCircle, CheckCircle2, History, Send, Search, CheckSquare, MessageSquare, ZoomIn, Eye, EyeOff, AlertTriangle,
  User, Link2, FileText, Trash2, Plus, Save, RotateCcw, Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function ClientDetail() {
  const [match, params] = useRoute("/clients/:id");
  const { toast } = useToast();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [ignoredEntries, setIgnoredEntries] = useState<string[]>([]);
  const [showIgnored, setShowIgnored] = useState(false);
  const [minAmount, setMinAmount] = useState<number>(0);
  const [journalFilter, setJournalFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState("synthesis");

  const [entries, setEntries] = useState(mockAccountingEntries);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState("");

  const client = mockClients.find(c => c.id === params?.id);
  const [clientContacts, setClientContacts] = useState(client?.contacts || []);
  
  // Reminder Dialog State
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderChannels, setReminderChannels] = useState<{email: boolean, sms: boolean, whatsapp: boolean}>({
    email: true,
    sms: false,
    whatsapp: false
  });
  const [reminderContent, setReminderContent] = useState<{email: string, sms: string, whatsapp: string}>({
    email: "",
    sms: "",
    whatsapp: ""
  });

  const documents = mockDocuments.filter(d => d.clientId === params?.id);
  const reminders = mockReminders.filter(r => r.clientId === params?.id);
  
  const activeEntries = entries.filter(e => {
    const isClient = e.clientId === params?.id;
    const isIgnored = ignoredEntries.includes(e.id);
    return isClient && (showIgnored ? isIgnored : !isIgnored);
  });
  const filteredEntries = activeEntries.filter(e => e.amount >= minAmount);
  
  const purchases = filteredEntries.filter(e => e.journal === 'ACH');
  const sales = filteredEntries.filter(e => e.journal === 'VTE');
  const bankEntries = filteredEntries.filter(e => e.journal === 'BQ');
  
  // Split bank entries for display
  const bankReceipts = bankEntries.filter(e => e.type === 'Debit'); // Encaissements (Debit au journal de banque = Entrée d'argent)
  const bankDisbursements = bankEntries.filter(e => e.type === 'Credit'); // Décaissements (Crédit au journal de banque = Sortie d'argent)

  // Helper to group entries
  const groupEntries = (entriesList: typeof mockAccountingEntries) => {
    return Object.values(entriesList.reduce((acc, entry) => {
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
  };

  const purchasesGrouped = groupEntries(purchases);
  const salesGrouped = groupEntries(sales);
  const bankReceiptsGrouped = groupEntries(bankReceipts);
  const bankDisbursementsGrouped = groupEntries(bankDisbursements);

  if (!client) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">Client introuvable</div>
      </Layout>
    );
  }

  const pendingDocs = documents.filter(d => d.status === 'missing');
  
  const handleOpenReminderDialog = () => {
    // Determine context (general reminder or specific entries)
    const isEntryReminder = selectedEntries.length > 0;
    const piecesCount = isEntryReminder ? selectedEntries.length : pendingDocs.length;
    
    // Set default content
    setReminderContent({
        email: `Bonjour ${client?.name || ''},\n\nSauf erreur de notre part, nous n'avons pas reçu les justificatifs pour ${isEntryReminder ? 'les écritures suivantes' : 'les documents manquants'}.\n\n${isEntryReminder ? `- ${piecesCount} pièces sélectionnées` : 'Merci de vérifier votre espace client.'}\n\nMerci de nous les faire parvenir dès que possible.\n\nCordialement,\nVotre Expert-Comptable`,
        sms: `Bonjour, sauf erreur, il nous manque ${piecesCount} documents comptables. Merci de vérifier vos emails. Cdt, Votre Expert-Comptable`,
        whatsapp: `Bonjour ${client?.name || ''}, il nous manque ${piecesCount} documents pour votre comptabilité. Pourriez-vous vérifier ? Merci !`
    });
    
    // Set default channels based on primary contact preferences if available
    const primaryContact = clientContacts.find(c => c.isPrimary);
    if (primaryContact && primaryContact.preferredChannels && primaryContact.preferredChannels.length > 0) {
        setReminderChannels({
            email: primaryContact.preferredChannels.includes('email'),
            sms: primaryContact.preferredChannels.includes('phone'), // Map 'phone' to sms
            whatsapp: primaryContact.preferredChannels.includes('whatsapp')
        });
    } else {
         // Default fallback
         setReminderChannels({ email: true, sms: false, whatsapp: false });
    }

    setReminderDialogOpen(true);
  };

  const handleSendEntryReminder = () => {
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

    setReminderDialogOpen(false);
    toast({
      title: "Demande envoyée !",
      description: `La relance pour ${selectedEntries.length > 0 ? selectedEntries.length : 'les'} pièces a été envoyée via ${channels.join(', ')}.`,
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
    if (ignoredEntries.includes(id)) {
      setIgnoredEntries(ignoredEntries.filter(e => e !== id));
      toast({
        title: "Écriture rétablie",
        description: "L'écriture a été réintégrée aux relances.",
      });
    } else {
      setIgnoredEntries([...ignoredEntries, id]);
      toast({
        title: "Écriture ignorée",
        description: "Cette écriture ne sera plus relancée.",
      });
    }
  };

  const handleToggleUrgent = (id: string) => {
    setEntries(entries.map(e => {
      if (e.id === id) {
        return { ...e, isUrgent: !e.isUrgent };
      }
      return e;
    }));
    toast({
      title: "Urgence mise à jour",
      description: "Le statut d'urgence de l'écriture a été modifié.",
    });
  };

  const handleOpenComment = (id: string, currentComment?: string) => {
    setEditingCommentId(id);
    setTempComment(currentComment || "");
  };

  const handleSaveComment = () => {
    if (editingCommentId) {
      setEntries(entries.map(e => {
        if (e.id === editingCommentId) {
          return { ...e, comment: tempComment };
        }
        return e;
      }));
      setEditingCommentId(null);
      setTempComment("");
      toast({
        title: "Commentaire ajouté",
        description: "Le commentaire a été enregistré sur l'écriture.",
      });
    }
  };

  const handleBulkIgnore = () => {
    setIgnoredEntries([...ignoredEntries, ...selectedEntries]);
    setSelectedEntries([]);
    toast({
      title: "Écritures ignorées",
      description: `${selectedEntries.length} écritures ont été ignorées.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {client.company}
              <Dialog>
                  <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                        <Info className="h-5 w-5" />
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 dark:bg-slate-900 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Informations Client</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 md:grid-cols-3">
               {/* Client Identification */}
               <Card className="md:col-span-1 border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl h-fit dark:bg-slate-900 dark:border dark:border-slate-800">
                 <CardHeader>
                   <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                     <Building2 className="h-5 w-5 text-blue-500" />
                     Identification
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-2">
                     <Label className="dark:text-slate-300">Dénomination Sociale</Label>
                     <Input defaultValue={client.company} className="rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                   </div>
                   <div className="space-y-2">
                     <Label className="dark:text-slate-300">Forme Juridique</Label>
                     <Input defaultValue={client.legalForm || 'SAS'} className="rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label className="dark:text-slate-300">SIREN</Label>
                       <Input defaultValue={client.siren} className="rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                     </div>
                     <div className="space-y-2">
                       <Label className="dark:text-slate-300">Code APE</Label>
                       <Input defaultValue={client.ape || '6201Z'} className="rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label className="dark:text-slate-300">Date de création</Label>
                     <Input type="date" defaultValue={client.creationDate || '2020-01-01'} className="rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                   </div>
                   <div className="space-y-2">
                     <Label className="dark:text-slate-300">Adresse Siège</Label>
                     <Textarea defaultValue={client.address || ''} className="rounded-xl border-slate-200 min-h-[80px] dark:bg-slate-950 dark:border-slate-800" />
                   </div>
                   <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 mt-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" /> Enregistrer
                   </Button>
                 </CardContent>
               </Card>

               {/* Contacts */}
               <div className="md:col-span-2 space-y-6">
                 {clientContacts.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                        <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun contact</h3>
                        <p className="text-slate-500 mb-4 dark:text-slate-400">Ajoutez des contacts pour ce dossier.</p>
                        <Button variant="outline" onClick={() => setClientContacts([...clientContacts, { id: Date.now().toString(), name: '', role: '', email: '', phone: '', isPrimary: false, preferredChannels: ['email'] }])}>
                            Ajouter un contact
                        </Button>
                    </div>
                 ) : (
                    clientContacts.map((contact, index) => (
                     <Card key={contact.id} className={`border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl relative group dark:bg-slate-900 dark:border dark:border-slate-800 ${!contact.active ? 'opacity-60 grayscale' : ''}`}>
                     <div className="absolute top-4 right-4 flex items-center gap-2">
                       <div className="flex items-center space-x-2">
                         <Label htmlFor={`active-${contact.id}`} className="text-xs text-slate-500 dark:text-slate-400">Actif</Label>
                         <Switch 
                           id={`active-${contact.id}`}
                           checked={contact.active !== false}
                           onCheckedChange={(checked) => {
                             setClientContacts(clientContacts.map(c => 
                               c.id === contact.id ? { ...c, active: checked } : c
                             ));
                             toast({
                               title: checked ? "Contact activé" : "Contact désactivé",
                               description: `Le contact ${contact.name} a été ${checked ? 'activé' : 'désactivé'}.`
                             });
                           }}
                         />
                       </div>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="text-slate-400 hover:text-red-500 rounded-xl"
                         onClick={() => setClientContacts(clientContacts.filter(c => c.id !== contact.id))}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                     <CardHeader>
                       <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                         <User className={`h-5 w-5 ${contact.isPrimary ? 'text-blue-500' : 'text-slate-400'}`} />
                         {contact.name || 'Nouveau contact'} {contact.isPrimary && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none ml-2 dark:bg-blue-900/30 dark:text-blue-400">Principal</Badge>}
                       </CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="grid md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label className="dark:text-slate-300">Nom / Prénom</Label>
                           <Input defaultValue={contact.name} className="rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                         </div>
                         <div className="space-y-2">
                           <Label className="dark:text-slate-300">Fonction</Label>
                           <Input defaultValue={contact.role} className="rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                         </div>
                         <div className="space-y-2">
                           <Label className="dark:text-slate-300">Email</Label>
                           <div className="relative">
                             <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                             <Input defaultValue={contact.email} className="pl-10 rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <Label className="dark:text-slate-300">Téléphone</Label>
                           <div className="relative">
                             <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                             <Input defaultValue={contact.phone} className="pl-10 rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                           </div>
                         </div>
                         <div className="md:col-span-2 space-y-2">
                           <Label className="dark:text-slate-300">Canaux préférés (2 max)</Label>
                          <div className="flex gap-4">
                            <Button 
                                variant="outline" 
                                className={`flex-1 rounded-xl transition-all ${contact.preferredChannels?.includes('email') ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}
                                onClick={() => {
                                    const current = contact.preferredChannels || [];
                                    let updated: ('email' | 'phone' | 'whatsapp')[];
                                    if (current.includes('email')) {
                                        updated = current.filter(c => c !== 'email');
                                    } else {
                                        if (current.length >= 2) return;
                                        updated = [...current, 'email'] as ('email' | 'phone' | 'whatsapp')[];
                                    }
                                    setClientContacts(clientContacts.map(c => c.id === contact.id ? { ...c, preferredChannels: updated } : c));
                                }}
                            >
                                <Mail className="w-4 h-4 mr-2" /> Email
                            </Button>
                            <Button 
                                variant="outline" 
                                className={`flex-1 rounded-xl transition-all ${contact.preferredChannels?.includes('phone') ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-500'}`}
                                onClick={() => {
                                    const current = contact.preferredChannels || [];
                                    let updated: ('email' | 'phone' | 'whatsapp')[];
                                    if (current.includes('phone')) {
                                        updated = current.filter(c => c !== 'phone');
                                    } else {
                                        if (current.length >= 2) return;
                                        updated = [...current, 'phone'] as ('email' | 'phone' | 'whatsapp')[];
                                    }
                                    setClientContacts(clientContacts.map(c => c.id === contact.id ? { ...c, preferredChannels: updated } : c));
                                }}
                            >
                                <Phone className="w-4 h-4 mr-2" /> SMS
                            </Button>
                            <Button 
                                variant="outline" 
                                className={`flex-1 rounded-xl transition-all ${contact.preferredChannels?.includes('whatsapp') ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-500'}`}
                                onClick={() => {
                                    const current = contact.preferredChannels || [];
                                    let updated: ('email' | 'phone' | 'whatsapp')[];
                                    if (current.includes('whatsapp')) {
                                        updated = current.filter(c => c !== 'whatsapp');
                                    } else {
                                        if (current.length >= 2) return;
                                        updated = [...current, 'whatsapp'] as ('email' | 'phone' | 'whatsapp')[];
                                    }
                                    setClientContacts(clientContacts.map(c => c.id === contact.id ? { ...c, preferredChannels: updated } : c));
                                }}
                            >
                                <Send className="w-4 h-4 mr-2" /> WhatsApp
                            </Button>
                          </div>
                           <p className="text-xs text-slate-400 mt-1">Sélectionnez jusqu'à 2 canaux de communication privilégiés.</p>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 )))}
                 
                 <Button variant="outline" className="w-full rounded-2xl border-dashed border-2 border-slate-200 py-8 hover:bg-slate-50 hover:border-slate-300 text-slate-500 gap-2 dark:border-slate-700 dark:hover:bg-slate-800" 
                    onClick={() => setClientContacts([...clientContacts, { id: Date.now().toString(), name: '', role: '', email: '', phone: '', isPrimary: false, preferredChannels: ['email'], active: true }])}
                 >
                   <Plus className="h-5 w-5" /> Ajouter un autre contact
                 </Button>
               </div>
             </div>
                  </DialogContent>
              </Dialog>
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-500 dark:text-slate-400 text-sm">
              <span className="flex items-center gap-1"><User className="h-4 w-4" /> {client.name}</span>
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {client.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {client.phone}</span>
              <span className="flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 pl-4"><Building2 className="h-4 w-4" /> SIREN : {client.siren}</span>
              <span className="flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 pl-4">
                 <Badge variant="secondary" className="font-normal bg-blue-50 text-blue-700 hover:bg-blue-100 border-none dark:bg-blue-900/30 dark:text-blue-400">
                    Resp: {client.manager}
                 </Badge>
              </span>
            </div>
          </div>
          <div className="ml-auto flex gap-3">
             <Button variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 border shadow-none dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/40" onClick={() => {
                 toast({
                     title: "Données supprimées",
                     description: "Les données du client ont été supprimées conformément au RGPD.",
                 });
             }}>
                Supprimer (RGPD)
             </Button>
            <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700" onClick={handleOpenReminderDialog}>
              <Send className="h-4 w-4 mr-2" />
              Relancer le client
            </Button>
          </div>
        </div>

        {/* Global Filters */}
        <div className="flex flex-col items-end gap-2 ml-auto mb-4 w-fit">
            <div className="flex items-center justify-end gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                {ignoredEntries.length > 0 && (
                  <>
                    <Button
                      variant={showIgnored ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowIgnored(!showIgnored)}
                      className={`h-8 px-3 text-xs font-medium border-slate-200 dark:border-slate-700 ${showIgnored ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                    >
                      IGN <span className="ml-1.5 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-full text-[10px]">{ignoredEntries.length}</span>
                    </Button>
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-2" />
                  </>
                )}
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Montant min. :</span>
                <div className="relative w-24">
                  <Input 
                    type="number" 
                    value={minAmount} 
                    onChange={(e) => setMinAmount(Number(e.target.value))}
                    className="h-8 rounded-lg pl-6 pr-2 text-right border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="0"
                  />
                  <span className="absolute left-2 top-1.5 text-slate-400 text-xs">€</span>
                </div>
            </div>
            {selectedEntries.length > 0 && (
              <div className="flex items-center gap-1 self-start mr-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBulkIgnore} 
                  className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 h-6 px-2 text-xs"
                >
                  <EyeOff className="h-3 w-3 mr-1.5" />
                  Ignorer
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedEntries([])} 
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 h-6 px-2 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1.5" />
                  Décocher
                </Button>
              </div>
            )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl p-1 bg-white border border-slate-200 shadow-sm mb-6 dark:bg-slate-900 dark:border-slate-800">
            <TabsTrigger value="synthesis" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 dark:text-slate-400">Synthèse</TabsTrigger>
            <TabsTrigger value="achats-ventes" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 dark:text-slate-400">Achats / Ventes</TabsTrigger>
            <TabsTrigger value="journaux" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 dark:text-slate-400">Journaux</TabsTrigger>
            <TabsTrigger value="encaissements" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 dark:text-slate-400">Encaissements / Décaissements</TabsTrigger>
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
                                {new Date(reminder.date).toLocaleDateString('fr-FR')} • Via {reminder.channels?.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') || reminder.type}
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achats-ventes" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-8">
              {/* ACHATS */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                  Achats
                </h3>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="w-[150px] font-bold text-slate-600">N° de compte aux</TableHead>
                        <TableHead className="font-bold text-slate-600">Libellé compte</TableHead>
                        <TableHead className="text-center font-bold text-slate-600">Justificatifs manquants</TableHead>
                        <TableHead className="text-right font-bold text-slate-600 pr-8">Montant Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchasesGrouped.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-400 py-8">Aucune écriture d'achat trouvée.</TableCell>
                        </TableRow>
                      ) : (
                        purchasesGrouped.map((group) => (
                          <AccountGroupRow 
                            key={group.account} 
                            group={group} 
                            selectedEntries={selectedEntries}
                            onToggleSelect={toggleEntrySelection}
                            onIgnore={handleIgnoreEntry}
                            onToggleUrgent={handleToggleUrgent}
                            onEditComment={handleOpenComment}
                            showIgnored={showIgnored}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* VENTES */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                  Ventes
                </h3>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="w-[150px] font-bold text-slate-600">N° de compte aux</TableHead>
                        <TableHead className="font-bold text-slate-600">Libellé compte</TableHead>
                        <TableHead className="text-center font-bold text-slate-600">Justificatifs manquants</TableHead>
                        <TableHead className="text-right font-bold text-slate-600 pr-8">Montant Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesGrouped.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-400 py-8">Aucune écriture de vente trouvée.</TableCell>
                        </TableRow>
                      ) : (
                        salesGrouped.map((group) => (
                          <AccountGroupRow 
                            key={group.account} 
                            group={group} 
                            selectedEntries={selectedEntries}
                            onToggleSelect={toggleEntrySelection}
                            onIgnore={handleIgnoreEntry}
                            onToggleUrgent={handleToggleUrgent}
                            onEditComment={handleOpenComment}
                            showIgnored={showIgnored}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="journaux" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <History className="h-5 w-5 text-slate-500" />
                    Grand Livre
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={journalFilter === 'ALL' ? 'default' : 'outline'} 
                      className={`cursor-pointer ${journalFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                      onClick={() => setJournalFilter('ALL')}
                    >
                      Tout
                    </Badge>
                    <Badge 
                      variant={journalFilter === 'ACH' ? 'default' : 'outline'} 
                      className={`cursor-pointer ${journalFilter === 'ACH' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}
                      onClick={() => setJournalFilter('ACH')}
                    >
                      Achats
                    </Badge>
                    <Badge 
                      variant={journalFilter === 'VTE' ? 'default' : 'outline'} 
                      className={`cursor-pointer ${journalFilter === 'VTE' ? 'bg-green-500 text-white' : 'text-slate-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200'}`}
                      onClick={() => setJournalFilter('VTE')}
                    >
                      Ventes
                    </Badge>
                    <Badge 
                      variant={journalFilter === 'BQ' ? 'default' : 'outline'} 
                      className={`cursor-pointer ${journalFilter === 'BQ' ? 'bg-purple-500 text-white' : 'text-slate-500 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'}`}
                      onClick={() => setJournalFilter('BQ')}
                    >
                      Banque
                    </Badge>
                    <Badge 
                      variant={journalFilter === 'OD' ? 'default' : 'outline'} 
                      className={`cursor-pointer ${journalFilter === 'OD' ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'}`}
                      onClick={() => setJournalFilter('OD')}
                    >
                      OD
                    </Badge>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="w-[100px] font-bold text-slate-600">Date</TableHead>
                      <TableHead className="w-[80px] font-bold text-slate-600">Jnl</TableHead>
                      <TableHead className="w-[100px] font-bold text-slate-600">Compte</TableHead>
                      <TableHead className="font-bold text-slate-600">Libellé</TableHead>
                      <TableHead className="font-bold text-slate-600">Libellé Écriture</TableHead>
                      <TableHead className="text-right font-bold text-slate-600">Débit</TableHead>
                      <TableHead className="text-right font-bold text-slate-600 pr-8">Crédit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries
                      .filter(e => journalFilter === 'ALL' || e.journal === journalFilter)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell className="font-medium text-slate-700">
                          {new Date(entry.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`
                            ${entry.journal === 'ACH' ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}
                            ${entry.journal === 'VTE' ? 'text-green-600 border-green-200 bg-green-50' : ''}
                            ${entry.journal === 'BQ' ? 'text-purple-600 border-purple-200 bg-purple-50' : ''}
                            ${entry.journal === 'OD' ? 'text-orange-600 border-orange-200 bg-orange-50' : ''}
                          `}>
                            {entry.journal}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-slate-600 text-xs">
                          {entry.account}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {entry.accountLabel}
                        </TableCell>
                        <TableCell className="text-slate-900 font-medium text-sm">
                          {entry.label}
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-600">
                          {entry.type === 'Debit' ? entry.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-600 pr-8">
                          {entry.type === 'Credit' ? entry.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredEntries.filter(e => journalFilter === 'ALL' || e.journal === journalFilter).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                          Aucune écriture trouvée pour ce journal.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
             </div>
          </TabsContent>

          <TabsContent value="encaissements" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-8">
              {/* ENCAISSEMENTS */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                  Encaissements
                </h3>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="w-[150px] font-bold text-slate-600">N° de compte</TableHead>
                        <TableHead className="font-bold text-slate-600">Libellé compte</TableHead>
                        <TableHead className="text-center font-bold text-slate-600">Justificatifs manquants</TableHead>
                        <TableHead className="text-right font-bold text-slate-600 pr-8">Montant Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bankReceiptsGrouped.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-400 py-8">Aucun encaissement trouvé.</TableCell>
                        </TableRow>
                      ) : (
                        bankReceiptsGrouped.map((group) => (
                          <AccountGroupRow 
                            key={group.account} 
                            group={group} 
                            selectedEntries={selectedEntries}
                            onToggleSelect={toggleEntrySelection}
                            onIgnore={handleIgnoreEntry}
                            onToggleUrgent={handleToggleUrgent}
                            onEditComment={handleOpenComment}
                            showIgnored={showIgnored}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* DECAISSEMENTS */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                  Décaissements
                </h3>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="w-[150px] font-bold text-slate-600">N° de compte</TableHead>
                        <TableHead className="font-bold text-slate-600">Libellé compte</TableHead>
                        <TableHead className="text-center font-bold text-slate-600">Justificatifs manquants</TableHead>
                        <TableHead className="text-right font-bold text-slate-600 pr-8">Montant Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bankDisbursementsGrouped.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-400 py-8">Aucun décaissement trouvé.</TableCell>
                        </TableRow>
                      ) : (
                        bankDisbursementsGrouped.map((group) => (
                          <AccountGroupRow 
                            key={group.account} 
                            group={group} 
                            selectedEntries={selectedEntries}
                            onToggleSelect={toggleEntrySelection}
                            onIgnore={handleIgnoreEntry}
                            onToggleUrgent={handleToggleUrgent}
                            onEditComment={handleOpenComment}
                            showIgnored={showIgnored}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
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
                onClick={handleOpenReminderDialog}
               >
                 <Send className="h-5 w-5 mr-2" />
                 Demander au client
               </Button>
            </div>
          </div>
        )}

        {/* Reminder Dialog */}
        <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-3xl dark:bg-slate-900 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Relancer {client.company}</DialogTitle>
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
              <Button onClick={handleSendEntryReminder} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                <Send className="mr-2 h-4 w-4" /> Envoyer {Object.values(reminderChannels).filter(Boolean).length > 0 ? `(${Object.values(reminderChannels).filter(Boolean).length})` : ''}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Comment Modal */}
        <Dialog open={!!editingCommentId} onOpenChange={(open) => !open && setEditingCommentId(null)}>
          <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">Ajouter un commentaire</DialogTitle>
              <DialogDescription>
                Ce commentaire sera visible pour vous et le client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                id="comment"
                placeholder="Ex: Montant élevé, à vérifier..."
                className="col-span-3 min-h-[100px] border-slate-200 rounded-xl"
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCommentId(null)} className="rounded-xl border-slate-200">Annuler</Button>
              <Button onClick={handleSaveComment} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">Enregistrer</Button>
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

function AccountGroupRow({ group, selectedEntries, onToggleSelect, onIgnore, onToggleUrgent, onEditComment, showIgnored }: any) {
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
        <TableCell>
           <Search className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? "text-blue-500" : ""}`} />
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow className="bg-slate-50/30">
          <TableCell colSpan={5} className="p-0">
            <div className="pl-8 pr-4 py-6 border-l-4 border-blue-500/20 ml-6 my-2 bg-slate-50/50 rounded-r-xl">
               <div className="mb-4">
                 <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                   <Search className="h-4 w-4 text-blue-500" />
                   Détail des écritures non lettrées
                 </h4>
               </div>
               
               <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-100/50 hover:bg-slate-100/50">
                        <TableHead className="w-[50px] pl-4"><Checkbox disabled /></TableHead>
                        <TableHead className="font-bold text-slate-600">Journal</TableHead>
                        <TableHead className="font-bold text-slate-600">Libellé de l'opération</TableHead>
                        <TableHead className="font-bold text-slate-600">Date de facturation</TableHead>
                        <TableHead className="font-bold text-slate-600">N° Pièce</TableHead>
                        <TableHead className="text-right font-bold text-slate-600">Débit</TableHead>
                        <TableHead className="text-right font-bold text-slate-600">Crédit</TableHead>
                        <TableHead className="text-center font-bold text-slate-600">Lettrage</TableHead>
                        <TableHead className="text-right font-bold text-slate-600 pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.entries.map((entry: any) => (
                        <TableRow key={entry.id} className={`group hover:bg-blue-50/10 border-slate-50 transition-colors ${entry.isUrgent ? 'bg-red-50' : ''}`}>
                          <TableCell className="pl-4">
                            <Checkbox 
                              checked={selectedEntries.includes(entry.id)}
                              onCheckedChange={() => onToggleSelect(entry.id)}
                              className="rounded-md border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs bg-slate-50">{entry.journal}</Badge>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                             {entry.label}
                             {entry.comment && (
                               <div className="text-xs text-orange-600 mt-0.5 flex items-center gap-1">
                                 <MessageSquare className="h-3 w-3" /> {entry.comment}
                               </div>
                             )}
                          </TableCell>
                          <TableCell className="text-slate-600">{new Date(entry.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="font-mono text-sm text-slate-500">{entry.pieceRef || '-'}</TableCell>
                          <TableCell className="text-right font-medium text-slate-700">
                            {entry.type === 'Debit' ? entry.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-700">
                            {entry.type === 'Credit' ? entry.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'}
                          </TableCell>
                          <TableCell className="text-center text-slate-300 italic">
                             -
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`h-8 w-8 rounded-lg ${entry.isUrgent ? 'text-red-600 bg-red-100 border-red-200 border' : 'text-slate-300 hover:text-red-600 hover:bg-red-50'}`}
                                onClick={() => onToggleUrgent(entry.id)}
                                title="Marquer comme urgent"
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                onClick={() => onEditComment(entry.id, entry.comment)}
                                title="Ajouter un commentaire"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`h-8 w-8 rounded-lg ${showIgnored ? 'text-blue-500 hover:text-blue-700 hover:bg-blue-50' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'}`}
                                onClick={() => onIgnore(entry.id)}
                                title={showIgnored ? "Rétablir l'écriture" : "Ignorer cette écriture"}
                              >
                                {showIgnored ? <RotateCcw className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
