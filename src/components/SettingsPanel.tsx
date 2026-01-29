import React from 'react';
import { Target, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingsPanelProps {
  target: number;
  reminderInterval: number;
  onTargetChange: (value: number) => void;
  onIntervalChange: (value: number) => void;
  onReset: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  target,
  reminderInterval,
  onTargetChange,
  onIntervalChange,
  onReset,
}) => {
  return (
    <div className="space-y-6">
      {/* Target Setting */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-secondary">
            <Target className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Target Harian</h3>
            <p className="text-sm text-muted-foreground">Jumlah air yang ingin diminum</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={target}
            onChange={(e) => onTargetChange(Math.max(500, parseInt(e.target.value) || 2000))}
            className="flex-1 h-12 text-center font-semibold rounded-xl"
            min={500}
            max={5000}
            step={100}
          />
          <span className="text-muted-foreground font-medium">ml</span>
        </div>
        
        <div className="flex gap-2 mt-3">
          {[1500, 2000, 2500, 3000].map((val) => (
            <Button
              key={val}
              variant={target === val ? "default" : "outline"}
              size="sm"
              onClick={() => onTargetChange(val)}
              className="flex-1 rounded-lg text-xs"
            >
              {val / 1000}L
            </Button>
          ))}
        </div>
      </div>

      {/* Reminder Interval */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-secondary">
            <Clock className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Interval Pengingat</h3>
            <p className="text-sm text-muted-foreground">Waktu antara pengingat minum</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={reminderInterval}
            onChange={(e) => onIntervalChange(Math.max(15, parseInt(e.target.value) || 60))}
            className="flex-1 h-12 text-center font-semibold rounded-xl"
            min={15}
            max={180}
            step={15}
          />
          <span className="text-muted-foreground font-medium">menit</span>
        </div>
        
        <div className="flex gap-2 mt-3">
          {[30, 60, 90, 120].map((val) => (
            <Button
              key={val}
              variant={reminderInterval === val ? "default" : "outline"}
              size="sm"
              onClick={() => onIntervalChange(val)}
              className="flex-1 rounded-lg text-xs"
            >
              {val}m
            </Button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={onReset}
        className="w-full h-12 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
      >
        <RotateCcw size={18} className="mr-2" />
        Reset Data Hari Ini
      </Button>
    </div>
  );
};

export default SettingsPanel;
