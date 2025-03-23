
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/App';
import AuthButton from './AuthButton';
import { ThemeToggle } from './ThemeToggle';
import { 
  Menu, 
  Home, 
  BookText, 
  Image, 
  Mic, 
  Bot, 
  GraduationCap, 
  CalendarDays, 
  Timer, 
  BookOpen, 
  UserRound, 
  History 
} from 'lucide-react';
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
                  <span className="text-[#5B86E5]">Smaran</span>
                  <span className="text-[#ff6b8b]">.ai</span>
                </Link>
              </div>
              
              <div className="flex-1 overflow-auto py-6 px-4">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleNavigation("/")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#4E9BF5] hover:bg-[#3d8be5] transition-colors h-24"
                  >
                    <Home size={24} />
                    <span className="text-sm font-medium text-center">Home</span>
                  </button>
                  
                  <button 
                    onClick={handleNavigation("/grammar")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                  >
                    <BookText size={24} />
                    <span className="text-sm font-medium text-center">Grammar</span>
                  </button>
                  
                  <button 
                    onClick={handleNavigation("/story-images")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                  >
                    <Image size={24} />
                    <span className="text-sm font-medium text-center">Story Images</span>
                  </button>
                  
                  <button 
                    onClick={handleNavigation("/spoken-english")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                  >
                    <Mic size={24} />
                    <span className="text-sm font-medium text-center">Spoken English</span>
                  </button>
                  
                  <button 
                    onClick={handleNavigation("/voice-bot")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                  >
                    <Bot size={24} />
                    <span className="text-sm font-medium text-center">Voice Bot</span>
                  </button>
                  
                  <button 
                    onClick={handleNavigation("/socratic-tutor")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                  >
                    <GraduationCap size={24} />
                    <span className="text-sm font-medium text-center">Socratic Tutor</span>
                  </button>
                  
                  <button 
                    onClick={handleNavigation("/study-planner")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                  >
                    <CalendarDays size={24} />
                    <span className="text-sm font-medium text-center">Study Planner</span>
                  </button>
                  
                  <button 
                    onClick={handleNavigation("/pomodoro")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                  >
                    <Timer size={24} />
                    <span className="text-sm font-medium text-center">Pomodoro Timer</span>
                  </button>
                  
                  {user && 
                    <button 
                      onClick={handleNavigation("/teacher")} 
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                    >
                      <BookOpen size={24} />
                      <span className="text-sm font-medium text-center">Teacher Tools</span>
                    </button>
                  }
                  
                  <button 
                    onClick={handleNavigation("/profile")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                  >
                    <UserRound size={24} />
                    <span className="text-sm font-medium text-center">Profile</span>
                  </button>
                  
                  <button 
                    onClick={handleNavigation("/history")} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-[#1d1d1d] transition-colors h-24"
                  >
                    <History size={24} />
                    <span className="text-sm font-medium text-center">History</span>
                  </button>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex justify-center md:justify-start">
          <Link to="/" className="text-2xl font-bold flex items-center gap-1 px-[19px]">
            <span className="text-[#5B86E5]">Smaran</span>
            <span className="text-[#ff6b8b]">.ai</span>
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
