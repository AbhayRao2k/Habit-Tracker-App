import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Habit } from '@/types/habit';
import { format, startOfYear, eachMonthOfInterval } from 'date-fns';

interface MonthlyProgressProps {
  habits: Habit[];
}

export function MonthlyProgress({ habits }: MonthlyProgressProps) {
  // Get all months of the current year
  const monthsOfYear = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: new Date(),
  });

  // Prepare data for the monthly completion chart
  const monthlyData = monthsOfYear.map(date => {
    const monthStr = format(date, 'yyyy-MM');
    const monthName = format(date, 'MMM');
    
    // Count completions for this month
    let totalPossibleCompletions = 0;
    let actualCompletions = 0;

    habits.forEach(habit => {
      Object.entries(habit.completions).forEach(([dateStr, completed]) => {
        if (dateStr.startsWith(monthStr)) {
          totalPossibleCompletions++;
          if (completed) {
            actualCompletions++;
          }
        }
      });
    });

    return {
      month: monthName,
      rate: totalPossibleCompletions > 0 ? (actualCompletions / totalPossibleCompletions) * 100 : 0,
      isCurrentMonth: format(new Date(), 'MMM') === monthName
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Progress</CardTitle>
        <CardDescription>Completion rates for each month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Completion Rate']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar
                dataKey="rate"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}