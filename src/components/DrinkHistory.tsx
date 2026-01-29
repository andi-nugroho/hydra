import React from 'react';
import { Droplets, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrinkEntry {
  id: string;
  amount: number;
  time: Date;
}

interface DrinkHistoryProps {
  entries: DrinkEntry[];
  onDelete?: (id: string) => void;
}

const DrinkHistory: React.FC<DrinkHistoryProps> = ({ entries, onDelete }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-4 rounded-full bg-secondary mb-4">
          <Droplets className="text-muted-foreground" size={32} />
        </div>
        <p className="text-muted-foreground font-medium">Belum ada catatan hari ini</p>
        <p className="text-sm text-muted-foreground/70">
          Mulai minum dan catat asupan airmu
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div 
          key={entry.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border 
                     hover:shadow-card transition-all animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="p-2 rounded-lg bg-secondary">
            <Droplets className="text-primary" size={16} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">+{entry.amount}ml</p>
            <p className="text-xs text-muted-foreground">{formatTime(entry.time)}</p>
          </div>
          
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(entry.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DrinkHistory;
