import { HabitList } from '@/components/habit-list';
import { WeeklyView } from '@/components/weekly-view';
import { StatsOverview } from '@/components/stats-overview';
import { Loading } from '@/components/ui/loading';
import { useHabits } from '@/context/HabitContext';

export function Dashboard() {
  const { isLoading, error } = useHabits();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-destructive">{error}</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <StatsOverview />
      
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8 space-y-8">
          <WeeklyView />
        </div>
        <div className="md:col-span-4 space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">Your Habits</h2>
          <div className="overflow-hidden">
            <HabitList />
          </div>
        </div>
      </div>
    </div>
  );
}