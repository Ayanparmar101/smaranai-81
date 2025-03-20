import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/App';
import AuthButton from './AuthButton';
import { ThemeToggle } from './ThemeToggle';
import AnimationToggle from './AnimationToggle';
const NavBar = () => {
  const {
    user
  } = useContext(AuthContext);
  return <header className="w-full py-4 px-4 md:px-8 bg-background border-b border-border/40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-foreground flex items-center gap-2 py-[6px] px-[26px] my-0 mx-0">
            <span className="text-primary">Smaran</span>
            <span className="text-accent">ai</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-muted-foreground">
          <Link to="/grammar" className="hover:text-foreground transition-colors">Grammar</Link>
          <Link to="/story-images" className="hover:text-foreground transition-colors">Story Images</Link>
          <Link to="/spoken-english" className="hover:text-foreground transition-colors">Spoken English</Link>
          <Link to="/voice-bot" className="hover:text-foreground transition-colors">Voice Bot</Link>
          <Link to="/socratic-tutor" className="hover:text-foreground transition-colors">Socratic Tutor</Link>
          {user && <Link to="/teacher" className="hover:text-foreground transition-colors">Teacher Tools</Link>}
        </nav>
        
        <div className="flex items-center gap-2">
          <AnimationToggle />
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>;
};
export default NavBar;