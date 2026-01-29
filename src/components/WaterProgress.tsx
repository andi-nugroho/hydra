import React from 'react';
import { Droplets } from 'lucide-react';

interface WaterProgressProps {
  current: number;
  target: number;
  size?: 'sm' | 'md' | 'lg';
}

const WaterProgress: React.FC<WaterProgressProps> = ({ 
  current, 
  target, 
  size = 'lg' 
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  const sizeConfig = {
    sm: { dimension: 120, stroke: 8, fontSize: 'text-xl', iconSize: 16 },
    md: { dimension: 180, stroke: 10, fontSize: 'text-3xl', iconSize: 20 },
    lg: { dimension: 240, stroke: 12, fontSize: 'text-4xl', iconSize: 28 },
  };

  const config = sizeConfig[size];
  const radius = (config.dimension - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getProgressColor = () => {
    if (percentage >= 100) return 'hsl(var(--success))';
    if (percentage >= 50) return 'hsl(var(--primary))';
    if (percentage >= 25) return 'hsl(var(--warning))';
    return 'hsl(var(--reminder-urgent))';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={config.dimension}
        height={config.dimension}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={config.stroke}
        />
        {/* Progress circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke={getProgressColor()}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="water-progress"
          style={{
            filter: percentage >= 100 ? 'drop-shadow(0 0 8px hsl(var(--success) / 0.5))' : undefined,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        <Droplets 
          className="text-primary mb-1 float-animation" 
          size={config.iconSize}
        />
        <span className={`font-bold ${config.fontSize} text-foreground`}>
          {current}
        </span>
        <span className="text-muted-foreground text-sm font-medium">
          / {target} ml
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          {percentage.toFixed(0)}% tercapai
        </span>
      </div>
    </div>
  );
};

export default WaterProgress;
