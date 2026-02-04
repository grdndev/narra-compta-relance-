import { subDays, format } from "date-fns";

const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

// Team Members
export interface TeamMember {
  id: string;
  name: string;
  role: 'associate' | 'collaborator';
  email: string;
  avatar?: string;
}

export const mockTeamMembers: TeamMember[] = [
  // 3 Associates
  { id: 'tm1', name: 'Sarah Lambert', role: 'associate', email: 'sarah.lambert@cabinet.fr' },
  { id: 'tm2', name: 'Marc Durand', role: 'associate', email: 'marc.durand@cabinet.fr' },
  { id: 'tm3', name: 'Claire Fontaine', role: 'associate', email: 'claire.fontaine@cabinet.fr' },
  // 12 Collaborators
  { id: 'tm4', name: 'Julie Moreau', role: 'collaborator', email: 'julie.moreau@cabinet.fr' },
  { id: 'tm5', name: 'Thomas Bernard', role: 'collaborator', email: 'thomas.bernard@cabinet.fr' },
  { id: 'tm6', name: 'Emma Petit', role: 'collaborator', email: 'emma.petit@cabinet.fr' },
  { id: 'tm7', name: 'Lucas Martin', role: 'collaborator', email: 'lucas.martin@cabinet.fr' },
  { id: 'tm8', name: 'Léa Dubois', role: 'collaborator', email: 'lea.dubois@cabinet.fr' },
  { id: 'tm9', name: 'Hugo Leroy', role: 'collaborator', email: 'hugo.leroy@cabinet.fr' },
  { id: 'tm10', name: 'Camille Roux', role: 'collaborator', email: 'camille.roux@cabinet.fr' },
  { id: 'tm11', name: 'Nathan Garcia', role: 'collaborator', email: 'nathan.garcia@cabinet.fr' },
  { id: 'tm12', name: 'Manon Lefebvre', role: 'collaborator', email: 'manon.lefebvre@cabinet.fr' },
  { id: 'tm13', name: 'Enzo Michel', role: 'collaborator', email: 'enzo.michel@cabinet.fr' },
  { id: 'tm14', name: 'Chloé Simon', role: 'collaborator', email: 'chloe.simon@cabinet.fr' },
  { id: 'tm15', name: 'Mathis Laurent', role: 'collaborator', email: 'mathis.laurent@cabinet.fr' },
];

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  preferredChannels: ('email' | 'phone' | 'whatsapp')[];
  active?: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  siren: string;
  manager: string;
  managerId: string; // Team member ID
  sector: 'BTP' | 'Restauration' | 'Services' | 'Commerce' | 'Santé';
  status: 'active' | 'archived';
  lastContact: string;
  pendingDocs: number;
  totalDocs: number;
  openRate: number; // Added openRate
  
  // New detailed fields
  legalForm?: string;
  ape?: string;
  creationDate?: string;
  address?: string;
  contacts?: Contact[];
  notes?: string;
  cooperates?: boolean;
  underSurveillance?: boolean;
  customFields?: {id: string, label: string, value: string}[];
}

export interface Document {
  id: string;
  clientId: string;
  name: string;
  type: 'FEC' | 'Facture' | 'Relevé' | 'Autre';
  status: 'missing' | 'received' | 'validated';
  dueDate: string;
  accountCode?: string; // 401, 411, 471
}

export interface Reminder {
  id: string;
  clientId: string;
  date: string;
  type: 'email' | 'sms' | 'automatic';
  channels?: ('email' | 'sms' | 'whatsapp')[];
  status: 'sent' | 'failed' | 'opened';
  subject: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentDate?: string;
  targetSector?: string; // 'All' or specific sector
  recipientCount: number;
  openRate?: number;
  followUpDelay?: number | 'immediate' | null;
}

