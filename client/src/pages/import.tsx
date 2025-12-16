import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function ImportFEC() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleUpload = () => {
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsComplete(true);
          toast({
            title: "Import terminé",
            description: "Le fichier FEC a été analysé avec succès. 14 nouvelles écritures détectées.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Import FEC</h1>
          <p className="text-slate-500 mt-2">Importez le Fichier des Écritures Comptables pour mettre à jour les documents manquants.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Importer un fichier</CardTitle>
            <CardDescription>
              Formats acceptés : .txt (FEC standard), .csv, .xlsx. Le système analysera automatiquement les comptes 401, 411 et 471.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="border-2 border-dashed border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={!isUploading && !isComplete ? handleUpload : undefined}
            >
              {isComplete ? (
                <div className="space-y-4 animate-in zoom-in-50 duration-300">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Analyse terminée !</h3>
                    <p className="text-slate-500">Le fichier a été traité avec succès.</p>
                  </div>
                  <Button variant="outline" onClick={(e) => { e.stopPropagation(); setIsComplete(false); }}>
                    Importer un autre fichier
                  </Button>
                </div>
              ) : isUploading ? (
                <div className="w-full max-w-xs space-y-4">
                  <div className="flex items-center justify-center mb-4">
                     <FileSpreadsheet className="h-12 w-12 text-blue-500 animate-pulse" />
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-slate-500 font-medium">Traitement du fichier en cours...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Cliquez pour upload</h3>
                    <p className="text-slate-500">ou glissez-déposez votre fichier ici</p>
                  </div>
                </div>
              )}
            </div>

            {!isComplete && !isUploading && (
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-blue-900">Note sur la confidentialité</h4>
                  <p className="text-sm text-blue-700">
                    Les données importées sont traitées localement pour extraire les écritures manquantes. 
                    Aucune donnée sensible n'est conservée au-delà de la durée nécessaire au traitement.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
