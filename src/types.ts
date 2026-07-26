export interface Student {
  id: string;
  name: string;
}

export interface PickHistoryItem {
  id: string;
  studentName: string;
  timestamp: Date;
  order: number;
}

export interface AppSettings {
  allowDuplicates: boolean;
  soundEnabled: boolean;
  autoConfetti: boolean;
  rouletteSpeed: number; // Duration in ms
}
