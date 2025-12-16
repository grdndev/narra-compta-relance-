import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAccountingEntries, mockClients, mockReminders, mockDocuments } from "@/lib/mockData";
import { 
  ArrowUpRight, AlertCircle, Filter, Search, Eye, Send, 
  MessageSquare, Bird, Settings2, Trash2, CheckSquare, Square,
  Activity, Clock, Mail
} from "lucide-react";
import { useState } from "react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const weeklyData = [
  { name: 'Lun', sent: 4, opened: 2 },
  { name: 'Mar', sent: 7, opened: 4 },
  { name: 'Mer', sent: 5, opened: 3 },
  { name: 'Jeu', sent: 12, opened: 8 },
  { name: 'Ven', sent: 9, opened: 6 },
  { name: 'Sam', sent: 2, opened: 1 },
  { name: 'Dim', sent: 0, opened: 0 },
];

const COLORS = ['hsl(225 73% 57%)', 'hsl(48 96% 53%)', 'hsl(150 60% 45%)', 'hsl(340 80% 65%)', 'hsl(260 60% 65%)'];

export default function Dashboard() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"achats-ventes" | "journaux" | "encaissements">("achats-ventes");
  const [minAmount, setMinAmount] = useState<number>(0);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [ignoredEntries, setIgnoredEntries] = useState<string[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [sectorFilter, setSectorFilter] = useState("All");

  // Overview Data Calculation
  const filteredClients = sectorFilter === "All" 
    ? mockClients 
    : mockClients.filter(c => c.sector === sectorFilter);
  const totalClients = filteredClients.length;
  const overviewPendingDocs = mockDocuments.filter(d => 
    d.status === 'missing' && filteredClients.map(c => c.id).includes(d.clientId)
  ).length;
  const overviewRemindersSent = mockReminders.filter(r => 
    (r.status === 'sent' || r.status === 'opened') && filteredClients.map(c => c.id).includes(r.clientId)
  ).length;
  const sectorData = Array.from(new Set(mockClients.map(c => c.sector))).map(sector => ({
    name: sector,
    value: mockClients.filter(c => c.sector === sector).length
  }));
  const uniqueSectors = Array.from(new Set(mockClients.map(c => c.sector)));

  // Accounting Analysis Data Calculation
  const activeEntries = mockAccountingEntries.filter(e => !ignoredEntries.includes(e.id));
  const filteredEntries = activeEntries.filter(e => e.amount >= minAmount);
  const missingDocsCount = filteredEntries.length;
  const missingAmount = filteredEntries.reduce((sum, e) => sum + e.amount, 0);

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

  return (
    <Layout>
      <div className="space-y-12">
        {/* =========================================
            SECTION 1: VUE D'ENSEMBLE (OVERVIEW)
           ========================================= */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Vue d'ensemble</h1>
              <p className="text-slate-500 mt-1 font-medium">Pilotage global du cabinet</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
               <Filter className="h-4 w-4 text-slate-500" />
               <Select value={sectorFilter} onValueChange={setSectorFilter}>
                 <SelectTrigger className="border-none h-auto p-0 focus:ring-0 w-[150px] font-medium text-slate-700">
                   <SelectValue placeholder="Tous secteurs" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-slate-100 shadow-lg">
                   <SelectItem value="All" className="rounded-lg cursor-pointer">Tous secteurs</SelectItem>
                   {uniqueSectors.map(s => (
                     <SelectItem key={s} value={s} className="rounded-lg cursor-pointer">{s}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Clients Actifs</CardTitle>
                <div className="p-2 bg-blue-50 rounded-xl">
                   <Activity className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-slate-800">{totalClients}</div>
                <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1">
                  <span className="text-green-500 bg-green-50 px-1.5 py-0.5 rounded-md">↑ 2%</span> ce mois
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 bg-gradient-to-br from-red-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-red-500 uppercase tracking-wider">Docs Manquants</CardTitle>
                <div className="p-2 bg-white rounded-xl shadow-sm">
                   <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-red-600">{overviewPendingDocs}</div>
                <p className="text-xs font-medium text-red-400 mt-2">Nécessitent une relance</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Relances</CardTitle>
                <div className="p-2 bg-purple-50 rounded-xl">
                   <Clock className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-slate-800">{overviewRemindersSent}</div>
                <p className="text-xs font-medium text-slate-400 mt-2">Envoyées cette semaine</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Taux d'Ouverture</CardTitle>
                <div className="p-2 bg-green-50 rounded-xl">
                   <ArrowUpRight className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-slate-800">68%</div>
                <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1">
                   <span className="text-green-500 bg-green-50 px-1.5 py-0.5 rounded-md">↑ 4%</span> vs sem. dernière
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
             <Card className="col-span-4 rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
               <CardHeader>
                 <CardTitle className="text-lg font-bold text-slate-800">Activité des Relances</CardTitle>
               </CardHeader>
               <CardContent className="pl-2">
                 <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={weeklyData} barGap={8}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                       <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                       <Tooltip cursor={{fill: '#f8fafc', radius: 8}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                       <Bar dataKey="sent" name="Envoyés" fill="hsl(225 73% 57%)" radius={[6, 6, 6, 6]} barSize={20} />
                       <Bar dataKey="opened" name="Ouverts" fill="hsl(48 96% 53%)" radius={[6, 6, 6, 6]} barSize={20} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </CardContent>
             </Card>

             <Card className="col-span-3 rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
               <CardHeader>
                 <CardTitle className="text-lg font-bold text-slate-800">Répartition par Secteur</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" cornerRadius={6}>
                         {sectorData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                         ))}
                       </Pie>
                       <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                       <Legend verticalAlign="bottom" height={36} iconType="circle" />
                     </PieChart>
                   </ResponsiveContainer>
                  </div>
               </CardContent>
             </Card>
          </div>
        </div>

        <div className="border-t border-slate-200"></div>

        {/* =========================================
            SECTION 2: PILOTAGE COMPTABLE (NEW)
           ========================================= */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Analyse des Pièces</h2>
              <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                Période d'analyse : 01/10/2023 - 31/10/2023
              </p>
            </div>
            
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
          </div>

          {/* View Switcher */}
          <div className="flex justify-center">
            <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-full max-w-3xl">
              <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-white border border-slate-200 shadow-sm">
                <TabsTrigger value="achats-ventes" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Achats / Ventes</TabsTrigger>
                <TabsTrigger value="journaux" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Journaux</TabsTrigger>
                <TabsTrigger value="encaissements" className="rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Encaissements / Décaissements</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Missing Docs Section */}
            <Card className="rounded-3xl border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-gradient-to-br from-red-50/50 to-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertCircle className="h-24 w-24 text-red-500 transform rotate-12" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  Pièces Manquantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-4xl font-extrabold text-slate-800">{missingDocsCount}</p>
                    <p className="text-slate-500 font-medium">justificatifs à réclamer</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{missingAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                    <p className="text-slate-400 text-sm">montant total non justifié</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Received Docs Section */}
            <Card className="rounded-3xl border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-gradient-to-br from-green-50/50 to-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckSquare className="h-24 w-24 text-green-500 transform -rotate-12" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  Pièces Reçues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-4xl font-extrabold text-slate-800">124</p>
                    <p className="text-slate-500 font-medium">justificatifs traités</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{(45230.50).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                    <p className="text-slate-400 text-sm">montant total justifié</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content based on View Mode */}
          {viewMode === "achats-ventes" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ACHATS Section */}
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

              {/* VENTES Section */}
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
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        </div>

        {/* Action Bar */}
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
