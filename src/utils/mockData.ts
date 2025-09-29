import { RequestData, ModelPerformance, UserActivity, SystemMetrics } from '../types';

const AI_MODELS = [
  'GPT-4', 'GPT-3.5-Turbo', 'Claude-3', 'Gemini-Pro', 
  'Llama-2', 'PaLM-2', 'Cohere-Command', 'Anthropic-Claude'
];

const INFERENCE_TYPES = [
  'text-generation', 'image-processing', 'code-completion', 
  'translation', 'summarization', 'question-answering',
  'sentiment-analysis', 'classification'
];

const WEB_AUTOMATION_GENRES = [
  'shopping', 'stocks', 'research', 'social-media', 
  'news', 'travel', 'finance', 'education'
];

const USERS = [
  'Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emma Wilson',
  'David Park', 'Lisa Zhang', 'Tom Anderson', 'Rachel Green',
  'James Lee', 'Anna Taylor', 'Chris Brown', 'Maya Patel'
];

// Generate realistic time patterns (business hours, weekends)
const generateTimeBasedValue = (baseValue: number, hour: number, dayOfWeek: number): number => {
  let multiplier = 1;
  
  // Business hours boost (9 AM - 5 PM)
  if (hour >= 9 && hour <= 17) {
    multiplier *= 1.5;
  }
  
  // Weekend reduction
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    multiplier *= 0.3;
  }
  
  // Add some randomness
  multiplier *= (0.8 + Math.random() * 0.4);
  
  return Math.round(baseValue * multiplier);
};

export const generateMockRequestData = (days: number = 30): RequestData[] => {
  const data: RequestData[] = [];
  const now = new Date();
  
  for (let d = days; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    
    // Generate 50-300 requests per day based on patterns
    const requestsPerDay = generateTimeBasedValue(150, date.getHours(), date.getDay());
    
    for (let i = 0; i < requestsPerDay; i++) {
      const timestamp = new Date(date);
      timestamp.setHours(Math.floor(Math.random() * 24));
      timestamp.setMinutes(Math.floor(Math.random() * 60));
      
      data.push({
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        model: AI_MODELS[Math.floor(Math.random() * AI_MODELS.length)],
        tokensIn: Math.floor(Math.random() * 2000) + 100,
        tokensOut: Math.floor(Math.random() * 1500) + 50,
        responseTime: Math.floor(Math.random() * 3000) + 200,
        userId: `user_${Math.floor(Math.random() * 12) + 1}`,
        success: Math.random() > 0.05, // 95% success rate
        inferenceType: INFERENCE_TYPES[Math.floor(Math.random() * INFERENCE_TYPES.length)]
      });
    }
  }
  
  return data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const generateModelPerformance = (): ModelPerformance[] => {
  return AI_MODELS.map(model => ({
    name: model,
    accuracy: 0.85 + Math.random() * 0.14, // 85-99%
    precision: 0.80 + Math.random() * 0.19, // 80-99%
    recall: 0.75 + Math.random() * 0.24, // 75-99%
    requests: Math.floor(Math.random() * 10000) + 1000,
    avgResponseTime: Math.floor(Math.random() * 2000) + 300
  }));
};

export const generateUserActivity = (): UserActivity[] => {
  return USERS.map((name, index) => ({
    userId: `user_${index + 1}`,
    userName: name,
    totalRequests: Math.floor(Math.random() * 5000) + 500,
    totalTokens: Math.floor(Math.random() * 100000) + 10000,
    avgSessionTime: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Within last 7 days
  }));
};

export const generateSystemMetrics = (hours: number = 72): SystemMetrics[] => {
  const data: SystemMetrics[] = [];
  const now = new Date();
  
  for (let h = hours; h >= 0; h--) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - h);
    
    const baseLoad = generateTimeBasedValue(50, timestamp.getHours(), timestamp.getDay());
    
    data.push({
      timestamp,
      cpuUsage: Math.min(95, baseLoad + Math.random() * 20),
      memoryUsage: Math.min(90, baseLoad + Math.random() * 15),
      diskUsage: 60 + Math.random() * 20,
      activeConnections: generateTimeBasedValue(200, timestamp.getHours(), timestamp.getDay()),
      queueSize: Math.floor(Math.random() * 50)
    });
  }
  
  return data;
};

export const generateWebAutomationData = () => {
  return WEB_AUTOMATION_GENRES.map(genre => ({
    genre,
    requests: Math.floor(Math.random() * 1000) + 100,
    successRate: 0.85 + Math.random() * 0.14,
    avgDuration: Math.floor(Math.random() * 30000) + 5000 // 5-35 seconds
  }));
};

export const generateConversationMetrics = () => {
  const days = 30;
  const data = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      avgDepth: 3 + Math.random() * 7, // 3-10 turns
      engagementScore: 0.6 + Math.random() * 0.4,
      completionRate: 0.7 + Math.random() * 0.29
    });
  }
  
  return data;
};