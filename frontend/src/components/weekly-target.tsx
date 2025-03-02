import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useHabits } from '@/context/HabitContext';
import { getWeekDays, formatDate } from '@/lib/utils';
import { useWeeklyTarget } from '@/context/WeeklyTargetContext';
import { Target, Award, Edit } from 'lucide-react';

const formSchema = z.object({
  target: z.coerce.number()
    .min(1, 'Target must be at least 1')
    .max(100, 'Target must be reasonable')
});

type FormValues = z.infer<typeof formSchema>;

export const DaySelector = ({ onSelect, selectedDays }: { onSelect: (days: number) => void; selectedDays: number }) => {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="flex items-center justify-center gap-2">
      {days.map((day, index) => {
        const isSelected = index < selectedDays;
        const isHovered = hoverIndex !== null && index <= hoverIndex;
        return (
          <button
            key={day}
            onClick={() => onSelect(index + 1)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            className={`h-10 w-10 flex items-center justify-center transition-colors rounded-lg
              ${isSelected ? 'bg-primary text-primary-foreground' : 
                isHovered ? 'bg-primary/70 text-primary-foreground' : 'bg-muted hover:bg-primary/20'}`}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

export function WeeklyTarget() {
  const { habits } = useHabits();
  const { weeklyTarget, setWeeklyTarget, weeklyAccomplishments } = useWeeklyTarget();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target: weeklyTarget ?? 1
    }
  });

  // Calculate current week's progress
  const weekDays = getWeekDays();
  const currentWeekDates = weekDays.map(day => formatDate(day));
  
  let completedThisWeek = 0;
  habits.forEach(habit => {
    currentWeekDates.forEach(date => {
      if (habit.completions[date]) {
        completedThisWeek++;
      }
    });
  });

  const targetPercentage = (weeklyTarget ?? 0) > 0 ? (completedThisWeek / (weeklyTarget ?? 0)) * 100 : 0;
  const isTargetAchieved = completedThisWeek >= (weeklyTarget ?? 0) && (weeklyTarget ?? 0) > 0;
  
  const getCurrentWeekId = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber}`;
  };
  
  const currentWeekId = getCurrentWeekId();
  const hasAchievedThisWeek = weeklyAccomplishments.includes(currentWeekId);

  const onSubmit = (values: FormValues) => {
    setWeeklyTarget(values.target);
    setDialogOpen(false);
  };

  const handleDaySelect = (days: number) => {
    if (days <= 7) {
      setWeeklyTarget(days);
    }
  };

  if (habits.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 sm:px-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Target
          </CardTitle>
          <CardDescription>
            Set and track your weekly habit completion goals
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => window.location.href = '/profile'}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Progress: {completedThisWeek} / {weeklyTarget || '?'} completions
          </div>
          {isTargetAchieved && (
            <Badge className="bg-green-500 hover:bg-green-600">
              <Award className="h-3 w-3 mr-1" /> Target Achieved
            </Badge>
          )}
        </div>
        
        <Progress value={targetPercentage > 100 ? 100 : targetPercentage} className="h-2" />
        
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="text-center mb-4">
            <DaySelector onSelect={handleDaySelect} selectedDays={weeklyTarget || 0} />
          </div>
          {!weeklyTarget ? (
            <div className="text-center text-sm text-muted-foreground">
              <p>Hover over the days above to preview and click to set your weekly target</p>
            </div>
          ) : isTargetAchieved ? (
            <div className="text-center space-y-2">
              <div className="text-sm font-medium">
                {hasAchievedThisWeek ? (
                  <span>Congratulations! You've achieved your weekly target.</span>
                ) : (
                  <span>You've reached your target for this week!</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Keep up the good work! Your target will reset next week.
              </div>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <div className="text-sm font-medium">
                {weeklyTarget - completedThisWeek} more to go!
              </div>
              <div className="text-xs text-muted-foreground">
                You're making progress toward your weekly target.
              </div>
            </div>
          )}
        </div>
      </CardContent>

      
    </Card>
  );
}