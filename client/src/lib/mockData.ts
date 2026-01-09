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
    ]
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
  {
    id: '9',
    name: 'Paul Girard',
    email: 'paul@girard-elec.fr',
    phone: '07 23 45 67 89',
    company: 'Girard Électricité',
    siren: '756 912 384',
    manager: 'Hugo Leroy',
    managerId: 'tm9',
    sector: 'BTP',
    status: 'active',
    lastContact: formatDate(subDays(today, 7)),
    pendingDocs: 4,
    totalDocs: 88,
    openRate: 35,
  },
  {
    id: '10',
    name: 'Nathalie Perrin',
    email: 'n.perrin@pharma-plus.fr',
    phone: '06 12 78 34 56',
    company: 'Pharmacie Plus',
    siren: '384 756 912',
    manager: 'Camille Roux',
    managerId: 'tm10',
    sector: 'Santé',
    status: 'active',
    lastContact: formatDate(subDays(today, 1)),
    pendingDocs: 1,
    totalDocs: 52,
    openRate: 88,
  },
  {
    id: '11',
    name: 'François Blanc',
    email: 'f.blanc@blanc-auto.fr',
    phone: '06 90 12 34 56',
    company: 'Blanc Automobiles',
    siren: '556 823 491',
    manager: 'Nathan Garcia',
    managerId: 'tm11',
    sector: 'Commerce',
    status: 'active',
    lastContact: formatDate(subDays(today, 6)),
    pendingDocs: 6,
    totalDocs: 95,
    openRate: 42,
  },
  {
    id: '12',
    name: 'Isabelle Morel',
    email: 'isabelle@morel-conseil.fr',
    phone: '06 34 56 78 90',
    company: 'Morel Consulting',
    siren: '491 384 756',
    manager: 'Manon Lefebvre',
    managerId: 'tm12',
    sector: 'Services',
    status: 'active',
    lastContact: formatDate(subDays(today, 3)),
    pendingDocs: 1,
    totalDocs: 28,
    openRate: 78,
  },
  {
    id: '13',
    name: 'Marc Chevalier',
    email: 'marc@chevalier-bat.fr',
    phone: '07 56 78 90 12',
    company: 'Chevalier Bâtiment',
    siren: '192 556 823',
    manager: 'Enzo Michel',
    managerId: 'tm13',
    sector: 'BTP',
    status: 'active',
    lastContact: formatDate(subDays(today, 8)),
    pendingDocs: 7,
    totalDocs: 110,
    openRate: 28,
  },
  {
    id: '14',
    name: 'Anne Faure',
    email: 'anne@faure-beaute.fr',
    phone: '06 67 89 01 23',
    company: 'Institut Beauté Anne',
    siren: '823 192 556',
    manager: 'Chloé Simon',
    managerId: 'tm14',
    sector: 'Commerce',
    status: 'active',
    lastContact: formatDate(subDays(today, 2)),
    pendingDocs: 2,
    totalDocs: 38,
    openRate: 82,
  },
  {
    id: '15',
    name: 'Éric Bonnet',
    email: 'eric@bonnet-plomberie.fr',
    phone: '07 89 01 23 45',
    company: 'Bonnet Plomberie',
    siren: '556 491 823',
    manager: 'Mathis Laurent',
    managerId: 'tm15',
    sector: 'BTP',
    status: 'active',
    lastContact: formatDate(subDays(today, 5)),
    pendingDocs: 3,
    totalDocs: 65,
    openRate: 50,
  }
];

export const mockDocuments: Document[] = [
  { id: 'd1', clientId: '1', name: 'Facture Orange Octobre', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 2)), accountCode: '401' },
  { id: 'd2', clientId: '1', name: 'Relevé Bancaire Septembre', type: 'Relevé', status: 'missing', dueDate: formatDate(subDays(today, 35)), accountCode: '512' },
  { id: 'd3', clientId: '1', name: 'TVA T3 2023', type: 'Autre', status: 'received', dueDate: formatDate(subDays(today, 40)) },
  { id: 'd4', clientId: '1', name: 'Facture EDF', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 1)), accountCode: '401' },
  
  { id: 'd5', clientId: '2', name: 'Justificatif URSSAF', type: 'Autre', status: 'missing', dueDate: formatDate(subDays(today, 5)), accountCode: '431' },
  
  { id: 'd6', clientId: '3', name: 'Facture Matériaux Bois', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 1)), accountCode: '401' },
  { id: 'd7', clientId: '3', name: 'Facture Location Engin', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 2)), accountCode: '401' },
  { id: 'd8', clientId: '3', name: 'Relevé Octobre', type: 'Relevé', status: 'missing', dueDate: formatDate(subDays(today, 3)), accountCode: '512' },
  { id: 'd9', clientId: '3', name: 'Facture Carburant', type: 'Facture', status: 'missing', dueDate: formatDate(subDays(today, 1)), accountCode: '401' },
  { id: 'd10', clientId: '3', name: 'Note de Frais Octobre', type: 'Autre', status: 'missing', dueDate: formatDate(subDays(today, 4)), accountCode: '471' },
];

