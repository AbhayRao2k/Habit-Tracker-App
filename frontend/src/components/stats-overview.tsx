import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/context/HabitContext';
import { calculateHabitStats } from '@/lib/utils';
import { Award, Calendar, CheckCircle, TrendingUp } from 'lucide-react';

export function StatsOverview() {
  const { habits } = useHabits();
  
  if (habits.length === 0) {
    return null;
  }

  // Calculate overall stats
  const totalHabits = habits.length;
  
  let totalCompletions = 0;
  let totalPossibleCompletions = 0;
  let longestStreak = 0;
  let currentStreakSum = 0;
  
  habits.forEach(habit => {
    const stats = calculateHabitStats(habit);
    totalCompletions += stats.totalCompletions;
    totalPossibleCompletions += stats.totalDays;
    longestStreak = Math.max(longestStreak, stats.longestStreak);
    currentStreakSum += stats.streak;
  });
  
  const completionRate = totalPossibleCompletions > 0 
    ? (totalCompletions / totalPossibleCompletions) * 100 
    : 0;
  
  const averageStreak = habits.length > 0 
    ? currentStreakSum / habits.length 
    : 0;

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHabits}</div>
          <p className="text-xs text-muted-foreground">Active habits being tracked</p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground">Overall habit completion</p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{longestStreak} days</div>
          <p className="text-xs text-muted-foreground">Best consecutive streak</p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Streak</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageStreak.toFixed(1)} days</div>
          <p className="text-xs text-muted-foreground">Average current streak</p>
        </CardContent>
      </Card>
    </div>
  );
}