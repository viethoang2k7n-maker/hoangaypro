export type ViewType = 'home' | 'summarizer' | 'scheduler' | 'chatbot';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ScheduleItem {
  time: string;
  activity: string;
  notes: string;
  category: 'study' | 'break' | 'personal' | 'class';
}

export interface SchedulePreferences {
  wakeUpTime: string;
  sleepTime: string;
  subjects: string;
  focusLevel: 'relaxed' | 'balanced' | 'intense';
}