export const mockReminders: Reminder[] = [
  { id: 'r1', clientId: '1', date: formatDate(subDays(today, 1)), type: 'automatic', channels: ['email'], status: 'opened', subject: 'Rappel : Documents manquants' },
  { id: 'r2', clientId: '3', date: formatDate(subDays(today, 2)), type: 'email', channels: ['email', 'sms'], status: 'sent', subject: 'Relance urgente - Clôture' },
  { id: 'r3', clientId: '2', date: formatDate(today), type: 'automatic', channels: ['email'], status: 'sent', subject: 'Vos documents comptables' },
  { id: 'r4', clientId: '1', date: formatDate(subDays(today, 3)), type: 'email', channels: ['email'], status: 'opened', subject: 'Relance Manuelle' },
  { id: 'r5', clientId: '6', date: formatDate(subDays(today, 1)), type: 'sms', channels: ['sms'], status: 'sent', subject: 'Rappel SMS' },
];

export const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'Rappel Paiement CFE', status: 'sent', sentDate: formatDate(subDays(today, 2)), recipientCount: 40, openRate: 82, targetSector: 'All' },
  { id: 'c2', name: 'Collecte TVA Trimestrielle', status: 'scheduled', sentDate: formatDate(subDays(today, -15)), recipientCount: 15, targetSector: 'All' },
  { id: 'c3', name: 'Info Secteur BTP - Changement Taux', status: 'draft', recipientCount: 8, targetSector: 'BTP' },
];

export const mockAccountingEntries: AccountingEntry[] = [
  { id: 'e1', clientId: '1', date: formatDate(subDays(today, 35)), label: 'FACTURE ORANGE', journal: 'ACH', amount: 45.90, type: 'Debit', account: '401ORANGE', accountLabel: 'Orange SA', status: 'missing_doc', pieceRef: 'AC-23-450', isUrgent: false },
  { id: 'e2', clientId: '3', date: formatDate(subDays(today, 20)), label: 'LEROY MERLIN MATERIAUX', journal: 'ACH', amount: 1250.00, type: 'Debit', account: '401LEROY', accountLabel: 'Leroy Merlin Pro', status: 'missing_doc', pieceRef: 'AC-23-451', isUrgent: true, comment: "Gros montant" },
  { id: 'e3', clientId: '2', date: formatDate(subDays(today, 15)), label: 'RESTAURANT LE GOURMET', journal: 'ACH', amount: 85.50, type: 'Debit', account: '401RESTO', accountLabel: 'Resto Le Gourmet', status: 'missing_doc', pieceRef: 'AC-23-452' },
  { id: 'e4', clientId: '1', date: formatDate(subDays(today, 12)), label: 'FACTURE EDF PRO', journal: 'ACH', amount: 312.45, type: 'Debit', account: '401EDF', accountLabel: 'EDF Entreprises', status: 'missing_doc', pieceRef: 'AC-23-453' },
  { id: 'e5', clientId: '4', date: formatDate(subDays(today, 40)), label: 'VENTE CLIENT X', journal: 'VTE', amount: 5000.00, type: 'Credit', account: '411CLIENTX', accountLabel: 'Client X SARL', status: 'missing_doc', pieceRef: 'VT-23-101' },
  { id: 'e6', clientId: '1', date: formatDate(subDays(today, 38)), label: 'PRESTATION CONSEIL', journal: 'VTE', amount: 1500.00, type: 'Credit', account: '411CONSEIL', accountLabel: 'Conseil & Co', status: 'missing_doc', pieceRef: 'VT-23-102' },
  
  // More entries for testing groups
  { id: 'e7', clientId: '3', date: formatDate(subDays(today, 5)), label: 'KILOUTOU', journal: 'ACH', amount: 450.00, type: 'Debit', account: '401KILOUTOU', accountLabel: 'Kiloutou', status: 'missing_doc', pieceRef: 'AC-23-460' },
  { id: 'e8', clientId: '3', date: formatDate(subDays(today, 4)), label: 'TOTAL ENERGIES', journal: 'ACH', amount: 120.00, type: 'Debit', account: '401TOTAL', accountLabel: 'Total Energies', status: 'missing_doc', pieceRef: 'AC-23-461' },
  { id: 'e9', clientId: '2', date: formatDate(subDays(today, 2)), label: 'METRO CASH CARRY', journal: 'ACH', amount: 840.20, type: 'Debit', account: '401METRO', accountLabel: 'Metro', status: 'missing_doc', isUrgent: true, pieceRef: 'AC-23-462' },
  
  // Encaissements / Bank entries
  { id: 'e10', clientId: '1', date: formatDate(subDays(today, 45)), label: 'VIREMENT RECU', journal: 'BQ', amount: 1500.00, type: 'Debit', account: '512000', accountLabel: 'Banque Populaire', status: 'missing_doc', pieceRef: 'BQ-10-001' },
  { id: 'e11', clientId: '1', date: formatDate(subDays(today, 42)), label: 'PRLV URSSAF', journal: 'BQ', amount: 450.00, type: 'Credit', account: '512000', accountLabel: 'Banque Populaire', status: 'missing_doc', pieceRef: 'BQ-10-005' },
  
  // OD Entries
  { id: 'e12', clientId: '1', date: formatDate(subDays(today, 30)), label: 'TVA A DECAISSER', journal: 'OD', amount: 2340.00, type: 'Credit', account: '445510', accountLabel: 'TVA à décaisser', status: 'validated', pieceRef: 'OD-10-001' },
  { id: 'e13', clientId: '1', date: formatDate(subDays(today, 30)), label: 'SALAIRES OCTOBRE', journal: 'OD', amount: 12500.00, type: 'Debit', account: '421000', accountLabel: 'Personnel - Rémunérations', status: 'validated', pieceRef: 'OD-10-002' },
];
