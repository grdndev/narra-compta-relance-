import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw, Link2, AlertCircle } from "lucide-react";

export default function Connectors() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Connecteurs</h1>
          <p className="text-slate-500 mt-2">Gérez la connexion avec votre logiciel comptable pour la synchronisation automatique.</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                    <span className="font-bold text-slate-700">SC</span>
                  </div>
                  <div>
                    <CardTitle>Sage Coala</CardTitle>
                    <CardDescription>Connexion active • Dernière synchro : il y a 5 min</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Connecté
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border-t border-blue-100 pt-4 mt-2">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">142</span> écritures synchronisées aujourd'hui.
                </div>
                <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50">
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Forcer la synchronisation
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-75 grayscale hover:grayscale-0 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                    <span className="font-bold text-green-600">QB</span>
                  </div>
                  <div>
                    <CardTitle>Quickbooks</CardTitle>
                    <CardDescription>Connecteur disponible</CardDescription>
                  </div>
                </div>
                <Button variant="outline">Connecter</Button>
              </div>
            </CardHeader>
          </Card>

          <Card className="opacity-75 grayscale hover:grayscale-0 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                    <span className="font-bold text-blue-600">C</span>
                  </div>
                  <div>
                    <CardTitle>Cegid</CardTitle>
                    <CardDescription>Connecteur disponible</CardDescription>
                  </div>
                </div>
                <Button variant="outline">Connecter</Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex gap-3">
           <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
           <div className="space-y-1">
             <h4 className="text-sm font-medium text-orange-900">Information importante</h4>
             <p className="text-sm text-orange-700">
               La synchronisation est en lecture seule. Aucune écriture ne sera modifiée dans votre logiciel comptable.
             </p>
           </div>
        </div>
      </div>
    </Layout>
  );
}
