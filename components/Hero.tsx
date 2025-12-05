
import React from 'react';
import { Asset, HomepageConfig } from '../types';
import { AssetCard } from './AssetCard';
import { Activity } from 'lucide-react';

interface HeroProps {
  featuredAssets: Asset[];
  config: HomepageConfig;
  onAssetSelect: (id: number) => void;
  onNavigateToRepo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  featuredAssets, 
  config,
  onAssetSelect,
  onNavigateToRepo 
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-20 animate-in fade-in duration-700">
      
      {/* Split Layout: Manifesto & Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left: Text Content */}
        <div className="space-y-8">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] font-source">
              {config.headlinePart1}<br/>
              <span className="text-white">
                {config.headlinePart2}
              </span>
            </h1>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-yellow-400 font-mono text-xs tracking-widest uppercase">
              <div className="w-8 h-[2px] bg-yellow-400"></div>
              {config.subheadline}
            </div>
            
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-mono whitespace-pre-line max-w-xl">
              {config.manifesto}
            </p>
          </div>
        </div>

        {/* Right: Visual Placeholder */}
        {/* Updated sizing: Removed lg:aspect-square, strictly aspect-video with reduced max-height */}
        <div className="relative w-full aspect-video max-h-[320px] bg-[#0a0a0a] border border-[#333] overflow-hidden group shadow-2xl shadow-black/50">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-yellow-400 z-10"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-yellow-400 z-10"></div>
          
          {config.heroVisualUrl ? (
            <img 
              src={config.heroVisualUrl} 
              alt="Hero Visual" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              {/* Animated Grid Background */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}></div>
              
              <div className="relative z-10 flex flex-col items-center gap-4 text-gray-600 animate-pulse">
                <Activity size={48} strokeWidth={1} />
                <span className="font-mono text-xs tracking-[0.3em] uppercase">System_Ready</span>
              </div>

              {/* Fake scanning line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent h-[20%] w-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Grid */}
      <div className="space-y-6 border-t border-[#333] pt-8">
        <div className="flex items-center justify-between">
           <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 font-source flex items-center gap-2">
             <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
             Freshly Squeezed
           </h2>
           <button 
             onClick={onNavigateToRepo}
             className="text-xs uppercase hover:text-white hover:underline text-gray-500 transition-colors font-mono"
           >
             View All_Directory &rarr;
           </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredAssets.map(asset => (
            <AssetCard 
              key={asset.id} 
              asset={asset}
              onClick={onAssetSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
