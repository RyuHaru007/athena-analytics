import { User } from '../types';

const MOCK_USER: User = {
  id: 'admin_001',
  name: 'Alex Chen',
  email: 'admin@athena-analytics.com',
  role: 'Administrator',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
};

export const mockLogin = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === 'admin@athena-analytics.com' && password === 'admin123') {
        resolve(MOCK_USER);
      } else {
        resolve(null);
      }
    }, 1500); // Simulate network delay
  });
};

export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem('athena_user');
  return stored ? JSON.parse(stored) : null;
};

export const storeUser = (user: User): void => {
  localStorage.setItem('athena_user', JSON.stringify(user));
};

export const clearUser = (): void => {
  localStorage.removeItem('athena_user');
};