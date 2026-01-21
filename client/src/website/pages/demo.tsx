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
            <div className="bg-slate-900 p-8 text-white text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Réservez une démo</h1>
              <p className="text-slate-300 max-w-lg mx-auto">
                Découvrez comment Naraa.ai peut transformer votre cabinet. Choisissez un créneau ci-dessous.
              </p>
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