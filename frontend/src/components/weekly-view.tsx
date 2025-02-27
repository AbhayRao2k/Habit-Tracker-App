import React from 'react';
import { Habit } from '@/types/habit';
import { getWeekDays, getWeekDayName, isCurrentDay, formatDate } from '@/lib/utils';
import { useHabits } from '@/context/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export function WeeklyView() {
  const { habits, toggleCompletion } = useHabits();
  const weekDays = getWeekDays();

  if (habits.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg">Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-6">
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 sm:p-3 text-sm font-medium text-muted-foreground">
                    <span className="block sm:inline">Habit</span>
                  </th>
                  {weekDays.map((day) => (
                    <th 
                      key={day.toString()} 
                      className={cn(
                        "p-2 sm:p-3 text-center text-xs font-medium",
                        isCurrentDay(day) ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      <div className="hidden sm:block">{getWeekDayName(day)}</div>
                      <div className="sm:hidden">{getWeekDayName(day).substring(0, 1)}</div>
                      <div className={cn(
                        "text-xs mt-1",
                        isCurrentDay(day) ? "font-bold" : ""
                      )}>
                        {day.getDate()}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => (
                  <tr key={habit.id} className="border-t">
                    <td className="p-2 sm:p-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${habit.color || 'bg-blue-500'}`} />
                        <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-[200px]">{habit.name}</span>
                      </div>
                    </td>
                    {weekDays.map((day) => {
                      const dateStr = formatDate(day);
                      const isCompleted = habit.completions[dateStr];
                      
                      return (
                        <td key={dateStr} className="p-2 sm:p-3 text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={isCompleted}
                              onCheckedChange={() => toggleCompletion(habit.id, dateStr)}
                              className={cn(
                                isCurrentDay(day) ? "border-primary" : ""
                              )}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}