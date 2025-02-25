import { getDatabase, ref, increment, update } from 'firebase/database';

export async function trackScan(qrcodeId: string, shortCode: string) {
  const db = getDatabase();
  const updates = {
    [`qrcodes/${qrcodeId}/scans`]: increment(1),
    [`shortUrls/${shortCode}/scans`]: increment(1)
  };
  await update(ref(db), updates);
} 