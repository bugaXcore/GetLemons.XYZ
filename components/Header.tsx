
import React from 'react';
import { ViewState } from '../types';
import { ShieldAlert } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

// Custom 8-bit Lemon Icon
const PixelLemon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    style={{ shapeRendering: 'crispEdges' }}
  >
    {/* Pixel art lemon shape */}
    <path d="
      M2 10h2V8h2V6h4V4h4v2h4v2h2v2h2v4h-2v2h-2v2h-4v2h-4v-2H6v-2H4v-2H2v-4z
      M6 10v4h2v2h4v2h4v-2h2v-2h2v-4h-2V8h-2V6h-4v2H8v2H6z
    " fillRule="evenodd"/>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItems: { label: string; value: ViewState }[] = [
    { label: 'HOME', value: 'home' },
    { label: 'REPOSITORY', value: 'repository' },
    { label: 'WORKS', value: 'works' },
    { label: 'INFO', value: 'info' },
  ];

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-[#333] bg-[#111]/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-8">
      {/* Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setCurrentView('home')}
      >
        <PixelLemon className="text-[#eee] group-hover:text-yellow-400 transition-colors duration-300" size={24} />
        <span className="font-bold tracking-wider text-lg mt-1 hidden md:block font-source">Getlemons.xyz</span>
        <span className="font-bold tracking-wider text-lg mt-1 md:hidden font-source">GL.xyz</span>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        {/* Navigation */}
        <nav className="flex gap-4 md:gap-8">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setCurrentView(item.value)}
              className={`text-sm font-mono tracking-wide uppercase focus:outline-none transition-colors duration-200
                ${currentView === item.value 
                  ? 'text-white border-b-2 border-white pb-0.5' 
                  : 'text-gray-500 hover:text-white'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CMS / Admin Button */}
        <button 
          onClick={() => setCurrentView('admin')}
          className={`flex items-center gap-2 text-xs font-bold uppercase px-3 py-1.5 border border-[#333] hover:border-yellow-400 hover:text-yellow-400 transition-colors
            ${currentView === 'admin' ? 'bg-[#222] border-yellow-400 text-yellow-400' : 'text-gray-400'}
          `}
        >
          <ShieldAlert size={14} />
          <span className="hidden sm:inline">ADMIN</span>
        </button>
      </div>
    </header>
  );
};
