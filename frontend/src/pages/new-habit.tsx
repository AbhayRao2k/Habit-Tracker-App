import { useNavigate } from 'react-router-dom';
import { HabitForm } from '@/components/habit-form';
import { useHabits } from '@/context/HabitContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function NewHabit() {
  const { addHabit } = useHabits();
  const navigate = useNavigate();

  const handleSubmit = (values: { name: string; description?: string; color?: string }) => {
    addHabit(values);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Habit</h1>
        <p className="text-muted-foreground mt-2">Add a new habit to track your daily progress</p>
      </div>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <HabitForm 
            onSubmit={handleSubmit} 
            onCancel={() => navigate('/')} 
          />
        </CardContent>
      </Card>
    </div>
  );
}