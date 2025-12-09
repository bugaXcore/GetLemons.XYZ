
import React, { useState, useEffect } from 'react';
import { PulseCanvas } from './components/PulseCanvas';
import { Controls } from './components/Controls';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Repository } from './components/Repository';
import { Info } from './components/Info';
import { Admin } from './components/Admin';
import { Login } from './components/Login';
import { AssetDetail } from './components/AssetDetail';
import { DEFAULT_CONFIG, DEFAULT_HOMEPAGE_CONFIG } from './constants';
import { ASSETS as INITIAL_ASSETS } from './data';
import { AppConfig, ViewState, Asset, HomepageConfig } from './types';
import { supabase } from './supabaseClient';

export default function App() {
  // --- Background State ---
  const [bgConfig, setBgConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [showBgControls, setShowBgControls] = useState(false);

  // --- App State ---
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Homepage Content State (Still in LocalStorage for simplicity of MVP, could be moved to DB later)
  const [homeConfig, setHomeConfig] = useState<HomepageConfig>(() => {
    const saved = localStorage.getItem('gl_home_config');
    return saved ? JSON.parse(saved) : DEFAULT_HOMEPAGE_CONFIG;
  });

  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- Effects ---

  // 1. Check Auth Status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Assets from DB
  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Transform database snake_case to camelCase
      const transformedAssets = data.map((item: any) => ({
        ...item,
        fileType: item.file_type || item.fileType,
        shortDesc: item.short_desc || item.shortDesc,
        fullDesc: item.full_desc || item.fullDesc,
        downloadUrl: item.download_url || item.downloadUrl,
        installationSteps: item.installation_steps || item.installationSteps,
        readmeUrl: item.readme_url || item.readmeUrl,
      }));
      setAssets(transformedAssets as Asset[]);
    } else {
      console.error('Error fetching assets:', error);
      // Fallback for demo if DB is empty/not connected
      if (assets.length === 0) setAssets(INITIAL_ASSETS);
    }
    setIsLoading(false);
  };

  // Save homepage config to LocalStorage
  useEffect(() => {
    localStorage.setItem('gl_home_config', JSON.stringify(homeConfig));
  }, [homeConfig]);

  // --- Handlers ---
  const handleAssetSelect = (id: number) => {
    setSelectedAssetId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRepo = () => {
    setSelectedAssetId(null);
  };

  const handleSaveAsset = async (asset: Asset) => {
    console.log('🔵 App.tsx received asset:', asset);
    console.log('🔵 downloadUrl value:', asset.downloadUrl);
    
    // Determine if this is a new asset (ID from Date.now() is a large timestamp)
    const isNewAsset = asset.id > 100000; // Any ID > 100000 is likely a temp timestamp ID
    
    // Optimistic Update
    setAssets(prev => {
      const exists = prev.find(a => a.id === asset.id);
      if (exists) return prev.map(a => a.id === asset.id ? asset : a);
      return [asset, ...prev];
    });

    // Transform camelCase to snake_case for database
    let error;
    
    if (isNewAsset) {
      // New asset - use INSERT (don't include ID, let database generate it)
      const dbAssetNew: any = {
        title: asset.title,
        category: asset.category,
        version: asset.version,
        license: asset.license,
        file_type: asset.fileType,
        short_desc: asset.shortDesc,
        full_desc: asset.fullDesc,
        featured: asset.featured,
        gallery: asset.gallery,
        section: asset.section,
        download_url: asset.downloadUrl,
        installation_steps: asset.installationSteps,
        readme_url: asset.readmeUrl
      };
      
      console.log('🟢 Inserting to DB:', dbAssetNew);
      
      const { error: insertError } = await supabase
        .from('assets')
        .insert(dbAssetNew);
      error = insertError;
    } else {
      // Existing asset - use UPDATE (don't include ID in data, use it in WHERE clause)
      const dbAssetUpdate: any = {
        title: asset.title,
        category: asset.category,
        version: asset.version,
        license: asset.license,
        file_type: asset.fileType,
        short_desc: asset.shortDesc,
        full_desc: asset.fullDesc,
        featured: asset.featured,
        gallery: asset.gallery,
        section: asset.section,
        download_url: asset.downloadUrl,
        installation_steps: asset.installationSteps,
        readme_url: asset.readmeUrl
      };
      
      console.log('🟡 Updating DB for ID:', asset.id, 'with data:', dbAssetUpdate);
      
      const { error: updateError } = await supabase
        .from('assets')
        .update(dbAssetUpdate)
        .eq('id', asset.id);
      error = updateError;
    }

    if (error) {
      console.error('❌ Error saving asset:', error);
      alert('Failed to save to database. Check console.');
      fetchAssets(); // Revert
    } else {
      fetchAssets(); // Refresh to get real IDs if generated
    }
  };

  const handleDeleteAsset = async (id: number) => {
    setAssets(prev => prev.filter(a => Number(a.id) !== Number(id)));

    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting asset:', error);
      fetchAssets();
    }
  };

  const handleSaveHomeConfig = (config: HomepageConfig) => {
    setHomeConfig(config);
  };

  // --- View Rendering ---
  const renderContent = () => {
    if (isLoading && assets.length === 0) {
      return (
        <div className="flex items-center justify-center h-[50vh] text-yellow-400 font-mono animate-pulse">
          INITIALIZING_SYSTEM...
        </div>
      );
    }

    // If an asset is selected, show Detail View (overlaying current section)
    if (selectedAssetId) {
      const asset = assets.find(a => a.id === selectedAssetId);
      if (asset) {
        return <AssetDetail asset={asset} onBack={handleBackToRepo} />;
      }
    }

    switch (currentView) {
      case 'home':
        return (
          <Hero 
            featuredAssets={assets.filter(a => a.featured).slice(0, 2)} 
            config={homeConfig}
            onAssetSelect={handleAssetSelect}
            onNavigateToRepo={() => setCurrentView('repository')}
          />
        );
      case 'repository':
        return (
          <Repository 
            assets={assets.filter(a => !a.section || a.section === 'repository')} 
            onAssetSelect={handleAssetSelect} 
            title="REPOSITORY"
            subtitle="INDEX OF AVAILABLE TOOLS"
          />
        );
      case 'works':
        return (
          <Repository 
            assets={assets.filter(a => a.section === 'works')} 
            onAssetSelect={handleAssetSelect}
            title="WORKS"
            subtitle="SELECTED VISUAL PROJECTS"
          />
        );
      case 'info':
        return <Info />;
      case 'admin':
        return isAuthenticated ? (
          <Admin 
            assets={assets} 
            homeConfig={homeConfig}
            onSave={handleSaveAsset} 
            onDelete={handleDeleteAsset}
            onSaveHomeConfig={handleSaveHomeConfig}
            onCancel={() => setCurrentView('home')}
          />
        ) : (
          <Login onLogin={() => setIsAuthenticated(true)} />
        );
      default:
        return (
          <Hero 
            featuredAssets={assets} 
            config={homeConfig}
            onAssetSelect={handleAssetSelect} 
            onNavigateToRepo={() => setCurrentView('repository')} 
          />
        );
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#09090b] text-[#eee] selection:bg-yellow-400 selection:text-black flex flex-col overflow-x-hidden" style={{ isolation: 'isolate' }}>
      
      {/* --- Background Layer --- */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <PulseCanvas config={bgConfig} />
      </div>

      {/* --- Foreground Layer with blend mode --- */}
      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none" style={{ mixBlendMode: 'normal' }}>
        {/* Enable pointer events only for interactive children */}
        <div className="pointer-events-auto w-full">
           <Header 
             currentView={currentView} 
             setCurrentView={(view) => {
               setCurrentView(view);
               setSelectedAssetId(null);
             }}
             showBgControls={showBgControls}
             setShowBgControls={setShowBgControls}
           />
        </div>
        
        {/* Add top padding to account for fixed header */}
        <main className="flex-grow w-full pointer-events-auto pt-14">
          {renderContent()}
        </main>

        <footer className="h-10 border-t border-[#333] bg-[#111] flex items-center justify-center text-[10px] text-gray-600 font-mono z-10 mt-auto shrink-0 w-full pointer-events-auto">
          GETLEMONS.XYZ // EST. 2024
        </footer>
      </div>

      {/* --- Background Controls Toggle --- */}
      {showBgControls && (
        <Controls config={bgConfig} onChange={setBgConfig} />
      )}

    </div>
  );
}
