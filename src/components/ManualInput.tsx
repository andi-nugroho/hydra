import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ManualInputProps {
  onAdd: (amount: number) => void;
}

const ManualInput: React.FC<ManualInputProps> = ({ onAdd }) => {
  const [value, setValue] = useState<number>(100);

  const handleIncrement = () => {
    setValue(prev => Math.min(prev + 50, 2000));
  };

  const handleDecrement = () => {
    setValue(prev => Math.max(prev - 50, 50));
  };

  const handleSubmit = () => {
    if (value > 0) {
      onAdd(value);
      setValue(100);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          className="h-12 w-12 rounded-xl shrink-0"
        >
          <Minus size={20} />
        </Button>
        
        <div className="relative flex-1">
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(Math.max(0, parseInt(e.target.value) || 0))}
            className="h-12 text-center text-lg font-semibold pr-12 rounded-xl"
            min={0}
            max={2000}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            ml
          </span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          className="h-12 w-12 rounded-xl shrink-0"
        >
          <Plus size={20} />
        </Button>
      </div>
      
      <Button 
        onClick={handleSubmit}
        className="h-12 rounded-xl font-semibold shadow-water hover:shadow-water-lg transition-all"
        style={{ background: 'var(--water-gradient)' }}
      >
        Tambah {value}ml
      </Button>
    </div>
  );
};

export default ManualInput;
