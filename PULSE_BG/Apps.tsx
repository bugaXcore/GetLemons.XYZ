import React, { useState } from 'react';
import { PulseCanvas } from './components/PulseCanvas';
import { Controls } from './components/Controls';
import { DEFAULT_CONFIG } from './constants';
import { AppConfig } from './types';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950">
      <PulseCanvas config={config} />
      
      {showControls && (
        <Controls config={config} onChange={setConfig} />
      )}

      {/* Top right minimal toggle button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="fixed top-6 right-6 z-[60] p-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg backdrop-blur-sm transition-all border border-zinc-800/50"
        aria-label={showControls ? "Close Settings" : "Open Settings"}
      >
        {showControls ? (
          // Close (X) Icon
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // Hamburger Menu Icon
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      <div className="fixed bottom-6 left-6 pointer-events-none text-zinc-600 text-sm select-none">
        <p>Click and hold to spawn</p>
      </div>
    </div>
  );
}