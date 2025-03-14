
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Image, Mic, MessageCircle, HelpCircle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Home', 
      path: '/',
      icon: <Home className="w-6 h-6" />,
      color: 'bg-kid-blue'
    },
    { 
      name: 'Grammar', 
      path: '/grammar',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-kid-green'
    },
    { 
      name: 'Story Images', 
      path: '/story-images',
      icon: <Image className="w-6 h-6" />,
      color: 'bg-kid-yellow'
    },
    { 
      name: 'Spoken English', 
      path: '/spoken-english',
      icon: <Mic className="w-6 h-6" />,
      color: 'bg-kid-red'
    },
    { 
      name: 'Voice Bot', 
      path: '/voice-bot',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-kid-purple'
    },
    { 
      name: 'Socratic Tutor', 
      path: '/socratic-tutor',
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'bg-kid-orange'
    }
  ];

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-kid-blue via-kid-purple to-kid-red bg-clip-text text-transparent">
              Smaran.ai
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-full transition-all duration-300",
                  location.pathname === item.path
                    ? `${item.color} text-white font-medium animate-wiggle`
                    : "hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="md:hidden">
            {/* Mobile menu button */}
            <button className="p-2 rounded-md bg-gray-100">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden flex overflow-x-auto py-2 px-4 space-x-4 mt-2 no-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center space-y-1 min-w-[70px] px-3 py-2 rounded-lg transition-all",
              location.pathname === item.path
                ? `${item.color} text-white font-medium`
                : "bg-gray-100"
            )}
          >
            {item.icon}
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
