import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Clients from "@/pages/clients";
import ClientDetail from "@/pages/client-detail";
import Campaigns from "@/pages/campaigns";
import Settings from "@/pages/settings";
import LandingPage from "@/website/pages/home";
import FeaturesPage from "@/website/pages/features";
import PricingPage from "@/website/pages/pricing";
import QuotePage from "@/website/pages/quote";
import ContactPage from "@/website/pages/contact";
import AboutPage from "@/website/pages/about";
import DemoPage from "@/website/pages/demo";
import LoginPage from "@/pages/auth";
import PreviewSwitcher from "@/components/dev/PreviewSwitcher";
import { useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const [, setLocation] = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/site-vitrine" component={LandingPage} />
      <Route path="/site-vitrine/features" component={FeaturesPage} />
      <Route path="/site-vitrine/pricing" component={PricingPage} />
      <Route path="/site-vitrine/quote" component={QuotePage} />
      <Route path="/site-vitrine/contact" component={ContactPage} />
      <Route path="/site-vitrine/about" component={AboutPage} />
      <Route path="/site-vitrine/demo" component={DemoPage} />
      <Route path="/login" component={LoginPage} />

      {/* Protected Routes */}
      <Route path="/app" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/clients" component={() => <ProtectedRoute component={Clients} />} />
      <Route path="/clients/:id" component={() => <ProtectedRoute component={ClientDetail} />} />
      <Route path="/campaigns" component={() => <ProtectedRoute component={Campaigns} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <PreviewSwitcher />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
