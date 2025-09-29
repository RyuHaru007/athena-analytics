import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Activity, 
  Users, 
  Zap, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Globe
} from 'lucide-react';
import MetricCard from '../Common/MetricCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import { generateMockRequestData, generateWebAutomationData } from '../../utils/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MainDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<any[]>([]);
  const [webAutomationData, setWebAutomationData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const requests = generateMockRequestData(30);
      const webData = generateWebAutomationData();
      
      setRequestData(requests);
      setWebAutomationData(webData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate metrics
  const totalRequests = requestData.length;
  const successfulRequests = requestData.filter(r => r.success).length;
  const totalTokens = requestData.reduce((sum, r) => sum + r.tokensIn + r.tokensOut, 0);
  const avgResponseTime = requestData.length > 0 
    ? requestData.reduce((sum, r) => sum + r.responseTime, 0) / requestData.length 
    : 0;

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyRequests = last7Days.map(date => {
    return requestData.filter(r => 
      r.timestamp.toISOString().split('T')[0] === date
    ).length;
  });

  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    return requestData.filter(r => r.timestamp.getHours() === hour).length;
  });

  const modelDistribution = requestData.reduce((acc, request) => {
    acc[request.model] = (acc[request.model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const requestsChartData = {
    labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Requests',
        data: dailyRequests,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const hourlyChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Hourly Requests',
        data: hourlyData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const modelChartData = {
    labels: Object.keys(modelDistribution),
    datasets: [
      {
        data: Object.values(modelDistribution),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
          '#84CC16',
          '#F97316',
        ],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard data..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Main Dashboard</h1>
        <p className="text-gray-600">Real-time analytics and system overview</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          change={12.5}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Success Rate"
          value={`${((successfulRequests / totalRequests) * 100).toFixed(1)}%`}
          change={2.3}
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <MetricCard
          title="Total Tokens"
          value={`${(totalTokens / 1000000).toFixed(1)}M`}
          change={8.7}
          icon={<Zap className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${avgResponseTime.toFixed(0)}ms`}
          change={-3.2}
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Trends (7 Days)</h3>
          <div className="h-64">
            <Line 
              data={requestsChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }} 
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Distribution</h3>
          <div className="h-64">
            <Bar 
              data={hourlyChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Usage</h3>
          <div className="h-64">
            <Doughnut 
              data={modelChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }} 
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-500" />
            Web Automation Activity
          </h3>
          <div className="space-y-4">
            {webAutomationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{item.genre}</p>
                    <p className="text-sm text-gray-600">{item.requests} requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {(item.successRate * 100).toFixed(1)}% success
                  </p>
                  <p className="text-xs text-gray-500">
                    {(item.avgDuration / 1000).toFixed(1)}s avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;