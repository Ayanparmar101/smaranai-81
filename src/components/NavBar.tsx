
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/App';
import AuthButton from './AuthButton';
import { ThemeToggle } from './ThemeToggle';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NavBar = () => {
  const {
    user
  } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };
  
  return <header className="w-full py-4 px-4 md:px-8 bg-[#121212] border-b border-border/40">
      <div className="container mx-auto flex justify-between items-center">
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-white hover:text-[#5B86E5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B86E5] rounded-md" aria-label="Open menu">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-[#121212] text-white p-0">
            <nav className="flex flex-col h-full">
              <div className="p-4 border-b border-border/40">
                <Link to="/" className="text-2xl font-bold flex items-center gap-1">
                  <span className="bg-gradient-to-r from-kid-blue via-kid-purple to-kid-red bg-clip-text text-transparent">Smaran.ai</span>
                </Link>
              </div>
              
              <div className="flex-1 overflow-auto py-6 px-4">
                <div className="space-y-6">
                  <button onClick={handleNavigation("/")} className="flex items-center gap-2 p-3 rounded-xl bg-[#4E9BF5] hover:bg-[#3d8be5] transition-colors w-full text-left">
                    <span className="text-lg font-medium">Home</span>
                  </button>
                  
                  <button onClick={handleNavigation("/grammar")} className="flex items-center gap-2 p-3 hover:bg-[#1d1d1d] transition-colors rounded-lg w-full text-left">
                    <span className="text-lg font-medium">Grammar</span>
                  </button>
                  
                  <button onClick={handleNavigation("/story-images")} className="flex items-center gap-2 p-3 hover:bg-[#1d1d1d] transition-colors rounded-lg w-full text-left">
                    <span className="text-lg font-medium">Story Images</span>
                  </button>
                  
                  <button onClick={handleNavigation("/spoken-english")} className="flex items-center gap-2 p-3 hover:bg-[#1d1d1d] transition-colors rounded-lg w-full text-left">
                    <span className="text-lg font-medium">Spoken English</span>
                  </button>
                  
                  <button onClick={handleNavigation("/voice-bot")} className="flex items-center gap-2 p-3 hover:bg-[#1d1d1d] transition-colors rounded-lg w-full text-left">
                    <span className="text-lg font-medium">Voice Bot</span>
                  </button>
                  
                  <button onClick={handleNavigation("/socratic-tutor")} className="flex items-center gap-2 p-3 hover:bg-[#1d1d1d] transition-colors rounded-lg w-full text-left">
                    <span className="text-lg font-medium">Socratic Tutor</span>
                  </button>
                  
                  {user && <button onClick={handleNavigation("/teacher")} className="flex items-center gap-2 p-3 hover:bg-[#1d1d1d] transition-colors rounded-lg w-full text-left">
                      <span className="text-lg font-medium">Teacher Tools</span>
                    </button>}
                  
                  <button onClick={handleNavigation("/profile")} className="flex items-center gap-2 p-3 hover:bg-[#1d1d1d] transition-colors rounded-lg w-full text-left">
                    <span className="text-lg font-medium">Profile</span>
                  </button>
                  
                  <button onClick={handleNavigation("/history")} className="flex items-center gap-2 p-3 hover:bg-[#1d1d1d] transition-colors rounded-lg w-full text-left">
                    <span className="text-lg font-medium">History</span>
                  </button>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex justify-center md:justify-start">
          <Link to="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-kid-blue via-kid-purple to-kid-red bg-clip-text text-transparent py-2">
            Smaran.ai
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>;
};

export default NavBar;
