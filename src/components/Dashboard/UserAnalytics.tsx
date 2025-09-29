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
import { Users, Clock, MessageSquare, Activity, TrendingUp, Eye } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import { generateUserActivity, generateConversationMetrics } from '../../utils/mockData';

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

const UserAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any[]>([]);
  const [conversationData, setConversationData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 900));
      
      const users = generateUserActivity();
      const conversations = generateConversationMetrics();
      
      setUserData(users);
      setConversationData(conversations);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Analyzing user behavior..." size="lg" />;
  }

  // User activity distribution
  const userSegments = {
    heavy: userData.filter(u => u.totalRequests > 2000).length,
    moderate: userData.filter(u => u.totalRequests > 500 && u.totalRequests <= 2000).length,
    light: userData.filter(u => u.totalRequests <= 500).length,
  };

  const userSegmentData = {
    labels: ['Heavy Users (2000+)', 'Moderate Users (500-2000)', 'Light Users (<500)'],
    datasets: [
      {
        data: [userSegments.heavy, userSegments.moderate, userSegments.light],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
        borderWidth: 0,
      },
    ],
  };

  // Conversation depth over time
  const conversationChartData = {
    labels: conversationData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Avg Conversation Depth',
        data: conversationData.map(d => d.avgDepth.toFixed(1)),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Engagement Score',
        data: conversationData.map(d => (d.engagementScore * 10).toFixed(1)),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // User requests distribution
  const requestsDistributionData = {
    labels: userData.map(u => u.userName),
    datasets: [
      {
        label: 'Total Requests',
        data: userData.map(u => u.totalRequests),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const topUsers = [...userData].sort((a, b) => b.totalRequests - a.totalRequests).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Analytics</h1>
        <p className="text-gray-600">User behavior patterns and engagement metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{userData.length}</h3>
          <p className="text-sm text-gray-600">Active Users</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {(conversationData.reduce((sum, d) => sum + d.avgDepth, 0) / conversationData.length).toFixed(1)}
          </h3>
          <p className="text-sm text-gray-600">Avg Conversation Depth</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {Math.round(userData.reduce((sum, u) => sum + u.avgSessionTime, 0) / userData.length / 60)}m
          </h3>
          <p className="text-sm text-gray-600">Avg Session Time</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {(conversationData.reduce((sum, d) => sum + d.engagementScore, 0) / conversationData.length * 100).toFixed(0)}%
          </h3>
          <p className="text-sm text-gray-600">Engagement Score</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            User Segments
          </h3>
          <div className="h-64">
            <Doughnut 
              data={userSegmentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((context.parsed * 100) / total).toFixed(1);
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
            Conversation Trends (30 Days)
          </h3>
          <div className="h-64">
            <Line 
              data={conversationChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
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

      {/* User Requests Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-500" />
          User Request Distribution
        </h3>
        <div className="h-80">
          <Bar 
            data={requestsDistributionData}
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

      {/* Top Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-blue-500" />
            Top Active Users
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Requests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tokens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topUsers.map((user, index) => (
                <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {user.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{user.totalRequests.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{(user.totalTokens / 1000).toFixed(0)}K</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{Math.round(user.avgSessionTime / 60)}m</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {user.lastActive.toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;