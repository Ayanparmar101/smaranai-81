
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type DoodleCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'pink';
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  children?: React.ReactNode;
};

const colorClasses = {
  green: 'border-kid-green hover:shadow-kid-green/50',
  blue: 'border-kid-blue hover:shadow-kid-blue/50',
  red: 'border-kid-red hover:shadow-kid-red/50',
  yellow: 'border-kid-yellow hover:shadow-kid-yellow/50',
  purple: 'border-kid-purple hover:shadow-kid-purple/50',
  orange: 'border-kid-orange hover:shadow-kid-orange/50',
  pink: 'border-kid-pink hover:shadow-kid-pink/50'
};

const DoodleCard = ({
  title,
  description,
  icon,
  color = 'blue',
  to,
  onClick,
  className,
  children
}: DoodleCardProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }
    
    if (to) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <div
      className={cn(
        'card-doodle flex flex-col p-6 cursor-pointer transition-all duration-300 hover:scale-105',
        colorClasses[color],
        className
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-center mb-4">
        {icon && (
          <div className={`text-${color === 'yellow' ? 'kid-orange' : `kid-${color}`} mr-3`}>
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
      {children}
    </div>
  );
};

export default DoodleCard;
