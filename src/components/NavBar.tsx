
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import useMobile from "../hooks/use-mobile";

const NavBar: React.FC = () => {
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Subjects", path: "/subjects" },
    { name: "Gujarati", path: "/gujarati" },
    { name: "Mathematics", path: "/mathematics" },
    { name: "Grammar", path: "/grammar" },
    { name: "Study Planner", path: "/study-planner" },
    { name: "Pomodoro", path: "/pomodoro" },
    { name: "Story Images", path: "/story-images" },
    { name: "Teacher", path: "/teacher" },
    { name: "Voice Bot", path: "/voice-bot" },
    { name: "Socratic Tutor", path: "/socratic-tutor" },
    { name: "History", path: "/history" },
  ];

  // Mobile navigation
  if (isMobile) {
    return (
      <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="font-bold text-xl flex items-center" onClick={closeMenu}>
            Smaran.ai
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthButton />
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="container pb-4 md:hidden">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-2 py-1 rounded-md ${
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    );
  }

  // Desktop navigation
  return (
    <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-14 items-center">
        <Link to="/" className="font-bold text-xl mr-8">
          Smaran.ai
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1 rounded-md ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              Home
            </NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Subjects</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to="/subjects">All Subjects</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/gujarati">Gujarati</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/mathematics">Mathematics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/grammar">Grammar</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Tools</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to="/study-planner">Study Planner</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pomodoro">Pomodoro Timer</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/story-images">Story Images</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">AI Tutors</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to="/teacher">Teacher</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/voice-bot">Voice Bot</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/socratic-tutor">Socratic Tutor</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `px-3 py-1 rounded-md ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              History
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
