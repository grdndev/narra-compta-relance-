export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: 'BTP' | 'Restauration' | 'Services' | 'Commerce' | 'Santé';
  status: 'active' | 'archived';
  lastContact: string;
  pendingDocs: number;
  totalDocs: number;
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
}

export interface AccountingEntry {
  id: string;
  clientId: string; // Added clientId
  date: string;
  label: string;
  journal: 'ACH' | 'VTE' | 'BQ';
  amount: number;
  type: 'Debit' | 'Credit';
  account: string;
  accountLabel: string;
  pieceRef?: string;
  status: 'missing_doc' | 'validated' | 'pending';
  comment?: string;
  isUrgent?: boolean;
  ignored?: boolean; // If user unchecks it (e.g. sent by email/wait 6 months)
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@techsol.fr',
    phone: '06 12 34 56 78',
    company: 'TechSolutions SAS',
    sector: 'Services',
    status: 'active',
    lastContact: '2023-11-15',
    pendingDocs: 3,
    totalDocs: 45,
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'm.martin@bakery.com',
    phone: '06 98 76 54 32',
    company: 'Boulangerie Martin',
    sector: 'Restauration',
    status: 'active',
    lastContact: '2023-11-20',
    pendingDocs: 1,
    totalDocs: 28,
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'contact@durand-btp.fr',
    phone: '07 11 22 33 44',
    company: 'Durand BTP',
    sector: 'BTP',
    status: 'active',
    lastContact: '2023-10-30',
    pendingDocs: 5,
    totalDocs: 120,
  },
  {
    id: '4',
    name: 'Sophie Lefebvre',
    email: 'sophie@designstudio.net',
    phone: '06 55 44 33 22',
    company: 'Lefebvre Design',
    sector: 'Services',
    status: 'active',
    lastContact: '2023-11-22',
    pendingDocs: 0,
    totalDocs: 15,
  },
  {
    id: '5',
    name: 'Dr. Lucas Bernard',
    email: 'l.bernard@cabinet-medical.fr',
    phone: '06 11 22 33 44',
    company: 'Cabinet Médical Bernard',
    sector: 'Santé',
    status: 'active',
    lastContact: '2023-11-25',
    pendingDocs: 2,
    totalDocs: 30,
  },
  {
    id: '6',
    name: 'Julie Dubois',
    email: 'julie@pretaporter.com',
    phone: '06 99 88 77 66',
    company: 'Mode & Co',
    sector: 'Commerce',
    status: 'active',
    lastContact: '2023-11-18',
    pendingDocs: 4,
    totalDocs: 50,
  }
];

export const mockDocuments: Document[] = [
  { id: 'd1', clientId: '1', name: 'Facture Orange Octobre', type: 'Facture', status: 'missing', dueDate: '2023-11-30', accountCode: '401' },
  { id: 'd2', clientId: '1', name: 'Relevé Bancaire Septembre', type: 'Relevé', status: 'missing', dueDate: '2023-10-31', accountCode: '512' },
  { id: 'd3', clientId: '1', name: 'TVA T3 2023', type: 'Autre', status: 'received', dueDate: '2023-10-20' },
  { id: 'd4', clientId: '1', name: 'Facture EDF', type: 'Facture', status: 'missing', dueDate: '2023-11-15', accountCode: '401' },
  
  { id: 'd5', clientId: '2', name: 'Justificatif URSSAF', type: 'Autre', status: 'missing', dueDate: '2023-11-05', accountCode: '431' },
  
  { id: 'd6', clientId: '3', name: 'Facture Matériaux Bois', type: 'Facture', status: 'missing', dueDate: '2023-11-10', accountCode: '401' },
  { id: 'd7', clientId: '3', name: 'Facture Location Engin', type: 'Facture', status: 'missing', dueDate: '2023-11-12', accountCode: '401' },
  { id: 'd8', clientId: '3', name: 'Relevé Octobre', type: 'Relevé', status: 'missing', dueDate: '2023-11-30', accountCode: '512' },
  { id: 'd9', clientId: '3', name: 'Facture Carburant', type: 'Facture', status: 'missing', dueDate: '2023-11-25', accountCode: '401' },
  { id: 'd10', clientId: '3', name: 'Note de Frais Octobre', type: 'Autre', status: 'missing', dueDate: '2023-11-30', accountCode: '471' },
];

