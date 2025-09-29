import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity,
  Wifi,
  Database,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import { generateSystemMetrics } from '../../utils/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SystemMonitoring: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [systemData, setSystemData] = useState<any[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const data = generateSystemMetrics(72);
      setSystemData(data);
      
      // Set current metrics (latest data point)
      if (data.length > 0) {
        setRealTimeMetrics(data[data.length - 1]);
      }
      
      setLoading(false);
    };

    loadData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      const now = new Date();
      const newMetric = {
        timestamp: now,
        cpuUsage: Math.min(95, 30 + Math.random() * 40),
        memoryUsage: Math.min(90, 40 + Math.random() * 30),
        diskUsage: 60 + Math.random() * 20,
        activeConnections: Math.floor(150 + Math.random() * 100),
        queueSize: Math.floor(Math.random() * 20),
      };
      
      setSystemData(prevData => [...prevData.slice(1), newMetric]);
      setRealTimeMetrics(newMetric);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading system metrics..." size="lg" />;
  }

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (value >= thresholds.warning) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  // Prepare chart data
  const chartData = {
    labels: systemData.map(d => d.timestamp.toLocaleTimeString()),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: systemData.map(d => d.cpuUsage),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Memory Usage (%)',
        data: systemData.map(d => d.memoryUsage),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Disk Usage (%)',
        data: systemData.map(d => d.diskUsage),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const connectionsData = {
    labels: systemData.map(d => d.timestamp.toLocaleTimeString()),
    datasets: [
      {
        label: 'Active Connections',
        data: systemData.map(d => d.activeConnections),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Queue Size',
        data: systemData.map(d => d.queueSize),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
        <p className="text-gray-600">Real-time server health and performance metrics</p>
      </div>

      {/* Real-time Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            {getStatusIcon(realTimeMetrics?.cpuUsage || 0, { warning: 70, critical: 90 })}
          </div>
          <h3 className={`text-2xl font-bold ${getStatusColor(realTimeMetrics?.cpuUsage || 0, { warning: 70, critical: 90 })}`}>
            {realTimeMetrics?.cpuUsage?.toFixed(1) || 0}%
          </h3>
          <p className="text-sm text-gray-600">CPU Usage</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${realTimeMetrics?.cpuUsage || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            {getStatusIcon(realTimeMetrics?.memoryUsage || 0, { warning: 75, critical: 90 })}
          </div>
          <h3 className={`text-2xl font-bold ${getStatusColor(realTimeMetrics?.memoryUsage || 0, { warning: 75, critical: 90 })}`}>
            {realTimeMetrics?.memoryUsage?.toFixed(1) || 0}%
          </h3>
          <p className="text-sm text-gray-600">Memory Usage</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${realTimeMetrics?.memoryUsage || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            {getStatusIcon(realTimeMetrics?.diskUsage || 0, { warning: 80, critical: 95 })}
          </div>
          <h3 className={`text-2xl font-bold ${getStatusColor(realTimeMetrics?.diskUsage || 0, { warning: 80, critical: 95 })}`}>
            {realTimeMetrics?.diskUsage?.toFixed(1) || 0}%
          </h3>
          <p className="text-sm text-gray-600">Disk Usage</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${realTimeMetrics?.diskUsage || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-green-600">
            {realTimeMetrics?.activeConnections || 0}
          </h3>
          <p className="text-sm text-gray-600">Active Connections</p>
          <div className="mt-2 text-xs text-gray-500">
            Queue: {realTimeMetrics?.queueSize || 0} pending
          </div>
        </div>
      </div>

      {/* System Resource Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2 text-blue-500" />
            System Resources (Last 72 Hours)
          </h3>
          <div className="h-80">
            <Line 
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  },
                  x: {
                    ticks: {
                      maxTicksLimit: 10,
                    }
                  }
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Network & Queue Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-purple-500" />
          Network & Queue Metrics
        </h3>
        <div className="h-64">
          <Line 
            data={connectionsData}
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
                x: {
                  ticks: {
                    maxTicksLimit: 10,
                  }
                }
              },
            }}
          />
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">API Server</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Cache Server</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Load Balancer</span>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">High Load</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Response Time</span>
              <span className="text-sm font-medium text-gray-900">245ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Throughput (req/sec)</span>
              <span className="text-sm font-medium text-gray-900">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium text-red-600">0.12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">99.98%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">SSL Certificate</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Valid (87 days)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;