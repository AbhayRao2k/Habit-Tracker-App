import React from 'react';
import { useHabits } from '@/context/HabitContext';
import { calculateHabitStats } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/empty-state';
import { BarChart, Calendar } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

export function Stats() {
  const { habits, isLoading } = useHabits();

  if (isLoading) {
    return <Loading />;
  }

  if (habits.length === 0) {
    return (
      <EmptyState
        title="No habits to analyze"
        description="Create habits to see your statistics"
        icon={<BarChart className="h-12 w-12" />}
        action={{
          label: "Create Habit",
          href: "/new"
        }}
      />
    );
  }

  // Sort habits by completion rate
  const sortedHabits = [...habits].sort((a, b) => {
    const statsA = calculateHabitStats(a);
    const statsB = calculateHabitStats(b);
    return statsB.completionRate - statsA.completionRate;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Statistics</h1>
      
      <Card className="overflow-hidden">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Habit Performance</CardTitle>
          <CardDescription>
            Completion rates for all your habits
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="space-y-6">
            {sortedHabits.map(habit => {
              const stats = calculateHabitStats(habit);
              
              return (
                <div key={habit.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className={`w-3 h-3 flex-shrink-0 rounded-full ${habit.color || 'bg-blue-500'}`} />
                      <span className="font-medium truncate">{habit.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground flex-shrink-0">
                      {stats.completionRate.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={stats.completionRate} className="h-2" />
                  <div className="flex flex-wrap justify-between text-xs text-muted-foreground gap-y-2">
                    <span>Streak: {stats.streak} days</span>
                    <span>Best: {stats.longestStreak} days</span>
                    <span>Total: {stats.totalCompletions} completions</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Top Performing Habits</CardTitle>
            <CardDescription>
              Your most consistent habits
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            {sortedHabits.slice(0, 3).map((habit, index) => {
              const stats = calculateHabitStats(habit);
              
              return (
                <div key={habit.id} className="flex items-center space-x-4 mb-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <p className="font-medium leading-none truncate">{habit.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.completionRate.toFixed(0)}% completion rate
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Habits Needing Attention</CardTitle>
            <CardDescription>
              Habits with lower completion rates
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            {sortedHabits.slice(-3).reverse().map((habit) => {
              const stats = calculateHabitStats(habit);
              
              return (
                <div key={habit.id} className="flex items-center space-x-4 mb-4">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${habit.color || 'bg-blue-500'} bg-opacity-20`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <p className="font-medium leading-none truncate">{habit.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.completionRate.toFixed(0)}% completion rate
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}