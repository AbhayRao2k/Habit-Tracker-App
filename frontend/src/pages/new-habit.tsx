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
    <div className="max-w-md mx-auto px-4 sm:px-0">
      <Card className="overflow-hidden">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Create New Habit</CardTitle>
          <CardDescription>
            Add a new habit to track your daily progress
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <HabitForm 
            onSubmit={handleSubmit} 
            onCancel={() => navigate('/')} 
          />
        </CardContent>
      </Card>
    </div>
  );
}