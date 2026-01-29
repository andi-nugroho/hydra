import React, { useState, useEffect, useCallback } from 'react';
import { Droplets, Waves } from 'lucide-react';
import WaterProgress from '@/components/WaterProgress';
import QuickAddButtons from '@/components/QuickAddButtons';
import ManualInput from '@/components/ManualInput';
import ReminderBanner from '@/components/ReminderBanner';
import DrinkHistory from '@/components/DrinkHistory';
import SettingsPanel from '@/components/SettingsPanel';
import { InteractiveMenu } from '@/components/ui/interactive-menu';
import { useIsMobile } from '@/hooks/use-mobile';

interface DrinkEntry {
  id: string;
  amount: number;
  time: Date;
}

interface AppState {
  entries: DrinkEntry[];
  target: number;
  reminderInterval: number;
}

const STORAGE_KEY = 'water-reminder-data';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const today = getTodayKey();

      // Reset if it's a new day
      if (data.date !== today) {
        return {
          entries: [],
          target: data.target || 2000,
          reminderInterval: data.reminderInterval || 60,
        };
      }

      return {
        entries: data.entries.map((e: any) => ({
          ...e,
          time: new Date(e.time),
        })),
        target: data.target || 2000,
        reminderInterval: data.reminderInterval || 60,
      };
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }

  return {
    entries: [],
    target: 2000,
    reminderInterval: 60,
  };
};

const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      date: getTodayKey(),
    }));
  } catch (e) {
    console.error('Error saving state:', e);
  }
};

const Index = () => {
  const [state, setState] = useState<AppState>(loadState);
  const [activeTab, setActiveTab] = useState('home');
  const isMobile = useIsMobile();

  const totalConsumed = state.entries.reduce((sum, e) => sum + e.amount, 0);
  const lastDrinkTime = state.entries.length > 0
    ? state.entries[state.entries.length - 1].time
    : null;


  useEffect(() => {
    saveState(state);
  }, [state]);

  
  useEffect(() => {
    if (!lastDrinkTime || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const checkReminder = () => {
      const elapsed = (Date.now() - lastDrinkTime.getTime()) / 60000;
      if (elapsed >= state.reminderInterval) {
        new Notification('💧 Waktunya Minum Air!', {
          body: `Sudah ${Math.floor(elapsed)} menit sejak terakhir minum. Jaga hidrasimu!`,
          icon: '/favicon.ico',
        });
      }
    };

    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, [lastDrinkTime, state.reminderInterval]);

  const addDrink = useCallback((amount: number) => {
    const newEntry: DrinkEntry = {
      id: Date.now().toString(),
      amount,
      time: new Date(),
    };

    setState(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry],
    }));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      entries: prev.entries.filter(e => e.id !== id),
    }));
  }, []);

  const resetData = useCallback(() => {
    setState(prev => ({
      ...prev,
      entries: [],
    }));
  }, []);

  const updateTarget = useCallback((target: number) => {
    setState(prev => ({ ...prev, target }));
  }, []);

  const updateInterval = useCallback((reminderInterval: number) => {
    setState(prev => ({ ...prev, reminderInterval }));
  }, []);

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-card border-r border-border p-6 gap-6 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 rounded-xl" style={{ background: 'var(--water-gradient)' }}>
          <Droplets className="text-primary-foreground" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground">HydroTrack</h1>
          <p className="text-xs text-muted-foreground">Pengingat Minum Air</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-4">
        {[
          { id: 'home', label: 'Dashboard', icon: '🏠' },
          { id: 'drink', label: 'Tambah Minum', icon: '💧' },
          { id: 'history', label: 'Riwayat', icon: '📊' },
          { id: 'settings', label: 'Pengaturan', icon: '⚙️' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
              activeTab === item.id
                ? 'bg-primary text-primary-foreground shadow-water'
                : 'hover:bg-secondary text-foreground'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="mt-auto p-4 rounded-2xl bg-secondary">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Hari Ini</span>
          <Waves className="text-primary" size={16} />
        </div>
        <p className="text-2xl font-bold text-foreground">{totalConsumed}ml</p>
        <p className="text-xs text-muted-foreground">dari {state.target}ml target</p>
      </div>
    </aside>
  );

  // Content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <ReminderBanner
              lastDrinkTime={lastDrinkTime}
              reminderInterval={state.reminderInterval}
            />

            <div className="flex justify-center py-6">
              <WaterProgress
                current={totalConsumed}
                target={state.target}
                size={isMobile ? 'md' : 'lg'}
              />
            </div>

            <QuickAddButtons onAdd={addDrink} />
          </div>
        );

      case 'drink':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Tambah Minum</h2>
              <p className="text-sm text-muted-foreground">Pilih cepat atau masukkan manual</p>
            </div>

            <QuickAddButtons onAdd={addDrink} />

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">atau</span>
              </div>
            </div>

            <ManualInput onAdd={addDrink} />
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Riwayat Hari Ini</h2>
                <p className="text-sm text-muted-foreground">
                  Total: {totalConsumed}ml dari {state.entries.length} kali minum
                </p>
              </div>
            </div>

            <DrinkHistory entries={state.entries} onDelete={deleteEntry} />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Pengaturan</h2>
              <p className="text-sm text-muted-foreground">Sesuaikan target dan pengingat</p>
            </div>

            <SettingsPanel
              target={state.target}
              reminderInterval={state.reminderInterval}
              onTargetChange={updateTarget}
              onIntervalChange={updateInterval}
              onReset={resetData}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content */}
      <main className="flex-1 min-h-screen pb-24 lg:pb-8">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ background: 'var(--water-gradient)' }}>
                <Droplets className="text-primary-foreground" size={20} />
              </div>
              <div>
                <h1 className="font-bold text-foreground">HydroTrack</h1>
                <p className="text-xs text-muted-foreground">
                  {totalConsumed}ml / {state.target}ml
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-8 max-w-2xl mx-auto">
          {/* Desktop Title */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {activeTab === 'home' && 'Dashboard'}
              {activeTab === 'drink' && 'Tambah Minum'}
              {activeTab === 'history' && 'Riwayat'}
              {activeTab === 'settings' && 'Pengaturan'}
            </h2>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border z-50">
        <InteractiveMenu
          activeId={activeTab}
          onItemClick={setActiveTab}
        />
      </div>
    </div>
  );
};

export default Index;
