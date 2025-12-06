
import React, { useState } from 'react';
import { Asset, Category, HomepageConfig } from '../types';
import { Save, Plus, X, Trash2, Edit2, ArrowUp, ArrowDown, Search, AlertTriangle, LayoutTemplate, Database, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AdminProps {
  assets: Asset[];
  homeConfig: HomepageConfig;
  onSave: (asset: Asset) => void;
  onDelete: (id: number) => void;
  onSaveHomeConfig: (config: HomepageConfig) => void;
  onCancel: () => void;
}

type Mode = 'list' | 'edit' | 'homepage';
type SortField = 'id' | 'title' | 'category' | 'featured';

const STANDARD_CATEGORIES = ['AE Scripts', '3D Assets'];

export const Admin: React.FC<AdminProps> = ({ assets, homeConfig, onSave, onDelete, onSaveHomeConfig, onCancel }) => {
  const [mode, setMode] = useState<Mode>('list');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Confirmation state for deletion
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  // Filter/Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Form State for Assets
  const defaultForm: Partial<Asset> = {
    title: '',
    category: 'AE Scripts',
    version: '',
    license: 'Free',
    fileType: '',
    shortDesc: '',
    fullDesc: '',
    featured: false,
    gallery: [],
    section: 'repository'
  };
  const [formData, setFormData] = useState<Partial<Asset>>(defaultForm);
  const [galleryInput, setGalleryInput] = useState('');

  // Form State for Homepage
  const [homeFormData, setHomeFormData] = useState<HomepageConfig>(homeConfig);

  // --- Handlers ---

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Force reload to clear state
  };

  const handleEditClick = (asset: Asset) => {
    setFormData(asset);
    setGalleryInput(asset.gallery ? asset.gallery.join(', ') : '');
    setEditingId(asset.id);
    setMode('edit');
    setDeleteConfirmId(null);
  };

  const handleNewClick = () => {
    setFormData(defaultForm);
    setGalleryInput('');
    setEditingId(null);
    setMode('edit');
    setDeleteConfirmId(null);
  };

  const executeDelete = (id: number) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Other') {
      const currentIsStandard = STANDARD_CATEGORIES.includes(formData.category || '');
      setFormData(prev => ({ ...prev, category: currentIsStandard ? '' : prev.category }));
    } else {
      setFormData(prev => ({ ...prev, category: val }));
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, featured: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDesc) return;

    const processedGallery = galleryInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const finalCategory = formData.category && formData.category.trim() !== '' ? formData.category : 'Other';

    const assetToSave: Asset = {
      id: editingId || Date.now(), // ID will be handled by backend for new items, but we keep temp ID for optimistic UI
      title: formData.title || 'UNTITLED',
      category: finalCategory,
      version: formData.version || 'v1.0',
      license: formData.license || 'Unknown',
      fileType: formData.fileType || '.ZIP',
      shortDesc: formData.shortDesc || '',
      fullDesc: formData.fullDesc || '',
      featured: formData.featured || false,
      gallery: processedGallery,
      section: (formData.section as 'repository' | 'works') || 'repository'
    };

    onSave(assetToSave);
    setMode('list');
  };

  // Homepage Handlers
  const handleHomeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHomeFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveHomeConfig(homeFormData);
    // Visual feedback could be added here
    alert('Homepage updated!');
  };

  // --- Derived State for List ---
  
  const filteredAssets = assets
    .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortDir === 'asc' ? comparison : -comparison;
    });

  const currentCategoryValue = STANDARD_CATEGORIES.includes(formData.category || '') ? formData.category : 'Other';

  // --- Renders ---

  // Common Layout for Admin Modes
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-12 min-h-screen font-mono">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 font-source">SYSTEM_ADMIN</h1>
          <p className="text-xs text-gray-500 uppercase">Manage Content & Configuration</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto items-center">
           <button 
             onClick={handleLogout}
             className="border border-red-900/50 text-red-500 px-4 py-2 text-xs font-bold uppercase hover:bg-red-900/20 transition-colors flex items-center gap-2"
           >
             <LogOut size={14} /> Logout
           </button>
           <button 
             onClick={onCancel}
             className="border border-[#333] px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:text-white hover:border-white transition-colors"
           >
             Exit
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#333]">
        <button 
          onClick={() => setMode('list')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-t border-x border-[#333] transition-colors ${mode === 'list' || mode === 'edit' ? 'bg-[#1a1a1a] text-yellow-400 border-b-[#1a1a1a] -mb-[1px]' : 'bg-transparent text-gray-500 hover:text-white hover:bg-[#111]'}`}
        >
          <Database size={14} /> Assets Database
        </button>
        <button 
          onClick={() => {
            setMode('homepage');
            setHomeFormData(homeConfig); // Reset form to current config when switching
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-t border-x border-[#333] transition-colors ${mode === 'homepage' ? 'bg-[#1a1a1a] text-yellow-400 border-b-[#1a1a1a] -mb-[1px]' : 'bg-transparent text-gray-500 hover:text-white hover:bg-[#111]'}`}
        >
          <LayoutTemplate size={14} /> Homepage Content
        </button>
      </div>

      {/* --- HOMEPAGE EDITOR MODE --- */}
      {mode === 'homepage' && (
        <div className="border border-[#333] bg-[#111] p-6 md:p-8 animate-in fade-in">
          <form onSubmit={handleHomeSubmit} className="space-y-6 max-w-3xl">
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase text-yellow-400 border-b border-[#333] pb-2">Main Headline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Line 1</label>
                  <input
                    type="text"
                    name="headlinePart1"
                    value={homeFormData.headlinePart1}
                    onChange={handleHomeFormChange}
                    className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none font-source font-bold text-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Line 2</label>
                  <input
                    type="text"
                    name="headlinePart2"
                    value={homeFormData.headlinePart2}
                    onChange={handleHomeFormChange}
                    className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none font-source font-bold text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase text-yellow-400 border-b border-[#333] pb-2">Manifesto</h2>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider">Sub-Headline</label>
                <input
                  type="text"
                  name="subheadline"
                  value={homeFormData.subheadline}
                  onChange={handleHomeFormChange}
                  className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none font-source font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider">Manifesto Body Text</label>
                <textarea
                  name="manifesto"
                  value={homeFormData.manifesto}
                  onChange={handleHomeFormChange}
                  rows={6}
                  className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase text-yellow-400 border-b border-[#333] pb-2">Visuals</h2>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider">Hero Visual URL (Image/GIF)</label>
                <input
                  type="text"
                  name="heroVisualUrl"
                  value={homeFormData.heroVisualUrl || ''}
                  onChange={handleHomeFormChange}
                  placeholder="https://example.com/animation.gif"
                  className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none font-mono text-sm"
                />
                <p className="text-[10px] text-gray-500 mt-1">Leave empty to show the default 'SYSTEM_READY' placeholder.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#333] flex justify-end">
              <button 
                type="submit" 
                className="bg-yellow-400 text-black px-6 py-2 font-bold uppercase hover:bg-yellow-300 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Save size={16} />
                Update Homepage
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- ASSET EDIT MODE --- */}
      {mode === 'edit' && (
        <div className="border border-[#333] bg-[#111] animate-in fade-in flex flex-col" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          <div className="border-b border-[#333] p-4 flex justify-between items-center bg-[#1a1a1a] shrink-0">
            <h1 className="font-bold flex items-center gap-2 font-source">
              <Plus size={16} className="text-yellow-400" />
              {editingId ? 'EDIT_ENTRY' : 'NEW_ENTRY'}
            </h1>
            <div className="flex items-center gap-3">
              <button 
                type="submit"
                form="asset-form"
                className="bg-yellow-400 text-black px-4 py-1.5 text-xs font-bold uppercase hover:bg-yellow-300 transition-all flex items-center gap-1.5 rounded-full"
              >
                <Save size={12} />
                {editingId ? 'Save' : 'Publish'}
              </button>
              <button onClick={() => setMode('list')} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
          </div>

          <form id="asset-form" onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 md:p-8 space-y-6 overflow-y-scroll flex-1">
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g. PROJECT_NEON"
                  className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                  autoFocus
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider">Destination Section</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleFormChange}
                  className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none appearance-none"
                >
                  <option value="repository">REPOSITORY (Tools/Assets)</option>
                  <option value="works">WORKS (Visual Projects)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider">Category</label>
                <div className="space-y-2">
                  <select
                    value={currentCategoryValue}
                    onChange={handleCategorySelectChange}
                    className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none appearance-none"
                  >
                    {STANDARD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Other">Other / Custom</option>
                  </select>
                  
                  {currentCategoryValue === 'Other' && (
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      placeholder="Enter custom category name..."
                      className="w-full bg-transparent border border-[#333] p-3 text-sm text-yellow-400 placeholder:text-gray-600 focus:border-yellow-400 focus:outline-none animate-in fade-in slide-in-from-top-1"
                    />
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider">Version</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleFormChange}
                  placeholder="v1.0"
                  className="w-full bg-transparent border border-[#333] p-3 text-sm text-gray-300 focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Meta Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider">License</label>
                <input
                  type="text"
                  name="license"
                  value={formData.license}
                  onChange={handleFormChange}
                  placeholder="MIT"
                  className="w-full bg-transparent border border-[#333] p-2 text-sm text-gray-300 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider">Ext</label>
                <input
                  type="text"
                  name="fileType"
                  value={formData.fileType}
                  onChange={handleFormChange}
                  placeholder=".JSX"
                  className="w-full bg-transparent border border-[#333] p-2 text-sm text-gray-300 focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Text Areas */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 tracking-wider">Short Description (Summary)</label>
              <input
                type="text"
                name="shortDesc"
                value={formData.shortDesc}
                onChange={handleFormChange}
                placeholder="Brief one-liner..."
                className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 tracking-wider">Full Description (Markdown/Text)</label>
              <textarea
                name="fullDesc"
                value={formData.fullDesc}
                onChange={handleFormChange}
                rows={6}
                placeholder="Detailed explanation of the tool or project..."
                className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none resize-none font-mono text-sm"
              />
            </div>

            {/* Gallery Input */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 tracking-wider">Gallery Images (Comma Separated URLs)</label>
              <input
                type="text"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="https://example.com/img1.png, https://example.com/img2.gif"
                className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none text-xs font-mono"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="pt-4 border-t border-[#333]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="featured" 
                    checked={formData.featured}
                    onChange={handleCheckbox}
                    className="peer sr-only" 
                  />
                  <div className="w-5 h-5 border border-[#333] peer-checked:bg-yellow-400 transition-colors"></div>
                  {formData.featured && (
                     <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-xs pointer-events-none">X</div>
                  )}
                </div>
                <span className="text-xs uppercase text-gray-500">Feature on Homepage</span>
              </label>
            </div>
            </div>
          </form>
        </div>
      )}

      {/* --- ASSET LIST MODE --- */}
      {mode === 'list' && (
        <div className="animate-in fade-in">
          {/* Toolbar */}
          <div className="bg-[#1a1a1a] border border-[#333] border-b-0 p-3 flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="SEARCH_DB..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111] border border-[#333] pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400 uppercase placeholder:text-gray-700"
              />
            </div>
            
            <button 
             onClick={handleNewClick}
             className="bg-yellow-400 text-black px-4 py-2 text-xs font-bold uppercase hover:bg-yellow-300 flex items-center gap-2 ml-auto"
            >
             <Plus size={14} /> New Entry
            </button>
          </div>

          {/* Table */}
          <div className="border border-[#333] overflow-x-auto min-h-[300px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111] text-gray-500 uppercase border-b border-[#333]">
                  <th 
                    className="p-3 font-normal border-r border-[#333] cursor-pointer hover:bg-[#222] select-none w-20"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">ID {sortField === 'id' && (sortDir === 'asc' ? <ArrowUp size={10}/> : <ArrowDown size={10}/>)}</div>
                  </th>
                  <th 
                    className="p-3 font-normal border-r border-[#333] cursor-pointer hover:bg-[#222] select-none"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-1">Title {sortField === 'title' && (sortDir === 'asc' ? <ArrowUp size={10}/> : <ArrowDown size={10}/>)}</div>
                  </th>
                  <th className="p-3 font-normal border-r border-[#333] hidden md:table-cell w-24">
                    Section
                  </th>
                  <th 
                    className="p-3 font-normal border-r border-[#333] cursor-pointer hover:bg-[#222] select-none w-32 hidden md:table-cell"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-1">Category {sortField === 'category' && (sortDir === 'asc' ? <ArrowUp size={10}/> : <ArrowDown size={10}/>)}</div>
                  </th>
                  <th className="p-3 font-normal border-r border-[#333] w-20 text-center">Featured</th>
                  <th className="p-3 font-normal w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333] bg-[#111]">
                {filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-[#1a1a1a] transition-colors group">
                    <td className="p-3 font-mono text-gray-500 border-r border-[#333]">#{asset.id.toString().slice(-4)}</td>
                    <td className="p-3 font-bold text-white border-r border-[#333]">{asset.title}</td>
                    <td className="p-3 text-gray-400 border-r border-[#333] hidden md:table-cell uppercase">
                      <span className={`px-1.5 py-0.5 border text-[10px] ${asset.section === 'works' ? 'border-blue-900 text-blue-400' : 'border-[#333]'}`}>
                        {asset.section || 'REPO'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 border-r border-[#333] hidden md:table-cell uppercase">{asset.category}</td>
                    <td className="p-3 border-r border-[#333] text-center">
                      {asset.featured ? <span className="text-yellow-400">★</span> : <span className="text-gray-800">.</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2 items-center h-6">
                        {deleteConfirmId === asset.id ? (
                          <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                            <button 
                              onClick={() => executeDelete(asset.id)}
                              className="bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-1 text-[10px] uppercase tracking-wide"
                            >
                              CONFIRM
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-gray-500 hover:text-white"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEditClick(asset)}
                              className="p-1 hover:bg-[#333] text-gray-400 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmId(asset.id)}
                              className="p-1 hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAssets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-600 italic">
                      NO_RECORDS_FOUND
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
