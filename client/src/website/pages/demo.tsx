import { Link } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect } from "react";

export default function DemoPage() {
  
  useEffect(() => {
    // This script is typically required for HubSpot meetings to render
    const script = document.createElement("script");
    script.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="w-full max-w-7xl">
          <div className="mb-6">
            <Link href="/site-vitrine">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 -ml-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au site
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid lg:grid-cols-2 min-h-[700px]">
            {/* Left Panel: Text */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 lg:p-14 text-white relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[80px] opacity-10 -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-400 rounded-full blur-[60px] opacity-20 -ml-10 -mb-10" />
              
              <div className="relative z-10">
                <div className="inline-flex h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white mb-8 shadow-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                  Réservez votre démo personnalisée
                </h1>
                <p className="text-blue-50 text-lg md:text-xl leading-relaxed max-w-md">
                  Échangez avec nos experts et découvrez comment Naraa.ai va révolutionner la gestion de votre cabinet.
                </p>
                
                <div className="mt-12 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    <span>Audit de vos besoins</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <span>Démonstration de la plateforme</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <span>Proposition sur mesure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Calendar */}
            <div className="p-4 md:p-6 lg:p-0 flex items-center justify-center bg-white h-full">
              {/* HubSpot Meeting Embed */}
              <div 
                className="meetings-iframe-container w-full h-full" 
                data-src="https://meetings.hubspot.com/naraa-demo-mockup?embed=true"
              >
                 {/* Mockup Fallback */}
                 <div className="w-full h-full flex flex-col items-center justify-center border-none bg-white p-4 text-center">
                    <div className="animate-pulse w-full h-full bg-slate-50 rounded-lg flex items-center justify-center">
                       <p className="text-slate-400">Chargement du calendrier...</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}