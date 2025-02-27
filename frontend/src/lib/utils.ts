import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, startOfWeek, addDays, isToday, parseISO, differenceInDays } from 'date-fns';
import { Habit, HabitStats } from '@/types/habit';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getWeekDays(date: Date = new Date()): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
}

export function getWeekDayName(date: Date): string {
  return format(date, 'EEE');
}

export function isCurrentDay(date: Date): boolean {
  return isToday(date);
}

export function calculateHabitStats(habit: Habit): HabitStats {
  const completions = Object.entries(habit.completions || {}).sort(
    ([dateA], [dateB]) => parseISO(dateA).getTime() - parseISO(dateB).getTime()
  );

  if (completions.length === 0) {
    return {
      streak: 0,
      longestStreak: 0,
      completionRate: 0,
      totalCompletions: 0,
      totalDays: 0,
    };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let totalCompletions = 0;

  // Calculate streaks and total completions
  const today = new Date();
  const todayStr = formatDate(today);
  
  // Count completions
  completions.forEach(([_, completed]) => {
    if (completed) totalCompletions++;
  });

  // Calculate current streak
  const sortedDates = completions
    .filter(([_, completed]) => completed)
    .map(([date]) => date)
    .sort((a, b) => parseISO(b).getTime() - parseISO(a).getTime()); // Sort descending

  if (sortedDates.length > 0) {
    const lastCompletionDate = parseISO(sortedDates[0]);
    const daysSinceLastCompletion = differenceInDays(today, lastCompletionDate);
    
    // If the last completion was today or yesterday, we have a streak
    if (daysSinceLastCompletion <= 1 || (daysSinceLastCompletion === 2 && !habit.completions[todayStr])) {
      currentStreak = 1;
      
      // Count consecutive days backward
      for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = parseISO(sortedDates[i - 1]);
        const prevDate = parseISO(sortedDates[i]);
        
        if (differenceInDays(currentDate, prevDate) === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // Calculate longest streak
  let tempStreak = 0;
  for (let i = 0; i < completions.length; i++) {
    const [date, completed] = completions[i];
    
    if (completed) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Calculate total days tracked
  const totalDays = completions.length;

  // Calculate completion rate
  const completionRate = totalDays > 0 ? (totalCompletions / totalDays) * 100 : 0;

  return {
    streak: currentStreak,
    longestStreak,
    completionRate,
    totalCompletions,
    totalDays,
  };
}