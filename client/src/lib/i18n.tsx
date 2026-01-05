import React, { createContext, useContext, useState, useEffect } from 'react';
import { fr } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dateLocale: any;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    "nav.dashboard": "Tableau de Bord",
    "nav.clients": "Relances Clients",
    "nav.campaigns": "Campagnes",
    "nav.settings": "Paramètres",
    "app.title": "Relance Expert",
    "user.admin": "Admin Cabinet",
    "user.role.admin": "Administrateur",
    "user.role.collaborator": "Collaborateur",
    "user.role.accountant": "Expert-Comptable",
    
    // Header
    "header.synced": "Synchronisé avec Sage Coala",
    "header.account": "Mon Compte",
    "header.profile": "Profil",
    "header.security": "Sécurité",
    "header.logout": "Déconnexion",
    "header.details": "Détails",

    // Dashboard
    "dashboard.welcome": "Bonjour, Cabinet ! 👋",
    "dashboard.subtitle": "Vue d'ensemble de l'activité.",
    "dashboard.date_placeholder": "Choisir une période",
    "dashboard.all_sectors": "Tous secteurs",
    "dashboard.export": "Exporter le rapport",
    "dashboard.active_clients": "Clients Actifs",
    "dashboard.missing_docs": "Docs Manquants",
    "dashboard.reminders": "Relances",
    "dashboard.open_rate": "Taux d'Ouverture",
    "dashboard.this_month": "ce mois",
    "dashboard.need_reminder": "Nécessitent une relance",
    "dashboard.sent_period": "Envoyées sur la période",
    "dashboard.vs_prev": "vs période préc.",
    "dashboard.chart_title": "Activité des Relances",
    "chart.sent": "Envoyés",
    "chart.opened": "Ouverts",
    "chart.no_data": "Aucune donnée sur cette période",
    
    // Settings
    "settings.title": "Paramètres",
    "settings.subtitle": "Gérez votre cabinet, vos connexions et vos modèles.",
    "settings.tab.cabinet": "Mon Cabinet",
    "settings.tab.connectors": "Connecteurs",
    "settings.tab.templates": "Modèles",
    "settings.tab.appearance": "Apparence",
    "settings.save": "Enregistrer les modifications",
    "settings.saved": "Paramètres enregistrés",
    "settings.saved_desc": "Vos modifications ont bien été prises en compte.",
    
    // Settings - Cabinet
    "settings.cabinet.id": "Identification du Cabinet",
    "settings.cabinet.company_name": "Raison Sociale",
    "settings.cabinet.legal_form": "Forme Juridique",
    "settings.cabinet.address": "Adresse",
    "settings.collaborators": "Collaborateurs",
    "settings.collaborators.add": "Ajouter",
    "settings.collaborators.desc": "Gérez les accès de vos collaborateurs au dossier.",
    
    // Settings - Connectors
    "settings.connectors.active": "Connexion active",
    "settings.connectors.last_sync": "Dernière synchro : il y a 5 min",
    "settings.connectors.connected": "Connecté",
    "settings.connectors.synced_today": "écritures synchronisées aujourd'hui.",
    "settings.connectors.force_sync": "Forcer la synchronisation",
    "settings.connectors.available": "Connecteur disponible",
    "settings.connectors.connect": "Connecter",
    
    // Settings - Templates
    "settings.templates.standard": "Relance standard par Email",
    "settings.templates.desc": "Ce modèle est utilisé pour la première relance automatique.",
    "settings.templates.subject": "Objet de l'email",
    "settings.templates.body": "Corps du message",
    "settings.templates.save": "Enregistrer le modèle",
    
    // Settings - Appearance
    "settings.appearance.dark_mode": "Mode Sombre",
    "settings.appearance.dark_mode_desc": "Activez le mode sombre pour réduire la fatigue visuelle.",
    "settings.appearance.toggle": "Basculer entre le thème clair et sombre",
    "settings.appearance.language": "Langue de l'interface",
    "settings.appearance.language_desc": "Choisissez la langue d'affichage de l'application.",
    "settings.appearance.select_lang": "Sélectionnez votre langue préférée",
    "settings.appearance.lang_changed": "Langue modifiée",
    "settings.appearance.lang_changed_desc": "L'interface est maintenant en Français.",

    // Clients Page (General)
    "clients.title": "Relances Clients",
    "clients.subtitle": "Suivi des demandes de documents.",
    
    // Common
    "common.cancel": "Annuler",
    "common.confirm": "Confirmer",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.loading": "Chargement...",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.clients": "Client Reminders",
    "nav.campaigns": "Campaigns",
    "nav.settings": "Settings",
    "app.title": "Relance Expert",
    "user.admin": "Firm Admin",
    "user.role.admin": "Administrator",
    "user.role.collaborator": "Collaborator",
    "user.role.accountant": "Accountant",
    
    // Header
    "header.synced": "Synced with Sage Coala",
    "header.account": "My Account",
    "header.profile": "Profile",
    "header.security": "Security",
    "header.logout": "Logout",
    "header.details": "Details",

    // Dashboard
    "dashboard.welcome": "Hello, Team! 👋",
    "dashboard.subtitle": "Activity overview.",
    "dashboard.date_placeholder": "Select a period",
    "dashboard.all_sectors": "All sectors",
    "dashboard.export": "Export report",
    "dashboard.active_clients": "Active Clients",
    "dashboard.missing_docs": "Missing Docs",
    "dashboard.reminders": "Reminders",
    "dashboard.open_rate": "Open Rate",
    "dashboard.this_month": "this month",
    "dashboard.need_reminder": "Need follow-up",
    "dashboard.sent_period": "Sent this period",
    "dashboard.vs_prev": "vs prev. period",
    "dashboard.chart_title": "Reminder Activity",
    "chart.sent": "Sent",
    "chart.opened": "Opened",
    "chart.no_data": "No data for this period",
    
    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your firm, connections, and templates.",
    "settings.tab.cabinet": "My Firm",
    "settings.tab.connectors": "Connectors",
    "settings.tab.templates": "Templates",
    "settings.tab.appearance": "Appearance",
    "settings.save": "Save Changes",
    "settings.saved": "Settings saved",
    "settings.saved_desc": "Your changes have been successfully saved.",
    
    // Settings - Cabinet
    "settings.cabinet.id": "Firm Identification",
    "settings.cabinet.company_name": "Company Name",
    "settings.cabinet.legal_form": "Legal Form",
    "settings.cabinet.address": "Address",
    "settings.collaborators": "Collaborators",
    "settings.collaborators.add": "Add",
    "settings.collaborators.desc": "Manage collaborator access to the file.",
    
    // Settings - Connectors
    "settings.connectors.active": "Active connection",
    "settings.connectors.last_sync": "Last sync: 5 min ago",
    "settings.connectors.connected": "Connected",
    "settings.connectors.synced_today": "entries synced today.",
    "settings.connectors.force_sync": "Force synchronization",
    "settings.connectors.available": "Connector available",
    "settings.connectors.connect": "Connect",
    
    // Settings - Templates
    "settings.templates.standard": "Standard Email Reminder",
    "settings.templates.desc": "This template is used for the first automatic reminder.",
    "settings.templates.subject": "Email Subject",
    "settings.templates.body": "Message Body",
    "settings.templates.save": "Save Template",
    
    // Settings - Appearance
    "settings.appearance.dark_mode": "Dark Mode",
    "settings.appearance.dark_mode_desc": "Enable dark mode to reduce eye strain.",
    "settings.appearance.toggle": "Toggle between light and dark theme",
    "settings.appearance.language": "Interface Language",
    "settings.appearance.language_desc": "Choose the application display language.",
    "settings.appearance.select_lang": "Select your preferred language",
    "settings.appearance.lang_changed": "Language changed",
    "settings.appearance.lang_changed_desc": "The interface is now in English.",

    // Clients Page (General)
    "clients.title": "Client Reminders",
    "clients.subtitle": "Track document requests.",
    
    // Common
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }
    return text;
  };

  const dateLocale = language === 'fr' ? fr : enUS;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dateLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
