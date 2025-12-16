import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClients, mockDocuments, mockReminders } from "@/lib/mockData";
import { useRoute } from "wouter";
import { 
  ArrowLeft, Mail, Phone, Building2, Calendar, 
  AlertCircle, CheckCircle2, History, Send 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function ClientDetail() {
  const [match, params] = useRoute("/clients/:id");
  const { toast } = useToast();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  
  const client = mockClients.find(c => c.id === params?.id);
  const documents = mockDocuments.filter(d => d.clientId === params?.id);
  const reminders = mockReminders.filter(r => r.clientId === params?.id);

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

  const toggleDocSelection = (docId: string) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
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
            <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={handleSendReminder}>
              <Send className="h-4 w-4 mr-2" />
              Relancer le client
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Gérez l'état des pièces comptables attendues.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="missing" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="missing" className="gap-2">
                      Manquants <Badge variant="secondary" className="bg-orange-100 text-orange-800 ml-1">{pendingDocs.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="all">Tous les documents</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="missing" className="space-y-4">
                    {pendingDocs.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                        <p>Tout est à jour ! Aucun document manquant.</p>
                      </div>
                    ) : (
                      pendingDocs.map(doc => (
                        <div key={doc.id} className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <Checkbox 
                            checked={selectedDocs.includes(doc.id)}
                            onCheckedChange={() => toggleDocSelection(doc.id)}
                            className="mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-slate-900">{doc.name}</h4>
                              <Badge variant="outline" className="text-xs font-normal">Compte {doc.accountCode}</Badge>
                            </div>
                            <p className="text-sm text-slate-500">
                              Échéance : {new Date(doc.dueDate).toLocaleDateString('fr-FR')} • {doc.type}
                            </p>
                          </div>
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
                            En retard
                          </Badge>
                        </div>
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="all" className="space-y-4">
                    {documents.map(doc => (
                       <div key={doc.id} className="flex items-center p-4 border border-slate-200 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{doc.name}</h4>
                            <p className="text-sm text-slate-500">{doc.type}</p>
                          </div>
                          <Badge variant={doc.status === 'missing' ? 'destructive' : 'secondary'} className={doc.status === 'missing' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}>
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
            <Card>
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
                          <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 h-5">
                            {reminder.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white border-none">
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
