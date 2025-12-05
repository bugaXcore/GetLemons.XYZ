
import React, { useState } from 'react';
import { Asset, Category } from '../types';
import { AssetCard } from './AssetCard';

interface RepositoryProps {
  assets: Asset[];
  onAssetSelect: (id: number) => void;
  title?: string;
  subtitle?: string;
}

const STANDARD_CATEGORIES = ['AE Scripts', '3D Assets'];

export const Repository: React.FC<RepositoryProps> = ({ 
  assets, 
  onAssetSelect,
  title = "REPOSITORY",
  subtitle = "INDEX OF AVAILABLE TOOLS"
}) => {
  const [activeFilter, setActiveFilter] = useState<Category>('All');

  const categories: Category[] = ['All', 'AE Scripts', '3D Assets', 'Other'];

  const filteredAssets = assets.filter(asset => {
    if (activeFilter === 'All') return true;
    
    if (activeFilter === 'Other') {
      // If the filter is 'Other', we show anything that isn't a standard category
      return !STANDARD_CATEGORIES.includes(asset.category);
    }

    return asset.category === activeFilter;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#333] pb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-source">{title}</h1>
            <p className="text-xs text-gray-500 font-mono">{subtitle}</p>
          </div>
          
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 text-xs uppercase font-bold tracking-wider border border-[#333] transition-colors duration-150
                  ${activeFilter === cat 
                    ? 'bg-[#eee] text-[#111]' 
                    : 'bg-transparent text-[#eee] hover:bg-[#333]'
                  }
                `}
              >
                [{cat}]
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="font-mono text-xs text-gray-500 mb-2">
          &gt; SHOWING {filteredAssets.length} RESULT(S)
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredAssets.map(asset => (
            <AssetCard 
              key={asset.id}
              asset={asset}
              onClick={onAssetSelect}
            />
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="py-20 text-center border border-[#333] border-dashed text-gray-500">
            NO_DATA_FOUND
          </div>
        )}
      </div>
    </section>
  );
};
