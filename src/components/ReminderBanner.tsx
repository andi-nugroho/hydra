import React, { useState, useEffect } from 'react';
import { AlertCircle, Bell, BellOff, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReminderBannerProps {
  lastDrinkTime: Date | null;
  reminderInterval: number; // in minutes
}

const ReminderBanner: React.FC<ReminderBannerProps> = ({ 
  lastDrinkTime, 
  reminderInterval 
}) => {
  const [timeSinceLastDrink, setTimeSinceLastDrink] = useState<number>(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      if (lastDrinkTime) {
        const diff = Math.floor((Date.now() - lastDrinkTime.getTime()) / 60000);
        setTimeSinceLastDrink(diff);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [lastDrinkTime]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        new Notification('Pengingat Minum Air 💧', {
          body: 'Notifikasi berhasil diaktifkan!',
          icon: '/favicon.ico',
        });
      }
    }
  };

  const isOverdue = lastDrinkTime && timeSinceLastDrink >= reminderInterval;
  const isWarning = lastDrinkTime && timeSinceLastDrink >= reminderInterval * 0.7;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
  };

  if (!lastDrinkTime) {
    return (
      <div className="p-4 rounded-2xl bg-secondary border border-border animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Droplets className="text-primary" size={20} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Selamat Datang!</p>
            <p className="text-sm text-muted-foreground">
              Mulai dengan minum segelas air pertama hari ini
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`p-4 rounded-2xl border transition-all duration-500 ${
        isOverdue 
          ? 'bg-destructive/10 border-destructive/30 pulse-reminder' 
          : isWarning
            ? 'bg-warning/10 border-warning/30'
            : 'bg-success/10 border-success/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${
          isOverdue 
            ? 'bg-destructive/20' 
            : isWarning 
              ? 'bg-warning/20' 
              : 'bg-success/20'
        }`}>
          <AlertCircle 
            className={
              isOverdue 
                ? 'text-destructive' 
                : isWarning 
                  ? 'text-warning' 
                  : 'text-success'
            } 
            size={20} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${
            isOverdue 
              ? 'text-destructive' 
              : isWarning 
                ? 'text-warning' 
                : 'text-success'
          }`}>
            {isOverdue 
              ? 'Waktunya minum air!' 
              : isWarning 
                ? 'Sebentar lagi waktunya minum'
                : 'Hidrasi baik!'}
          </p>
          <p className="text-sm text-muted-foreground">
            Terakhir minum: {formatTime(timeSinceLastDrink)} yang lalu
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={requestNotificationPermission}
          className={`shrink-0 ${notificationsEnabled ? 'text-primary' : 'text-muted-foreground'}`}
          title={notificationsEnabled ? 'Notifikasi aktif' : 'Aktifkan notifikasi'}
        >
          {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default ReminderBanner;
