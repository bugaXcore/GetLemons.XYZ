
import React from 'react';
import { ViewState } from '../types';
import { ShieldAlert, X } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  showBgControls: boolean;
  setShowBgControls: (show: boolean) => void;
}

// SVG Lemon Icon
const LemonIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <style>
        {`
          .lemon-stroke {
            fill: none;
            stroke: currentColor;
            stroke-miterlimit: 10;
            stroke-width: 6px;
          }
          .lemon-stroke-round {
            stroke-linecap: round;
          }
        `}
      </style>
    </defs>
    <g>
      <path className="lemon-stroke" d="M27.85,81.5c-2.27,0-4.64-1.07-6.5-2.92-2.84-2.84-3.73-6.89-2.12-9.63,1.43-2.44,1.15-5.54.8-9.46-.71-7.85-1.68-18.61,9.97-30.26,9.25-9.27,17.98-10.34,23.74-10.34,2.35,0,4.56.2,6.51.37,1.63.15,3.16.28,4.53.28s3.28-.11,4.93-1.08c.92-.54,1.98-.81,3.14-.81,2.27,0,4.64,1.07,6.5,2.92,2.84,2.84,3.73,6.89,2.12,9.63-1.43,2.44-1.15,5.54-.8,9.46.71,7.86,1.68,18.61-9.97,30.26-9.25,9.27-17.98,10.34-23.74,10.34h0c-2.35,0-4.56-.2-6.51-.37-1.63-.15-3.16-.28-4.53-.28s-3.28.11-4.93,1.08c-.92.54-1.98.81-3.14.81Z"/>
      <path className="lemon-stroke lemon-stroke-round" d="M30.7,51.7c.65-8.68,10-21.23,21.84-21.77"/>
    </g>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, showBgControls, setShowBgControls }) => {
  const [showCogIcon, setShowCogIcon] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  
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

  const handleNavClick = (view: ViewState) => {
    setCurrentView(view);
    setShowMobileMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 w-full border-b border-[#333] bg-[#111]/95 backdrop-blur-md shadow-lg flex items-center justify-between px-4 md:px-8">
      {/* Logo */}
      <div className="flex items-center gap-3 relative">
        <div className="relative flex items-center">
          <button
            onClick={handleLemonClick}
            className="cursor-pointer flex items-center"
            title="Toggle settings access"
          >
            <LemonIcon className="text-[#eee] hover:text-yellow-400 transition-colors duration-300" size={48} />
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
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-4 md:gap-8">
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

        {/* Hamburger Menu Button (Mobile) */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {showMobileMenu ? (
            <X size={24} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* CMS / Admin Button */}
        <button 
          onClick={() => setCurrentView('admin')}
          className={`hidden sm:flex items-center gap-2 text-xs font-bold uppercase px-3 py-1.5 border border-[#333] hover:border-yellow-400 hover:text-yellow-400 transition-colors
            ${currentView === 'admin' ? 'bg-[#222] border-yellow-400 text-yellow-400' : 'text-gray-400'}
          `}
        >
          <ShieldAlert size={14} />
          <span className="hidden sm:inline">ADMIN</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-[#111] border-b border-[#333] shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`text-left px-6 py-2.5 text-xs font-mono tracking-wide uppercase transition-colors duration-200 border-l-2
                  ${currentView === item.value 
                    ? 'text-white border-yellow-400 bg-[#1a1a1a]' 
                    : 'text-gray-400 hover:text-white border-transparent hover:bg-[#0a0a0a]'
                  }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Admin in mobile menu */}
            <div className="border-t border-[#222] mt-1 pt-1">
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-6 py-2.5 text-xs font-mono tracking-wide uppercase transition-colors duration-200 border-l-2 flex items-center gap-2
                  ${currentView === 'admin' 
                    ? 'text-yellow-400 border-yellow-400 bg-[#1a1a1a]' 
                    : 'text-gray-400 hover:text-white border-transparent hover:bg-[#0a0a0a]'
                  }`}
              >
                <ShieldAlert size={12} />
                ADMIN
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
