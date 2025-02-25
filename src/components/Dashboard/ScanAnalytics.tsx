import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { DevicePhoneMobileIcon, DeviceTabletIcon, ComputerDesktopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, Query } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Device type colors
const DEVICE_COLORS = {
  Mobile: '#6366f1',
  Tablet: '#8b5cf6',
  Desktop: '#10b981'
};

interface ScanAnalyticsProps {
  qrId: string;
}

interface ReferrerData {
  name: string;
  value: number;
  utm?: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
  };
}

interface ScanData {
  timestamp: Date;
  userAgent: string;
  utm?: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
  };
}

interface ProcessedData {
  dailyData: { date: string; count: number }[];
  deviceData: { name: string; value: number }[];
  referrerData: ReferrerData[];
}

export default function ScanAnalytics({ qrId }: ScanAnalyticsProps) {
  const [scansQuery, setScansQuery] = useState<Query | null>(null);

  useEffect(() => {
    if (qrId) {
      setScansQuery(collection(db, 'qrcodes', qrId, 'scans'));
    }
  }, [qrId]);

  const [scans, loading, error] = useCollectionData(scansQuery);

  if (!qrId) {
    return <div>No QR Code selected</div>;
  }

  if (loading) {
    return <div>Loading scan data...</div>;
  }

  if (error) {
    return <div>Error loading scans: {error.message}</div>;
  }

  const processData = (data: any[]): ProcessedData => {
    if (!data || data.length === 0) return {
      dailyData: [],
      deviceData: [],
      referrerData: []
    };

    const dailyCounts = data.reduce((acc, scan) => {
      // Convert Firestore Timestamp to Date
      const timestamp = scan.timestamp?.toDate 
        ? scan.timestamp.toDate() 
        : new Date(scan.timestamp);
        
      const date = format(timestamp, 'MMM dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    console.log('[Analytics] Daily counts processed:', dailyCounts);

    // Calculate device breakdown
    const devices = data.reduce((acc, scan) => {
      const ua = scan.userAgent.toLowerCase();
      let deviceType = 'Desktop';
      
      if (ua.match(/mobile|android|iphone|ipad|ipod/)) {
        deviceType = ua.match(/tablet|ipad/) ? 'Tablet' : 'Mobile';
      }
      
      acc[deviceType] = (acc[deviceType] || 0) + 1;
      return acc;
    }, {});
    console.log('[Analytics] Device breakdown processed:', devices);

    // Calculate referrer breakdown with UTM data
    const referrers = data.reduce((acc, scan) => {
      const source = scan.utm?.source || 'direct';
      const medium = scan.utm?.medium || 'none';
      const name = `${source} / ${medium}`;
      
      if (!acc[name]) {
        acc[name] = {
          count: 0,
          utm: scan.utm
        };
      }
      acc[name].count += 1;
      return acc;
    }, {});
    console.log('[Analytics] Referrer data processed:', referrers);

    return {
      dailyData: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
      deviceData: Object.entries(devices).map(([name, value]) => ({ name, value })),
      referrerData: Object.entries(referrers)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3)
        .map(([name, data]) => ({ 
          name,
          value: data.count,
          utm: data.utm
        }))
    };
  };

  const { dailyData, deviceData, referrerData } = processData(scans || []);

  const getDeviceType = (userAgent: string) => {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Scan Analytics</h3>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{scans?.length || 0}</p>
            <p className="text-sm text-gray-500">Total Scans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{new Set(scans?.map((s: ScanData) => s.userAgent) || []).size}</p>
            <p className="text-sm text-gray-500">Unique Devices</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart - Daily Scans */}
        <div className="h-64">
          <h4 className="text-sm font-semibold text-gray-600 mb-4">Daily Scan Activity</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#4F46E5" 
                strokeWidth={2}
                dot={{ fill: '#4F46E5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown Pie Chart */}
        <div className="h-64">
          <h4 className="text-sm font-semibold text-gray-600 mb-4">Device Breakdown</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {deviceData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={DEVICE_COLORS[entry.name as keyof typeof DEVICE_COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Referrers List */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-semibold text-gray-600 mb-4">Top Referrers</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {referrerData.map((referrer: ReferrerData, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <GlobeAltIcon className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium truncate">{referrer.name}</p>
                  <p className="text-xs text-gray-500">{referrer.value} scans</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 