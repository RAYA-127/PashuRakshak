import { useState } from 'react';
import {
  Search, Upload, Mic, Send, ImageIcon, AlertTriangle, CheckCircle2,
  ArrowRight, Activity, Shield, MapPin, Loader2, X
} from 'lucide-react';
import { mockAnimals, speciesList, symptomList, type Species } from '@/services/mockData';
import { calculateTriage, type TriageResult } from '@/services/triageEngine';
import { RiskBadge } from '@/components/ui/Badge';
import { RiskGauge } from '@/components/ui/RiskGauge';

export function FarmerPortal() {
  const [tagId, setTagId] = useState('');
  const [species, setSpecies] = useState<Species>('Cattle');
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [hasImage, setHasImage] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);

  const matchedAnimal = mockAnimals.find((a) => a.tagId === tagId);

  function toggleSymptom(s: string) {
    setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function handleImageUpload() {
    setHasImage(true);
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  }

  function handleVoiceRecord() {
    if (hasVoice) { setHasVoice(false); return; }
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasVoice(true);
    }, 2000);
  }

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      const res = calculateTriage({
        tagId, species, age: parseInt(age) || 3,
        symptoms, hasImage, hasVoice,
        vaccinated: matchedAnimal?.vaccinated ?? false,
      });
      setResult(res);
      setSubmitting(false);
    }, 1800);
  }

  function resetForm() {
    setResult(null);
    setTagId(''); setAge(''); setSymptoms([]);
    setHasImage(false); setHasVoice(false);
  }

  if (result) {
    return <TriageResultCard result={result} onReset={resetForm} />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 animate-fade-up">
        <h2 className="font-display text-2xl font-bold text-ink-900">Report Sick Animal</h2>
        <p className="mt-1 text-sm text-ink-500">Submit symptoms and photos for AI-assisted triage. Results appear instantly.</p>
      </div>

      <div className="space-y-5">
        {/* Tag ID Lookup */}
        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <label className="mb-2 block text-sm font-semibold text-ink-700">Pashu Aadhaar / Tag ID</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              placeholder="e.g. PA-1029384756"
              className="w-full rounded-lg border border-ink-200 pl-10 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-safe-400 focus:ring-2 focus:ring-safe-100"
            />
          </div>
          {matchedAnimal && (
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-safe-50 border border-safe-200 p-3 animate-scale-in">
              <CheckCircle2 className="h-5 w-5 text-safe-500" />
              <div className="text-sm">
                <p className="font-medium text-safe-800">{matchedAnimal.species} · {matchedAnimal.age} yrs · {matchedAnimal.ownerName}</p>
                <p className="text-safe-600 text-xs">Village: {matchedAnimal.village} · Vaccinated: {matchedAnimal.vaccinated ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {mockAnimals.slice(0, 3).map((a) => (
              <button key={a.id} onClick={() => setTagId(a.tagId)}
                className="rounded-md bg-ink-100 px-2 py-1 text-xs text-ink-500 hover:bg-ink-200 transition-colors">
                {a.tagId}
              </button>
            ))}
          </div>
        </div>

        {/* Species + Age */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <label className="mb-2 block text-sm font-semibold text-ink-700">Animal Species</label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value as Species)}
              className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-safe-400 focus:ring-2 focus:ring-safe-100"
            >
              {speciesList.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <label className="mb-2 block text-sm font-semibold text-ink-700">Age (years)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 4"
              className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-safe-400 focus:ring-2 focus:ring-safe-100"
            />
          </div>
        </div>

        {/* Symptom Checklist */}
        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <label className="mb-3 block text-sm font-semibold text-ink-700">Select Symptoms</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {symptomList.map((s) => {
              const active = symptoms.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? 'border-safe-300 bg-safe-50 text-safe-800 shadow-sm'
                      : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                    active ? 'border-safe-500 bg-safe-500' : 'border-ink-300'
                  }`}>
                    {active && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </span>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Upload + Voice */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <label className="mb-3 block text-sm font-semibold text-ink-700">Image Upload</label>
            {!hasImage ? (
              <button
                onClick={handleImageUpload}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300 py-8 text-ink-400 hover:border-safe-400 hover:text-safe-500 transition-colors"
              >
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm font-medium">Drop photo or tap to upload</span>
                <span className="text-xs">JPG, PNG up to 10MB</span>
              </button>
            ) : (
              <div className="rounded-xl border border-ink-200 p-4">
                {scanning ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <Loader2 className="h-8 w-8 text-safe-500 animate-spin-slow" />
                    <p className="text-sm font-medium text-ink-600">Simulating AI scan...</p>
                    <div className="w-full rounded-full bg-ink-100 h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-safe-400 to-safe-600 rounded-full animate-progress" style={{ ['--progress' as string]: '100%' }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-safe-100">
                      <ImageIcon className="h-6 w-6 text-safe-600" />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-ink-700">photo_uploaded.jpg</p>
                      <p className="text-xs text-safe-600">AI scan complete — lesions detected</p>
                    </div>
                    <button onClick={() => setHasImage(false)} className="text-ink-400 hover:text-danger-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <label className="mb-3 block text-sm font-semibold text-ink-700">Voice Note</label>
            <button
              onClick={handleVoiceRecord}
              className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 py-8 transition-all ${
                isRecording
                  ? 'border-danger-300 bg-danger-50'
                  : hasVoice
                    ? 'border-safe-300 bg-safe-50'
                    : 'border-dashed border-ink-300 hover:border-safe-400'
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                isRecording ? 'bg-danger-500 animate-pulse' : hasVoice ? 'bg-safe-500' : 'bg-ink-100'
              }`}>
                <Mic className={`h-6 w-6 ${isRecording ? 'text-white' : hasVoice ? 'text-white' : 'text-ink-400'}`} />
              </div>
              {isRecording ? (
                <span className="text-sm font-medium text-danger-600">Recording... (2s)</span>
              ) : hasVoice ? (
                <span className="text-sm font-medium text-safe-600">Voice note captured</span>
              ) : (
                <span className="text-sm font-medium text-ink-400">Tap to record voice note</span>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || symptoms.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-safe-600 to-safe-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-safe-600/20 transition-all hover:shadow-xl hover:shadow-safe-600/30 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-up"
          style={{ animationDelay: '0.35s' }}
        >
          {submitting ? (
            <><Loader2 className="h-5 w-5 animate-spin-slow" /> Analyzing symptoms...</>
          ) : (
            <><Send className="h-4 w-4" /> Submit Triage Report</>
          )}
        </button>
        {symptoms.length === 0 && (
          <p className="text-center text-xs text-ink-400">Select at least one symptom to submit</p>
        )}
      </div>
    </div>
  );
}

function TriageResultCard({ result, onReset }: { result: TriageResult; onReset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 animate-fade-up">
        <div className="flex items-center gap-2 text-sm font-medium text-safe-600 mb-1">
          <Activity className="h-4 w-4" /> AI Triage Complete
        </div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Triage Result</h2>
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lg animate-scale-in">
        {/* Score + Badge */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <RiskGauge score={result.riskScore} />
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <RiskBadge level={result.riskLevel} size="md" />
            <div className="text-center sm:text-right">
              <p className="text-xs text-ink-400">Predicted Condition</p>
              <p className="font-display text-lg font-bold text-ink-800">{result.predictedDisease}</p>
              <p className="text-sm text-ink-500">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* SHAP Breakdown */}
        <div className="mt-6 border-t border-ink-100 pt-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-700">
            <Shield className="h-4 w-4 text-safe-600" /> Risk Factor Breakdown (SHAP)
          </h3>
          <div className="space-y-2.5">
            {result.shapFactors.map((f, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                <span className="w-40 text-sm text-ink-600 flex-shrink-0">{f.label}</span>
                <div className="flex-1 relative h-6 rounded bg-ink-50 overflow-hidden">
                  <div
                    className={`absolute top-0 h-full rounded ${f.direction === 'positive' ? 'bg-danger-200 left-1/2' : 'bg-safe-200 right-1/2'}`}
                    style={{ width: `${Math.abs(f.contribution) * 1.5}%` }}
                  />
                  <div className="absolute left-1/2 top-0 h-full w-px bg-ink-300" />
                </div>
                <span className={`w-14 text-right text-sm font-bold ${f.direction === 'positive' ? 'text-danger-600' : 'text-safe-600'}`}>
                  {f.contribution > 0 ? '+' : ''}{f.contribution}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 border-t border-ink-100 pt-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-700">
            <AlertTriangle className="h-4 w-4 text-warn-500" /> Actionable Next Steps
          </h3>
          <ul className="space-y-2">
            {result.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-600 animate-fade-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <ArrowRight className="h-4 w-4 mt-0.5 text-safe-500 flex-shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onReset}
          className="mt-6 w-full rounded-xl border border-ink-200 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50 transition-colors"
        >
          Submit Another Report
        </button>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-400">
        <MapPin className="h-3.5 w-3.5" /> Report forwarded to Veterinary Command Center for review
      </p>
    </div>
  );
}
