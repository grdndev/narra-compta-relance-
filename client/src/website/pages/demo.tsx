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
      
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/site-vitrine">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 -ml-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au site
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[600px]">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[80px] opacity-10 -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-400 rounded-full blur-[60px] opacity-20 -ml-10 -mb-10" />
              
              <div className="relative z-10">
                <div className="inline-flex h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white mb-6 shadow-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Réservez votre démo personnalisée</h1>
                <p className="text-blue-50 max-w-lg mx-auto text-lg">
                  Échangez avec nos experts et découvrez comment Naraa.ai va révolutionner la gestion de votre cabinet.
                </p>
              </div>
            </div>

            <div className="p-4 md:p-8 flex justify-center bg-white">
              {/* HubSpot Meeting Embed */}
              {/* Note: In a real environment, you would replace the data-src with your actual HubSpot meeting link */}
              <div 
                className="meetings-iframe-container" 
                data-src="https://meetings.hubspot.com/naraa-demo-mockup?embed=true"
                style={{width: '100%', height: '650px'}}
              >
                 {/* Mockup Fallback if HubSpot script doesn't load or URL is invalid */}
                 <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 text-center">
                    <Calendar className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">Calendrier de réservation</h3>
                    <p className="text-slate-500 mb-6 max-w-md">
                      Le calendrier HubSpot s'affichera ici. 
                    </p>
                    <div className="animate-pulse flex flex-col gap-3 w-full max-w-sm">
                      <div className="h-10 bg-slate-200 rounded"></div>
                      <div className="h-64 bg-slate-200 rounded"></div>
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