export interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  type: 'warning' | 'info' | 'success' | 'danger';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface TeacherItem {
  id: number;
  name: string;
  subject: string;
  desc: string;
}

export type ActiveTab = 'home' | 'chat' | 'admin' | 'notifications' | 'staff';
