import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Mail, Settings, LogOut, Bell, Megaphone, Link2, Sparkles, Building2 } from "lucide-react";
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
    { href: "/clients", label: "Relances Clients", icon: Users },
    { href: "/campaigns", label: "Campagnes", icon: Megaphone },
    { href: "/settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 flex-shrink-0 hidden md:flex flex-col border-r border-slate-100 dark:border-slate-800 shadow-[2px_0_20px_rgba(0,0,0,0.02)] z-20 transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Relance Expert</h1>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (location !== "/" && location.startsWith(item.href) && item.href !== "/");
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group font-medium ${
                    isActive 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? "text-blue-600 dark:text-blue-400 scale-110" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700 shadow-sm">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">Admin Cabinet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@cabinet.fr</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F7F9FC] dark:bg-slate-950 transition-colors duration-300">
        {/* Header */}
        <header className="h-20 bg-[#F7F9FC]/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            {navItems.find(i => i.href === location)?.label || "Détails"}
          </h2>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 text-sm font-semibold rounded-full border border-green-100 dark:border-green-900/30 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              Synchronisé avec Sage Coala
            </div>

            <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50">
                  <span className="text-sm font-medium">Mon Compte</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
                <DropdownMenuLabel className="dark:text-white">Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-slate-800" />
                <DropdownMenuItem className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800">Profil</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800">Sécurité</DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-slate-800" />
                <DropdownMenuItem className="text-red-600 dark:text-red-400 rounded-lg cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700 dark:focus:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto px-8 pb-8 pt-2">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
