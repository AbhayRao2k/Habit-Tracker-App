import React from 'react';
import { Habit } from '@/types/habit';
import { HabitItem } from '@/components/habit-item';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HabitForm } from '@/components/habit-form';
import { useHabits } from '@/context/HabitContext';
import { ClipboardList } from 'lucide-react';

export function HabitList() {
  const { habits, deleteHabit, updateHabit } = useHabits();
  const [editingHabit, setEditingHabit] = React.useState<Habit | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [habitToDelete, setHabitToDelete] = React.useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (habitId: string) => {
    setHabitToDelete(habitId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete);
      setHabitToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleUpdateHabit = (values: { name: string; description?: string; color?: string }) => {
    if (editingHabit) {
      updateHabit({
        ...editingHabit,
        name: values.name,
        description: values.description,
        color: values.color,
      });
    }
    setIsEditDialogOpen(false);
    setEditingHabit(null);
  };

  if (habits.length === 0) {
    return (
      <EmptyState
        title="No habits yet"
        description="Create your first habit to start tracking your progress"
        icon={<ClipboardList className="h-12 w-12" />}
        action={{
          label: "Create Habit",
          href: "/new"
        }}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onEdit={() => handleEdit(habit)}
          onDelete={() => handleDelete(habit.id)}
        />
      ))}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          {editingHabit && (
            <HabitForm
              habit={editingHabit}
              onSubmit={handleUpdateHabit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and all of its tracking data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}