import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WeeklyTargetContextType {
  weeklyTarget: number | null;
  weeklyAccomplishments: string[];
  setWeeklyTarget: (target: number) => void;
  addWeeklyAccomplishment: (weekId: string) => void;
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

export function WeeklyTargetProvider({ children }: { children: ReactNode }) {
  const [weeklyTarget, setWeeklyTargetState] = useState<number | null>(null);
  const [weeklyAccomplishments, setWeeklyAccomplishments] = useState<string[]>([]);

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
  };

  // Check if the current week's target has been achieved and record it
  useEffect(() => {
    if (weeklyTarget === null) return;

    // Get current week identifier
    const getCurrentWeekId = () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
      return `${now.getFullYear()}-W${weekNumber}`;
    };

    const currentWeekId = getCurrentWeekId();
    
    // Check if this week's accomplishment has already been recorded
    if (weeklyAccomplishments.includes(currentWeekId)) return;

    // This effect will run whenever habits are updated
    // The actual check for completion will happen in the WeeklyTarget component
  }, [weeklyTarget, weeklyAccomplishments]);

  const value = {
    weeklyTarget,
    weeklyAccomplishments,
    setWeeklyTarget,
    addWeeklyAccomplishment,
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