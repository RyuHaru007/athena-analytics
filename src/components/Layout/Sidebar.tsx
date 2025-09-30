import React from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  Users, 
  Activity, 
  Monitor, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'models', label: 'Model Analytics', icon: Brain },
    { id: 'users', label: 'User Analytics', icon: Users },
    { id: 'requests', label: 'Request Analytics', icon: Activity },
    { id: 'system', label: 'System Monitoring', icon: Monitor },
  ];

  return (
    <div className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col fixed left-0 top-0 h-full z-30`}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-white font-bold text-lg">Athena</h1>
              <p className="text-gray-400 text-xs">Analytics</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <ChevronRight size={16} className="ml-auto opacity-70" />
                      )}
                    </>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;