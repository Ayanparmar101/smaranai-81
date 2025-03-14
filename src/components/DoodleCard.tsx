
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import DoodleDecoration from './DoodleDecoration';

interface DoodleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'orange';
  to: string;
  className?: string;
}

const DoodleCard: React.FC<DoodleCardProps> = ({
  title,
  description,
  icon,
  color,
  to,
  className,
}) => {
  const colorClasses = {
    blue: 'border-kid-blue',
    green: 'border-kid-green',
    yellow: 'border-kid-yellow',
    red: 'border-kid-red',
    purple: 'border-kid-purple',
    pink: 'border-kid-pink',
    orange: 'border-kid-orange',
  };

  const backgroundGradients = {
    blue: 'bg-gradient-to-br from-white to-blue-100',
    green: 'bg-gradient-to-br from-white to-green-100',
    yellow: 'bg-gradient-to-br from-white to-yellow-100',
    red: 'bg-gradient-to-br from-white to-red-100',
    purple: 'bg-gradient-to-br from-white to-purple-100',
    pink: 'bg-gradient-to-br from-white to-pink-100',
    orange: 'bg-gradient-to-br from-white to-orange-100',
  };

  const colorText = {
    blue: 'text-kid-blue',
    green: 'text-kid-green',
    yellow: 'text-kid-yellow',
    red: 'text-kid-red',
    purple: 'text-kid-purple',
    pink: 'text-kid-pink',
    orange: 'text-kid-orange',
  };

  const decorationTypes = ['star', 'cloud', 'heart', 'circle', 'squiggle'] as const;
  const randomDecoration = decorationTypes[Math.floor(Math.random() * decorationTypes.length)];

  return (
    <Link
      to={to}
      className={cn(
        "relative group p-6 rounded-2xl border-4 border-dashed overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        backgroundGradients[color],
        colorClasses[color],
        className
      )}
    >
      <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <DoodleDecoration type={randomDecoration} color={color} size="sm" />
      </div>
      
      <div className="flex flex-col h-full">
        <div className={cn("p-3 rounded-full w-16 h-16 mb-4 flex items-center justify-center", colorText[color])}>
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow mb-4">{description}</p>
        
        <div className={cn("mt-auto text-sm font-medium flex items-center", colorText[color])}>
          Start Learning
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default DoodleCard;
