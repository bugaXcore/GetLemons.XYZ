
import React, { useState } from 'react';
import { Asset, Category } from '../types';
import { AssetCard } from './AssetCard';
import { Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      'All': assets.length,
      'AE Scripts': 0,
      '3D Assets': 0,
      'Other': 0
    };

    assets.forEach(asset => {
      if (STANDARD_CATEGORIES.includes(asset.category)) {
        counts[asset.category] = (counts[asset.category] || 0) + 1;
      } else {
        counts['Other'] = (counts['Other'] || 0) + 1;
      }
    });

    return counts;
  }, [assets]);

  // Only show categories that have assets (or "All" if there are any assets)
  const availableCategories: Category[] = React.useMemo(() => {
    const cats: Category[] = [];
    
    if (categoryCounts['All'] > 0) cats.push('All');
    if (categoryCounts['AE Scripts'] > 0) cats.push('AE Scripts');
    if (categoryCounts['3D Assets'] > 0) cats.push('3D Assets');
    if (categoryCounts['Other'] > 0) cats.push('Other');
    
    return cats;
  }, [categoryCounts]);

  const filteredAssets = assets.filter(asset => {
    // First apply category filter
    const matchesCategory = activeFilter === 'All' 
      ? true 
      : activeFilter === 'Other'
        ? !STANDARD_CATEGORIES.includes(asset.category)
        : asset.category === activeFilter;
    
    // Then apply search filter
    const matchesSearch = searchTerm.trim() === '' 
      ? true
      : asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-8">
        
        {/* Header Area */}
        <div className="flex flex-col gap-6 border-b border-[#333] pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 font-source">{title}</h1>
              <p className="text-xs text-gray-500 font-mono">{subtitle}</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH..."
                className="w-full bg-[#111] border border-[#333] pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 uppercase placeholder:text-gray-700 font-mono transition-colors"
              />
            </div>
          </div>
          
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2">
            {availableCategories.map(cat => (
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
                [{cat}] <span className="ml-1 opacity-60">({categoryCounts[cat]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="font-mono text-xs text-gray-500 mb-2">
          &gt; SHOWING {filteredAssets.length} RESULT(S)
          {searchTerm && <span className="text-yellow-400"> // SEARCH: "{searchTerm}"</span>}
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
          <div className="py-20 text-center border border-[#333] border-dashed">
            <p className="text-gray-500 font-mono text-sm mb-2">NO_DATA_FOUND</p>
            {searchTerm && (
              <p className="text-gray-600 text-xs">
                Try adjusting your search term or category filter
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
