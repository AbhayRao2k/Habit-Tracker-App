import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatDate, getWeekDays } from '@/lib/utils';
import { useHabits } from './HabitContext';

interface WeeklyTargetContextType {
  weeklyTarget: number | null;
  weeklyAccomplishments: string[];
  dailyCompletions: Record<string, boolean>;
  setWeeklyTarget: (target: number) => void;
  addWeeklyAccomplishment: (weekId: string) => void;
  isTargetMet: boolean;
  showConfetti: boolean;
  setShowConfetti: (show: boolean) => void;
}

const WeeklyTargetContext = createContext<WeeklyTargetContextType | undefined>(undefined);

const STORAGE_KEY = 'habit-tracker-weekly-targets';

interface WeeklyTargetData {
  target: number | null;
  accomplishments: string[];
}

function loadWeeklyTargetData(): WeeklyTargetData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { target: null, accomplishments: [] };
  } catch (error) {
    console.error('Error loading weekly target data from localStorage:', error);
    return { target: null, accomplishments: [] };
  }
}

function saveWeeklyTargetData(data: WeeklyTargetData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving weekly target data to localStorage:', error);
  }
}

// Helper function to get current week identifier
export const getCurrentWeekId = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber}`;
};

export function WeeklyTargetProvider({ children }: { children: ReactNode }) {
  const { habits } = useHabits();
  const [weeklyTarget, setWeeklyTargetState] = useState<number | null>(null);
  const [weeklyAccomplishments, setWeeklyAccomplishments] = useState<string[]>([]);
  const [dailyCompletions, setDailyCompletions] = useState<Record<string, boolean>>({});
  const [isTargetMet, setIsTargetMet] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const data = loadWeeklyTargetData();
    setWeeklyTargetState(data.target);
    setWeeklyAccomplishments(data.accomplishments);
  }, []);

  // Handle setting a new weekly target
  const setWeeklyTarget = (target: number) => {
    setWeeklyTargetState(target);
    const data = loadWeeklyTargetData();
    const newData = { ...data, target };
    saveWeeklyTargetData(newData);
  };

  // Handle adding a weekly accomplishment
  const addWeeklyAccomplishment = (weekId: string) => {
    if (weeklyAccomplishments.includes(weekId)) return;
    
    const newAccomplishments = [...weeklyAccomplishments, weekId];
    setWeeklyAccomplishments(newAccomplishments);
    
    const data = loadWeeklyTargetData();
    const newData = { ...data, accomplishments: newAccomplishments };
    saveWeeklyTargetData(newData);
    
    // Show confetti when a new accomplishment is added
    setShowConfetti(true);
  };

  // Track daily completions and check if weekly target is met
  useEffect(() => {
    if (!habits.length || weeklyTarget === null) return;

    // Get current week days
    const weekDays = getWeekDays();
    const currentWeekDates = weekDays.map(day => formatDate(day));
    
    // Track which days have all habits completed
    const dailyStatus: Record<string, boolean> = {};
    
    currentWeekDates.forEach(date => {
      // A day is complete if all habits are completed for that day
      const allHabitsCompletedForDay = habits.every(habit => habit.completions[date]);
      dailyStatus[date] = allHabitsCompletedForDay;
    });
    
    setDailyCompletions(dailyStatus);
    
    // Count how many days have all habits completed
    const completedDaysCount = Object.values(dailyStatus).filter(Boolean).length;
    
    // Check if target is met
    const targetMet = completedDaysCount >= weeklyTarget;
    setIsTargetMet(targetMet);
    
    // If target is met and not already recorded, add to accomplishments
    const currentWeekId = getCurrentWeekId();
    if (targetMet && !weeklyAccomplishments.includes(currentWeekId)) {
      addWeeklyAccomplishment(currentWeekId);
    }
  }, [habits, weeklyTarget, weeklyAccomplishments]);

  const value = {
    weeklyTarget,
    weeklyAccomplishments,
    dailyCompletions,
    setWeeklyTarget,
    addWeeklyAccomplishment,
    isTargetMet,
    showConfetti,
    setShowConfetti,
  };

  return <WeeklyTargetContext.Provider value={value}>{children}</WeeklyTargetContext.Provider>;
}

export function useWeeklyTarget() {
  const context = useContext(WeeklyTargetContext);
  if (context === undefined) {
    throw new Error('useWeeklyTarget must be used within a WeeklyTargetProvider');
  }
  return context;
}