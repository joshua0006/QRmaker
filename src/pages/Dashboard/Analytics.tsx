/**
 * Analytics component for displaying QR code statistics
 */
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { BarChart2, Globe, Smartphone, Chrome, Clock, Users, ArrowUpRight, Link as LinkIcon } from 'lucide-react';
import { Card, Skeleton } from '@nextui-org/react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface AnalyticsProps {
  selectedQRId: string;
}

interface ScanData {
  timestamp: Date;
  platform: string;
  referrer: string;
  deviceType: string;
}

export default function Analytics({ selectedQRId }: AnalyticsProps) {
  const [scans, setScans] = useState<ScanData[]>([]);
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Analytics component loaded with ID:", selectedQRId);
    const loadAnalytics = async () => {
      if (!selectedQRId) {
        console.error("No QR code ID selected");
        setError("No QR code selected");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log("Loading analytics for QR code:", selectedQRId);
        
        // Get QR code document directly
        const qrDoc = await getDoc(doc(db, 'qrcodes', selectedQRId));
        
        if (qrDoc.exists()) {
          console.log("QR code found:", qrDoc.data());
          setQrData(qrDoc.data());
          
          // Get scan data
          const scansCol = collection(db, 'qrcodes', selectedQRId, 'scans');
          const snapshot = await getDocs(scansCol);
          console.log("Found scan records:", snapshot.docs.length);
          
          const scanData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              ...data,
              timestamp: data.timestamp?.toDate() || new Date()
            };
          });
          
          setScans(scanData as ScanData[]);
          setError(null);
        } else {
          console.error("QR code not found");
          setError("QR code not found");
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedQRId]);

  const processData = () => {
    const dailyCounts: { [key: string]: number } = {};
    const devices: { [key: string]: number } = {};
    const referrers: { [key: string]: number } = {};

    scans.forEach(scan => {
      // Make sure timestamp exists before using it
      if (scan.timestamp) {
        // Daily counts
        const date = scan.timestamp.toLocaleDateString();
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      }

      // Device types
      const device = scan.deviceType || 'Unknown';
      devices[device] = (devices[device] || 0) + 1;

      // Referrers
      const ref = scan.referrer || 'Direct';
      referrers[ref] = (referrers[ref] || 0) + 1;
    });

    return { dailyCounts, devices, referrers };
  };

  const { dailyCounts, devices, referrers } = processData();

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Scans</p>
              <p className="text-3xl font-bold">{scans.length}</p>
            </div>
            <BarChart2 className="w-8 h-8 text-indigo-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Scan</p>
              <p className="text-3xl font-bold">
                {scans.length > 0 && scans[0]?.timestamp 
                  ? scans[0].timestamp.toLocaleDateString() 
                  : 'Never'}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Devices</p>
              <p className="text-3xl font-bold">{Object.keys(devices).length}</p>
            </div>
            <Smartphone className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Scan Timeline Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Scan Activity Over Time
        </h2>
        <div className="h-96">
          {Object.keys(dailyCounts).length > 0 ? (
            <Bar
              data={{
                labels: Object.keys(dailyCounts),
                datasets: [{
                  label: 'Daily Scans',
                  data: Object.values(dailyCounts),
                  backgroundColor: '#6366f1',
                  borderRadius: 8,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: '#e5e7eb' }
                  },
                  x: {
                    grid: { display: false }
                  }
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No scan data available</p>
            </div>
          )}
        </div>
      </Card>

      {/* Device & Referrer Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            Device Types
          </h2>
          {Object.keys(devices).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(devices).map(([device, count]) => (
                <div key={device} className="flex items-center justify-between">
                  <span className="text-gray-600">{device}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No device data available</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Traffic Sources
          </h2>
          {Object.keys(referrers).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(referrers).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-gray-600">{source}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No referrer data available</p>
          )}
        </Card>
      </div>
    </div>
  );
}