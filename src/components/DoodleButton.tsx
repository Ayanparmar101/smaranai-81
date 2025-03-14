
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DoodleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "pink" | "orange";
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  variant?: "default" | "outline" | "ghost";
}

const DoodleButton = ({
  color = "blue",
  children,
  icon,
  size = "md",
  className,
  loading = false,
  variant = "default",
  ...props
}: DoodleButtonProps) => {
  const colors = {
    blue: "bg-kid-blue hover:bg-blue-600",
    green: "bg-kid-green hover:bg-green-600",
    yellow: "bg-kid-yellow hover:bg-amber-500",
    red: "bg-kid-red hover:bg-red-600",
    purple: "bg-kid-purple hover:bg-purple-600",
    pink: "bg-kid-pink hover:bg-pink-600",
    orange: "bg-kid-orange hover:bg-orange-600",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 rounded-lg",
    md: "text-base px-4 py-2 rounded-xl",
    lg: "text-lg px-6 py-3 rounded-2xl",
  };

  const variants = {
    default: colors[color],
    outline: `bg-transparent border-2 border-current text-${color === 'blue' ? 'kid-blue' : 
      color === 'green' ? 'kid-green' : 
      color === 'yellow' ? 'kid-yellow' : 
      color === 'red' ? 'kid-red' : 
      color === 'purple' ? 'kid-purple' : 
      color === 'pink' ? 'kid-pink' : 
      'kid-orange'} hover:bg-gray-50`,
    ghost: `bg-transparent text-${color === 'blue' ? 'kid-blue' : 
      color === 'green' ? 'kid-green' : 
      color === 'yellow' ? 'kid-yellow' : 
      color === 'red' ? 'kid-red' : 
      color === 'purple' ? 'kid-purple' : 
      color === 'pink' ? 'kid-pink' : 
      'kid-orange'} hover:bg-gray-50`,
  };

  return (
    <Button
      className={cn(
        "font-medium text-white transition-all transform active:scale-95",
        "border-b-4 border-black/20",
        "shadow-md hover:shadow-lg active:border-b-0 active:translate-y-1",
        variant === 'default' ? colors[color] : variants[variant],
        sizes[size],
        variant !== 'default' && "text-current border-current",
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </div>
      )}
    </Button>
  );
};

export default DoodleButton;
