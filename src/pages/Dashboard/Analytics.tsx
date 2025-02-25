/**
 * Analytics component for displaying QR code statistics
 */
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import ScanAnalytics from '../../components/Dashboard/ScanAnalytics';
import { BarChart2, Globe, Smartphone, Chrome } from 'lucide-react';
import { Card, Select, SelectItem } from '@nextui-org/react';

interface AnalyticsProps {
  qrCodes: any[];
}

export default function Analytics({ qrCodes }: AnalyticsProps) {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQRId, setSelectedQRId] = useState<string | null>(null);

  useEffect(() => {
    const loadScans = async () => {
      console.log('[Analytics] Starting scan loading process');
      if (!auth.currentUser) return;
      
      try {
        console.log('[Analytics] Current user:', auth.currentUser.uid);
        
        const scansQuery = query(
          collection(db, 'analytics', 'scanRecords', 'scans'),
          where('userId', '==', auth.currentUser.uid)
        );
        console.log('[Analytics] Firestore query created:', scansQuery);
        
        const snapshot = await getDocs(scansQuery);
        console.log('[Analytics] Query snapshot received, docs:', snapshot.docs.length);
        
        setScans(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        console.log('[Analytics] Scans data updated:', snapshot.docs.length, 'scans');
      } catch (err) {
        console.error('[Analytics] Error loading scans:', {
          error: err,
          user: auth.currentUser?.uid,
          time: new Date().toISOString()
        });
      } finally {
        console.log('[Analytics] Loading completed');
        setLoading(false);
      }
    };

    loadScans();
  }, [qrCodes]);

  const handleQRSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQRId(e.target.value);
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="p-4 mb-8">
        <Select
          label="Select QR Code"
          placeholder="Choose a QR code to analyze"
          className="max-w-xs"
          onChange={handleQRSelect}
        >
          {qrCodes.map(qr => (
            <SelectItem key={qr.id} value={qr.id}>
              {qr.name}
            </SelectItem>
          ))}
        </Select>
      </Card>

      {selectedQRId ? (
        <ScanAnalytics qrId={selectedQRId} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          Select a QR code to view analytics
        </div>
      )}
    </div>
  );
}