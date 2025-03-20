
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/App';
import AuthButton from './AuthButton';
import { ThemeToggle } from './ThemeToggle';
import AnimationToggle from './AnimationToggle';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <>
      <header className="w-full py-4 px-4 md:px-8 bg-[#121212] border-b border-border/40">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            className="text-white md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2 mx-auto md:mx-0">
            <Link to="/" className="text-2xl font-bold flex items-center gap-1">
              <span className="text-[#5B86E5]">Smaran</span>
              <span className="text-[#ff6b8b]">.ai</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-white">
            <Link to="/grammar" className="hover:text-[#5B86E5] transition-colors">Grammar</Link>
            <Link to="/story-images" className="hover:text-[#5B86E5] transition-colors">Story Images</Link>
            <Link to="/spoken-english" className="hover:text-[#5B86E5] transition-colors">Spoken English</Link>
            <Link to="/voice-bot" className="hover:text-[#5B86E5] transition-colors">Voice Bot</Link>
            <Link to="/socratic-tutor" className="hover:text-[#5B86E5] transition-colors">Socratic Tutor</Link>
            {user && (
              <Link to="/teacher" className="hover:text-[#5B86E5] transition-colors">Teacher Tools</Link>
            )}
          </nav>
          
          <div className="flex items-center gap-2">
            <AnimationToggle />
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>
      
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#121212] z-50 overflow-y-auto md:hidden">
          <div className="p-4 flex justify-end">
            <button onClick={toggleMenu} aria-label="Close menu">
              <X size={24} className="text-white" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-6 p-6">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-white p-4 rounded-xl bg-[#4E9BF5] hover:bg-[#3d8be5]" 
              onClick={toggleMenu}
            >
              <span className="text-xl font-medium">Home</span>
            </Link>
            
            <Link 
              to="/grammar" 
              className="flex items-center gap-2 text-white p-4" 
              onClick={toggleMenu}
            >
              <span className="text-xl font-medium">Grammar</span>
            </Link>
            
            <Link 
              to="/story-images" 
              className="flex items-center gap-2 text-white p-4" 
              onClick={toggleMenu}
            >
              <span className="text-xl font-medium">Story Images</span>
            </Link>
            
            <Link 
              to="/spoken-english" 
              className="flex items-center gap-2 text-white p-4" 
              onClick={toggleMenu}
            >
              <span className="text-xl font-medium">Spoken English</span>
            </Link>
            
            <Link 
              to="/voice-bot" 
              className="flex items-center gap-2 text-white p-4" 
              onClick={toggleMenu}
            >
              <span className="text-xl font-medium">Voice Bot</span>
            </Link>
            
            <Link 
              to="/socratic-tutor" 
              className="flex items-center gap-2 text-white p-4" 
              onClick={toggleMenu}
            >
              <span className="text-xl font-medium">Socratic Tutor</span>
            </Link>
            
            {user && (
              <Link 
                to="/teacher" 
                className="flex items-center gap-2 text-white p-4" 
                onClick={toggleMenu}
              >
                <span className="text-xl font-medium">Teacher</span>
              </Link>
            )}
            
            <Link 
              to="/profile" 
              className="flex items-center gap-2 text-white p-4" 
              onClick={toggleMenu}
            >
              <span className="text-xl font-medium">Profile</span>
            </Link>
            
            <Link 
              to="/history" 
              className="flex items-center gap-2 text-white p-4" 
              onClick={toggleMenu}
            >
              <span className="text-xl font-medium">History</span>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default NavBar;
