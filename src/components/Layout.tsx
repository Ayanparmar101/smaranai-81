
import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-grow pt-2">
        {children}
      </main>
      <Footer />
    </div>
  );
};
