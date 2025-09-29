import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        {change > 0 ? (
          <TrendingUp className="text-green-500" size={20} />
        ) : (
          <TrendingDown className="text-red-500" size={20} />
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        <div className="flex items-center space-x-1">
          <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;