export interface AccountingEntry {
  id: string;
  clientId: string;
  date: string;
  label: string;
  journal: 'ACH' | 'VTE' | 'BQ' | 'OD';
  amount: number;
  type: 'Debit' | 'Credit';
  account: string;
  accountLabel: string;
  pieceRef?: string;
  status: 'missing_doc' | 'validated' | 'pending';
  comment?: string;
  isUrgent?: boolean;
  ignored?: boolean;
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@techsol.fr',
    phone: '06 12 34 56 78',
    company: 'TechSolutions SAS',
    siren: '802 934 192',
    manager: 'Sarah Lambert',
    managerId: 'tm1',
    sector: 'Services',
    status: 'active',
    lastContact: formatDate(subDays(today, 2)),
    pendingDocs: 3,
    totalDocs: 45,
    openRate: 85,
    legalForm: 'SAS',
    ape: '6201Z',
    creationDate: '2018-03-12',
    address: '15 Rue de la République, 75001 Paris',
    contacts: [
      { id: 'c1', name: 'Jean Dupont', role: 'Président', email: 'jean.dupont@techsol.fr', phone: '06 12 34 56 78', isPrimary: true, preferredChannels: ['email'], active: true },
      { id: 'c2', name: 'Sophie Martin', role: 'Office Manager', email: 'sophie.m@techsol.fr', phone: '06 99 88 77 66', isPrimary: false, preferredChannels: ['whatsapp', 'email'], active: true }
    ],
    notes: "Client fidèle depuis 2018. Préfère être contacté le matin avant 10h.\n\nRDV annuel de bilan prévu en mars.\nAttention : Changement d'expert-comptable prévu pour 2026, à surveiller."
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'm.martin@bakery.com',
    phone: '06 98 76 54 32',
    company: 'Boulangerie Martin',
    siren: '401 293 847',
    manager: 'Marc Durand',
    managerId: 'tm2',
    sector: 'Restauration',
    status: 'active',
    lastContact: formatDate(subDays(today, 1)),
    pendingDocs: 1,
    totalDocs: 28,
    openRate: 45,
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'contact@durand-btp.fr',
    phone: '07 11 22 33 44',
    company: 'Durand BTP',
    siren: '902 384 112',
    manager: 'Julie Moreau',
    managerId: 'tm4',
    sector: 'BTP',
    status: 'active',
    lastContact: formatDate(subDays(today, 5)),
    pendingDocs: 5,
    totalDocs: 120,
    openRate: 20,
    notes: "Dossier complexe avec plusieurs chantiers en cours.\nRelances fréquentes nécessaires pour les pièces justificatives.",
    underSurveillance: true
  },
  {
    id: '4',
    name: 'Sophie Lefebvre',
    email: 'sophie@designstudio.net',
    phone: '06 55 44 33 22',
    company: 'Lefebvre Design',
    siren: '550 192 384',
    manager: 'Thomas Bernard',
    managerId: 'tm5',
    sector: 'Services',
    status: 'active',
    lastContact: formatDate(subDays(today, 10)),
    pendingDocs: 0,
    totalDocs: 15,
    openRate: 92,
  },
  {
    id: '5',
    name: 'Dr. Lucas Bernard',
    email: 'l.bernard@cabinet-medical.fr',
    phone: '06 11 22 33 44',
    company: 'Cabinet Médical Bernard',
    siren: '302 491 823',
    manager: 'Claire Fontaine',
    managerId: 'tm3',
    sector: 'Santé',
    status: 'active',
    lastContact: formatDate(subDays(today, 3)),
    pendingDocs: 2,
    totalDocs: 30,
    openRate: 60,
  },
  {
    id: '6',
    name: 'Julie Dubois',
    email: 'julie@pretaporter.com',
    phone: '06 99 88 77 66',
    company: 'Mode & Co',
    siren: '823 491 002',
    manager: 'Emma Petit',
    managerId: 'tm6',
    sector: 'Commerce',
    status: 'active',
    lastContact: formatDate(subDays(today, 1)),
    pendingDocs: 4,
    totalDocs: 50,
    openRate: 75,
  },
  {
    id: '7',
    name: 'Antoine Mercier',
    email: 'a.mercier@mercier-immo.fr',
    phone: '06 78 90 12 34',
    company: 'Mercier Immobilier',
    siren: '912 384 556',
    manager: 'Lucas Martin',
    managerId: 'tm7',
    sector: 'Services',
    status: 'active',
    lastContact: formatDate(subDays(today, 4)),
    pendingDocs: 2,
    totalDocs: 35,
    openRate: 70,
  },
  {
    id: '8',
    name: 'Camille Rousseau',
    email: 'camille@resto-gourmet.fr',
    phone: '06 45 67 89 01',
    company: 'Le Gourmet',
    siren: '823 556 192',
    manager: 'Léa Dubois',
    managerId: 'tm8',
    sector: 'Restauration',
    status: 'active',
    lastContact: formatDate(subDays(today, 2)),
    pendingDocs: 3,
    totalDocs: 42,
    openRate: 55,
  },
];

