import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { ArrowTopRightOnSquareIcon, ChartBarIcon, CalendarIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
Chart.register(...registerables);

export default function AnalyticsView() {
  const { uniqueId } = useParams();
  const [scanData, setScanData] = useState<any[]>([]);
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch QR code metadata
        const qrQuery = query(collection(db, 'qrcodes'), where('uniqueId', '==', uniqueId));
        const qrSnapshot = await getDocs(qrQuery);
        const qrDoc = qrSnapshot.docs[0];
        setQrData(qrDoc.data());

        // Fetch scan data
        const scansQuery = query(collection(db, 'qrcodes', qrDoc.id, 'scans'));
        const scansSnapshot = await getDocs(scansQuery);
        setScanData(scansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uniqueId]);

  // Process data for charts
  const processChartData = () => {
    const dailyScans: { [key: string]: number } = {};
    const deviceTypes: { [key: string]: number } = {};
    const referrers: { [key: string]: number } = {};

    scanData.forEach(scan => {
      // Daily scans
      const date = new Date(scan.timestamp?.toDate() || scan.timestamp).toLocaleDateString();
      dailyScans[date] = (dailyScans[date] || 0) + 1;

      // Device types
      const platform = scan.platform || 'Unknown';
      deviceTypes[platform] = (deviceTypes[platform] || 0) + 1;

      // Referrers
      const referrer = scan.referrer || 'Direct';
      referrers[referrer] = (referrers[referrer] || 0) + 1;
    });

    return { dailyScans, deviceTypes, referrers };
  };

  const { dailyScans, deviceTypes, referrers } = processChartData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-lg shadow p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{qrData?.name} Analytics</h1>
            <p className="text-gray-600 mt-2">
              <span className="inline-flex items-center gap-1">
                <DevicePhoneMobileIcon className="w-4 h-4" />
                {scanData.length} total scans
              </span>
            </p>
          </div>
          <a
            href={qrData?.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            View QR Code
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Scans</p>
                <p className="text-2xl font-bold">{scanData.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <CalendarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Scan</p>
                <p className="text-2xl font-bold">
                  {new Date(scanData[0]?.timestamp?.toDate() || scanData[0]?.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Add more stat cards as needed */}
        </div>

        {/* Scan Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Scan Trends</h2>
          <div className="h-96">
            <Line
              data={{
                labels: Object.keys(dailyScans),
                datasets: [{
                  label: 'Daily Scans',
                  data: Object.values(dailyScans),
                  borderColor: '#4f46e5',
                  backgroundColor: '#6366f11a',
                  tension: 0.3,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        </div>

        {/* Device Types Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Device Types</h2>
            <div className="h-64">
              <Line
                data={{
                  labels: Object.keys(deviceTypes),
                  datasets: [{
                    label: 'Devices',
                    data: Object.values(deviceTypes),
                    borderColor: '#10b981',
                    backgroundColor: '#34d3991a',
                    tension: 0.3,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </div>

          {/* Referrer Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
            <div className="h-64">
              <Line
                data={{
                  labels: Object.keys(referrers),
                  datasets: [{
                    label: 'Referrers',
                    data: Object.values(referrers),
                    borderColor: '#f59e0b',
                    backgroundColor: '#fcd34d1a',
                    tension: 0.3,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}