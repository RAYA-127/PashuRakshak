import type { RiskLevel, Species } from './mockData';

export interface ShapFactor {
  label: string;
  contribution: number; // + or - points
  direction: 'positive' | 'negative';
}

export interface TriageResult {
  riskScore: number;
  riskLevel: RiskLevel;
  predictedDisease: string;
  confidence: number;
  shapFactors: ShapFactor[];
  nextSteps: string[];
}

const diseaseMap: Record<string, { disease: string; confidence: number }> = {
  'Lesions/Blisters': { disease: 'Lumpy Skin Disease', confidence: 0.87 },
  'Lameness': { disease: 'Foot-and-Mouth Disease', confidence: 0.78 },
  'Nasal Discharge': { disease: 'Peste des Petits Ruminants', confidence: 0.84 },
  'Reduced Milk Yield': { disease: 'Mastitis', confidence: 0.71 },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function calculateTriage(input: {
  tagId: string;
  species: Species;
  age: number;
  symptoms: string[];
  hasImage: boolean;
  hasVoice: boolean;
  vaccinated: boolean;
}): TriageResult {
  const factors: ShapFactor[] = [];
  let score = 10; // baseline

  // Symptom severity
  const severeSymptoms = ['High Fever', 'Lesions/Blisters', 'Lameness'];
  const mildSymptoms = ['Loss of Appetite', 'Reduced Milk Yield', 'Nasal Discharge'];

  const severeCount = input.symptoms.filter((s) => severeSymptoms.includes(s)).length;
  const mildCount = input.symptoms.filter((s) => mildSymptoms.includes(s)).length;

  if (severeCount > 0) {
    const pts = severeCount * 15;
    score += pts;
    factors.push({ label: `Severe symptoms (${severeCount})`, contribution: pts, direction: 'positive' });
  }
  if (mildCount > 0) {
    const pts = mildCount * 8;
    score += pts;
    factors.push({ label: `Mild symptoms (${mildCount})`, contribution: pts, direction: 'positive' });
  }

  // Local outbreak proximity (mock)
  const nearbyOutbreak = input.symptoms.includes('Lesions/Blisters') || input.symptoms.includes('Lameness');
  if (nearbyOutbreak) {
    score += 25;
    factors.push({ label: 'Local outbreak nearby (10km)', contribution: 25, direction: 'positive' });
  }

  // Vaccination status
  if (input.vaccinated) {
    score -= 10;
    factors.push({ label: 'Fully vaccinated', contribution: -10, direction: 'negative' });
  } else {
    score += 12;
    factors.push({ label: 'Not vaccinated', contribution: 12, direction: 'positive' });
  }

  // Age factor
  if (input.age <= 1) {
    score += 8;
    factors.push({ label: 'Young animal (vulnerable)', contribution: 8, direction: 'positive' });
  } else if (input.age >= 7) {
    score += 5;
    factors.push({ label: 'Older animal', contribution: 5, direction: 'positive' });
  }

  // Image evidence
  if (input.hasImage) {
    score += 6;
    factors.push({ label: 'Image evidence provided', contribution: 6, direction: 'positive' });
  }

  // Voice note
  if (input.hasVoice) {
    score += 2;
    factors.push({ label: 'Voice description added', contribution: 2, direction: 'positive' });
  }

  score = clamp(score, 0, 100);

  let riskLevel: RiskLevel = 'LOW';
  if (score >= 75) riskLevel = 'CRITICAL';
  else if (score >= 55) riskLevel = 'HIGH';
  else if (score >= 30) riskLevel = 'MEDIUM';

  // Determine predicted disease
  const matchedSymptom = input.symptoms.find((s) => diseaseMap[s]);
  const predictedDisease = matchedSymptom
    ? diseaseMap[matchedSymptom].disease
    : input.symptoms.length > 0
      ? 'General Infection (unspecified)'
      : 'Healthy / No significant finding';
  const confidence = matchedSymptom ? diseaseMap[matchedSymptom].confidence : 0.5 + input.symptoms.length * 0.05;

  // Next steps
  const nextSteps: string[] = [];
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    nextSteps.push('Isolate animal immediately from the herd');
    nextSteps.push('Veterinary review requested — field visit will be dispatched');
    nextSteps.push('Avoid movement of animal for 72 hours');
  } else if (riskLevel === 'MEDIUM') {
    nextSteps.push('Monitor animal closely for 48 hours');
    nextSteps.push('Ensure adequate hydration and rest');
    nextSteps.push('Report to veterinarian if symptoms worsen');
  } else {
    nextSteps.push('No immediate action required');
    nextSteps.push('Continue regular health monitoring');
    nextSteps.push('Maintain vaccination schedule');
  }

  // Sort SHAP factors by absolute contribution
  factors.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return { riskScore: Math.round(score), riskLevel, predictedDisease, confidence: clamp(confidence, 0, 1), shapFactors: factors, nextSteps };
}
