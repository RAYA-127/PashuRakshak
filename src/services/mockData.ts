// ─── Types ──────────────────────────────────────────────
export type Species = 'Cattle' | 'Buffalo' | 'Goat' | 'Sheep';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CaseStatus = 'PENDING_VET_REVIEW' | 'CONFIRMED' | 'DISMISSED' | 'FIELD_VISIT' | 'RESOLVED';

export interface Animal {
  id: string;
  tagId: string;
  species: Species;
  age: number;
  ownerId: string;
  ownerName: string;
  village: string;
  vaccinated: boolean;
  healthStatus: 'Healthy' | 'Under Observation' | 'Critical';
}

export interface VillagePin {
  id: string;
  name: string;
  lat: number; // simulated 0-100 grid coords
  lng: number;
  cases: number;
  highRisk: number;
  confirmed: number;
  riskLevel: RiskLevel;
}

export interface CaseRecord {
  id: string;
  animalTag: string;
  species: Species;
  ownerName: string;
  village: string;
  reportedAt: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: CaseStatus;
  predictedDisease: string;
  confidence: number;
  symptoms: string[];
}

export interface FieldTask {
  id: string;
  caseId: string;
  animalTag: string;
  village: string;
  ownerName: string;
  riskLevel: RiskLevel;
  assignedBy: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
}

export interface CusumAlert {
  id: string;
  disease: string;
  location: string;
  radius: string;
  cases: number;
  threshold: number;
  triggered: boolean;
}

// ─── Mock Data ──────────────────────────────────────────
export const mockAnimals: Animal[] = [
  { id: '1', tagId: 'PA-1029384756', species: 'Cattle', age: 4, ownerId: 'u1', ownerName: 'Ramesh Patil', village: 'Shirpur', vaccinated: true, healthStatus: 'Healthy' },
  { id: '2', tagId: 'PA-1029384760', species: 'Buffalo', age: 3, ownerId: 'u2', ownerName: 'Sunita Devi', village: 'Bhusawal', vaccinated: true, healthStatus: 'Under Observation' },
  { id: '3', tagId: 'PA-1029384772', species: 'Goat', age: 2, ownerId: 'u3', ownerName: 'Arjun Yadav', village: 'Chopda', vaccinated: false, healthStatus: 'Critical' },
  { id: '4', tagId: 'PA-1029384788', species: 'Cattle', age: 5, ownerId: 'u4', ownerName: 'Kishan More', village: 'Pachora', vaccinated: true, healthStatus: 'Healthy' },
  { id: '5', tagId: 'PA-1029384801', species: 'Sheep', age: 1, ownerId: 'u5', ownerName: 'Meena Joshi', village: 'Jalgaon', vaccinated: false, healthStatus: 'Under Observation' },
];

export const mockVillages: VillagePin[] = [
  { id: 'v1', name: 'Shirpur', lat: 35, lng: 30, cases: 14, highRisk: 5, confirmed: 3, riskLevel: 'HIGH' },
  { id: 'v2', name: 'Bhusawal', lat: 55, lng: 45, cases: 8, highRisk: 2, confirmed: 1, riskLevel: 'MEDIUM' },
  { id: 'v3', name: 'Chopda', lat: 25, lng: 60, cases: 21, highRisk: 9, confirmed: 5, riskLevel: 'CRITICAL' },
  { id: 'v4', name: 'Pachora', lat: 70, lng: 25, cases: 4, highRisk: 0, confirmed: 0, riskLevel: 'LOW' },
  { id: 'v5', name: 'Jalgaon', lat: 48, lng: 55, cases: 11, highRisk: 4, confirmed: 2, riskLevel: 'MEDIUM' },
  { id: 'v6', name: 'Dharangaon', lat: 40, lng: 70, cases: 6, highRisk: 1, confirmed: 0, riskLevel: 'MEDIUM' },
  { id: 'v7', name: 'Erandol', lat: 62, lng: 65, cases: 3, highRisk: 0, confirmed: 0, riskLevel: 'LOW' },
  { id: 'v8', name: 'Raver', lat: 78, lng: 50, cases: 9, highRisk: 3, confirmed: 1, riskLevel: 'MEDIUM' },
];

