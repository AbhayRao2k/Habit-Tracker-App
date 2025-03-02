import { Habit } from '@/types/habit';
import { formatDate, calculateHabitStats } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface HabitItemProps {
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitItem({ habit, onEdit, onDelete }: HabitItemProps) {
  const { toggleCompletion } = useHabits();
  const today = formatDate(new Date());
  const isCompletedToday = habit.completions[today];
  const stats = calculateHabitStats(habit);

  const handleToggle = () => {
    toggleCompletion(habit.id, today);
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2 overflow-hidden">
          <div className={`w-3 h-3 flex-shrink-0 rounded-full ${habit.color || 'bg-blue-500'}`} />
          <h3 className="font-medium text-base sm:text-lg truncate">{habit.name}</h3>
        </div>
        <div className="flex space-x-1 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4">
        {habit.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{habit.description}</p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`habit-${habit.id}`} 
              checked={isCompletedToday} 
              onCheckedChange={handleToggle}
            />
            <label 
              htmlFor={`habit-${habit.id}`}
              className="text-sm font-medium cursor-pointer"
            >
              Complete for today
            </label>
          </div>
          <Badge variant={isCompletedToday ? "default" : "outline"} className="self-start sm:self-auto">
            {isCompletedToday ? "Completed" : "Pending"}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completion rate</span>
            <span className="font-medium">{stats.completionRate.toFixed(0)}%</span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-muted/50 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Current streak</div>
              <div className="font-semibold">{stats.streak} days</div>
            </div>
            <div className="bg-muted/50 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Longest streak</div>
              <div className="font-semibold">{stats.longestStreak} days</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}