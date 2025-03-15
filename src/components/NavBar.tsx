
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Image, Mic, MessageCircle, HelpCircle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthButton from './AuthButton';

const NavBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    window.addEventListener('resize', closeMenu);
    return () => window.removeEventListener('resize', closeMenu);
  }, []);

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

          <div className={`${isOpen ? 'flex' : 'hidden'} absolute top-16 left-0 right-0 flex-col bg-white shadow-lg md:relative md:top-0 md:flex md:flex-row md:shadow-none md:items-center md:space-x-4`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-full transition-all duration-300 md:flex-row md:flex-nowrap",
                  location.pathname === item.path
                    ? `${item.color} text-white font-medium`
                    : "hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <AuthButton />
            
            <div className="md:hidden">
              <button onClick={toggle} className="p-2 rounded-md bg-gray-100">
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
      </div>
    </nav>
  );
};

export default NavBar;
