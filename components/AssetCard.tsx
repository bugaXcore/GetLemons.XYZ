import React from 'react';
import { Asset } from '../types';
import { ArrowRight, Box, FileCode, Terminal } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  onClick: (id: number) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick }) => {
  const getIcon = (cat: string) => {
    switch (cat) {
      case 'AE Scripts': return <Terminal size={14} />;
      case '3D Assets': return <Box size={14} />;
      default: return <FileCode size={14} />;
    }
  };

  return (
    <div 
      onClick={() => onClick(asset.id)}
      className="group border border-[#333] bg-[#09090b]/30 hover:bg-[#09090b]/85 hover:border-[#666] transition-all duration-200 cursor-pointer flex flex-col h-full relative overflow-hidden backdrop-blur-sm"
    >
      {/* Hover Decoration */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-300 rotate-45 z-10"></div>

      {/* Main Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono text-gray-500 border border-[#333] px-1.5 py-0.5 uppercase flex items-center gap-2 w-fit bg-black/40">
            {getIcon(asset.category)}
            {asset.category}
          </span>
          <ArrowRight size={16} className="text-gray-600 group-hover:text-yellow-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
        </div>

        <div>
          <h3 className="font-bold text-lg tracking-tight group-hover:text-white transition-colors font-source text-gray-200">{asset.title}</h3>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 font-mono leading-relaxed group-hover:text-gray-400 transition-colors">
            {asset.shortDesc}
          </p>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="border-t border-[#333] p-3 flex items-center gap-3 bg-black/20 group-hover:bg-black/50 transition-colors">
        <span className="text-[10px] text-gray-500 font-mono bg-[#222]/80 px-1">{asset.version}</span>
        <span className="text-[10px] text-gray-500 font-mono bg-[#222]/80 px-1">{asset.fileType}</span>
        {asset.featured && <span className="text-[10px] text-yellow-400 font-bold ml-auto">★ FEATURED</span>}
      </div>
    </div>
  );
};