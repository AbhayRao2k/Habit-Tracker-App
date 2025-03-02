import { HabitList } from '@/components/habit-list';
import { WeeklyView } from '@/components/weekly-view';
import { StatsOverview } from '@/components/stats-overview';
import { WeeklyTarget } from '@/components/weekly-target';
import { Loading } from '@/components/ui/loading';
import { useHabits } from '@/context/HabitContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { isLoading, error } = useHabits();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-destructive">{error}</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between py-4 px-6 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => navigate('/new')} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Habit
        </Button>
      </div>
      
      <div className="px-6 sm:px-8">
        <StatsOverview />
      </div>
      
      <div className="grid gap-8 md:grid-cols-12 px-6 sm:px-8">
        <div className="md:col-span-8 space-y-8">
          <WeeklyView />
        </div>
        <div className="md:col-span-4 space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">Your Habits</h2>
          <div className="overflow-hidden">
            <HabitList />
          </div>
          <div className="mt-6">
            <WeeklyTarget />
          </div>
        </div>
      </div>
    </div>
  );
}