export const mockDocuments: Document[] = [
  { id: 'd1', clientId: '1', name: 'Facture Orange', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 3)), accountCode: '401' },
  { id: 'd2', clientId: '1', name: 'Relevé bancaire Septembre', type: 'Relevé', status: 'missing', dueDate: formatDate(subDays(today, 2)), accountCode: '512' },
  { id: 'd3', clientId: '1', name: 'FEC', type: 'FEC', status: 'received', dueDate: formatDate(subDays(today, 10)) },
  { id: 'd4', clientId: '1', name: 'Facture EDF', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 1)), accountCode: '401' },
  
  { id: 'd5', clientId: '2', name: 'Justificatif URSSAF', type: 'Autre', status: 'missing', dueDate: formatDate(subDays(today, 5)), accountCode: '431' },
  
  { id: 'd6', clientId: '3', name: 'Facture Matériaux Bois', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 1)), accountCode: '401' },
  { id: 'd7', clientId: '3', name: 'Facture Location Engin', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 2)), accountCode: '401' },
  { id: 'd8', clientId: '3', name: 'Relevé Octobre', type: 'Relevé', status: 'missing', dueDate: formatDate(subDays(today, 3)), accountCode: '512' },
  { id: 'd9', clientId: '3', name: 'Facture Carburant', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 1)), accountCode: '401' },
  { id: 'd10', clientId: '3', name: 'Note de Frais Octobre', type: 'Autre', status: 'missing', dueDate: formatDate(subDays(today, 4)), accountCode: '471' },
];

export const mockReminders: Reminder[] = [
  { id: 'r1', clientId: '1', date: `${formatDate(subDays(today, 0))}T08:12:00`, type: 'automatic', channels: ['email'], status: 'sent', subject: 'Rappel : Documents manquants' },
  { id: 'r4', clientId: '1', date: `${formatDate(subDays(today, 0))}T11:47:00`, type: 'email', channels: ['email'], status: 'opened', subject: 'Relance Manuelle' },
  { id: 'r6', clientId: '1', date: `${formatDate(subDays(today, 1))}T16:05:00`, type: 'automatic', channels: ['email', 'sms'], status: 'sent', subject: 'Relance automatique J+1' },
  { id: 'r7', clientId: '1', date: `${formatDate(subDays(today, 2))}T09:25:00`, type: 'email', channels: ['email'], status: 'opened', subject: 'Relance - Justificatifs' },
  { id: 'r8', clientId: '1', date: `${formatDate(subDays(today, 3))}T18:33:00`, type: 'sms', channels: ['sms'], status: 'sent', subject: 'Rappel SMS' },
  { id: 'r2', clientId: '3', date: `${formatDate(subDays(today, 2))}T10:15:00`, type: 'email', channels: ['email', 'sms'], status: 'sent', subject: 'Relance urgente - Clôture' },
  { id: 'r3', clientId: '2', date: `${formatDate(today)}T14:20:00`, type: 'automatic', channels: ['email'], status: 'sent', subject: 'Vos documents comptables' },
  { id: 'r5', clientId: '6', date: `${formatDate(subDays(today, 1))}T13:10:00`, type: 'sms', channels: ['sms'], status: 'sent', subject: 'Rappel SMS' },
];

export const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'Rappel Paiement CFE', status: 'sent', sentDate: formatDate(subDays(today, 2)), recipientCount: 40, openRate: 82, targetSector: 'All' },
  { id: 'c2', name: 'Collecte TVA Trimestrielle', status: 'scheduled', sentDate: formatDate(subDays(today, -15)), recipientCount: 15, targetSector: 'All' },
  { id: 'c3', name: 'Info Secteur BTP - Changement Taux', status: 'draft', recipientCount: 8, targetSector: 'BTP' },
];

