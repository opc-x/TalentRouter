export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  role: string;
  matchScore: number;
  channel: 'Telegram Bot' | 'Slack Bot' | 'External API' | 'Web Intake';
  jobProfile: string;
  status: string;
  statusType: 'success' | 'warning' | 'info';
  metrics: {
    tech: number;      // 技术技能
    culture: number;   // 文化契合度
    speed: number;     // 速度
    leadership: number;// 领导力
  };
  messages: Message[];
  email?: string;
  phone?: string;
  experienceYears?: number;
  bio?: string;
}

export interface Message {
  id: string;
  sender: string;
  senderType: 'ai' | 'candidate' | 'recruiter';
  content: string;
  time: string;
}

export interface NewSearchCriteria {
  role: string;
  jobProfile: string;
  channel: 'Telegram Bot' | 'Slack Bot' | 'External API' | 'Web Intake';
  skillsRequired: string;
}

export interface CompanyProfile {
  name: string;
  techFocus: string;
  cultureRating: number;   // 0-100
  speedRating: number;     // 0-100
  leadershipRating: number;// 0-100
  description: string;
}

export interface JobProfile {
  id: string;
  title: string;
  skills: string;
  experienceYearsRequired: number;
  techWeight: number;
  cultureWeight: number;
  speedWeight: number;
  leadershipWeight: number;
}

export interface ChannelConfig {
  telegramBotToken: string;
  telegramChatId: string;
  minScoreThreshold: number;
  pushNotificationsEnabled: boolean;
  channelStatus: 'active' | 'standby' | 'inactive';
}

export interface ChannelItem {
  id: string;
  name: string;
  type: 'Telegram' | 'Slack' | 'Discord' | 'Email' | 'Webhook' | 'WhatsApp' | 'Other';
  config: {
    botToken?: string;
    chatId?: string;
    webhookUrl?: string;
    smtpHost?: string;
    smtpPort?: string;
    recipientEmail?: string;
    endpointUrl?: string;
    secretHeader?: string;
    apiKey?: string;
    phone?: string;
  };
  minScoreThreshold: number;
  pushNotificationsEnabled: boolean;
  status: 'active' | 'standby' | 'inactive';
}