export const mockReminders: Reminder[] = [
  { id: 'r1', clientId: '1', date: '2023-11-15', type: 'automatic', status: 'opened', subject: 'Rappel : Documents manquants' },
  { id: 'r2', clientId: '3', date: '2023-10-30', type: 'email', status: 'sent', subject: 'Relance urgente - Clôture' },
  { id: 'r3', clientId: '2', date: '2023-11-20', type: 'automatic', status: 'sent', subject: 'Vos documents comptables' },
];

export const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'Rappel Paiement CFE', status: 'sent', sentDate: '2023-12-10', recipientCount: 40, openRate: 82, targetSector: 'All' },
  { id: 'c2', name: 'Collecte TVA Trimestrielle', status: 'scheduled', sentDate: '2024-01-05', recipientCount: 15, targetSector: 'All' },
  { id: 'c3', name: 'Info Secteur BTP - Changement Taux', status: 'draft', recipientCount: 8, targetSector: 'BTP' },
];

export const mockAccountingEntries: AccountingEntry[] = [
  { id: 'e1', clientId: '1', date: '2023-10-15', label: 'FACTURE ORANGE', journal: 'ACH', amount: 45.90, type: 'Debit', account: '401ORANGE', accountLabel: 'Orange SA', status: 'missing_doc', isUrgent: false },
  { id: 'e2', clientId: '3', date: '2023-10-22', label: 'LEROY MERLIN MATERIAUX', journal: 'ACH', amount: 1250.00, type: 'Debit', account: '401LEROY', accountLabel: 'Leroy Merlin Pro', status: 'missing_doc', isUrgent: true, comment: "Gros montant" },
  { id: 'e3', clientId: '2', date: '2023-10-25', label: 'RESTAURANT LE GOURMET', journal: 'ACH', amount: 85.50, type: 'Debit', account: '401RESTO', accountLabel: 'Resto Le Gourmet', status: 'missing_doc' },
  { id: 'e4', clientId: '1', date: '2023-10-28', label: 'FACTURE EDF PRO', journal: 'ACH', amount: 312.45, type: 'Debit', account: '401EDF', accountLabel: 'EDF Entreprises', status: 'missing_doc' },
  { id: 'e5', clientId: '4', date: '2023-10-05', label: 'VENTE CLIENT X', journal: 'VTE', amount: 5000.00, type: 'Credit', account: '411CLIENTX', accountLabel: 'Client X SARL', status: 'missing_doc' },
  { id: 'e6', clientId: '1', date: '2023-10-12', label: 'PRESTATION CONSEIL', journal: 'VTE', amount: 1500.00, type: 'Credit', account: '411CONSEIL', accountLabel: 'Conseil & Co', status: 'missing_doc' },
  
  // Adding more entries for full testing
  { id: 'e7', clientId: '3', date: '2023-11-01', label: 'KILOUTOU', journal: 'ACH', amount: 450.00, type: 'Debit', account: '401KILOUTOU', accountLabel: 'Kiloutou', status: 'missing_doc' },
  { id: 'e8', clientId: '3', date: '2023-11-05', label: 'TOTAL ENERGIES', journal: 'ACH', amount: 120.00, type: 'Debit', account: '401TOTAL', accountLabel: 'Total Energies', status: 'missing_doc' },
  { id: 'e9', clientId: '2', date: '2023-11-10', label: 'METRO CASH CARRY', journal: 'ACH', amount: 840.20, type: 'Debit', account: '401METRO', accountLabel: 'Metro', status: 'missing_doc', isUrgent: true },
];
