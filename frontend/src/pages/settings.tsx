import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeeklyTarget } from '@/context/WeeklyTargetContext';
import { Label } from '@/components/ui/label';
import { DaySelector } from '@/components/weekly-target';

export function Settings() {
  const { weeklyTarget, setWeeklyTarget } = useWeeklyTarget();

  const handleDaySelect = (days: number) => {
    if (days <= 7) {
      setWeeklyTarget(days);
    }
  };

  return (
    <div className="container max-w-2xl py-10 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Target Settings</CardTitle>
          <CardDescription>Set your weekly habit completion goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Select Weekly Target Days</Label>
            <div className="bg-muted/50 p-4 rounded-lg">
              <DaySelector onSelect={handleDaySelect} selectedDays={weeklyTarget || 0} />
            </div>
            <p className="text-sm text-muted-foreground">
              Click on the days to set your weekly target. This will be displayed on your dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}