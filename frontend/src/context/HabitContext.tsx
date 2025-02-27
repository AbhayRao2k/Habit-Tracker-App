import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Habit } from '@/types/habit';
import { loadHabits, saveHabits, addHabit, updateHabit, deleteHabit, toggleHabitCompletion } from '@/lib/storage';
import { formatDate } from '@/lib/utils';

interface HabitContextType {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  getHabitById: (id: string) => Habit | undefined;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loadedHabits = loadHabits();
      setHabits(loadedHabits);
    } catch (err) {
      setError('Failed to load habits from storage');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    try {
      const newHabit: Habit = {
        ...habitData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        completions: {},
      };
      
      const updatedHabits = addHabit(newHabit);
      setHabits(updatedHabits);
    } catch (err) {
      setError('Failed to add habit');
      console.error(err);
    }
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    try {
      const result = updateHabit(updatedHabit);
      setHabits(result);
    } catch (err) {
      setError('Failed to update habit');
      console.error(err);
    }
  };

  const handleDeleteHabit = (id: string) => {
    try {
      const result = deleteHabit(id);
      setHabits(result);
    } catch (err) {
      setError('Failed to delete habit');
      console.error(err);
    }
  };

  const handleToggleCompletion = (habitId: string, date: string) => {
    try {
      const result = toggleHabitCompletion(habitId, date);
      setHabits(result);
    } catch (err) {
      setError('Failed to toggle habit completion');
      console.error(err);
    }
  };

  const getHabitById = (id: string) => {
    return habits.find(habit => habit.id === id);
  };

  const value = {
    habits,
    isLoading,
    error,
    addHabit: handleAddHabit,
    updateHabit: handleUpdateHabit,
    deleteHabit: handleDeleteHabit,
    toggleCompletion: handleToggleCompletion,
    getHabitById,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}