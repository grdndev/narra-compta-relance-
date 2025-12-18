import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClients, mockDocuments, mockReminders, mockAccountingEntries, mockCampaigns } from "@/lib/mockData";
import { ArrowUpRight, AlertCircle, Filter, Activity, Clock, ChevronRight, Calendar as CalendarIcon, Mail, Send, CheckCircle2, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addDays, format, subDays, isWithinInterval, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [sectorFilter, setSectorFilter] = useState("All");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 3),
    to: new Date(),
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Dialog States
  const [activeClientsOpen, setActiveClientsOpen] = useState(false);
  const [missingDocsOpen, setMissingDocsOpen] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [openRateOpen, setOpenRateOpen] = useState(false);

  // Email Modal State (inside Missing Docs)
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedMissingDocs, setSelectedMissingDocs] = useState<string[]>([]);
  const [emailContent, setEmailContent] = useState("Bonjour,\n\nSauf erreur de notre part, nous n'avons pas reçu les documents suivants...\n\nCordialement,");

  // Filtering Logic
  const isInDateRange = (dateString: string) => {
    if (!date?.from || !date?.to) return true;
    const d = parseISO(dateString);
    return isWithinInterval(d, { start: date.from, end: date.to });
  };

  const filteredClients = mockClients.filter(c => {
    const sectorMatch = sectorFilter === "All" || c.sector === sectorFilter;
    // For clients, we might filter by lastContact if we want to show "active in period", 
    // but typically "Active Clients" means status='active'. 
    // Let's stick to status='active' AND sector match.
    return sectorMatch && c.status === 'active';
  });

  const totalClients = filteredClients.length;
  
  const filteredDocs = mockDocuments.filter(d => 
    d.status === 'missing' && 
    filteredClients.map(c => c.id).includes(d.clientId) &&
    // Check due date or just assume all missing are relevant? 
    // Let's filter by due date roughly falling in range or recently overdue
    (isInDateRange(d.dueDate) || new Date(d.dueDate) < new Date()) 
  );
  
  const pendingDocs = filteredDocs.length;

  const filteredReminders = mockReminders.filter(r => 
    (r.status === 'sent' || r.status === 'opened') && 
    filteredClients.map(c => c.id).includes(r.clientId) &&
    isInDateRange(r.date)
  );

  const remindersSent = filteredReminders.length;

  // Open Rate Logic
  const campaignsInRange = mockCampaigns.filter(c => 
    c.status === 'sent' && c.sentDate && isInDateRange(c.sentDate)
  );
  const avgOpenRate = campaignsInRange.length > 0 
    ? Math.round(campaignsInRange.reduce((acc, c) => acc + (c.openRate || 0), 0) / campaignsInRange.length) 
    : 68; // Default fallback

  // Identify clients needing attention (Top 10)
  const urgentClients = filteredClients.filter(client => {
    const clientEntries = mockAccountingEntries.filter(e => e.clientId === client.id && e.isUrgent);
    return client.pendingDocs > 0 || clientEntries.length > 0;
  })
  .sort((a, b) => b.pendingDocs - a.pendingDocs)
  .slice(0, 10);

  // Sector Data for Pie Chart
  const sectorData = Array.from(new Set(mockClients.map(c => c.sector))).map(sector => ({
    name: sector,
    value: mockClients.filter(c => c.sector === sector).length
  }));

  const uniqueSectors = Array.from(new Set(mockClients.map(c => c.sector)));

  const handleSendMissingDocsEmail = () => {
    toast({
      title: "Email envoyé",
      description: `La relance pour ${selectedMissingDocs.length} documents a été envoyée.`,
      className: "bg-green-600 text-white border-none"
    });
    setEmailModalOpen(false);
    setSelectedMissingDocs([]);
    setMissingDocsOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Bonjour, Cabinet ! 👋</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Vue d'ensemble de l'activité.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
             {/* Date Picker */}
             <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[260px] justify-start text-left font-normal rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "d LLL", { locale: fr })} -{" "}
                          {format(date.to, "d LLL", { locale: fr })}
                        </>
                      ) : (
                        format(date.from, "d LLL, y", { locale: fr })
                      )
                    ) : (
                      <span>Choisir une période</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

             <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
               <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
               <Select value={sectorFilter} onValueChange={setSectorFilter}>
                 <SelectTrigger className="border-none h-auto p-0 focus:ring-0 w-[150px] font-medium text-slate-700 dark:text-slate-300 bg-transparent">
                   <SelectValue placeholder="Tous secteurs" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 dark:bg-slate-900 shadow-lg">
                   <SelectItem value="All" className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800">Tous secteurs</SelectItem>
                   {uniqueSectors.map(s => (
                     <SelectItem key={s} value={s} className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800">{s}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer dark:bg-slate-900"
            onClick={() => setActiveClientsOpen(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clients Actifs</CardTitle>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                 <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{totalClients}</div>
              <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1">
                <span className="text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md">↑ 2%</span> ce mois
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-slate-900 cursor-pointer"
            onClick={() => setMissingDocsOpen(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wider">Docs Manquants</CardTitle>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                 <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-red-600 dark:text-red-400">{pendingDocs}</div>
              <p className="text-xs font-medium text-red-400 mt-2">
                Nécessitent une relance
              </p>
            </CardContent>
          </Card>

          <Card 
            className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer dark:bg-slate-900"
            onClick={() => setRemindersOpen(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Relances</CardTitle>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                 <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{remindersSent}</div>
              <p className="text-xs font-medium text-slate-400 mt-2">
                Envoyées sur la période
              </p>
            </CardContent>
          </Card>

          <Card 
            className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer dark:bg-slate-900"
            onClick={() => setOpenRateOpen(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Taux d'Ouverture</CardTitle>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                 <ArrowUpRight className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{avgOpenRate}%</div>
              <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1">
                 <span className="text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md">↑ 4%</span> vs période préc.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart */}
          <Card className="col-span-4 rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Activité des Relances</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent', radius: 8}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="sent" name="Envoyés" fill="hsl(225 73% 57%)" radius={[6, 6, 6, 6]} barSize={20} />
                    <Bar dataKey="opened" name="Ouverts" fill="hsl(48 96% 53%)" radius={[6, 6, 6, 6]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sector Distribution */}
          <Card className="col-span-3 rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Répartition par Secteur</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                      cornerRadius={6}
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients Needing Attention List - Top 10 */}
        {urgentClients.length > 0 && (
          <Card className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500 dark:bg-slate-900">
            <CardHeader>
               <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                 <AlertCircle className="h-5 w-5 text-red-500" />
                 Clients nécessitant une attention (Top 10)
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urgentClients.map(client => {
                   const clientEntries = mockAccountingEntries.filter(e => e.clientId === client.id && e.status === 'missing_doc');
                   const totalAmount = clientEntries.reduce((sum, e) => sum + e.amount, 0);
                   
                   return (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-lg font-bold text-slate-700 dark:text-slate-200">
                            {client.company.charAt(0)}
                         </div>
                         <div>
                           <h4 className="font-bold text-slate-900 dark:text-white">{client.company}</h4>
                           <p className="text-sm text-slate-500 dark:text-slate-400">{client.name}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pièces manquantes</p>
                          <p className="text-lg font-bold text-red-600 dark:text-red-400">{client.pendingDocs}</p>
                        </div>
                        <div className="text-right w-32">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Montant total</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </p>
                        </div>
                        <Link href={`/clients/${client.id}`}>
                          <Button variant="ghost" size="icon" className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                   );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog: Clients Actifs */}
      <Dialog open={activeClientsOpen} onOpenChange={setActiveClientsOpen}>
        <DialogContent className="max-w-4xl rounded-3xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold dark:text-white">Clients Actifs</DialogTitle>
            <DialogDescription className="dark:text-slate-400">Liste de tous vos clients actifs.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[600px] overflow-auto">
             <Table>
               <TableHeader>
                 <TableRow className="dark:border-slate-800 hover:bg-transparent">
                   <TableHead className="dark:text-slate-400">Entreprise</TableHead>
                   <TableHead className="dark:text-slate-400">Contact</TableHead>
                   <TableHead className="dark:text-slate-400">Secteur</TableHead>
                   <TableHead className="dark:text-slate-400">Dernier Contact</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredClients.map(client => (
                   <TableRow 
                      key={client.id} 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 dark:border-slate-800"
                      onClick={() => setLocation(`/clients/${client.id}`)}
                   >
                     <TableCell className="font-bold dark:text-white">{client.company}</TableCell>
                     <TableCell className="dark:text-slate-300">{client.name}</TableCell>
                     <TableCell><Badge variant="outline" className="dark:border-slate-700 dark:text-slate-300">{client.sector}</Badge></TableCell>
                     <TableCell className="dark:text-slate-400">{new Date(client.lastContact).toLocaleDateString('fr-FR')}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Docs Manquants */}
      <Dialog open={missingDocsOpen} onOpenChange={setMissingDocsOpen}>
        <DialogContent className="max-w-4xl rounded-3xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold dark:text-white">Documents Manquants</DialogTitle>
            <DialogDescription className="dark:text-slate-400">Sélectionnez les documents pour envoyer une relance groupée.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[600px] overflow-auto py-4">
             {filteredDocs.length === 0 ? (
               <div className="text-center py-8 text-slate-500 dark:text-slate-400">Aucun document manquant sur cette période.</div>
             ) : (
               <Table>
                 <TableHeader>
                   <TableRow className="dark:border-slate-800 hover:bg-transparent">
                     <TableHead className="w-12">
                       <Checkbox 
                         checked={selectedMissingDocs.length === filteredDocs.length && filteredDocs.length > 0}
                         onCheckedChange={() => {
                           if (selectedMissingDocs.length === filteredDocs.length) setSelectedMissingDocs([]);
                           else setSelectedMissingDocs(filteredDocs.map(d => d.id));
                         }}
                         className="dark:border-slate-600 dark:data-[state=checked]:bg-blue-600"
                       />
                     </TableHead>
                     <TableHead className="dark:text-slate-400">Client</TableHead>
                     <TableHead className="dark:text-slate-400">Document</TableHead>
                     <TableHead className="dark:text-slate-400">Échéance</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredDocs.map(doc => {
                     const client = mockClients.find(c => c.id === doc.clientId);
                     return (
                       <TableRow key={doc.id} className="dark:border-slate-800">
                         <TableCell>
                           <Checkbox 
                             checked={selectedMissingDocs.includes(doc.id)}
                             onCheckedChange={(checked) => {
                               if (checked) setSelectedMissingDocs([...selectedMissingDocs, doc.id]);
                               else setSelectedMissingDocs(selectedMissingDocs.filter(id => id !== doc.id));
                             }}
                             className="dark:border-slate-600 dark:data-[state=checked]:bg-blue-600"
                           />
                         </TableCell>
                         <TableCell className="font-medium dark:text-white">{client?.company}</TableCell>
                         <TableCell className="dark:text-slate-300">
                           {doc.name}
                           <Badge variant="secondary" className="ml-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">Manquant</Badge>
                         </TableCell>
                         <TableCell className="dark:text-slate-400">{new Date(doc.dueDate).toLocaleDateString('fr-FR')}</TableCell>
                       </TableRow>
                     );
                   })}
                 </TableBody>
               </Table>
             )}
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
             <Button 
                onClick={() => setEmailModalOpen(true)} 
                disabled={selectedMissingDocs.length === 0}
                className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
             >
               <Mail className="mr-2 h-4 w-4" /> Envoyer Relance ({selectedMissingDocs.length})
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Relances */}
      <Dialog open={remindersOpen} onOpenChange={setRemindersOpen}>
        <DialogContent className="max-w-4xl rounded-3xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold dark:text-white">Historique des Relances</DialogTitle>
            <DialogDescription className="dark:text-slate-400">Historique des emails et SMS envoyés sur la période.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[600px] overflow-auto">
             <Table>
               <TableHeader>
                 <TableRow className="dark:border-slate-800 hover:bg-transparent">
                   <TableHead className="dark:text-slate-400">Date</TableHead>
                   <TableHead className="dark:text-slate-400">Client</TableHead>
                   <TableHead className="dark:text-slate-400">Sujet</TableHead>
                   <TableHead className="dark:text-slate-400">Statut</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredReminders.map(reminder => {
                    const client = mockClients.find(c => c.id === reminder.clientId);
                    return (
                     <TableRow key={reminder.id} className="dark:border-slate-800">
                       <TableCell className="dark:text-slate-300">{new Date(reminder.date).toLocaleDateString('fr-FR')}</TableCell>
                       <TableCell className="font-bold dark:text-white">{client?.company}</TableCell>
                       <TableCell className="dark:text-slate-300">{reminder.subject}</TableCell>
                       <TableCell>
                         {reminder.status === 'opened' ? (
                           <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 border-none">Ouvert</Badge>
                         ) : (
                           <Badge variant="outline" className="text-slate-500 dark:text-slate-400 dark:border-slate-700">Envoyé</Badge>
                         )}
                       </TableCell>
                     </TableRow>
                    );
                 })}
               </TableBody>
             </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Taux d'Ouverture */}
      <Dialog open={openRateOpen} onOpenChange={setOpenRateOpen}>
        <DialogContent className="max-w-4xl rounded-3xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold dark:text-white">Taux d'Ouverture</DialogTitle>
            <DialogDescription className="dark:text-slate-400">Détail des campagnes et ouvertures.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[600px] overflow-auto">
             <div className="space-y-6">
               {campaignsInRange.map(campaign => (
                 <div key={campaign.id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-bold text-lg dark:text-white">{campaign.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Envoyé le {new Date(campaign.sentDate!).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{campaign.openRate}%</div>
                        <p className="text-xs text-slate-400">Taux d'ouverture</p>
                      </div>
                    </div>
                    {/* Mock list of recipients who haven't opened */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                      <h5 className="font-semibold mb-2 dark:text-slate-200 text-sm flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" /> N'ont pas ouvert (3 clients)
                      </h5>
                      <div className="space-y-2">
                        {mockClients.slice(0, 3).map(c => (
                          <div key={c.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                             <span className="text-sm dark:text-slate-300">{c.company}</span>
                             <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                               Relancer
                             </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
               ))}
               {campaignsInRange.length === 0 && (
                 <p className="text-center text-slate-500 dark:text-slate-400 py-8">Aucune campagne sur cette période.</p>
               )}
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Dialog: Edit Email */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Modifier l'email de relance</DialogTitle>
            <DialogDescription className="dark:text-slate-400">Personnalisez le message avant l'envoi.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
             <Label className="mb-2 block dark:text-slate-300">Message</Label>
             <Textarea 
               value={emailContent}
               onChange={(e) => setEmailContent(e.target.value)}
               className="min-h-[200px] dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
             />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEmailModalOpen(false)} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Annuler</Button>
            <Button onClick={handleSendMissingDocsEmail} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700">
              <Send className="mr-2 h-4 w-4" /> Envoyer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
