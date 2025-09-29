export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

export interface ChartData {
  labels: string[];
  datasets: any[];
}

export interface RequestData {
  id: string;
  timestamp: Date;
  model: string;
  tokensIn: number;
  tokensOut: number;
  responseTime: number;
  userId: string;
  success: boolean;
  inferenceType: string;
}

export interface ModelPerformance {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  requests: number;
  avgResponseTime: number;
}

export interface UserActivity {
  userId: string;
  userName: string;
  totalRequests: number;
  totalTokens: number;
  avgSessionTime: number;
  lastActive: Date;
}

export interface SystemMetrics {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  queueSize: number;
}