import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/theme-provider';
import { HabitProvider } from '@/context/HabitContext';
import { Dashboard } from '@/pages/dashboard';
import { NewHabit } from '@/pages/new-habit';
import { Stats } from '@/pages/stats';
import { NotFound } from '@/pages/not-found';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="habit-tracker-theme">
      <HabitProvider>
        <Router>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-6 sm:py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new" element={<NewHabit />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;