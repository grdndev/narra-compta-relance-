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
import { useState, useMemo } from "react";
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
  const [selectedJournalEntries, setSelectedJournalEntries] = useState<string[]>([]);
  const [journalChannelModalOpen, setJournalChannelModalOpen] = useState(false);
  const [journalSelectedChannel, setJournalSelectedChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [journalMessageContent, setJournalMessageContent] = useState('');
  const [newEmailOpen, setNewEmailOpen] = useState(false);
  const [newEmailContent, setNewEmailContent] = useState({ subject: '', message: '' });

  const handleSendEmail = () => {
    toast({
      title: "Email envoyé",
      description: `Votre email a bien été envoyé à ${client?.email}.`,
      className: "bg-green-600 text-white border-none"
    });
    setNewEmailOpen(false);
    setNewEmailContent({ subject: '', message: '' });
  };
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
  
  // Client notes state
  const [clientNotes, setClientNotes] = useState(client?.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState("");
  
  // Client status toggles
  const [cooperates, setCooperates] = useState(client?.cooperates !== false);
  const [underSurveillance, setUnderSurveillance] = useState(client?.underSurveillance || false);
  
  // Custom fields state
  const [customFields, setCustomFields] = useState<{id: string, label: string, value: string}[]>(
    client?.customFields || [
      { id: '1', label: 'Champ libre 1', value: '' },
      { id: '2', label: 'Champ libre 2', value: '' },
      { id: '3', label: 'Champ libre 3', value: '' },
      { id: '4', label: 'Champ libre 4', value: '' },
      { id: '5', label: 'Champ libre 5', value: '' },
    ]
  );
  
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
  
  // Scheduling State
  const [scheduleOption, setScheduleOption] = useState<'immediate' | 'd1' | 'd2' | 'h1' | 'h2' | 'custom'>('immediate');
  const [isUrgentReminder, setIsUrgentReminder] = useState(false);
  const [customDate, setCustomDate] = useState<string>("");

  const documents = mockDocuments.filter(d => d.clientId === params?.id);
  const reminders = mockReminders.filter(r => r.clientId === params?.id);
  
  const activeEntries = useMemo(() => entries.filter(e => {
    const isClient = e.clientId === params?.id;
    const isIgnored = ignoredEntries.includes(e.id);
    return isClient && (showIgnored ? isIgnored : !isIgnored);
  }), [entries, params?.id, ignoredEntries, showIgnored]);

  const filteredEntries = useMemo(() => activeEntries.filter(e => e.amount >= minAmount), [activeEntries, minAmount]);
  
  const purchases = useMemo(() => filteredEntries.filter(e => e.journal === 'ACH'), [filteredEntries]);
  const sales = useMemo(() => filteredEntries.filter(e => e.journal === 'VTE'), [filteredEntries]);
  const bankEntries = useMemo(() => filteredEntries.filter(e => e.journal === 'BQ'), [filteredEntries]);
  
  // Split bank entries for display
  const bankReceipts = useMemo(() => bankEntries.filter(e => e.type === 'Debit'), [bankEntries]); // Encaissements (Debit au journal de banque = Entrée d'argent)
  const bankDisbursements = useMemo(() => bankEntries.filter(e => e.type === 'Credit'), [bankEntries]); // Décaissements (Crédit au journal de banque = Sortie d'argent)

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

  const purchasesGrouped = useMemo(() => groupEntries(purchases), [purchases]);
  const salesGrouped = useMemo(() => groupEntries(sales), [sales]);
  const bankReceiptsGrouped = useMemo(() => groupEntries(bankReceipts), [bankReceipts]);
  const bankDisbursementsGrouped = useMemo(() => groupEntries(bankDisbursements), [bankDisbursements]);

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
    const isDocReminder = selectedDocs.length > 0;
    const piecesCount = isEntryReminder ? selectedEntries.length : (isDocReminder ? selectedDocs.length : pendingDocs.length);
    
    // Find primary contact
    const primaryContact = clientContacts.find(c => c.isPrimary) || clientContacts[0];
    // Simple heuristic for civility (can be improved with real data)
    const contactName = primaryContact ? primaryContact.name : (client?.name || '');
    const civility = contactName.toLowerCase().match(/^(marie|sophie|julie|claire|lea|camille|manon|chloe|anne|isabelle|nathalie)/) ? "Madame" : "Monsieur";
    const politeName = `${civility} ${contactName.split(' ').pop()}`; // Monsieur Dupont

    // Set default content
    setReminderContent({
        email: `Bonjour ${politeName},\n\nSauf erreur de notre part, nous n'avons pas reçu les justificatifs pour ${isEntryReminder ? 'les écritures suivantes' : (isDocReminder ? 'les documents suivants' : 'les documents manquants')}.\n\n${(isEntryReminder || isDocReminder) ? `- ${piecesCount} pièces sélectionnées` : 'Merci de vérifier votre espace client.'}\n\nMerci de nous les faire parvenir dès que possible.\n\nCordialement,\nVotre Expert-Comptable`,
        sms: `Bonjour ${politeName}, sauf erreur, il nous manque ${piecesCount} documents comptables. Merci de vérifier vos emails. Cdt, Votre Expert-Comptable`,
        whatsapp: `Bonjour ${politeName}, il nous manque ${piecesCount} documents pour votre comptabilité. Pourriez-vous vérifier ? Merci !`
    });
    
    // Reset scheduling
    setScheduleOption('immediate');
    setIsUrgentReminder(false);
    setCustomDate("");
    
    // Set default channels based on primary contact preferences if available
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
      
      let scheduleText = "maintenant";
      if (scheduleOption === 'd1') scheduleText = "demain (J+1)";
      if (scheduleOption === 'd2') scheduleText = "après-demain (J+2)";
      if (scheduleOption === 'h1') scheduleText = "dans 1 heure (H+1)";
      if (scheduleOption === 'h2') scheduleText = "dans 2 heures (H+2)";
      if (scheduleOption === 'custom') scheduleText = `le ${customDate}`;

    setReminderDialogOpen(false);
    toast({
      title: scheduleOption === 'immediate' ? "Demande envoyée !" : "Relance programmée",
      description: `La relance pour ${selectedEntries.length > 0 ? selectedEntries.length : (selectedDocs.length > 0 ? selectedDocs.length : 'les')} pièces ${scheduleOption === 'immediate' ? 'a été envoyée' : 'sera envoyée ' + scheduleText} via ${channels.join(', ')}.`,
      className: "bg-green-600 text-white border-none"
    });
    setSelectedEntries([]);
    setSelectedDocs([]);
  };

  const toggleSelectAllDocs = () => {
    if (selectedDocs.length === pendingDocs.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(pendingDocs.map(d => d.id));
    }
  };

  const toggleSelectAllEntriesInList = (entriesList: typeof entries) => {
    const ids = entriesList.map(e => e.id);
    const allSelected = ids.every(id => selectedEntries.includes(id));
    
    if (allSelected) {
      setSelectedEntries(selectedEntries.filter(id => !ids.includes(id)));
    } else {
      const newSelected = [...selectedEntries];
      ids.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      setSelectedEntries(newSelected);
    }
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

  const handleSendEntryMessage = (entry: typeof entries[0], channel: 'email' | 'sms' | 'whatsapp') => {
    const channelLabels = { email: 'Email', sms: 'SMS', whatsapp: 'WhatsApp' };
    const amount = entry.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    toast({
      title: `${channelLabels[channel]} envoyé`,
      description: `Relance envoyée pour l'écriture "${entry.label}" (${amount}).`,
      className: "bg-green-600 text-white border-none"
    });
  };

  const toggleJournalEntrySelection = (id: string) => {
    setSelectedJournalEntries(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const filteredJournalEntries = filteredEntries.filter(e => journalFilter === 'ALL' || e.journal === journalFilter);
  
  const toggleSelectAllJournalEntries = () => {
    if (selectedJournalEntries.length === filteredJournalEntries.length) {
      setSelectedJournalEntries([]);
    } else {
      setSelectedJournalEntries(filteredJournalEntries.map(e => e.id));
    }
  };

  const handleSendJournalEntriesMessage = () => {
    const channelLabels = { email: 'Email', sms: 'SMS', whatsapp: 'WhatsApp' };
    toast({
      title: `${channelLabels[journalSelectedChannel]} envoyé`,
      description: `Relance envoyée pour ${selectedJournalEntries.length} écriture(s).`,
      className: "bg-green-600 text-white border-none"
    });
    setJournalChannelModalOpen(false);
    setSelectedJournalEntries([]);
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
                   
                   {/* Status Toggles */}
                   <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className={`w-3 h-3 rounded-full ${cooperates ? 'bg-green-500' : 'bg-red-500'}`} />
                         <Label className="dark:text-slate-300">Client coopératif</Label>
                       </div>
                       <Switch 
                         checked={cooperates}
                         onCheckedChange={(checked) => {
                           setCooperates(checked);
                           toast({
                             title: checked ? "Client coopératif" : "Client non coopératif",
                             description: `Le statut de coopération a été mis à jour.`,
                           });
                         }}
                       />
                     </div>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <AlertTriangle className={`h-4 w-4 ${underSurveillance ? 'text-amber-500' : 'text-slate-300'}`} />
                         <Label className="dark:text-slate-300">En surveillance</Label>
                       </div>
                       <Switch 
                         checked={underSurveillance}
                         onCheckedChange={(checked) => {
                           setUnderSurveillance(checked);
                           toast({
                             title: checked ? "Client en surveillance" : "Surveillance désactivée",
                             description: `Le statut de surveillance a été mis à jour.`,
                           });
                         }}
                       />
                     </div>
                   </div>

                   {/* Custom Fields */}
                   <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                     <Label className="dark:text-slate-300 font-semibold">Champs personnalisés</Label>
                     {customFields.map((field, index) => (
                       <div key={field.id} className="grid grid-cols-5 gap-2">
                         <Input 
                           value={field.label}
                           onChange={(e) => setCustomFields(customFields.map(f => f.id === field.id ? {...f, label: e.target.value} : f))}
                           placeholder="Libellé"
                           className="col-span-2 rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs"
                         />
                         <Input 
                           value={field.value}
                           onChange={(e) => setCustomFields(customFields.map(f => f.id === field.id ? {...f, value: e.target.value} : f))}
                           placeholder="Valeur"
                           className="col-span-3 rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs"
                         />
                       </div>
                     ))}
                     <Button 
                       variant="outline" 
                       size="sm"
                       className="w-full rounded-xl border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400"
                       onClick={() => setCustomFields([...customFields, { id: Date.now().toString(), label: '', value: '' }])}
                     >
                       <Plus className="h-4 w-4 mr-2" /> Ajouter un champ
                     </Button>
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
              {clientContacts.slice(1).map(contact => (
                <span key={contact.id} className="flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 pl-4">
                   <Badge variant="secondary" className="font-normal bg-slate-50 text-slate-700 hover:bg-slate-100 border-none dark:bg-slate-800 dark:text-slate-300">
                      {contact.role || 'Contact'} : {contact.name}
                   </Badge>
                </span>
              ))}
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

        {/* Notes Section */}
        <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl dark:bg-slate-900 dark:border dark:border-slate-800 max-w-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                  Notes internes
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Aujourd'hui</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {filteredEntries.reduce((sum, e) => sum + e.amount, 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span>Total écritures non lettrées</span>
                </div>
              </div>
              {!isEditingNotes ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => {
                    setTempNotes(clientNotes);
                    setIsEditingNotes(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={() => {
                      setIsEditingNotes(false);
                      setTempNotes("");
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    size="sm" 
                    className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={() => {
                      setClientNotes(tempNotes);
                      setIsEditingNotes(false);
                      toast({
                        title: "Notes enregistrées",
                        description: "Les notes ont été mises à jour avec succès.",
                        className: "bg-green-600 text-white border-none"
                      });
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingNotes ? (
              <Textarea 
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Ajoutez des notes internes sur ce client (informations importantes, rappels, historique des échanges...)"
                className="min-h-[120px] rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white resize-none"
              />
            ) : (
              <div className="min-h-[60px]">
                {clientNotes ? (
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{clientNotes}</p>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 italic">Aucune note pour ce client. Cliquez sur "Modifier" pour en ajouter.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

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
          <TabsList className="grid w-full grid-cols-5 rounded-2xl p-1 bg-white border border-slate-200 shadow-sm mb-6 dark:bg-slate-900 dark:border-slate-800">
            <TabsTrigger value="synthesis" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 dark:text-slate-400">Synthèse</TabsTrigger>
            <TabsTrigger value="achats-ventes" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 dark:text-slate-400">Achats / Ventes</TabsTrigger>
            <TabsTrigger value="journaux" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 dark:text-slate-400">Journaux</TabsTrigger>
            <TabsTrigger value="encaissements" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 dark:text-slate-400">Enc. / Déc.</TabsTrigger>
            <TabsTrigger value="emails" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              E-mails
            </TabsTrigger>
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
                      <div className="flex justify-end mb-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={toggleSelectAllDocs}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          {selectedDocs.length === pendingDocs.length && pendingDocs.length > 0 ? "Tout désélectionner" : "Tout sélectionner"}
                        </Button>
                      </div>
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
                                {new Date(reminder.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} • {new Date(reminder.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • Via {reminder.channels?.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') || reminder.type}
                              </span>
                              <Badge variant="outline" className={`w-fit text-[10px] px-1.5 py-0 h-5 border-slate-200 ${reminder.status === 'opened' ? 'bg-green-50 text-green-700 border-green-200' : reminder.status === 'sent' ? 'bg-blue-50 text-blue-700 border-blue-200' : reminder.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' : ''}`}>
                                {reminder.status === 'opened' ? 'Ouvert' : reminder.status === 'sent' ? 'En cours' : reminder.status === 'failed' ? 'Échec' : reminder.status}
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
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    Achats
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSelectAllEntriesInList(purchases)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Tout sélectionner
                  </Button>
                </div>
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
                            onToggleSelectGroup={() => toggleSelectAllEntriesInList(group.entries)}
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
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    Ventes
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSelectAllEntriesInList(sales)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Tout sélectionner
                  </Button>
                </div>
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
                            onToggleSelectGroup={() => toggleSelectAllEntriesInList(group.entries)}
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
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={filteredJournalEntries.length > 0 && selectedJournalEntries.length === filteredJournalEntries.length}
                          onCheckedChange={toggleSelectAllJournalEntries}
                        />
                      </TableHead>
                      <TableHead className="w-[100px] font-bold text-slate-600">Date</TableHead>
                      <TableHead className="w-[80px] font-bold text-slate-600">Jnl</TableHead>
                      <TableHead className="w-[100px] font-bold text-slate-600">Compte</TableHead>
                      <TableHead className="font-bold text-slate-600">Libellé</TableHead>
                      <TableHead className="font-bold text-slate-600">Libellé Écriture</TableHead>
                      <TableHead className="text-right font-bold text-slate-600">Débit</TableHead>
                      <TableHead className="text-right font-bold text-slate-600">Crédit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJournalEntries
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                      <TableRow 
                        key={entry.id} 
                        className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${selectedJournalEntries.includes(entry.id) ? 'bg-blue-50/50' : ''}`}
                        onClick={() => toggleJournalEntrySelection(entry.id)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedJournalEntries.includes(entry.id)}
                            onCheckedChange={() => toggleJournalEntrySelection(entry.id)}
                          />
                        </TableCell>
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
                        <TableCell className="text-right font-mono text-slate-600">
                          {entry.type === 'Credit' ? entry.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredJournalEntries.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                          Aucune écriture trouvée pour ce journal.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Floating Action Bar for selected entries */}
                {selectedJournalEntries.length > 0 && (
                  <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1">
                        {selectedJournalEntries.length} écriture{selectedJournalEntries.length > 1 ? 's' : ''} sélectionnée{selectedJournalEntries.length > 1 ? 's' : ''}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedJournalEntries([])}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        Désélectionner tout
                      </Button>
                    </div>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                      onClick={() => {
                        const selectedItems = filteredJournalEntries.filter(e => selectedJournalEntries.includes(e.id));
                        const itemsList = selectedItems.map(e => `• ${e.label} (${e.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })})`).join('\n');
                        const defaultMessage = `Bonjour,\n\nNous vous contactons concernant les écritures comptables suivantes pour lesquelles nous avons besoin de justificatifs :\n\n${itemsList}\n\nMerci de nous transmettre les documents correspondants dans les meilleurs délais.\n\nCordialement,\nVotre cabinet comptable`;
                        setJournalMessageContent(defaultMessage);
                        setJournalChannelModalOpen(true);
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Demander au client
                    </Button>
                  </div>
                )}
             </div>
          </TabsContent>

          <TabsContent value="encaissements" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-8">
              {/* ENCAISSEMENTS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    Encaissements
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSelectAllEntriesInList(bankReceipts)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Tout sélectionner
                  </Button>
                </div>
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
                            onToggleSelectGroup={() => toggleSelectAllEntriesInList(group.entries)}
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
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                    Décaissements
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSelectAllEntriesInList(bankDisbursements)}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Tout sélectionner
                  </Button>
                </div>
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
                            onToggleSelectGroup={() => toggleSelectAllEntriesInList(group.entries)}
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

          <TabsContent value="emails" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden dark:bg-slate-900 dark:border-slate-800">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Boîte e-mail</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Échanges avec {client.company}</p>
                  </div>
                </div>
                <Button 
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setNewEmailOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau message
                </Button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  {
                    id: '1',
                    from: 'cabinet',
                    subject: 'Relance - Documents comptables manquants',
                    preview: 'Bonjour, nous vous contactons concernant les pièces justificatives manquantes pour le mois de décembre...',
                    date: '2026-01-10T14:30:00',
                    read: true
                  },
                  {
                    id: '2',
                    from: 'client',
                    subject: 'RE: Relance - Documents comptables manquants',
                    preview: 'Bonjour, je vous transmets en pièce jointe les factures demandées. Concernant la facture EDF, je suis...',
                    date: '2026-01-10T16:45:00',
                    read: true,
                    hasAttachment: true
                  },
                  {
                    id: '3',
                    from: 'cabinet',
                    subject: 'Confirmation de réception',
                    preview: 'Nous accusons bonne réception de vos documents. Il nous manque encore la facture EDF mentionnée...',
                    date: '2026-01-11T09:15:00',
                    read: true
                  },
                  {
                    id: '4',
                    from: 'cabinet',
                    subject: 'Déclaration TVA - Action requise',
                    preview: 'Dans le cadre de la préparation de votre déclaration de TVA du 4ème trimestre 2025, nous avons besoin...',
                    date: '2026-01-08T11:00:00',
                    read: true
                  },
                  {
                    id: '5',
                    from: 'client',
                    subject: 'RE: Déclaration TVA - Action requise',
                    preview: 'Merci pour ce rappel. Voici les informations demandées concernant les opérations intracommunautaires...',
                    date: '2026-01-09T08:30:00',
                    read: true,
                    hasAttachment: true
                  },
                  {
                    id: '6',
                    from: 'cabinet',
                    subject: 'Bilan annuel 2025 - Rendez-vous de présentation',
                    preview: 'Suite à la clôture de votre exercice comptable, nous souhaiterions organiser un rendez-vous pour...',
                    date: '2026-01-05T10:00:00',
                    read: true
                  }
                ].map((email) => (
                  <div 
                    key={email.id}
                    className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${!email.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        email.from === 'cabinet' 
                          ? 'bg-blue-100 dark:bg-blue-900/30' 
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        {email.from === 'cabinet' ? (
                          <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${email.from === 'cabinet' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {email.from === 'cabinet' ? 'Cabinet Comptable' : client.company}
                            </span>
                            {email.hasAttachment && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-slate-200 dark:border-slate-700">
                                <FileText className="h-3 w-3 mr-1" />
                                PJ
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(email.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className={`text-sm mb-1 truncate ${!email.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                          {email.subject}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {email.preview}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  6 messages • Dernière synchronisation il y a 5 minutes
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Bar for Analysis */}
        {(selectedEntries.length > 0 || selectedDocs.length > 0) && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-in slide-in-from-bottom-10 fade-in">
            <div className="bg-slate-900 text-white px-2 py-2 rounded-2xl shadow-2xl flex items-center gap-4 pl-6 border border-slate-700">
               <div className="text-sm font-medium">
                  <span className="text-blue-400 font-bold">{selectedEntries.length + selectedDocs.length} pièces sélectionnées</span>
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

                {/* New Email Dialog */}
        <Dialog open={newEmailOpen} onOpenChange={setNewEmailOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-3xl dark:bg-slate-900 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Nouveau message</DialogTitle>
              <DialogDescription className="dark:text-slate-400">
                Envoyer un e-mail à {client.email}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Objet</Label>
                <Input 
                  value={newEmailContent.subject}
                  onChange={(e) => setNewEmailContent({...newEmailContent, subject: e.target.value})}
                  className="rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800"
                  placeholder="Objet du message"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Message</Label>
                <Textarea 
                  value={newEmailContent.message}
                  onChange={(e) => setNewEmailContent({...newEmailContent, message: e.target.value})}
                  className="min-h-[200px] bg-white dark:bg-slate-950 dark:border-slate-800 text-sm rounded-xl border-slate-200"
                  placeholder="Rédigez votre message..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewEmailOpen(false)} className="rounded-xl">Annuler</Button>
              <Button onClick={handleSendEmail} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="mr-2 h-4 w-4" /> Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
              {/* Scheduling Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                   <Label className="font-semibold dark:text-slate-200">Moment de l'envoi</Label>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <Button 
                        variant={scheduleOption === 'immediate' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setScheduleOption('immediate')}
                        className={`rounded-lg ${scheduleOption === 'immediate' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                    >
                        Immédiat
                    </Button>
                    
                    <Button 
                        variant={scheduleOption === 'd1' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setScheduleOption('d1')}
                        className={`rounded-lg ${scheduleOption === 'd1' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                    >
                        J+1 (Demain)
                    </Button>
                    <Button 
                        variant={scheduleOption === 'd2' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setScheduleOption('d2')}
                        className={`rounded-lg ${scheduleOption === 'd2' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                    >
                        J+2
                    </Button>
                    <Button 
                        variant={scheduleOption === 'custom' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setScheduleOption('custom')}
                        className={`rounded-lg ${scheduleOption === 'custom' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                    >
                        Personnalisé
                    </Button>
                </div>
                
                {scheduleOption === 'custom' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <Label className="text-xs mb-1.5 block">Date et heure</Label>
                        <Input 
                            type="datetime-local" 
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            className="bg-white"
                        />
                    </div>
                )}
              </div>

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

        {/* Journal Channel Selection Modal */}
        <Dialog open={journalChannelModalOpen} onOpenChange={setJournalChannelModalOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-3xl dark:bg-slate-900 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Demander les justificatifs</DialogTitle>
              <DialogDescription className="dark:text-slate-400">
                Personnalisez le message et choisissez le canal d'envoi pour {selectedJournalEntries.length} écriture{selectedJournalEntries.length > 1 ? 's' : ''}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Message</Label>
                <Textarea 
                  value={journalMessageContent}
                  onChange={(e) => setJournalMessageContent(e.target.value)}
                  className="min-h-[200px] bg-white dark:bg-slate-950 dark:border-slate-800 text-sm"
                  placeholder="Écrivez votre message..."
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Canal d'envoi</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={journalSelectedChannel === 'email' ? 'default' : 'outline'}
                    className={`flex-col h-16 rounded-xl ${journalSelectedChannel === 'email' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-blue-50 hover:border-blue-200'}`}
                    onClick={() => setJournalSelectedChannel('email')}
                  >
                    <Mail className="h-5 w-5 mb-1" />
                    <span className="text-xs">Email</span>
                  </Button>
                  <Button 
                    variant={journalSelectedChannel === 'sms' ? 'default' : 'outline'}
                    className={`flex-col h-16 rounded-xl ${journalSelectedChannel === 'sms' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'hover:bg-purple-50 hover:border-purple-200'}`}
                    onClick={() => setJournalSelectedChannel('sms')}
                  >
                    <MessageSquare className="h-5 w-5 mb-1" />
                    <span className="text-xs">SMS</span>
                  </Button>
                  <Button 
                    variant={journalSelectedChannel === 'whatsapp' ? 'default' : 'outline'}
                    className={`flex-col h-16 rounded-xl ${journalSelectedChannel === 'whatsapp' ? 'bg-green-600 text-white hover:bg-green-700' : 'hover:bg-green-50 hover:border-green-200'}`}
                    onClick={() => setJournalSelectedChannel('whatsapp')}
                  >
                    <Phone className="h-5 w-5 mb-1" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setJournalChannelModalOpen(false)} className="rounded-xl">Annuler</Button>
              <Button onClick={handleSendJournalEntriesMessage} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                <Send className="mr-2 h-4 w-4" /> Envoyer
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

function AccountGroupRow({ group, selectedEntries, onToggleSelect, onToggleSelectGroup, onIgnore, onToggleUrgent, onEditComment, showIgnored }: any) {
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
                        <TableHead className="w-[50px] pl-4">
                          <Checkbox 
                            checked={group.entries.length > 0 && group.entries.every((e: any) => selectedEntries.includes(e.id))}
                            onCheckedChange={onToggleSelectGroup}
                            className="rounded-md border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                        </TableHead>
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
