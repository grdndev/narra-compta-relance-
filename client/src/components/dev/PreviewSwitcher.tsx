import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Globe, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function PreviewSwitcher() {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  // Determine active mode
  const isWebsite = location === "/" || location.startsWith("/site-vitrine");
  
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-2 bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-700/50 mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dev Mode</span>
        <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white transition-colors">
          <X className="h-3 w-3" />
        </button>
      </div>
      
      <div className="flex gap-2">
        <Link href="/dashboard">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-9 px-3 rounded-xl transition-all ${
              !isWebsite 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 hover:bg-blue-500 hover:text-white" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            App
          </Button>
        </Link>
        
        <Link href="/">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-9 px-3 rounded-xl transition-all ${
              isWebsite 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 hover:bg-indigo-500 hover:text-white" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Globe className="h-4 w-4 mr-2" />
            Site
          </Button>
        </Link>
      </div>
    </div>
  );
}