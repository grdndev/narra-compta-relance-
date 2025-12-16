import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Mail, Settings, LogOut, Bell, Megaphone, Link2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Tableau de Bord", icon: LayoutDashboard },
    { href: "/clients", label: "Clients & Relances", icon: Users },
    { href: "/campaigns", label: "Campagnes", icon: Megaphone },
    { href: "/connectors", label: "Connecteurs", icon: Link2 },
    { href: "/templates", label: "Modèles", icon: Mail },
    { href: "/settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center text-white font-serif font-bold text-xl">
              R
            </div>
            <h1 className="text-xl font-serif font-bold text-white tracking-tight">Relance Expert</h1>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (location !== "/" && location.startsWith(item.href) && item.href !== "/");
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${
                    isActive 
                      ? "bg-blue-600/20 text-blue-400 font-medium" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-700">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin Cabinet</p>
              <p className="text-xs text-slate-500 truncate">admin@cabinet.fr</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-medium text-slate-800">
            {navItems.find(i => i.href === location)?.label || "Détails"}
          </h2>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Synchronisé avec Sage Coala
            </div>

            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="text-sm font-medium text-slate-700">Mon Compte</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profil</DropdownMenuItem>
                <DropdownMenuItem>Sécurité</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