export const mockAccountingEntries: AccountingEntry[] = [
  // Client 1 (TechSolutions) - mix achats/ventes/banque
  { id: 'e1', clientId: '1', date: formatDate(subDays(today, 35)), label: 'FACTURE ORANGE - FORFAIT PRO', journal: 'ACH', amount: 45.90, type: 'Debit', account: '401ORANGE', accountLabel: 'Orange SA', status: 'missing_doc', pieceRef: 'AC-23-450', isUrgent: false },
  { id: 'e4', clientId: '1', date: formatDate(subDays(today, 12)), label: 'FACTURE EDF PRO - ÉLECTRICITÉ', journal: 'ACH', amount: 312.45, type: 'Debit', account: '401EDF', accountLabel: 'EDF Entreprises', status: 'missing_doc', pieceRef: 'AC-23-453' },
  { id: 'e14', clientId: '1', date: formatDate(subDays(today, 18)), label: 'AMAZON BUSINESS - FOURNITURES', journal: 'ACH', amount: 128.60, type: 'Debit', account: '401AMAZON', accountLabel: 'Amazon Business', status: 'missing_doc', pieceRef: 'AC-23-470', isUrgent: true },
  { id: 'e15', clientId: '1', date: formatDate(subDays(today, 22)), label: 'MICROSOFT - ABONNEMENT 365', journal: 'ACH', amount: 89.00, type: 'Debit', account: '401MS', accountLabel: 'Microsoft Ireland', status: 'missing_doc', pieceRef: 'AC-23-471' },
  { id: 'e6', clientId: '1', date: formatDate(subDays(today, 38)), label: 'PRESTATION CONSEIL - OCTOBRE', journal: 'VTE', amount: 1500.00, type: 'Credit', account: '411CONSEIL', accountLabel: 'Conseil & Co', status: 'missing_doc', pieceRef: 'VT-23-102' },
  { id: 'e16', clientId: '1', date: formatDate(subDays(today, 9)), label: 'VENTE - MAINTENANCE MENSUELLE', journal: 'VTE', amount: 980.00, type: 'Credit', account: '411MAINT', accountLabel: 'Client Maintenance', status: 'missing_doc', pieceRef: 'VT-23-118', isUrgent: true },
  { id: 'e17', clientId: '1', date: formatDate(subDays(today, 6)), label: 'VENTE - DÉVELOPPEMENT FEATURE', journal: 'VTE', amount: 2400.00, type: 'Credit', account: '411DEV', accountLabel: 'Projet Feature', status: 'missing_doc', pieceRef: 'VT-23-121' },
  { id: 'e10', clientId: '1', date: formatDate(subDays(today, 45)), label: 'VIREMENT REÇU - FACTURE VT-23-102', journal: 'BQ', amount: 1500.00, type: 'Debit', account: '512000', accountLabel: 'Banque Populaire', status: 'missing_doc', pieceRef: 'BQ-10-001' },
  { id: 'e11', clientId: '1', date: formatDate(subDays(today, 42)), label: 'PRLV URSSAF', journal: 'BQ', amount: 450.00, type: 'Credit', account: '512000', accountLabel: 'Banque Populaire', status: 'missing_doc', pieceRef: 'BQ-10-005', isUrgent: true },

  // Client 2 (Boulangerie) - achats + banque
  { id: 'e3', clientId: '2', date: formatDate(subDays(today, 15)), label: 'FOURNISSEUR FARINE - MOIS', journal: 'ACH', amount: 85.50, type: 'Debit', account: '401RESTO', accountLabel: 'Fournisseur Farine', status: 'missing_doc', pieceRef: 'AC-23-452' },
  { id: 'e9', clientId: '2', date: formatDate(subDays(today, 2)), label: 'METRO CASH & CARRY - INGRÉDIENTS', journal: 'ACH', amount: 840.20, type: 'Debit', account: '401METRO', accountLabel: 'Metro', status: 'missing_doc', isUrgent: true, pieceRef: 'AC-23-462' },
  { id: 'e18', clientId: '2', date: formatDate(subDays(today, 7)), label: 'SAC EMBALLAGE - COMMANDE', journal: 'ACH', amount: 132.10, type: 'Debit', account: '401EMB', accountLabel: 'Emballages Pro', status: 'missing_doc', pieceRef: 'AC-23-490' },
  { id: 'e19', clientId: '2', date: formatDate(subDays(today, 8)), label: 'VIREMENT FOURNISSEUR', journal: 'BQ', amount: 585.00, type: 'Credit', account: '512000', accountLabel: 'Crédit Mutuel', status: 'missing_doc', pieceRef: 'BQ-20-010' },

  // Client 3 (BTP) - gros volume achats + banque
  { id: 'e2', clientId: '3', date: formatDate(subDays(today, 20)), label: 'LEROY MERLIN - MATÉRIAUX', journal: 'ACH', amount: 1250.00, type: 'Debit', account: '401LEROY', accountLabel: 'Leroy Merlin Pro', status: 'missing_doc', pieceRef: 'AC-23-451', isUrgent: true, comment: "Gros montant" },
  { id: 'e7', clientId: '3', date: formatDate(subDays(today, 5)), label: 'KILOUTOU - LOCATION', journal: 'ACH', amount: 450.00, type: 'Debit', account: '401KILOUTOU', accountLabel: 'Kiloutou', status: 'missing_doc', pieceRef: 'AC-23-460' },
  { id: 'e8', clientId: '3', date: formatDate(subDays(today, 4)), label: 'TOTAL ENERGIES - CARBURANT', journal: 'ACH', amount: 120.00, type: 'Debit', account: '401TOTAL', accountLabel: 'Total Energies', status: 'missing_doc', pieceRef: 'AC-23-461' },
  { id: 'e20', clientId: '3', date: formatDate(subDays(today, 3)), label: 'POINT.P - MATÉRIAUX', journal: 'ACH', amount: 980.00, type: 'Debit', account: '401POINTP', accountLabel: 'Point.P', status: 'missing_doc', pieceRef: 'AC-23-520' },
  { id: 'e21', clientId: '3', date: formatDate(subDays(today, 11)), label: 'CASTORAMA PRO - OUTILLAGE', journal: 'ACH', amount: 265.40, type: 'Debit', account: '401CASTO', accountLabel: 'Castorama Pro', status: 'missing_doc', pieceRef: 'AC-23-521' },
  { id: 'e22', clientId: '3', date: formatDate(subDays(today, 9)), label: 'MANPOWER - INTÉRIM', journal: 'ACH', amount: 2350.00, type: 'Debit', account: '401MANP', accountLabel: 'Manpower', status: 'missing_doc', pieceRef: 'AC-23-522', isUrgent: true },
  { id: 'e23', clientId: '3', date: formatDate(subDays(today, 8)), label: 'VIREMENT SORTANT - FOURNISSEUR', journal: 'BQ', amount: 1250.00, type: 'Credit', account: '512000', accountLabel: 'Société Générale', status: 'missing_doc', pieceRef: 'BQ-30-033' },

  // Client 4 (Design) - ventes
  { id: 'e5', clientId: '4', date: formatDate(subDays(today, 40)), label: 'VENTE - DESIGN PACK', journal: 'VTE', amount: 5000.00, type: 'Credit', account: '411CLIENTX', accountLabel: 'Client X SARL', status: 'missing_doc', pieceRef: 'VT-23-101' },
  { id: 'e24', clientId: '4', date: formatDate(subDays(today, 14)), label: 'VENTE - CRÉATION LOGO', journal: 'VTE', amount: 1200.00, type: 'Credit', account: '411LOGO', accountLabel: 'Client Logo', status: 'missing_doc', pieceRef: 'VT-23-140' },

  // OD Entries (validated examples)
  { id: 'e12', clientId: '1', date: formatDate(subDays(today, 30)), label: 'TVA À DÉCAISSER', journal: 'OD', amount: 2340.00, type: 'Credit', account: '445510', accountLabel: 'TVA à décaisser', status: 'validated', pieceRef: 'OD-10-001' },
  { id: 'e13', clientId: '1', date: formatDate(subDays(today, 30)), label: 'SALAIRES OCTOBRE', journal: 'OD', amount: 12500.00, type: 'Debit', account: '421000', accountLabel: 'Personnel - Rémunérations', status: 'validated', pieceRef: 'OD-10-002' },
];
