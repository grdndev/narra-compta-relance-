import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockClients, mockDocuments, mockReminders } from "@/lib/mockData";
import { ArrowUpRight, Clock, AlertCircle, CheckCircle2, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Lun', sent: 4, opened: 2 },
  { name: 'Mar', sent: 7, opened: 4 },
  { name: 'Mer', sent: 5, opened: 3 },
  { name: 'Jeu', sent: 12, opened: 8 },
  { name: 'Ven', sent: 9, opened: 6 },
  { name: 'Sam', sent: 2, opened: 1 },
  { name: 'Dim', sent: 0, opened: 0 },
];

export default function Dashboard() {
  const totalClients = mockClients.length;
  const pendingDocs = mockDocuments.filter(d => d.status === 'missing').length;
  const remindersSent = mockReminders.filter(r => r.status === 'sent' || r.status === 'opened').length;
  
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Tableau de Bord</h1>
          <p className="text-slate-500 mt-2">Aperçu de l'activité du cabinet et des relances en cours.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Clients Actifs</CardTitle>
              <UsersIcon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalClients}</div>
              <p className="text-xs text-slate-500 mt-1">+2 depuis le mois dernier</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow border-orange-200 bg-orange-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Documents Manquants</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{pendingDocs}</div>
              <p className="text-xs text-orange-600 mt-1">Nécessitent une relance</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Relances Envoyées</CardTitle>
              <MailIcon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{remindersSent}</div>
              <p className="text-xs text-slate-500 mt-1">Cette semaine</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Taux d'Ouverture</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">68%</div>
              <p className="text-xs text-slate-500 mt-1">+4% vs semaine dernière</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Chart */}
          <Card className="col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle>Activité des Relances</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="sent" name="Envoyés" fill="hsl(215 40% 20%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="opened" name="Ouverts" fill="hsl(210 60% 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity / Missing Docs Preview */}
          <Card className="col-span-3 shadow-sm">
            <CardHeader>
              <CardTitle>Documents en Retard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockDocuments.filter(d => d.status === 'missing').slice(0, 5).map((doc) => {
                  const client = mockClients.find(c => c.id === doc.clientId);
                  return (
                    <div key={doc.id} className="flex items-start justify-between group">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-slate-900 group-hover:text-blue-600 transition-colors">
                          {doc.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {client?.company} • Échéance : {new Date(doc.dueDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                          J+{Math.floor((Date.now() - new Date(doc.dueDate).getTime()) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6">
                <Link href="/clients">
                  <Button variant="outline" className="w-full">Voir tous les documents manquants</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
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

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
