
import React, { useState } from 'react';
import { Asset } from '../types';
import { ArrowLeft, Download, Monitor, FileText, Hash, ChevronLeft, ChevronRight } from 'lucide-react';

interface AssetDetailProps {
  asset: Asset;
  onBack: () => void;
}

export const AssetDetail: React.FC<AssetDetailProps> = ({ asset, onBack }) => {
  const gallery = asset.gallery || [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeImage = gallery.length > 0 ? gallery[activeImageIndex] : null;
  const isWork = asset.section === 'works';

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (gallery.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (gallery.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full animate-in fade-in duration-300 min-h-screen flex flex-col">
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-mono uppercase text-gray-500 hover:text-white mb-6 transition-colors group w-fit"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        {isWork ? 'Back_To_Works' : 'Back_To_Repository'}
      </button>

      {/* Header Section with Integrated Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-[#333] pb-6">
        <div className="space-y-2 flex-1">
           <div className="flex items-center gap-3 text-xs font-mono uppercase text-gray-500">
              <span className="border border-[#333] px-1.5 py-0.5">{asset.category}</span>
              <span>// ID: {asset.id.toString().padStart(4, '0')}</span>
           </div>
           <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase break-words font-source">{asset.title}</h1>
           <p className="text-lg text-gray-400 font-mono max-w-2xl leading-relaxed">{asset.shortDesc}</p>
        </div>
        
        {/* Download Button */}
        <button className="bg-[#eee] text-[#111] font-bold px-8 py-4 flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-wide group shrink-0 shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
          <Download size={20} className="stroke-[2.5px]" />
          {isWork ? 'Download Project' : 'Download Asset'}
        </button>
      </div>

      {/* Compact Meta Bar */}
      <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs font-mono text-gray-400 mb-6 bg-[#151515] border border-[#333] p-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 uppercase font-bold">Version:</span>
          <span className="text-white bg-[#222] px-1.5">{asset.version}</span>
        </div>
        <div className="w-px h-3 bg-[#333] hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 uppercase font-bold">License:</span>
          <span className="text-white">{asset.license}</span>
        </div>
        <div className="w-px h-3 bg-[#333] hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 uppercase font-bold">File_Ext:</span>
          <span className="text-white">{asset.fileType}</span>
        </div>
        <div className="w-px h-3 bg-[#333] hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 uppercase font-bold">Updated:</span>
          <span className="text-white">2024-10-27</span>
        </div>
        
        {/* Tags Inline */}
        <div className="sm:ml-auto flex flex-wrap gap-2 border-t border-[#333] sm:border-0 pt-2 sm:pt-0 w-full sm:w-auto">
           {[asset.category, asset.fileType.replace('.',''), 'MOTION', 'DEV'].map(tag => (
             <span key={tag} className="flex items-center text-[10px] uppercase text-gray-500 hover:text-white transition-colors cursor-default">
               <Hash size={10} className="mr-0.5 text-yellow-600"/>{tag}
             </span>
           ))}
        </div>
      </div>

      {/* Full Width Cinema Viewer / Carousel */}
      <div className="w-full aspect-video bg-[#0a0a0a] border border-[#333] relative overflow-hidden group mb-4 select-none">
        {activeImage ? (
          <>
            <img 
              src={activeImage} 
              alt={asset.title} 
              className="w-full h-full object-contain"
            />
            
            {/* Carousel Controls */}
            {gallery.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/40 z-10"
                >
                  <ChevronLeft className="text-white drop-shadow-lg" size={48} strokeWidth={1} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/40 z-10"
                >
                  <ChevronRight className="text-white drop-shadow-lg" size={48} strokeWidth={1} />
                </button>
                
                {/* Index Indicator */}
                <div className="absolute bottom-4 right-4 bg-black/90 border border-[#333] px-3 py-1 text-xs font-mono text-gray-300 z-10">
                  {activeImageIndex + 1} / {gallery.length}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <svg width="100%" height="100%" className="absolute inset-0 opacity-10 pointer-events-none">
              <defs>
                <pattern id="detail-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40L40 0H20L0 20M40 40V20L0 40" stroke="#333" strokeWidth="1" fill="none"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#detail-pattern)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 gap-4">
              <Monitor size={64} strokeWidth={1} />
              <span className="font-mono text-xs uppercase tracking-[0.2em]">No_Visual_Signal_Detected</span>
            </div>
          </>
        )}
      </div>

      {/* Gallery Strip */}
      {gallery.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide mb-4">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`w-32 h-20 shrink-0 border transition-all relative group ${idx === activeImageIndex ? 'border-yellow-400 opacity-100' : 'border-[#333] opacity-60 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              {idx === activeImageIndex && <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400"></div>}
            </button>
          ))}
        </div>
      )}

      {/* Documentation & Specs Split */}
      <div className="border-t border-[#333] pt-8 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className={isWork ? "md:col-span-4" : "md:col-span-3"}>
             <h3 className="text-xl font-bold flex items-center gap-2 uppercase mb-6 text-white font-source">
               <FileText size={20} /> {isWork ? 'Project Description' : 'Documentation'}
             </h3>
             <div className="prose prose-invert prose-p:font-mono prose-p:text-sm prose-p:text-gray-400 max-w-none">
               <p className="whitespace-pre-line leading-relaxed">
                 {asset.fullDesc}
               </p>
             </div>
           </div>
           
           {!isWork && (
             <div className="md:col-span-1">
                <div className="bg-[#151515] p-5 border border-[#333] font-mono text-xs text-gray-400 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400/20"></div>
                  <p className="mb-3 uppercase font-bold text-yellow-500 tracking-wider">Installation_Protocol:</p>
                  <ol className="list-decimal list-inside space-y-2 marker:text-gray-600">
                    <li>Download <span className="text-white">{asset.fileType}</span> file</li>
                    <li>Extract to root dir</li>
                    <li>Run via terminal</li>
                  </ol>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
