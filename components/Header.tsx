
import React from 'react';
import { ViewState } from '../types';
import { ShieldAlert } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  showBgControls: boolean;
  setShowBgControls: (show: boolean) => void;
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

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, showBgControls, setShowBgControls }) => {
  const [showCogIcon, setShowCogIcon] = React.useState(false);
  
  const navItems: { label: string; value: ViewState }[] = [
    { label: 'HOME', value: 'home' },
    { label: 'REPOSITORY', value: 'repository' },
    { label: 'WORKS', value: 'works' },
    { label: 'INFO', value: 'info' },
  ];

  const handleLemonClick = () => {
    if (showCogIcon) {
      // Close both cog and menu
      setShowCogIcon(false);
      setShowBgControls(false);
    } else {
      // Open cog
      setShowCogIcon(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-[#333] bg-[#111]/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-8">
      {/* Logo */}
      <div className="flex items-center gap-3 relative">
        <div className="relative flex items-center">
          <button
            onClick={handleLemonClick}
            className="cursor-pointer flex items-center"
            title="Toggle settings access"
          >
            <PixelLemon className="text-[#eee] hover:text-yellow-400 transition-colors duration-300" size={24} />
          </button>
          
          {/* Settings button appears below lemon icon when lemon is clicked */}
          {showCogIcon && (
            <button
              onClick={() => setShowBgControls(!showBgControls)}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 bg-black/90 hover:bg-black text-gray-500 hover:text-white border border-[#333] rounded-lg transition-all shadow-lg z-50"
              title="Background Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          )}
        </div>
        
        <button
          onClick={() => setCurrentView('home')}
          className="cursor-pointer"
        >
          <span className="font-bold tracking-wider text-lg mt-1 hidden md:block font-source hover:text-yellow-400 transition-colors duration-300">Getlemons.xyz</span>
          <span className="font-bold tracking-wider text-lg mt-1 md:hidden font-source hover:text-yellow-400 transition-colors duration-300">GL.xyz</span>
        </button>
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
