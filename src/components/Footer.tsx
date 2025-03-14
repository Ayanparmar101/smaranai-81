import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 border-t-2 border-dashed border-gray-200 pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-4/12 mb-8 md:mb-0">
            <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-kid-blue via-kid-purple to-kid-red bg-clip-text text-transparent">
              Smaran.ai
            </h4>
            <p className="text-gray-600 mb-4">
              Making English learning fun and interactive for students in grades 1-8.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="bg-kid-blue hover:bg-blue-600 text-white p-2 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Smaran.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;