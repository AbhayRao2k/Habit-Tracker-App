import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Habit, HabitStats } from '@/types/habit';
import { calculateHabitStats } from '@/lib/utils';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface HabitChartsProps {
  habits: Habit[];
}

export function HabitCharts({ habits }: HabitChartsProps) {
  // Prepare data for the weekly completion chart
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const weeklyData = last7Days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayStr = format(date, 'EEE');
    
    const completions = habits.reduce((acc, habit) => {
      if (habit.completions[dateStr]) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return {
      day: dayStr,
      completions,
      total: habits.length,
      rate: habits.length > 0 ? (completions / habits.length) * 100 : 0,
    };
  });

  // Prepare data for habits comparison
  const habitsData = habits.map(habit => {
    const stats = calculateHabitStats(habit);
    return {
      name: habit.name,
      completionRate: stats.completionRate,
      streak: stats.streak,
      totalCompletions: stats.totalCompletions,
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Daily completion rates for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Completion Rate']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Habits Comparison</CardTitle>
          <CardDescription>Completion rates by habit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={habitsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Completion Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}