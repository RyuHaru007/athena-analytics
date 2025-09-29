import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { Brain, Zap, Clock, Target, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import { generateModelPerformance } from '../../utils/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const ModelAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modelData, setModelData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = generateModelPerformance();
      setModelData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Analyzing model performance..." size="lg" />;
  }

  const performanceChartData = {
    labels: modelData.map(m => m.name),
    datasets: [
      {
        label: 'Accuracy',
        data: modelData.map(m => (m.accuracy * 100).toFixed(1)),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Precision',
        data: modelData.map(m => (m.precision * 100).toFixed(1)),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Recall',
        data: modelData.map(m => (m.recall * 100).toFixed(1)),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const responseTimeData = {
    labels: modelData.map(m => m.name),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: modelData.map(m => m.avgResponseTime),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const radarData = {
    labels: ['Accuracy', 'Precision', 'Recall', 'Speed', 'Requests'],
    datasets: modelData.slice(0, 3).map((model, index) => ({
      label: model.name,
      data: [
        model.accuracy * 100,
        model.precision * 100,
        model.recall * 100,
        100 - (model.avgResponseTime / 30), // Invert for speed
        (model.requests / Math.max(...modelData.map(m => m.requests))) * 100,
      ],
      backgroundColor: `rgba(${59 + index * 50}, ${130 + index * 30}, 246, 0.2)`,
      borderColor: `rgba(${59 + index * 50}, ${130 + index * 30}, 246, 1)`,
      pointBackgroundColor: `rgba(${59 + index * 50}, ${130 + index * 30}, 246, 1)`,
    })),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Model Analytics</h1>
        <p className="text-gray-600">AI model performance metrics and comparisons</p>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modelData.slice(0, 4).map((model, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{model.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Requests:</span>
                <span className="font-medium">{model.requests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Time:</span>
                <span className="font-medium">{model.avgResponseTime}ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Comparison Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-500" />
          Model Performance Comparison
        </h3>
        <div className="h-96">
          <Bar 
            data={performanceChartData}
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
                      return `${context.dataset.label}: ${context.parsed.y}%`;
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
              },
            }}
          />
        </div>
      </div>

      {/* Response Time and Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-500" />
            Response Time Analysis
          </h3>
          <div className="h-64">
            <Bar 
              data={responseTimeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.y}ms`;
                      }
                    }
                  }
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

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Top 3 Models Overview
          </h3>
          <div className="h-64">
            <Radar 
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Model List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Model Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precision</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recall</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Response</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modelData.map((model, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{model.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{(model.accuracy * 100).toFixed(1)}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{(model.precision * 100).toFixed(1)}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{(model.recall * 100).toFixed(1)}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{model.requests.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{model.avgResponseTime}ms</span>
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

export default ModelAnalytics;