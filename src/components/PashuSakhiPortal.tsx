import { useState, useEffect } from 'react';
import {
  ClipboardList, MapPin, Thermometer, Heart, TestTube, ShieldCheck,
  CloudOff, Cloud, Loader2, CheckCircle2, ArrowLeft, Calendar
} from 'lucide-react';
import { mockFieldTasks, type FieldTask } from '@/services/mockData';
import { RiskBadge } from '@/components/ui/Badge';
import { useAppState } from '@/context/AppContext';
import { getQueuedRecords, addToQueue, clearQueue, getQueueCount, type QueuedRecord } from '@/services/offlineSync';

export function PashuSakhiPortal() {
  const { connectivity, showToast } = useAppState();
  const [tasks, setTasks] = useState<FieldTask[]>(mockFieldTasks);
  const [activeTask, setActiveTask] = useState<FieldTask | null>(null);
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  // Form state
  const [temperature, setTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodSampleId, setBloodSampleId] = useState('');
  const [tissueSwab, setTissueSwab] = useState(false);
  const [isolated, setIsolated] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setQueueCount(getQueueCount());
  }, []);

  // When switching to online with queued items, auto-sync
  useEffect(() => {
    if (connectivity === 'online' && queueCount > 0 && !syncing) {
      handleSync();
    }
  }, [connectivity]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSync() {
    const queued = getQueuedRecords();
    if (queued.length === 0) return;
    setSyncing(true);
    showToast(`Syncing ${queued.length} queued field record${queued.length > 1 ? 's' : ''} with central server...`, 'info');
    setTimeout(() => {
      clearQueue();
      setQueueCount(0);
      setSyncing(false);
      showToast(`Sync complete — ${queued.length} record${queued.length > 1 ? 's' : ''} uploaded successfully`, 'success');
    }, 2500);
  }

  function resetForm() {
    setTemperature(''); setHeartRate(''); setBloodSampleId('');
    setTissueSwab(false); setIsolated(false); setNotes('');
  }

  function handleSubmit() {
    if (!activeTask) return;
    const record = {
      taskId: activeTask.id,
      animalTag: activeTask.animalTag,
      temperature, heartRate, bloodSampleId,
      tissueSwab, isolated, notes,
    };

    if (connectivity === 'offline') {
      addToQueue(record);
      setQueueCount(getQueueCount());
      showToast('Inspection saved locally — will sync when back online', 'warning');
    } else {
      showToast('Inspection submitted successfully', 'success');
    }

    // Mark task completed
    setTasks((prev) => prev.map((t) => t.id === activeTask.id ? { ...t, status: 'COMPLETED' } : t));
    setActiveTask(null);
    resetForm();
  }

  // ─── Exam Form View ─────────────────────────────
  if (activeTask) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => setActiveTask(null)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Tasks
        </button>

        <div className="mb-6 animate-fade-up">
          <h2 className="font-display text-2xl font-bold text-ink-900">Field Examination</h2>
          <p className="mt-1 text-sm text-ink-500">Complete the examination checklist for this animal</p>
        </div>

        {/* Animal info card */}
        <div className="mb-5 rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-ink-400">{activeTask.caseId}</p>
              <p className="text-lg font-bold text-ink-800">Tag: {activeTask.animalTag}</p>
              <p className="text-sm text-ink-500 flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5" /> {activeTask.village} · {activeTask.ownerName}
              </p>
            </div>
            <RiskBadge level={activeTask.riskLevel} size="md" />
          </div>
        </div>

        {/* Vital Parameters */}
        <div className="mb-5 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-700">
              <Thermometer className="h-4 w-4 text-danger-500" /> Temperature (°F)
            </label>
            <input
              type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)}
              placeholder="e.g. 101.5"
              className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-safe-400 focus:ring-2 focus:ring-safe-100"
            />
            <p className="mt-1 text-xs text-ink-400">Normal range: 100.5–102.5°F</p>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-700">
              <Heart className="h-4 w-4 text-danger-500" /> Heart Rate (bpm)
            </label>
            <input
              type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)}
              placeholder="e.g. 65"
              className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-safe-400 focus:ring-2 focus:ring-safe-100"
            />
            <p className="mt-1 text-xs text-ink-400">Normal range: 48–84 bpm</p>
          </div>
        </div>

        {/* Sample Collection */}
        <div className="mb-5 rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-700">
            <TestTube className="h-4 w-4 text-blue-500" /> Sample Collection Tracker
          </h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm text-ink-600">Blood Sample ID</label>
              <input
                type="text" value={bloodSampleId} onChange={(e) => setBloodSampleId(e.target.value)}
                placeholder="e.g. BS-2026-0451"
                className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-safe-400 focus:ring-2 focus:ring-safe-100"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                onClick={() => setTissueSwab(!tissueSwab)}
                className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${tissueSwab ? 'border-safe-500 bg-safe-500' : 'border-ink-300'}`}
              >
                {tissueSwab && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
              </button>
              <span className="text-sm text-ink-600">Tissue swab collected</span>
            </label>
          </div>
        </div>

        {/* Isolation */}
        <div className="mb-5 rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              onClick={() => setIsolated(!isolated)}
              className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all ${isolated ? 'border-danger-500 bg-danger-500' : 'border-ink-300'}`}
            >
              {isolated && <CheckCircle2 className="h-4 w-4 text-white" />}
            </button>
            <div>
              <span className="flex items-center gap-2 text-sm font-semibold text-ink-700">
                <ShieldCheck className="h-4 w-4 text-safe-500" /> Quarantine / Isolation Confirmed
              </span>
              <p className="text-xs text-ink-400">Animal has been separated from the herd</p>
            </div>
          </label>
        </div>

        {/* Notes */}
        <div className="mb-5 rounded-2xl border border-ink-200 bg-white p-5 shadow-sm animate-fade-up" style={{ animationDelay: '0.25s' }}>
          <label className="mb-2 block text-sm font-semibold text-ink-700">Field Notes</label>
          <textarea
            value={notes} onChange={(e) => setNotes(e.target.value)}
            rows={3} placeholder="Additional observations..."
            className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-safe-400 focus:ring-2 focus:ring-safe-100 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-safe-600 to-safe-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-safe-600/20 transition-all hover:shadow-xl animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          {connectivity === 'offline' ? (
            <><CloudOff className="h-4 w-4" /> Save to Offline Queue</>
          ) : (
            <><Cloud className="h-4 w-4" /> Submit Inspection</>
          )}
        </button>
        {connectivity === 'offline' && (
          <p className="mt-3 text-center text-xs text-warn-600">Offline mode — record will be stored locally and synced automatically</p>
        )}
      </div>
    );
  }

  // ─── Tasks List View ─────────────────────────────
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 animate-fade-up">
        <h2 className="font-display text-2xl font-bold text-ink-900">Assigned Field Visits</h2>
        <p className="mt-1 text-sm text-ink-500">Tasks assigned by Veterinary Officers</p>
      </div>

      {/* Offline Queue Banner */}
      {queueCount > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-warn-200 bg-warn-50 p-4 animate-fade-up">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warn-100">
            {syncing ? <Loader2 className="h-5 w-5 text-warn-600 animate-spin-slow" /> : <CloudOff className="h-5 w-5 text-warn-600" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-warn-800">
              {syncing ? `Syncing ${queueCount} queued record${queueCount > 1 ? 's' : ''}...` : `${queueCount} record${queueCount > 1 ? 's' : ''} queued offline`}
            </p>
            <p className="text-xs text-warn-600">
              {syncing ? 'Uploading to central server' : connectivity === 'online' ? 'Will sync automatically' : 'Switch to online mode to sync'}
            </p>
          </div>
          {connectivity === 'online' && !syncing && (
            <button onClick={handleSync} className="rounded-lg bg-warn-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-warn-700 transition-colors">
              Sync Now
            </button>
          )}
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.filter((t) => t.status !== 'COMPLETED').length === 0 && (
          <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center animate-fade-up">
            <CheckCircle2 className="mx-auto h-10 w-10 text-safe-400" />
            <p className="mt-3 text-sm font-medium text-ink-500">All tasks completed</p>
          </div>
        )}
        {tasks.filter((t) => t.status !== 'COMPLETED').map((task, i) => (
          <div
            key={task.id}
            className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow animate-fade-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-ink-400">{task.caseId}</span>
                  {task.status === 'IN_PROGRESS' && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">In Progress</span>
                  )}
                </div>
                <p className="mt-1 text-base font-bold text-ink-800">Tag: {task.animalTag}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-ink-500">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {task.village}</span>
                  <span className="flex items-center gap-1"><ClipboardList className="h-3.5 w-3.5" /> {task.ownerName}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Due: {task.dueDate}</span>
                </div>
                <p className="mt-1 text-xs text-ink-400">Assigned by {task.assignedBy}</p>
              </div>
              <RiskBadge level={task.riskLevel} />
            </div>
            <button
              onClick={() => setActiveTask(task)}
              className="mt-4 w-full rounded-lg bg-ink-800 py-2.5 text-sm font-semibold text-white hover:bg-ink-900 transition-colors"
            >
              {task.status === 'IN_PROGRESS' ? 'Continue Visit' : 'Start Visit'}
            </button>
          </div>
        ))}
      </div>

      {/* Completed tasks */}
      {tasks.some((t) => t.status === 'COMPLETED') && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-ink-500">Completed Visits</h3>
          {tasks.filter((t) => t.status === 'COMPLETED').map((task) => (
            <div key={task.id} className="mb-2 flex items-center gap-3 rounded-xl border border-safe-200 bg-safe-50 p-4">
              <CheckCircle2 className="h-5 w-5 text-safe-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-safe-800">{task.animalTag} · {task.village}</p>
                <p className="text-xs text-safe-600">{task.caseId} — submitted</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
