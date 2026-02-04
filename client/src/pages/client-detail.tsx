import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  mockClients,
  mockDocuments,
  mockReminders,
  mockAccountingEntries,
} from "@/lib/mockData";
import { useRoute } from "wouter";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  History,
  Send,
  Search,
  CheckSquare,
  MessageSquare,
  ZoomIn,
  Eye,
  EyeOff,
  AlertTriangle,
  User,
  Link2,
  FileText,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  Info,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function ClientDetail() {
  const [match, params] = useRoute("/clients/:id");
  const { toast } = useToast();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [lostEntries, setLostEntries] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<"all" | "lost" | "urgent">(
    "all",
  );
  const [selectionScope, setSelectionScope] = useState<
    "achats" | "ventes" | "all-av" | null
  >(null);
  const [selectedJournalEntries, setSelectedJournalEntries] = useState<string[]>(
    [],
  );
  const [journalChannelModalOpen, setJournalChannelModalOpen] = useState(false);
  const [journalSelectedChannel, setJournalSelectedChannel] = useState<
    "email" | "sms" | "whatsapp"
  >("email");
  const [journalMessageContent, setJournalMessageContent] = useState("");
  const [newEmailOpen, setNewEmailOpen] = useState(false);
  const [newEmailContent, setNewEmailContent] = useState({
    subject: "",
    message: "",
  });

  const handleSendEmail = () => {
    toast({
      title: "Email envoyé",
      description: "Votre message a été envoyé avec succès.",
      className: "bg-green-600 text-white border-none",
    });
    setNewEmailOpen(false);
  };

  const client = mockClients.find((c) => c.id === params?.id);

  const [activeTab, setActiveTab] = useState("overview");
  const [minAmount, setMinAmount] = useState(0);
  const [ignoredEntries, setIgnoredEntries] = useState<string[]>([]);
  const [showIgnored, setShowIgnored] = useState(false);
  const [journalFilter, setJournalFilter] = useState<
    "ALL" | "ACH" | "VTE" | "BQ" | "OD"
  >("ALL");

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState("");
  const [clientContacts, setClientContacts] = useState<any[]>([
    {
      id: "1",
      name: "Marie Dupont",
      role: "Dirigeante",
      email: client?.email || "",
      phone: "06 12 34 56 78",
      isPrimary: true,
      preferredChannels: ["email"],
    },
    {
      id: "2",
      name: "Paul Martin",
      role: "Comptable",
      email: "compta@" + (client?.company || "entreprise") + ".fr",
      phone: "06 98 76 54 32",
      isPrimary: false,
      preferredChannels: ["email", "whatsapp"],
    },
  ]);

  const [customFields, setCustomFields] = useState<
    { id: string; label: string; value: string }[]
  >(
    client?.customFields || [
      { id: "1", label: "Champ libre 1", value: "" },
      { id: "2", label: "Champ libre 2", value: "" },
      { id: "3", label: "Champ libre 3", value: "" },
      { id: "4", label: "Champ libre 4", value: "" },
      { id: "5", label: "Champ libre 5", value: "" },
    ],
  );

  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderChannels, setReminderChannels] = useState<{
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  }>({
    email: true,
    sms: false,
    whatsapp: false,
  });
  const [reminderContent, setReminderContent] = useState<{
    email: string;
    sms: string;
    whatsapp: string;
  }>({
    email: "",
    sms: "",
    whatsapp: "",
  });

  const [scheduleOption, setScheduleOption] = useState<
    "immediate" | "d1" | "d2" | "h1" | "h2" | "custom"
  >("immediate");
  const [isUrgentReminder, setIsUrgentReminder] = useState(false);
  const [customDate, setCustomDate] = useState<string>("");

  type FollowUpDelay = "d1" | "d3" | "d7" | "custom";
  type FollowUpStep = {
    id: string;
    delay: FollowUpDelay;
    customDate?: string;
    subject: string;
    body: string;
  };

  const [followUpEnabled, setFollowUpEnabled] = useState(false);
  const [followUpSteps, setFollowUpSteps] = useState<FollowUpStep[]>([]);

  const documents = mockDocuments.filter((d) => d.clientId === params?.id);
  const reminders = mockReminders.filter((r) => r.clientId === params?.id);

  const [entries, setEntries] = useState(mockAccountingEntries);

  const activeEntries = useMemo(
    () =>
      entries.filter((e) => {
        const isClient = e.clientId === params?.id;
        const isIgnored = ignoredEntries.includes(e.id);
        return isClient && (showIgnored ? isIgnored : !isIgnored);
      }),
    [entries, params?.id, ignoredEntries, showIgnored],
  );

  const filteredEntries = useMemo(
    () => activeEntries.filter((e) => e.amount >= minAmount),
    [activeEntries, minAmount],
  );

  const purchases = useMemo(
    () => filteredEntries.filter((e) => e.journal === "ACH"),
    [filteredEntries],
  );
  const sales = useMemo(
    () => filteredEntries.filter((e) => e.journal === "VTE"),
    [filteredEntries],
  );
  const bankEntries = useMemo(
    () => filteredEntries.filter((e) => e.journal === "BQ"),
    [filteredEntries],
  );

  const bankReceipts = useMemo(
    () => bankEntries.filter((e) => e.type === "Debit"),
    [bankEntries],
  );
  const bankDisbursements = useMemo(
    () => bankEntries.filter((e) => e.type === "Credit"),
    [bankEntries],
  );

  const groupEntries = (entriesList: typeof mockAccountingEntries) => {
    return Object.values(
      entriesList.reduce(
        (acc, entry) => {
          if (!acc[entry.account]) {
            acc[entry.account] = {
              account: entry.account,
              label: entry.accountLabel,
              entries: [],
              totalAmount: 0,
              count: 0,
            };
          }
          acc[entry.account].entries.push(entry);
          acc[entry.account].totalAmount += entry.amount;
          acc[entry.account].count += 1;
          return acc;
        },
        {} as Record<
          string,
          {
            account: string;
            label: string;
            entries: typeof mockAccountingEntries;
            totalAmount: number;
            count: number;
          }
        >,
      ),
    );
  };

  const purchasesGrouped = useMemo(() => groupEntries(purchases), [purchases]);
  const salesGrouped = useMemo(() => groupEntries(sales), [sales]);
  const bankReceiptsGrouped = useMemo(
    () => groupEntries(bankReceipts),
    [bankReceipts],
  );
  const bankDisbursementsGrouped = useMemo(
    () => groupEntries(bankDisbursements),
    [bankDisbursements],
  );

  if (!client) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          Client introuvable
        </div>
      </Layout>
    );
  }

  const pendingDocs = documents.filter((d) => d.status === "missing");

  const gedLink = "https://ged.naraa.fr";

  const appendGedLink = (content: string) => {
    const c = content || "";
    if (c.includes(gedLink)) return c;
    const trimmed = c.trimEnd();
    return `${trimmed}\n\nLien GED (vos documents) : ${gedLink}`;
  };

  const buildEmailTemplateForSelection = (
    mode: "all" | "lost" | "urgent",
    politeName: string,
    count: number,
  ) => {
    const base =
      mode === "lost"
        ? `Bonjour ${politeName},\n\nNous constatons que ${count} pièce(s) comptable(s) sont indiquées comme *perdues* (non retrouvées).\n\n⚠️ Sans justificatifs, certaines charges peuvent être considérées comme non déductibles et cela peut poser un risque en cas de contrôle fiscal.\n\nMerci de nous transmettre au plus vite un duplicata (fournisseur / facture / reçu) ou toute preuve équivalente permettant de justifier ces écritures.\n\nCordialement,\nVotre Expert-Comptable`
        : mode === "urgent"
          ? `Bonjour ${politeName},\n\nNous vous informons qu’il manque encore ${count} pièce(s) comptable(s) marquées comme *urgentes*.\n\nAfin de mener à bien notre mission et de respecter les deadlines, merci de nous transmettre ces justificatifs dès que possible via votre espace client.\n\nCordialement,\nVotre Expert-Comptable`
          : `Bonjour ${politeName},\n\nSauf erreur de notre part, nous n'avons pas reçu les justificatifs pour ${count} pièce(s) comptable(s).\n\nMerci de nous les faire parvenir dès que possible.\n\nCordialement,\nVotre Expert-Comptable`;

    return appendGedLink(base);
  };

  const handleOpenReminderDialog = () => {
    const isEntryReminder = selectedEntries.length > 0;
    const isDocReminder = selectedDocs.length > 0;
    const piecesCount = isEntryReminder
      ? selectedEntries.length
      : isDocReminder
        ? selectedDocs.length
        : pendingDocs.length;

    const primaryContact =
      clientContacts.find((c) => c.isPrimary) || clientContacts[0];
    const contactName = primaryContact ? primaryContact.name : client?.name || "";
    const civility = contactName
      .toLowerCase()
      .match(
        /^(marie|sophie|julie|claire|lea|camille|manon|chloe|anne|isabelle|nathalie)/,
      )
      ? "Madame"
      : "Monsieur";
    const politeName = `${civility} ${contactName.split(" ").pop()}`;

    setReminderContent({
      email: buildEmailTemplateForSelection(selectionMode, politeName, piecesCount),
      sms: `Bonjour ${politeName}, sauf erreur, il nous manque ${piecesCount} document(s) comptable(s). Merci de vérifier vos emails. Cdt, Votre Expert-Comptable`,
      whatsapp: `Bonjour ${politeName}, il nous manque ${piecesCount} document(s) pour votre comptabilité. Pourriez-vous vérifier ? Merci !`,
    });

    setFollowUpEnabled(false);
    setFollowUpSteps([
      {
        id: crypto.randomUUID(),
        delay: "d1",
        subject: `Rappel — pièces comptables manquantes`,
        body: appendGedLink(
          `Bonjour ${politeName},\n\nJe me permets de revenir vers vous car nous n'avons pas eu de retour concernant les pièces comptables demandées.\n\nPouvez-vous nous les transmettre dès que possible afin que nous puissions finaliser votre dossier ?\n\nMerci par avance.\n\nCordialement,\nVotre Expert-Comptable`,
        ),
      },
      {
        id: crypto.randomUUID(),
        delay: "d3",
        subject: `2e rappel — pièces comptables manquantes`,
        body: appendGedLink(
          `Bonjour ${politeName},\n\nSans retour de votre part, nous ne pouvons pas clôturer certaines écritures.\n\nPouvez-vous nous envoyer les justificatifs manquants (ou nous indiquer si certaines pièces sont perdues) ?\n\nMerci d'avance.\n\nCordialement,\nVotre Expert-Comptable`,
        ),
      },
    ]);

    setScheduleOption("immediate");
    setIsUrgentReminder(false);
    setCustomDate("");

    if (
      primaryContact &&
      primaryContact.preferredChannels &&
      primaryContact.preferredChannels.length > 0
    ) {
      setReminderChannels({
        email: primaryContact.preferredChannels.includes("email"),
        sms: primaryContact.preferredChannels.includes("phone"),
        whatsapp: primaryContact.preferredChannels.includes("whatsapp"),
      });
    } else {
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
        variant: "destructive",
      });
      return;
    }

    let scheduleText = "maintenant";
    if (scheduleOption === "d1") scheduleText = "demain (J+1)";
    if (scheduleOption === "d2") scheduleText = "après-demain (J+2)";
    if (scheduleOption === "h1") scheduleText = "dans 1 heure (H+1)";
    if (scheduleOption === "h2") scheduleText = "dans 2 heures (H+2)";
    if (scheduleOption === "custom") scheduleText = `le ${customDate}`;

    setReminderDialogOpen(false);

    const followUpLabel = !followUpEnabled
      ? null
      : `${followUpSteps.length} relance${followUpSteps.length > 1 ? "s" : ""}`;

    toast({
      title: scheduleOption === "immediate" ? "Demande envoyée !" : "Relance programmée",
      description: `La relance pour ${selectedEntries.length > 0 ? selectedEntries.length : selectedDocs.length > 0 ? selectedDocs.length : "les"} pièces ${scheduleOption === "immediate" ? "a été envoyée" : "sera envoyée " + scheduleText} via ${channels.join(", ")}.${followUpLabel ? ` Relance automatique prévue : ${followUpLabel}.` : ""}`,
      className: "bg-green-600 text-white border-none",
    });

    setSelectedEntries([]);
    setSelectedDocs([]);
    setSelectionMode("all");
    setSelectionScope(null);
  };

  const toggleSelectAllDocs = () => {
    if (selectedDocs.length === pendingDocs.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(pendingDocs.map((d) => d.id));
    }
  };

  const toggleSelectAllEntriesInList = (entriesList: typeof entries) => {
    const ids = entriesList.map((e) => e.id);
    const allSelected = ids.every((id) => selectedEntries.includes(id));

    if (allSelected) {
      setSelectedEntries(selectedEntries.filter((id) => !ids.includes(id)));
    } else {
      const newSelected = [...selectedEntries];
      ids.forEach((id) => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      setSelectedEntries(newSelected);
    }
  };

  const toggleDocSelection = (docId: string) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter((id) => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
  };

  const toggleEntrySelection = (id: string) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter((e) => e !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };

  const selectByMode = (
    scope: "all-av" | "achats" | "ventes",
    mode: "all" | "lost" | "urgent",
  ) => {
    setSelectionScope(scope);
    setSelectionMode(mode);

    const eligibleBase = filteredEntries.filter(
      (e) => e.status === "missing_doc" && !ignoredEntries.includes(e.id),
    );

    const eligible = eligibleBase.filter((e) => {
      if (scope === "achats") return e.journal === "ACH";
      if (scope === "ventes") return e.journal === "VTE";
      return e.journal === "ACH" || e.journal === "VTE";
    });

    if (mode === "all") {
      setSelectedEntries(eligible.map((e) => e.id));
      return;
    }

    if (mode === "lost") {
      const lostIds = eligible
        .filter((e) => lostEntries.includes(e.id))
        .map((e) => e.id);
      setSelectedEntries(lostIds);

      if (lostIds.length === 0) {
        toast({
          title: "Aucune pièce perdue",
          description: "Aucune écriture marquée comme perdue dans cette liste.",
        });
      }
      return;
    }

    setSelectedEntries(eligible.filter((e) => e.isUrgent).map((e) => e.id));
  };

  const handleIgnoreEntry = (id: string) => {
    if (ignoredEntries.includes(id)) {
      setIgnoredEntries(ignoredEntries.filter((e) => e !== id));
      toast({
        title: "Écriture rétablie",
        description: "L'écriture a été réintégrée aux relances.",
      });
      return;
    }

    setIgnoredEntries([...ignoredEntries, id]);
    toast({
      title: "Écriture ignorée",
      description: "Cette écriture a été retirée de la liste.",
    });
  };

  const handleToggleLost = (id: string) => {
    if (lostEntries.includes(id)) {
      setLostEntries(lostEntries.filter((e) => e !== id));
    } else {
      setLostEntries([...lostEntries, id]);
    }
  };

  const handleToggleUrgent = (id: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              isUrgent: !e.isUrgent,
            }
          : e,
      ),
    );
  };

  const filteredJournalEntries = useMemo(() => {
    const base = filteredEntries.filter((e) => e.status === "missing_doc");
    if (journalFilter === "ALL") return base;
    return base.filter((e) => e.journal === journalFilter);
  }, [filteredEntries, journalFilter]);

  const toggleJournalEntrySelection = (id: string) => {
    if (selectedJournalEntries.includes(id)) {
      setSelectedJournalEntries(selectedJournalEntries.filter((e) => e !== id));
    } else {
      setSelectedJournalEntries([...selectedJournalEntries, id]);
    }
  };

  const toggleSelectAllJournalEntries = () => {
    const ids = filteredJournalEntries.map((e) => e.id);
    const allSelected = ids.every((id) => selectedJournalEntries.includes(id));
    if (allSelected) {
      setSelectedJournalEntries(
        selectedJournalEntries.filter((id) => !ids.includes(id)),
      );
    } else {
      setSelectedJournalEntries(Array.from(new Set([...selectedJournalEntries, ...ids])));
    }
  };

  const handleSendJournalEntriesMessage = () => {
    toast({
      title: "Message prêt",
      description: "Ce prototype simule l'envoi via le canal choisi.",
    });
    setJournalChannelModalOpen(false);
    setSelectedJournalEntries([]);
  };

  const handleOpenComment = (id: string, current: string) => {
    setEditingCommentId(id);
    setTempComment(current || "");
  };

  const handleSaveComment = () => {
    if (!editingCommentId) return;
    setEntries((prev) =>
      prev.map((e) => (e.id === editingCommentId ? { ...e, comment: tempComment } : e)),
    );
    setEditingCommentId(null);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="rounded-xl"
              onClick={() => history.back()}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </Button>
            <div>
              <h1
                className="text-3xl font-bold text-slate-900"
                data-testid="text-client-company"
              >
                {client.company}
              </h1>
              <p className="text-sm text-slate-500" data-testid="text-client-email">
                {client.email}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-slate-100 rounded-2xl p-1">
            <TabsTrigger value="overview" className="rounded-xl" data-testid="tab-overview">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="achats-ventes" className="rounded-xl" data-testid="tab-achats-ventes">
              Achats & Ventes
            </TabsTrigger>
            <TabsTrigger value="journaux" className="rounded-xl" data-testid="tab-journaux">
              Journaux
            </TabsTrigger>
            <TabsTrigger value="encaissements" className="rounded-xl" data-testid="tab-encaissements">
              Enc / Déc
            </TabsTrigger>
            <TabsTrigger value="emails" className="rounded-xl" data-testid="tab-emails">
              Emails
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl">
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Pièces manquantes et reçues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="missing">
                      <TabsList className="bg-slate-50 rounded-2xl p-1">
                        <TabsTrigger value="missing" className="rounded-xl">
                          Manquants
                        </TabsTrigger>
                        <TabsTrigger value="all" className="rounded-xl">
                          Tous
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="missing" className="space-y-4">
                        {pendingDocs.length === 0 ? (
                          <p className="text-sm text-slate-500">Aucun document manquant.</p>
                        ) : (
                          pendingDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900">{doc.name}</h4>
                                <p className="text-sm text-slate-500">{doc.type}</p>
                              </div>
                              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-3 py-1">
                                En retard
                              </Badge>
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value="all" className="space-y-4">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{doc.name}</h4>
                              <p className="text-sm text-slate-500">{doc.type}</p>
                            </div>
                            <Badge
                              variant={doc.status === "missing" ? "destructive" : "secondary"}
                              className={
                                doc.status === "missing"
                                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border-none"
                                  : "bg-green-100 text-green-700 hover:bg-green-200 border-none"
                              }
                            >
                              {doc.status === "missing" ? "Manquant" : "Reçu"}
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
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle data-testid="title-reminders-history">Historique des Relances</CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => {
                          const rows = reminders.map((r) => {
                            const date = new Date(r.date);
                            return {
                              date: date.toLocaleDateString("fr-FR"),
                              heure: date.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                              sujet: (r.subject || "").replace(/\n/g, " "),
                              statut: r.status,
                              canaux: (r.channels?.join(", ") || r.type || "").toString(),
                            };
                          });

                          const header = ["date", "heure", "sujet", "statut", "canaux"];
                          const csv = [
                            header.join(";"),
                            ...rows.map((row) =>
                              header
                                .map((h) => {
                                  const v = String((row as any)[h] ?? "");
                                  return `\"${v.replace(/\"/g, '\"\"')}\"`;
                                })
                                .join(";"),
                            ),
                          ].join("\n");

                          const blob = new Blob([csv], {
                            type: "text/csv;charset=utf-8;",
                          });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `historique-relances-${client.company.toLowerCase().replace(/\s+/g, "-")}.csv`;
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          URL.revokeObjectURL(url);

                          toast({
                            title: "Export prêt",
                            description: `Historique exporté (${reminders.length} relance${reminders.length > 1 ? "s" : ""}).`,
                          });
                        }}
                        data-testid="button-export-reminders"
                        disabled={reminders.length === 0}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
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
                                {new Date(reminder.date).toLocaleDateString("fr-FR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}{" "}
                                •{" "}
                                {new Date(reminder.date).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                • Via{" "}
                                {reminder.channels
                                  ?.map((c: string) =>
                                    c.charAt(0).toUpperCase() + c.slice(1),
                                  )
                                  .join(", ") || reminder.type}
                              </span>
                              <Badge
                                variant="outline"
                                className={`w-fit text-[10px] px-1.5 py-0 h-5 border-slate-200 ${
                                  reminder.status === "opened"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : reminder.status === "sent"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : reminder.status === "failed"
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : ""
                                }`}
                              >
                                {reminder.status === "opened"
                                  ? "Ouvert"
                                  : reminder.status === "sent"
                                    ? "En cours"
                                    : reminder.status === "failed"
                                      ? "Échec"
                                      : reminder.status}
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

          <TabsContent
            value="achats-ventes"
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="flex items-center justify-end">
              <Button
                size="sm"
                variant={
                  selectionScope === "all-av" && selectionMode === "all"
                    ? "default"
                    : "outline"
                }
                className={`rounded-xl ${
                  selectionScope === "all-av" && selectionMode === "all"
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-white hover:bg-slate-50"
                }`}
                onClick={() => selectByMode("all-av", "all")}
                data-testid="button-select-all-av"
              >
                Tout sélectionner HA + VT
              </Button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    Achats
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={
                        selectionScope === "achats" && selectionMode === "all"
                          ? "default"
                          : "outline"
                      }
                      className={`rounded-xl ${
                        selectionScope === "achats" && selectionMode === "all"
                          ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                          : "bg-white hover:bg-slate-50 text-blue-700 border-blue-200"
                      }`}
                      onClick={() => selectByMode("achats", "all")}
                      data-testid="button-select-achats-all"
                    >
                      Tout sélectionner
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectionScope === "achats" && selectionMode === "lost"
                          ? "default"
                          : "outline"
                      }
                      className={`rounded-xl ${
                        selectionScope === "achats" && selectionMode === "lost"
                          ? "bg-amber-600 text-white hover:bg-amber-700 border-amber-600"
                          : "bg-white hover:bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                      onClick={() => selectByMode("achats", "lost")}
                      data-testid="button-select-achats-lost"
                    >
                      Perdues uniquement
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectionScope === "achats" && selectionMode === "urgent"
                          ? "default"
                          : "outline"
                      }
                      className={`rounded-xl ${
                        selectionScope === "achats" && selectionMode === "urgent"
                          ? "bg-red-600 text-white hover:bg-red-700 border-red-600"
                          : "bg-white hover:bg-red-50 text-red-700 border-red-200"
                      }`}
                      onClick={() => selectByMode("achats", "urgent")}
                      data-testid="button-select-achats-urgent"
                    >
                      Urgentes uniquement
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="font-bold text-slate-600">
                          Date
                        </TableHead>
                        <TableHead className="font-bold text-slate-600">
                          Libellé
                        </TableHead>
                        <TableHead className="text-right font-bold text-slate-600">
                          Montant
                        </TableHead>
                        <TableHead className="text-right font-bold text-slate-600 pr-6">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases
                        .filter((e) => e.status === "missing_doc")
                        .map((entry) => (
                          <TableRow
                            key={entry.id}
                            className={`border-slate-50 transition-colors ${
                              lostEntries.includes(entry.id)
                                ? "bg-amber-50"
                                : entry.isUrgent
                                  ? "bg-red-50"
                                  : "hover:bg-slate-50"
                            }`}
                          >
                            <TableCell className="pl-4">
                              <Checkbox
                                checked={selectedEntries.includes(entry.id)}
                                onCheckedChange={() => toggleEntrySelection(entry.id)}
                                data-testid={`checkbox-entry-${entry.id}`}
                              />
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {new Date(entry.date).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">
                              {entry.label}
                            </TableCell>
                            <TableCell className="text-right font-medium text-slate-700">
                              {entry.amount.toLocaleString("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              })}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 rounded-lg ${
                                    entry.isUrgent
                                      ? "text-red-600 bg-red-100 border-red-200 border"
                                      : "text-slate-300 hover:text-red-600 hover:bg-red-50"
                                  }`}
                                  onClick={() => handleToggleUrgent(entry.id)}
                                  data-testid={`button-urgent-entry-${entry.id}`}
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-8 px-2 rounded-lg border ${
                                    lostEntries.includes(entry.id)
                                      ? "text-amber-800 bg-amber-100 border-amber-200 hover:bg-amber-200"
                                      : "text-slate-500 border-slate-200 hover:text-amber-700 hover:bg-amber-50"
                                  }`}
                                  onClick={() => handleToggleLost(entry.id)}
                                  data-testid={`button-lost-entry-${entry.id}`}
                                >
                                  Perdu
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 rounded-lg ${
                                    ignoredEntries.includes(entry.id)
                                      ? "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                      : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                                  }`}
                                  onClick={() => handleIgnoreEntry(entry.id)}
                                  data-testid={`button-ignore-entry-${entry.id}`}
                                >
                                  {ignoredEntries.includes(entry.id) ? (
                                    <RotateCcw className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    Ventes
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={
                        selectionScope === "ventes" && selectionMode === "all"
                          ? "default"
                          : "outline"
                      }
                      className={`rounded-xl ${
                        selectionScope === "ventes" && selectionMode === "all"
                          ? "bg-green-600 text-white hover:bg-green-700 border-green-600"
                          : "bg-white hover:bg-slate-50 text-green-700 border-green-200"
                      }`}
                      onClick={() => selectByMode("ventes", "all")}
                      data-testid="button-select-ventes-all"
                    >
                      Tout sélectionner
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectionScope === "ventes" && selectionMode === "lost"
                          ? "default"
                          : "outline"
                      }
                      className={`rounded-xl ${
                        selectionScope === "ventes" && selectionMode === "lost"
                          ? "bg-amber-600 text-white hover:bg-amber-700 border-amber-600"
                          : "bg-white hover:bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                      onClick={() => selectByMode("ventes", "lost")}
                      data-testid="button-select-ventes-lost"
                    >
                      Perdues uniquement
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectionScope === "ventes" && selectionMode === "urgent"
                          ? "default"
                          : "outline"
                      }
                      className={`rounded-xl ${
                        selectionScope === "ventes" && selectionMode === "urgent"
                          ? "bg-red-600 text-white hover:bg-red-700 border-red-600"
                          : "bg-white hover:bg-red-50 text-red-700 border-red-200"
                      }`}
                      onClick={() => selectByMode("ventes", "urgent")}
                      data-testid="button-select-ventes-urgent"
                    >
                      Urgentes uniquement
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="font-bold text-slate-600">
                          Date
                        </TableHead>
                        <TableHead className="font-bold text-slate-600">
                          Libellé
                        </TableHead>
                        <TableHead className="text-right font-bold text-slate-600">
                          Montant
                        </TableHead>
                        <TableHead className="text-right font-bold text-slate-600 pr-6">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales
                        .filter((e) => e.status === "missing_doc")
                        .map((entry) => (
                          <TableRow
                            key={entry.id}
                            className={`border-slate-50 transition-colors ${
                              lostEntries.includes(entry.id)
                                ? "bg-amber-50"
                                : entry.isUrgent
                                  ? "bg-red-50"
                                  : "hover:bg-slate-50"
                            }`}
                          >
                            <TableCell className="pl-4">
                              <Checkbox
                                checked={selectedEntries.includes(entry.id)}
                                onCheckedChange={() => toggleEntrySelection(entry.id)}
                                data-testid={`checkbox-entry-${entry.id}`}
                              />
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {new Date(entry.date).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">
                              {entry.label}
                            </TableCell>
                            <TableCell className="text-right font-medium text-slate-700">
                              {entry.amount.toLocaleString("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              })}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 rounded-lg ${
                                    entry.isUrgent
                                      ? "text-red-600 bg-red-100 border-red-200 border"
                                      : "text-slate-300 hover:text-red-600 hover:bg-red-50"
                                  }`}
                                  onClick={() => handleToggleUrgent(entry.id)}
                                  data-testid={`button-urgent-entry-${entry.id}`}
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-8 px-2 rounded-lg border ${
                                    lostEntries.includes(entry.id)
                                      ? "text-amber-800 bg-amber-100 border-amber-200 hover:bg-amber-200"
                                      : "text-slate-500 border-slate-200 hover:text-amber-700 hover:bg-amber-50"
                                  }`}
                                  onClick={() => handleToggleLost(entry.id)}
                                  data-testid={`button-lost-entry-${entry.id}`}
                                >
                                  Perdu
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 rounded-lg ${
                                    ignoredEntries.includes(entry.id)
                                      ? "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                      : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                                  }`}
                                  onClick={() => handleIgnoreEntry(entry.id)}
                                  data-testid={`button-ignore-entry-${entry.id}`}
                                >
                                  {ignoredEntries.includes(entry.id) ? (
                                    <RotateCcw className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="journaux" className="space-y-8"></TabsContent>
          <TabsContent value="encaissements" className="space-y-8"></TabsContent>
          <TabsContent value="emails" className="space-y-6"></TabsContent>
        </Tabs>

        {(selectedEntries.length > 0 || selectedDocs.length > 0) && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-in slide-in-from-bottom-10 fade-in">
            <div className="bg-slate-900 text-white px-2 py-2 rounded-2xl shadow-2xl flex items-center gap-4 pl-6 border border-slate-700">
              <div className="text-sm font-medium">
                <span className="text-blue-400 font-bold">
                  {selectedEntries.length + selectedDocs.length} pièces sélectionnées
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="lg"
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-lg shadow-blue-900/50"
                  onClick={handleOpenReminderDialog}
                  data-testid="button-request-client"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Demander au client
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-slate-600/50 text-slate-200 hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setSelectedEntries([]);
                    setSelectedDocs([]);
                    setSelectionMode("all");
                    setSelectionScope(null);
                  }}
                  data-testid="button-cancel-selection"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}

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
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Objet
                </Label>
                <Input
                  value={newEmailContent.subject}
                  onChange={(e) =>
                    setNewEmailContent({ ...newEmailContent, subject: e.target.value })
                  }
                  className="rounded-xl border-slate-200 dark:bg-slate-950 dark:border-slate-800"
                  placeholder="Objet du message"
                  data-testid="input-new-email-subject"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Message
                </Label>
                <Textarea
                  value={newEmailContent.message}
                  onChange={(e) =>
                    setNewEmailContent({ ...newEmailContent, message: e.target.value })
                  }
                  className="min-h-[200px] bg-white dark:bg-slate-950 dark:border-slate-800 text-sm rounded-xl border-slate-200"
                  placeholder="Rédigez votre message..."
                  data-testid="textarea-new-email-message"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setNewEmailOpen(false)}
                className="rounded-xl"
                data-testid="button-new-email-cancel"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendEmail}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-new-email-send"
              >
                <Send className="mr-2 h-4 w-4" /> Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-3xl dark:bg-slate-900 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Relancer {client.company}</DialogTitle>
              <DialogDescription className="dark:text-slate-400">
                Personnalisez et envoyez vos messages via les canaux sélectionnés.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold dark:text-slate-200">Moment de l'envoi</Label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={scheduleOption === "immediate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setScheduleOption("immediate")}
                    className={`rounded-lg ${scheduleOption === "immediate" ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
                    data-testid="button-schedule-immediate"
                  >
                    Immédiat
                  </Button>
                  <Button
                    variant={scheduleOption === "d1" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setScheduleOption("d1")}
                    className={`rounded-lg ${scheduleOption === "d1" ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
                    data-testid="button-schedule-d1"
                  >
                    J+1 (Demain)
                  </Button>
                  <Button
                    variant={scheduleOption === "d2" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setScheduleOption("d2")}
                    className={`rounded-lg ${scheduleOption === "d2" ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
                    data-testid="button-schedule-d2"
                  >
                    J+2
                  </Button>
                  <Button
                    variant={scheduleOption === "custom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setScheduleOption("custom")}
                    className={`rounded-lg ${scheduleOption === "custom" ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
                    data-testid="button-schedule-custom"
                  >
                    Personnalisé
                  </Button>
                </div>

                {scheduleOption === "custom" && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <Label className="text-xs mb-1.5 block">Date et heure</Label>
                    <Input
                      type="datetime-local"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="bg-white"
                      data-testid="input-schedule-custom"
                    />
                  </div>
                )}
              </div>

              <div
                className={`border rounded-xl p-4 transition-all ${reminderChannels.email ? "border-blue-200 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-900/10" : "border-slate-200 dark:border-slate-800"}`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="email"
                    checked={reminderChannels.email}
                    onCheckedChange={(checked) =>
                      setReminderChannels({
                        ...reminderChannels,
                        email: checked as boolean,
                      })
                    }
                    data-testid="checkbox-channel-email"
                  />
                  <Label
                    htmlFor="email"
                    className="flex-1 cursor-pointer font-semibold dark:text-slate-200 flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                </div>
                {reminderChannels.email && (
                  <div className="pl-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">
                      Message Email
                    </Label>
                    <Textarea
                      value={reminderContent.email}
                      onChange={(e) =>
                        setReminderContent({
                          ...reminderContent,
                          email: appendGedLink(e.target.value),
                        })
                      }
                      className="bg-white dark:bg-slate-950 dark:border-slate-800 min-h-[120px] text-sm"
                      data-testid="textarea-reminder-email"
                    />
                  </div>
                )}
              </div>

              <div
                className={`border rounded-xl p-4 transition-all ${reminderChannels.sms ? "border-purple-200 bg-purple-50/30 dark:border-purple-900/50 dark:bg-purple-900/10" : "border-slate-200 dark:border-slate-800"}`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="sms"
                    checked={reminderChannels.sms}
                    onCheckedChange={(checked) =>
                      setReminderChannels({
                        ...reminderChannels,
                        sms: checked as boolean,
                      })
                    }
                    data-testid="checkbox-channel-sms"
                  />
                  <Label
                    htmlFor="sms"
                    className="flex-1 cursor-pointer font-semibold dark:text-slate-200 flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" /> SMS
                  </Label>
                </div>
                {reminderChannels.sms && (
                  <div className="pl-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">
                      Message SMS
                    </Label>
                    <Textarea
                      value={reminderContent.sms}
                      onChange={(e) =>
                        setReminderContent({
                          ...reminderContent,
                          sms: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-slate-950 dark:border-slate-800 min-h-[60px] text-sm"
                      maxLength={160}
                      data-testid="textarea-reminder-sms"
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">
                      {reminderContent.sms.length}/160
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`border rounded-xl p-4 transition-all ${reminderChannels.whatsapp ? "border-green-200 bg-green-50/30 dark:border-green-900/50 dark:bg-green-900/10" : "border-slate-200 dark:border-slate-800"}`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="whatsapp"
                    checked={reminderChannels.whatsapp}
                    onCheckedChange={(checked) =>
                      setReminderChannels({
                        ...reminderChannels,
                        whatsapp: checked as boolean,
                      })
                    }
                    data-testid="checkbox-channel-whatsapp"
                  />
                  <Label
                    htmlFor="whatsapp"
                    className="flex-1 cursor-pointer font-semibold dark:text-slate-200 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" /> WhatsApp
                  </Label>
                </div>
                {reminderChannels.whatsapp && (
                  <div className="pl-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">
                      Message WhatsApp
                    </Label>
                    <Textarea
                      value={reminderContent.whatsapp}
                      onChange={(e) =>
                        setReminderContent({
                          ...reminderContent,
                          whatsapp: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-slate-950 dark:border-slate-800 min-h-[80px] text-sm"
                      data-testid="textarea-reminder-whatsapp"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl border border-indigo-200/60 dark:border-indigo-900/50 bg-indigo-50/60 dark:bg-indigo-900/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold text-indigo-900 dark:text-indigo-100">
                      Séquence de relance (emails)
                    </Label>
                    <p
                      className="text-xs text-indigo-800/70 dark:text-indigo-200/70 mt-0.5"
                      data-testid="text-followup-hint"
                    >
                      Créez une suite de relances.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={followUpEnabled ? "default" : "outline"}
                    onClick={() => setFollowUpEnabled((v) => !v)}
                    className={`rounded-lg ${followUpEnabled ? "bg-indigo-700 text-white hover:bg-indigo-800" : "bg-white text-slate-600"}`}
                    data-testid="button-followup-toggle"
                  >
                    {followUpEnabled ? "Activée" : "Activer"}
                  </Button>
                </div>

                {followUpEnabled && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3">
                      {followUpSteps.map((step, idx) => {
                        const delayLabel =
                          step.delay === "d1"
                            ? "J+1"
                            : step.delay === "d3"
                              ? "J+3"
                              : step.delay === "d7"
                                ? "J+7"
                                : "Personnalisé";

                        return (
                          <div
                            key={step.id}
                            className="rounded-xl border border-indigo-200/60 dark:border-indigo-900/50 bg-white/70 dark:bg-slate-950/40 overflow-hidden"
                            data-testid={`card-followup-step-${step.id}`}
                          >
                            <div className="flex items-center justify-between px-4 py-3 bg-indigo-50/70 dark:bg-indigo-900/20">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center text-xs font-bold"
                                  data-testid={`text-followup-step-number-${step.id}`}
                                >
                                  {idx + 1}
                                </div>
                                <div
                                  className="text-sm font-semibold text-slate-900 dark:text-white"
                                  data-testid={`text-followup-step-title-${step.id}`}
                                >
                                  Relance {idx + 1}
                                </div>
                                <div
                                  className="text-xs text-slate-500 dark:text-slate-400"
                                  data-testid={`text-followup-step-delay-${step.id}`}
                                >
                                  {delayLabel}
                                  {step.delay === "custom" && step.customDate
                                    ? ` (${step.customDate})`
                                    : ""}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg"
                                  onClick={() => {
                                    setFollowUpSteps((prev) =>
                                      prev.filter((s) => s.id !== step.id),
                                    );
                                  }}
                                  data-testid={`button-followup-remove-${step.id}`}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </div>

                            <div className="p-4 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {([
                                  "d1",
                                  "d3",
                                  "d7",
                                  "custom",
                                ] as FollowUpDelay[]).map((opt) => (
                                  <Button
                                    key={opt}
                                    size="sm"
                                    variant={step.delay === opt ? "default" : "outline"}
                                    onClick={() => {
                                      setFollowUpSteps((prev) =>
                                        prev.map((s) =>
                                          s.id === step.id
                                            ? { ...s, delay: opt }
                                            : s,
                                        ),
                                      );
                                    }}
                                    className={`rounded-lg ${step.delay === opt ? "bg-indigo-700 text-white hover:bg-indigo-800" : "bg-white text-slate-600"}`}
                                    data-testid={`button-followup-delay-${step.id}-${opt}`}
                                  >
                                    {opt === "d1"
                                      ? "J+1"
                                      : opt === "d3"
                                        ? "J+3"
                                        : opt === "d7"
                                          ? "J+7"
                                          : "Personnalisé"}
                                  </Button>
                                ))}
                              </div>

                              {step.delay === "custom" && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                  <Label className="text-xs mb-1.5 block">
                                    Date et heure
                                  </Label>
                                  <Input
                                    type="datetime-local"
                                    value={step.customDate || ""}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setFollowUpSteps((prev) =>
                                        prev.map((s) =>
                                          s.id === step.id
                                            ? { ...s, customDate: v }
                                            : s,
                                        ),
                                      );
                                    }}
                                    className="bg-white"
                                    data-testid={`input-followup-custom-${step.id}`}
                                  />
                                </div>
                              )}

                              <div>
                                <Label className="text-xs text-slate-500 dark:text-slate-400">
                                  Objet
                                </Label>
                                <Input
                                  value={step.subject}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setFollowUpSteps((prev) =>
                                      prev.map((s) =>
                                        s.id === step.id ? { ...s, subject: v } : s,
                                      ),
                                    );
                                  }}
                                  className="bg-white dark:bg-slate-950 dark:border-slate-800 mt-1"
                                  data-testid={`input-followup-subject-${step.id}`}
                                />
                              </div>

                              <div>
                                <Label className="text-xs text-slate-500 dark:text-slate-400">
                                  Email
                                </Label>
                                <Textarea
                                  value={step.body}
                                  onChange={(e) => {
                                    const v = appendGedLink(e.target.value);
                                    setFollowUpSteps((prev) =>
                                      prev.map((s) =>
                                        s.id === step.id ? { ...s, body: v } : s,
                                      ),
                                    );
                                  }}
                                  className="bg-white dark:bg-slate-950 dark:border-slate-800 min-h-[120px] text-sm mt-1"
                                  data-testid={`textarea-followup-body-${step.id}`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                      <p
                        className="text-xs text-indigo-900/70 dark:text-indigo-200/70"
                        data-testid="text-followup-count"
                      >
                        {followUpSteps.length} étape{followUpSteps.length > 1 ? "s" : ""}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg bg-white/80"
                        onClick={() => {
                          if (followUpSteps.length >= 5) return;
                          setFollowUpSteps((prev) => [
                            ...prev,
                            {
                              id: crypto.randomUUID(),
                              delay: "d3",
                              subject: `Rappel — pièces comptables manquantes`,
                              body: appendGedLink(
                                `Bonjour,\n\nPetit rappel concernant les pièces comptables demandées.\n\nMerci d'avance.\n\nCordialement,\nVotre Expert-Comptable`,
                              ),
                            },
                          ]);
                        }}
                        disabled={followUpSteps.length >= 5}
                        data-testid="button-followup-add-step"
                      >
                        Ajouter une relance
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setReminderDialogOpen(false)}
                className="rounded-xl dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                data-testid="button-reminder-cancel"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendEntryReminder}
                className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                data-testid="button-reminder-send"
              >
                <Send className="mr-2 h-4 w-4" /> Envoyer
                {Object.values(reminderChannels).filter(Boolean).length > 0
                  ? `(${Object.values(reminderChannels).filter(Boolean).length})`
                  : ""}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={journalChannelModalOpen}
          onOpenChange={setJournalChannelModalOpen}
        >
          <DialogContent className="sm:max-w-[600px] rounded-3xl dark:bg-slate-900 dark:border-slate-800 max-h-[85vh] overflow-y-auto"></DialogContent>
        </Dialog>

        <Dialog
          open={!!editingCommentId}
          onOpenChange={(open) => !open && setEditingCommentId(null)}
        >
          <DialogContent className="sm:max-w-[425px] rounded-3xl p-6"></DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
