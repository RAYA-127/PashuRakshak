import { useState } from 'react';
import {
  AlertTriangle, Activity, ShieldAlert, ClipboardList, MapPin,
  Check, X, Send, Filter, TrendingUp, Users
} from 'lucide-react';
import { mockCases, mockVillages, mockCusumAlert, type CaseRecord, type CaseStatus } from '@/services/mockData';
import { RiskBadge, StatusBadge, riskColor } from '@/components/ui/Badge';
import { useAppState } from '@/context/AppContext';

type FilterLevel = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export function VetCommandCenter() {
  const { showToast } = useAppState();
  const [cases, setCases] = useState<CaseRecord[]>(mockCases);
  const [filter, setFilter] = useState<FilterLevel>('ALL');
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  const filteredCases = filter === 'ALL' ? cases : cases.filter((c) => c.riskLevel === filter);

  const kpis = [
    { label: 'Active Cases Today', value: cases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'DISMISSED').length, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'High Risk / Critical', value: cases.filter((c) => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL').length, icon: ShieldAlert, color: 'text-danger-600', bg: 'bg-danger-50' },
    { label: 'Confirmed Outbreaks', value: cases.filter((c) => c.status === 'CONFIRMED').length, icon: AlertTriangle, color: 'text-warn-600', bg: 'bg-warn-50' },
    { label: 'Pending Field Visits', value: cases.filter((c) => c.status === 'FIELD_VISIT').length, icon: ClipboardList, color: 'text-safe-600', bg: 'bg-safe-50' },
  ];

  function updateStatus(id: string, status: CaseStatus, msg: string) {
    setCases((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    showToast(msg, status === 'DISMISSED' ? 'warning' : 'success');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <h2 className="font-display text-2xl font-bold text-ink-900">Veterinary Command Center</h2>
        <p className="mt-1 text-sm text-ink-500">Real-time disease surveillance across Jalgaon district</p>
      </div>

      {/* KPI Bar */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-ink-400">{kpi.label}</p>
                  <p className="mt-1 font-display text-3xl font-bold text-ink-900">{kpi.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.bg}`}>
                  <Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CUSUM Alert Banner */}
      {mockCusumAlert.triggered && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-danger-200 bg-gradient-to-r from-danger-50 to-warn-50 p-4 animate-fade-up">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-danger-100">
            <AlertTriangle className="h-5 w-5 text-danger-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-danger-800">CUSUM Alert: Potential {mockCusumAlert.disease} cluster detected</p>
            <p className="text-sm text-danger-600">
              {mockCusumAlert.cases} cases within {mockCusumAlert.radius} radius of {mockCusumAlert.location} — statistical threshold of {mockCusumAlert.threshold} exceeded
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-lg bg-danger-100 px-3 py-1.5 text-xs font-bold text-danger-700">
            <TrendingUp className="h-3.5 w-3.5" /> +40%
          </span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-700">
                <MapPin className="h-4 w-4 text-safe-600" /> Spatial Disease Tracker
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-safe-500" /> Low</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-warn-500" /> Moderate</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> High</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-danger-500" /> Outbreak</span>
              </div>
            </div>

            {/* SVG Map */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-grid bg-ink-50">
              <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full">
                {/* District boundary */}
                <path d="M 10 15 Q 20 8 35 12 L 55 10 Q 70 14 85 20 L 90 35 Q 88 50 80 60 L 65 68 Q 45 72 30 65 L 15 55 Q 8 40 10 15 Z"
                  fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,1" />
                {/* River */}
                <path d="M 15 20 Q 30 30 45 28 Q 60 35 75 45 L 85 55"
                  fill="none" stroke="#bfdbfe" strokeWidth="1.5" opacity="0.6" />
              </svg>

              {/* Village pins */}
              {mockVillages.map((v) => {
                const color = riskColor(v.riskLevel);
                const isSel = selectedPin === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedPin(isSel ? null : v.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${v.lng}%`, top: `${v.lat * 0.75}%` }}
                  >
                    {/* Pulse ring for high/critical */}
                    {(v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL') && (
                      <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ backgroundColor: color }} />
                    )}
                    <span
                      className="relative block rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-125"
                      style={{ backgroundColor: color, width: `${Math.max(10, Math.min(22, v.cases))}px`, height: `${Math.max(10, Math.min(22, v.cases))}px` }}
                    />
                    <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-ink-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {v.name}
                    </span>

                    {/* Tooltip card */}
                    {isSel && (
                      <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-10 w-44 rounded-xl border border-ink-200 bg-white p-3 shadow-lg text-left animate-scale-in">
                        <p className="text-sm font-bold text-ink-800">{v.name}</p>
                        <div className="mt-1.5 space-y-1 text-xs text-ink-500">
                          <p>Cases: <span className="font-semibold text-ink-700">{v.cases}</span></p>
                          <p>High Risk: <span className="font-semibold text-danger-600">{v.highRisk}</span></p>
                          <p>Confirmed: <span className="font-semibold text-warn-600">{v.confirmed}</span></p>
                        </div>
                        <div className="mt-2">
                          <RiskBadge level={v.riskLevel} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-ink-400">Tap any pin to view village case details. Pulsing pins indicate active outbreak zones.</p>
          </div>
        </div>

        {/* Case Review Queue */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-700">
                <ClipboardList className="h-4 w-4 text-safe-600" /> Case Review Queue
              </h3>
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-ink-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterLevel)}
                  className="rounded-md border border-ink-200 px-2 py-1 text-xs text-ink-600 outline-none focus:border-safe-400"
                >
                  <option value="ALL">All Risk</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div className="max-h-[480px] space-y-3 overflow-y-auto scrollbar-thin pr-1">
              {filteredCases.length === 0 && (
                <div className="py-8 text-center text-sm text-ink-400">No cases match this filter</div>
              )}
              {filteredCases.map((c, i) => (
                <div key={c.id} className="rounded-xl border border-ink-100 p-4 hover:border-ink-200 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs font-semibold text-ink-500">{c.id}</p>
                      <p className="text-sm font-bold text-ink-800">{c.predictedDisease}</p>
                      <p className="text-xs text-ink-400">{c.animalTag} · {c.village}</p>
                    </div>
                    <RiskBadge level={c.riskLevel} />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.symptoms.map((s) => (
                      <span key={s} className="rounded bg-ink-100 px-1.5 py-0.5 text-[10px] text-ink-500">{s}</span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge status={c.status} />
                    <span className="text-xs font-bold text-ink-600">{c.riskScore}/100</span>
                  </div>

                  {/* Action buttons */}
                  {c.status === 'PENDING_VET_REVIEW' && (
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => updateStatus(c.id, 'CONFIRMED', `Case ${c.id} confirmed as ${c.predictedDisease}`)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-danger-50 py-2 text-xs font-semibold text-danger-700 hover:bg-danger-100 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" /> Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(c.id, 'DISMISSED', `Case ${c.id} dismissed`)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-ink-100 py-2 text-xs font-semibold text-ink-500 hover:bg-ink-200 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Dismiss
                      </button>
                      <button
                        onClick={() => updateStatus(c.id, 'FIELD_VISIT', `Field worker dispatched for ${c.id}`)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-safe-50 py-2 text-xs font-semibold text-safe-700 hover:bg-safe-100 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" /> Dispatch
                      </button>
                    </div>
                  )}
                  {c.status === 'CONFIRMED' && (
                    <button
                      onClick={() => updateStatus(c.id, 'FIELD_VISIT', `Field worker dispatched for ${c.id}`)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-safe-50 py-2 text-xs font-semibold text-safe-700 hover:bg-safe-100 transition-colors"
                    >
                      <Users className="h-3.5 w-3.5" /> Dispatch Field Worker
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
