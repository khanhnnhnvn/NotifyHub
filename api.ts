import { Channel, Group, Notification, Template, ChannelType, NotificationStatus } from './types';

// CONFIGURATION
// Set this to FALSE when you run the real backend (server.js)
// Set this to TRUE to use the app in the browser preview without a backend
const USE_MOCK_DATA = true;
const API_BASE_URL = 'http://localhost:3001/api';

// --- MOCK DATA FOR DEMO MODE ---
const mockNotifications: Notification[] = [
  { id: '1', scheduledTime: '2024-12-25T09:00:00', title: 'Chúc mừng Giáng sinh!', content: 'Gửi lời chúc ấm áp...', channel: ChannelType.EMAIL, group: 'Khách hàng VIP', status: NotificationStatus.PENDING },
  { id: '2', scheduledTime: '2025-01-01T00:00:00', title: 'Chúc mừng năm mới 2025!', content: 'Khuyến mãi đặc biệt...', channel: ChannelType.PUSH, group: 'Tất cả người dùng', status: NotificationStatus.PENDING },
  { id: '3', scheduledTime: '2024-11-15T14:30:00', title: 'Cập nhật nội bộ', content: 'Họp toàn thể công ty...', channel: ChannelType.SMS, group: 'Nhân viên Marketing', status: NotificationStatus.CANCELLED },
  { id: '4', scheduledTime: '2024-10-20T08:00:00', title: 'Khuyến mãi 20/10', content: 'Tri ân phụ nữ VN...', channel: ChannelType.ZALO, group: 'Khách hàng Nữ', status: NotificationStatus.SENT },
];

const mockChannels: Channel[] = [
  { id: '1', name: 'Zalo - Marketing Team', type: ChannelType.ZALO, isActive: true },
  { id: '2', name: 'Email - System Alerts', type: ChannelType.EMAIL, isActive: true },
  { id: '3', name: 'Telegram - Dev Ops', type: ChannelType.TELEGRAM, isActive: false },
  { id: '4', name: 'SMS Brandname', type: ChannelType.SMS, isActive: true },
];

const mockGroups: Group[] = [
  { id: '1', name: 'Tất cả Nhân viên', memberCount: 156, description: 'Toàn bộ nhân viên chính thức' },
  { id: '2', name: 'Marketing Team', memberCount: 12, description: 'Phòng tiếp thị và truyền thông' },
  { id: '3', name: 'Khách hàng VIP', memberCount: 450, description: 'Khách hàng chi tiêu > 50tr/năm' },
];

const mockTemplates: Template[] = [
  { id: '1', name: 'Mẫu Chào mừng', content: 'Chào mừng...', lastUpdated: '2023-10-28' },
  { id: '2', name: 'Thông báo Đơn hàng Mới', content: 'Đơn hàng của bạn...', lastUpdated: '2023-10-26' },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const stored = localStorage.getItem('nh_notifications');
      return stored ? JSON.parse(stored) : mockNotifications;
    }
    const res = await fetch(`${API_BASE_URL}/notifications`);
    return res.json();
  },

  createNotification: async (notif: Omit<Notification, 'id'>): Promise<Notification> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      const newNotif = { ...notif, id: Math.random().toString(36).substr(2, 9) };
      const current = await api.getNotifications();
      const updated = [newNotif, ...current];
      localStorage.setItem('nh_notifications', JSON.stringify(updated));
      return newNotif;
    }
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif),
    });
    return res.json();
  },

  // Channels
  getChannels: async (): Promise<Channel[]> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockChannels;
    }
    const res = await fetch(`${API_BASE_URL}/channels`);
    return res.json();
  },

  // Groups
  getGroups: async (): Promise<Group[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockGroups;
    }
    const res = await fetch(`${API_BASE_URL}/groups`);
    return res.json();
  },

  // Templates
  getTemplates: async (): Promise<Template[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockTemplates;
    }
    const res = await fetch(`${API_BASE_URL}/templates`);
    return res.json();
  }
};