export const mockCases: CaseRecord[] = [
  { id: 'PR-10231', animalTag: 'PA-1029384772', species: 'Goat', ownerName: 'Arjun Yadav', village: 'Chopda', reportedAt: '2026-09-04T08:30:00', riskScore: 88, riskLevel: 'CRITICAL', status: 'PENDING_VET_REVIEW', predictedDisease: 'Peste des Petits Ruminants', confidence: 0.91, symptoms: ['High Fever', 'Lesions/Blisters', 'Nasal Discharge'] },
  { id: 'PR-10230', animalTag: 'PA-1029384760', species: 'Buffalo', ownerName: 'Sunita Devi', village: 'Bhusawal', reportedAt: '2026-09-04T07:15:00', riskScore: 62, riskLevel: 'HIGH', status: 'FIELD_VISIT', predictedDisease: 'Foot-and-Mouth Disease', confidence: 0.78, symptoms: ['Lameness', 'Lesions/Blisters', 'Reduced Milk Yield'] },
  { id: 'PR-10229', animalTag: 'PA-1029384756', species: 'Cattle', ownerName: 'Ramesh Patil', village: 'Shirpur', reportedAt: '2026-09-04T06:45:00', riskScore: 74, riskLevel: 'HIGH', status: 'CONFIRMED', predictedDisease: 'Lumpy Skin Disease', confidence: 0.87, symptoms: ['Lesions/Blisters', 'High Fever', 'Loss of Appetite'] },
  { id: 'PR-10228', animalTag: 'PA-1029384801', species: 'Sheep', ownerName: 'Meena Joshi', village: 'Jalgaon', reportedAt: '2026-09-03T18:20:00', riskScore: 45, riskLevel: 'MEDIUM', status: 'PENDING_VET_REVIEW', predictedDisease: 'Endoparasitic Infection', confidence: 0.64, symptoms: ['Loss of Appetite', 'Reduced Milk Yield'] },
  { id: 'PR-10227', animalTag: 'PA-1029384788', species: 'Cattle', ownerName: 'Kishan More', village: 'Pachora', reportedAt: '2026-09-03T14:10:00', riskScore: 18, riskLevel: 'LOW', status: 'DISMISSED', predictedDisease: 'Healthy / No significant finding', confidence: 0.92, symptoms: ['Loss of Appetite'] },
  { id: 'PR-10226', animalTag: 'PA-1029384760', species: 'Buffalo', ownerName: 'Sunita Devi', village: 'Bhusawal', reportedAt: '2026-09-03T11:05:00', riskScore: 51, riskLevel: 'MEDIUM', status: 'RESOLVED', predictedDisease: 'Mastitis', confidence: 0.71, symptoms: ['Reduced Milk Yield', 'High Fever'] },
];

export const mockFieldTasks: FieldTask[] = [
  { id: 'ft-01', caseId: 'PR-10230', animalTag: 'PA-1029384760', village: 'Bhusawal', ownerName: 'Sunita Devi', riskLevel: 'HIGH', assignedBy: 'Dr. Pawar', status: 'ASSIGNED', dueDate: '2026-09-04' },
  { id: 'ft-02', caseId: 'PR-10229', animalTag: 'PA-1029384756', village: 'Shirpur', ownerName: 'Ramesh Patil', riskLevel: 'HIGH', assignedBy: 'Dr. Pawar', status: 'IN_PROGRESS', dueDate: '2026-09-04' },
  { id: 'ft-03', caseId: 'PR-10231', animalTag: 'PA-1029384772', village: 'Chopda', ownerName: 'Arjun Yadav', riskLevel: 'CRITICAL', assignedBy: 'Dr. Deshmukh', status: 'ASSIGNED', dueDate: '2026-09-04' },
];

export const mockCusumAlert: CusumAlert = {
  id: 'cusum-001',
  disease: 'Foot-and-Mouth Disease',
  location: 'Shirpur',
  radius: '10km',
  cases: 14,
  threshold: 10,
  triggered: true,
};

export const symptomList = [
  'High Fever',
  'Lesions/Blisters',
  'Lameness',
  'Loss of Appetite',
  'Reduced Milk Yield',
  'Nasal Discharge',
] as const;

export const speciesList: Species[] = ['Cattle', 'Buffalo', 'Goat', 'Sheep'];
