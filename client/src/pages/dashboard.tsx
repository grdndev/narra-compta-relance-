import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClients, mockDocuments, mockReminders, mockAccountingEntries } from "@/lib/mockData";
import { ArrowUpRight, AlertCircle, Filter, Activity, Clock, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  const filteredClients = sectorFilter === "All" 
    ? mockClients 
    : mockClients.filter(c => c.sector === sectorFilter);

  const totalClients = filteredClients.length;
  
  // Calculate docs for filtered clients only
  const pendingDocs = mockDocuments.filter(d => 
    d.status === 'missing' && filteredClients.map(c => c.id).includes(d.clientId)
  ).length;

  const remindersSent = mockReminders.filter(r => 
    (r.status === 'sent' || r.status === 'opened') && filteredClients.map(c => c.id).includes(r.clientId)
  ).length;

  // Identify clients needing attention (urgent entries or high pending docs)
  const urgentClients = filteredClients.filter(client => {
    const clientEntries = mockAccountingEntries.filter(e => e.clientId === client.id && e.isUrgent);
    return client.pendingDocs > 2 || clientEntries.length > 0;
  }).slice(0, 3); // Top 3

  // Sector Data for Pie Chart
  const sectorData = Array.from(new Set(mockClients.map(c => c.sector))).map(sector => ({
    name: sector,
    value: mockClients.filter(c => c.sector === sector).length
  }));

  const uniqueSectors = Array.from(new Set(mockClients.map(c => c.sector)));

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Bonjour, Cabinet ! 👋</h1>
            <p className="text-slate-500 mt-1 font-medium">Vue d'ensemble de l'activité.</p>
          </div>
          <div className="flex items-center gap-3">
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
        </div>

        {/* Clients Needing Attention Section */}
        {urgentClients.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Clients nécessitant une attention
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {urgentClients.map(client => {
                 const urgentCount = mockAccountingEntries.filter(e => e.clientId === client.id && e.isUrgent).length;
                 return (
                  <Link key={client.id} href={`/clients/${client.id}`}>
                    <Card className="rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group bg-gradient-to-br from-red-50/30 to-white">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-lg font-bold text-slate-700 group-hover:bg-red-500 group-hover:text-white transition-colors">
                              {client.company.charAt(0)}
                           </div>
                           <Badge variant="destructive" className="bg-red-100 text-red-600 hover:bg-red-200 border-none">
                              Action requise
                           </Badge>
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{client.company}</h3>
                        <div className="flex flex-col gap-1 mt-2 text-sm text-slate-500">
                           {client.pendingDocs > 0 && (
                             <span className="flex items-center gap-1.5 text-red-600 font-medium">
                               <AlertCircle className="h-3.5 w-3.5" /> {client.pendingDocs} docs manquants
                             </span>
                           )}
                           {urgentCount > 0 && (
                             <span className="flex items-center gap-1.5 text-orange-600 font-medium">
                               <Clock className="h-3.5 w-3.5" /> {urgentCount} écritures urgentes
                             </span>
                           )}
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                          Gérer le dossier <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                 );
              })}
            </div>
          </div>
        )}

        {/* KPI Cards */}
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
              <div className="text-3xl font-extrabold text-red-600">{pendingDocs}</div>
              <p className="text-xs font-medium text-red-400 mt-2">
                Nécessitent une relance
              </p>
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
              <div className="text-3xl font-extrabold text-slate-800">{remindersSent}</div>
              <p className="text-xs font-medium text-slate-400 mt-2">
                Envoyées cette semaine
              </p>
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
          {/* Main Chart */}
          <Card className="col-span-4 rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800">Activité des Relances</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                      cursor={{fill: '#f8fafc', radius: 8}}
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
          <Card className="col-span-3 rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800">Répartition par Secteur</CardTitle>
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
                      formatter={(value) => <span className="text-sm font-medium text-slate-600 ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
