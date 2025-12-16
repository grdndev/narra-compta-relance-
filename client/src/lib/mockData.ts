export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
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

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@techsol.fr',
    phone: '06 12 34 56 78',
    company: 'TechSolutions SAS',
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
    status: 'active',
    lastContact: '2023-11-22',
    pendingDocs: 0,
    totalDocs: 15,
  },
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
