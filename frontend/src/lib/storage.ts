import { Habit } from '@/types/habit';

const STORAGE_KEY = 'habit-tracker-data';

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits to localStorage:', error);
  }
}

export function loadHabits(): Habit[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading habits from localStorage:', error);
    return [];
  }
}

export function addHabit(habit: Habit): Habit[] {
  const habits = loadHabits();
  const updatedHabits = [...habits, habit];
  saveHabits(updatedHabits);
  return updatedHabits;
}

export function updateHabit(updatedHabit: Habit): Habit[] {
  const habits = loadHabits();
  const updatedHabits = habits.map(habit => 
    habit.id === updatedHabit.id ? updatedHabit : habit
  );
  saveHabits(updatedHabits);
  return updatedHabits;
}

export function deleteHabit(habitId: string): Habit[] {
  const habits = loadHabits();
  const updatedHabits = habits.filter(habit => habit.id !== habitId);
  saveHabits(updatedHabits);
  return updatedHabits;
}

export function toggleHabitCompletion(habitId: string, date: string): Habit[] {
  const habits = loadHabits();
  const updatedHabits = habits.map(habit => {
    if (habit.id === habitId) {
      const completions = { ...habit.completions };
      completions[date] = !completions[date];
      return { ...habit, completions };
    }
    return habit;
  });
  saveHabits(updatedHabits);
  return updatedHabits;
}