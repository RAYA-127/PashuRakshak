// Offline sync manager using localStorage for queued field records

const QUEUE_KEY = 'pashurakshak_offline_queue';

export interface QueuedRecord {
  id: string;
  taskId: string;
  animalTag: string;
  temperature: string;
  heartRate: string;
  bloodSampleId: string;
  tissueSwab: boolean;
  isolated: boolean;
  notes: string;
  queuedAt: string;
}

export function getQueuedRecords(): QueuedRecord[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToQueue(record: Omit<QueuedRecord, 'id' | 'queuedAt'>): QueuedRecord {
  const queue = getQueuedRecords();
  const newRecord: QueuedRecord = {
    ...record,
    id: `q-${Date.now()}`,
    queuedAt: new Date().toISOString(),
  };
  queue.push(newRecord);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return newRecord;
}

export function clearQueue(): QueuedRecord[] {
  const queue = getQueuedRecords();
  localStorage.removeItem(QUEUE_KEY);
  return queue;
}

export function getQueueCount(): number {
  return getQueuedRecords().length;
}
