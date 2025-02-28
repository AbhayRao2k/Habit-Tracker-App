import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Home, Calendar, LogIn, LogOut } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span className="font-semibold hidden sm:inline-block">HabitTracker</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="/stats" className="text-sm font-medium transition-colors hover:text-primary">
            Statistics
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/new">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline-block">New Habit</span>
                  <span className="sm:hidden">New</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline-block">Sign Out</span>
                <span className="sm:hidden">Sign Out</span>
              </Button>
              <ModeToggle />
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline-block">Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/register">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline-block">Sign Up</span>
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </Button>
              <ModeToggle />
            </>
          )}
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t">
        <div className="container flex h-12 items-center justify-between px-4">
          <Link to="/" className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium">
            <Home className="h-5 w-5 mb-1" />
            Dashboard
          </Link>
          <Link to="/stats" className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium">
            <BarChart3 className="h-5 w-5 mb-1" />
            Statistics
          </Link>
        </div>
      </div>
    </header>
  );
}