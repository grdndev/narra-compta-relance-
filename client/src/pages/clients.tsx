import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockClients } from "@/lib/mockData";
import { Search, Filter, MoreVertical, Mail, Send, Plus, Building2, User, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Clients() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  // Client List Logic
  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const toggleSelectClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const handleBulkReminder = () => {
    toast({
      title: "Relances envoyées",
      description: `${selectedClients.length} clients ont été relancés pour leurs documents manquants.`,
      className: "bg-green-600 text-white border-none"
    });
    setSelectedClients([]);
  };

  const handleCreateClient = () => {
    setIsNewClientDialogOpen(false);
    toast({
      title: "Dossier créé",
      description: "Le nouveau dossier client a été ajouté avec succès.",
      className: "bg-blue-600 text-white border-none"
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Relances Clients</h1>
            <p className="text-slate-500 mt-1 font-medium">Gérez vos dossiers et les pièces manquantes.</p>
          </div>
          
          <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Dossier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-3xl p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-800">Créer un nouveau dossier</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau client à votre portefeuille pour commencer le suivi.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" /> Informations Entreprise
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Raison Sociale</Label>
                      <Input placeholder="Ex: Ma Société SAS" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>SIREN</Label>
                      <Input placeholder="123 456 789" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Secteur d'activité</Label>
                      <Select>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="btp">BTP</SelectItem>
                          <SelectItem value="restauration">Restauration</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="commerce">Commerce</SelectItem>
                          <SelectItem value="sante">Santé</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Forme Juridique</Label>
                      <Input placeholder="Ex: SAS, SARL..." className="rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" /> Contact Principal
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input placeholder="Jean Dupont" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fonction</Label>
                      <Input placeholder="Gérant" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="jean@societe.com" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input type="tel" placeholder="06 12 34 56 78" className="rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewClientDialogOpen(false)} className="rounded-xl border-slate-200">Annuler</Button>
                <Button onClick={handleCreateClient} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le dossier
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center gap-4 bg-white">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher un client, entreprise ou secteur..." 
                  className="pl-10 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm font-medium text-slate-500 ml-auto bg-slate-50 px-3 py-1 rounded-full">
                {filteredClients.length} dossiers trouvés
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="w-[50px] pl-4">
                    <Checkbox 
                      checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                      onCheckedChange={toggleSelectAll}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md border-slate-300"
                    />
                  </TableHead>
                  <TableHead className="w-[300px] text-slate-500 font-semibold">Client / Entreprise</TableHead>
                  <TableHead className="text-slate-500 font-semibold">SIREN</TableHead>
                  <TableHead className="text-slate-500 font-semibold">Secteur</TableHead>
                  <TableHead className="text-slate-500 font-semibold">État des pièces</TableHead>
                  <TableHead className="text-slate-500 font-semibold">Dernier Contact</TableHead>
                  <TableHead className="text-right pr-4 text-slate-500 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="group hover:bg-blue-50/30 border-slate-50 transition-colors">
                    <TableCell className="pl-4">
                      <Checkbox 
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => toggleSelectClient(client.id)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md border-slate-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/clients/${client.id}`} className="block">
                        <div className="flex flex-col cursor-pointer">
                          <span className="text-slate-800 font-bold group-hover:text-blue-600 transition-colors">
                            {client.company}
                          </span>
                          <span className="text-slate-500 font-normal text-sm">
                            {client.name}
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-500 font-mono text-sm">
                      {client.siren}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium text-slate-600 bg-slate-50 border-slate-200 rounded-lg px-2.5 py-1">
                        {client.sector}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.pendingDocs > 0 ? (
                        <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg px-2.5 py-1 shadow-sm">
                          {client.pendingDocs} manquants
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100 border border-green-100 rounded-lg px-2.5 py-1 shadow-sm">
                          À jour
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium text-sm">
                      {new Date(client.lastContact).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                            <DropdownMenuItem className="rounded-lg cursor-pointer">
                              <Link href={`/clients/${client.id}`} className="flex w-full">Voir le dossier</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg cursor-pointer">Modifier</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-700">Archiver</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Bulk Actions */}
          {selectedClients.length > 0 && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-in slide-in-from-bottom-10 fade-in">
              <Button onClick={handleBulkReminder} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-lg shadow-blue-900/50">
                <Send className="h-5 w-5 mr-2" />
                Relancer {selectedClients.length} clients
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
