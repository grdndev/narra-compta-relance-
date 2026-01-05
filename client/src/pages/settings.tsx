import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, User, Phone, Mail, Link2, FileText, CheckCircle2, 
  RefreshCw, Plus, Trash2, Save, Moon, Sun, Laptop, Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleSave = () => {
    toast({
      title: t("settings.saved"),
      description: t("settings.saved_desc"),
      className: "bg-green-600 text-white border-none"
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{t("settings.title")}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{t("settings.subtitle")}</p>
        </div>

        <Tabs defaultValue="cabinet" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
            <TabsTrigger value="cabinet" className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 dark:text-slate-400 gap-2">
              <Building2 className="h-4 w-4" /> {t("settings.tab.cabinet")}
            </TabsTrigger>
            <TabsTrigger value="connecteurs" className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 dark:text-slate-400 gap-2">
              <Link2 className="h-4 w-4" /> {t("settings.tab.connectors")}
            </TabsTrigger>
            <TabsTrigger value="modeles" className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 dark:text-slate-400 gap-2">
              <FileText className="h-4 w-4" /> {t("settings.tab.templates")}
            </TabsTrigger>
            <TabsTrigger value="apparence" className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 dark:text-slate-400 gap-2">
              <Moon className="h-4 w-4" /> {t("settings.tab.appearance")}
            </TabsTrigger>
          </TabsList>

          {/* =======================
              ONGLET CABINET
             ======================= */}
          <TabsContent value="cabinet" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Cabinet Identification */}
              <Card className="md:col-span-1 border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl h-fit dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    {t("settings.cabinet.id")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">{t("settings.cabinet.company_name")}</Label>
                    <Input defaultValue="Cabinet Expertis & Co" className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">{t("settings.cabinet.legal_form")}</Label>
                    <Input defaultValue="SELARL" className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">SIREN</Label>
                      <Input defaultValue="999 888 777" className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Code APE</Label>
                      <Input defaultValue="6920Z" className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">{t("settings.cabinet.address")}</Label>
                    <Textarea defaultValue="12 Avenue des Champs-Élysées, 75008 Paris" className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white min-h-[80px]" />
                  </div>
                </CardContent>
              </Card>

              {/* Collaborators */}
              <div className="md:col-span-2 space-y-6">
                <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl dark:bg-slate-900">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        {t("settings.collaborators")}
                      </CardTitle>
                      <Button variant="outline" size="sm" className="rounded-xl dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        <Plus className="h-4 w-4 mr-2" /> {t("settings.collaborators.add")}
                      </Button>
                    </div>
                    <CardDescription className="dark:text-slate-400">{t("settings.collaborators.desc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">AD</div>
                             <div>
                               <p className="font-bold text-slate-900 dark:text-white">{t("user.admin")}</p>
                               <p className="text-sm text-slate-500 dark:text-slate-400">admin@cabinet.fr</p>
                             </div>
                          </div>
                          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 border-none">{t("user.role.admin")}</Badge>
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">JD</div>
                             <div>
                               <p className="font-bold text-slate-900 dark:text-white">Julie Dubois</p>
                               <p className="text-sm text-slate-500 dark:text-slate-400">julie.d@cabinet.fr</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700">{t("user.role.collaborator")}</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                       </div>

                       <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">PM</div>
                             <div>
                               <p className="font-bold text-slate-900 dark:text-white">Pierre Martin</p>
                               <p className="text-sm text-slate-500 dark:text-slate-400">pierre.m@cabinet.fr</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700">{t("user.role.accountant")}</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button size="lg" onClick={handleSave} className="rounded-xl bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-700 px-8 shadow-lg shadow-slate-900/20 dark:shadow-blue-600/20">
                <Save className="h-4 w-4 mr-2" /> {t("settings.save")}
              </Button>
            </div>
          </TabsContent>

          {/* =======================
              ONGLET CONNECTEURS
             ======================= */}
          <TabsContent value="connecteurs" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6">
              <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-900 rounded-3xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-lg">SC</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">Sage Coala</CardTitle>
                        <CardDescription className="dark:text-slate-400">{t("settings.connectors.active")} • {t("settings.connectors.last_sync")}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-4 py-1.5 rounded-full text-sm font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      {t("settings.connectors.connected")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between border-t border-blue-100 dark:border-blue-900/30 pt-4 mt-2">
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">142</span> {t("settings.connectors.synced_today")}
                    </div>
                    <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      {t("settings.connectors.force_sync")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="opacity-75 grayscale hover:grayscale-0 transition-all duration-300 rounded-3xl border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-green-600 dark:text-green-400 text-lg">QB</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">Quickbooks</CardTitle>
                        <CardDescription className="dark:text-slate-400">{t("settings.connectors.available")}</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">{t("settings.connectors.connect")}</Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* =======================
              ONGLET MODÈLES
             ======================= */}
          <TabsContent value="modeles" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">{t("settings.templates.standard")}</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  {t("settings.templates.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="dark:text-slate-300">{t("settings.templates.subject")}</Label>
                  <Input defaultValue="Rappel : Documents comptables manquants" className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-slate-300">{t("settings.templates.body")}</Label>
                  <Textarea 
                    className="min-h-[300px] font-mono text-sm rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white p-4"
                    defaultValue={`Bonjour {nom_client},

Sauf erreur de notre part, nous n'avons pas reçu les documents suivants pour votre dossier {nom_entreprise} :

{liste_documents}

Merci de nous les faire parvenir dès que possible afin de finaliser votre comptabilité.

Cordialement,
Votre Expert-Comptable`}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave} className="rounded-xl bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-700 shadow-lg shadow-slate-900/20 dark:shadow-blue-600/20">
                    <Save className="h-4 w-4 mr-2" />
                    {t("settings.templates.save")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* =======================
              ONGLET APPARENCE
             ======================= */}
          <TabsContent value="apparence" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Moon className="h-5 w-5 text-blue-500" />
                  {t("settings.appearance.dark_mode")}
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  {t("settings.appearance.dark_mode_desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </div>
                    <div>
                      <Label htmlFor="dark-mode" className="font-bold text-slate-900 dark:text-white block cursor-pointer">{t("settings.appearance.dark_mode")}</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t("settings.appearance.toggle")}</p>
                    </div>
                  </div>
                  <Switch 
                    id="dark-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-3xl dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  {t("settings.appearance.language")}
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  {t("settings.appearance.language_desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-sm">{language.toUpperCase()}</span>
                    </div>
                    <div>
                      <Label htmlFor="language-select" className="font-bold text-slate-900 dark:text-white block">{t("settings.appearance.language")}</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t("settings.appearance.select_lang")}</p>
                    </div>
                  </div>
                  <Select value={language} onValueChange={(val: any) => {
                      setLanguage(val);
                      toast({
                        title: t("settings.appearance.lang_changed"),
                        description: t("settings.appearance.lang_changed_desc"),
                        className: "bg-blue-600 text-white border-none"
                      });
                  }}>
                    <SelectTrigger className="w-[180px] rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                      <SelectValue placeholder="Langue" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 dark:bg-slate-900">
                      <SelectItem value="fr" className="cursor-pointer">Français</SelectItem>
                      <SelectItem value="en" className="cursor-pointer">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
