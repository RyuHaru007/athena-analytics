import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Activity, Clock, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import { generateMockRequestData } from '../../utils/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const RequestAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<any[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const data = generateMockRequestData(30);
      setRequestData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Processing request analytics..." size="lg" />;
  }

  const successfulRequests = requestData.filter(r => r.success);
  const failedRequests = requestData.filter(r => !r.success);
  const totalTokens = requestData.reduce((sum, r) => sum + r.tokensIn + r.tokensOut, 0);
  const avgResponseTime = requestData.reduce((sum, r) => sum + r.responseTime, 0) / requestData.length;

  // Inference type distribution
  const inferenceTypes = requestData.reduce((acc, request) => {
    acc[request.inferenceType] = (acc[request.inferenceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inferenceTypeData = {
    labels: Object.keys(inferenceTypes),
    datasets: [
      {
        data: Object.values(inferenceTypes),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
          '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Response time trends
  const last24Hours = Array.from({ length: 24 }, (_, hour) => {
    const requests = requestData.filter(r => r.timestamp.getHours() === hour);
    const avgTime = requests.length > 0 
      ? requests.reduce((sum, r) => sum + r.responseTime, 0) / requests.length 
      : 0;
    return avgTime;
  });

  const responseTimeData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Avg Response Time (ms)',
        data: last24Hours,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Token usage over time
  const dailyTokens = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayRequests = requestData.filter(r => 
      r.timestamp.toDateString() === date.toDateString()
    );
    return dayRequests.reduce((sum, r) => sum + r.tokensIn + r.tokensOut, 0);
  });

  const tokenUsageData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Token Usage',
        data: dailyTokens,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  // Error analysis
  const errorRequests = failedRequests.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request Analytics</h1>
          <p className="text-gray-600">Detailed analysis of API requests and responses</p>
        </div>
        <div className="flex space-x-2">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{requestData.length.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Total Requests</p>
          <div className="mt-2 text-xs text-green-600">
            {((successfulRequests.length / requestData.length) * 100).toFixed(1)}% success rate
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <XCircle className="text-red-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{successfulRequests.length.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Successful Requests</p>
          <div className="mt-2 text-xs text-red-600">
            {failedRequests.length} failed
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <Zap className="text-yellow-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{(totalTokens / 1000000).toFixed(1)}M</h3>
          <p className="text-sm text-gray-600">Total Tokens</p>
          <div className="mt-2 text-xs text-gray-500">
            Avg: {Math.round((totalTokens / requestData.length))} per request
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <Clock className="text-purple-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{Math.round(avgResponseTime)}ms</h3>
          <p className="text-sm text-gray-600">Avg Response Time</p>
          <div className="mt-2 text-xs text-gray-500">
            95th percentile: {Math.round(avgResponseTime * 1.5)}ms
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Inference Type Distribution
          </h3>
          <div className="h-64">
            <Doughnut 
              data={inferenceTypeData}
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

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-500" />
            Response Time Trends (24h)
          </h3>
          <div className="h-64">
            <Line 
              data={responseTimeData}
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
                    ticks: {
                      callback: function(value) {
                        return value + 'ms';
                      }
                    }
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Token Usage Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-green-500" />
          Token Usage (7 Days)
        </h3>
        <div className="h-64">
          <Bar 
            data={tokenUsageData}
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
                  ticks: {
                    callback: function(value) {
                      return (value / 1000).toFixed(0) + 'K';
                    }
                  }
                },
              },
            }}
          />
        </div>
      </div>

      {/* Recent Failed Requests */}
      {failedRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Recent Failed Requests
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inference Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {errorRequests.map((request, index) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.timestamp.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.inferenceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.tokensIn.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.responseTime}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Failed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestAnalytics;