export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  completions: Record<string, boolean>;
  color?: string;
}

export interface HabitCompletion {
  date: string;
  completed: boolean;
}

export interface HabitStats {
  streak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  totalDays: number;
}