export enum ChannelType {
  EMAIL = 'Email',
  ZALO = 'Zalo',
  TELEGRAM = 'Telegram',
  SMS = 'SMS',
  PUSH = 'Mobile Push'
}

export enum NotificationStatus {
  PENDING = 'Đang chờ',
  SENT = 'Đã gửi',
  FAILED = 'Lỗi',
  CANCELLED = 'Đã hủy'
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  channel: ChannelType;
  group: string;
  scheduledTime: string; // ISO string
  status: NotificationStatus;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  isActive: boolean;
}

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  description?: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  lastUpdated: string;
}
