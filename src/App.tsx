import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import TopNav from './components/Layout/TopNav';
import MainDashboard from './components/Dashboard/MainDashboard';
import ModelAnalytics from './components/Dashboard/ModelAnalytics';
import UserAnalytics from './components/Dashboard/UserAnalytics';
import RequestAnalytics from './components/Dashboard/RequestAnalytics';
import SystemMonitoring from './components/Dashboard/SystemMonitoring';
import LoadingSpinner from './components/Common/LoadingSpinner';

const DashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    
    // Force refresh of current component
    const event = new CustomEvent('dashboard-refresh');
    window.dispatchEvent(event);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'models':
        return <ModelAnalytics />;
      case 'users':
        return <UserAnalytics />;
      case 'requests':
        return <RequestAnalytics />;
      case 'system':
        return <SystemMonitoring />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col">
        <TopNav 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {isRefreshing ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner text="Refreshing data..." size="lg" />
              </div>
            ) : (
              renderActiveTab()
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Initializing Athena Analytics..." size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <DashboardContent />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;