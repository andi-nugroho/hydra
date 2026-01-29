import React from 'react';
import { GlassWater, Coffee, Wine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAddButtonsProps {
  onAdd: (amount: number) => void;
}

const presets = [
  { amount: 150, label: '150ml', icon: Coffee, description: 'Cangkir' },
  { amount: 250, label: '250ml', icon: GlassWater, description: 'Gelas' },
  { amount: 500, label: '500ml', icon: Wine, description: 'Botol' },
];

const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({ onAdd }) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {presets.map((preset) => {
        const IconComponent = preset.icon;
        return (
          <button
            key={preset.amount}
            onClick={() => onAdd(preset.amount)}
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border 
                       hover:border-primary hover:shadow-water transition-all duration-300 
                       active:scale-95 ripple-effect"
          >
            <div className="p-3 rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors">
              <IconComponent 
                className="text-primary transition-transform group-hover:scale-110" 
                size={24} 
              />
            </div>
            <span className="font-bold text-foreground">{preset.label}</span>
            <span className="text-xs text-muted-foreground">{preset.description}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickAddButtons;
