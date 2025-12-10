
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Asset } from '../types';
import { ArrowLeft, Download, Monitor, FileText, Hash, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import remarkGfm from 'remark-gfm';

// Lazy load markdown components
const ReactMarkdown = lazy(() => import('react-markdown'));
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(mod => ({ default: mod.Prism })));

// Import syntax highlighter theme (not lazy since it's just CSS)
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AssetDetailProps {
  asset: Asset;
  onBack: () => void;
}

export const AssetDetail: React.FC<AssetDetailProps> = ({ asset, onBack }) => {
  const gallery = asset.gallery || [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInstallationOpen, setIsInstallationOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'readme'>('gallery');
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [loadingReadme, setLoadingReadme] = useState(false);

  const activeImage = gallery.length > 0 ? gallery[activeImageIndex] : null;
  const isWork = asset.section === 'works';

  // Format the date from database or show fallback
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return 'N/A';
    }
  };

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

  // Fetch README content when switching to readme view
  useEffect(() => {
    if (viewMode === 'readme' && asset.readmeUrl && !readmeContent) {
      setLoadingReadme(true);
      fetch(asset.readmeUrl)
        .then(res => res.text())
        .then(text => {
          setReadmeContent(text);
          setLoadingReadme(false);
        })
        .catch(err => {
          console.error('Failed to load README:', err);
          setReadmeContent('Failed to load documentation.');
          setLoadingReadme(false);
        });
    }
  }, [viewMode, asset.readmeUrl, readmeContent]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full animate-in fade-in duration-300 flex flex-col">
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
        {asset.downloadUrl ? (
          <a 
            href={asset.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#eee] text-[#111] font-bold px-8 py-4 flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-wide group shrink-0 shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Download size={20} className="stroke-[2.5px]" />
            {isWork ? 'Download Project' : 'Download Asset'}
          </a>
        ) : (
          <button 
            disabled
            className="bg-[#333] text-gray-600 font-bold px-8 py-4 flex items-center justify-center gap-3 uppercase tracking-wide cursor-not-allowed opacity-50"
          >
            <Download size={20} className="stroke-[2.5px]" />
            No Download Available
          </button>
        )}
      </div>

      {/* Compact Meta Bar */}
      <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs font-mono text-gray-400 mb-6 bg-[#151515] border border-[#333] p-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 uppercase font-bold">Version:</span>
          <span className="text-white bg-[#222] px-1.5">{asset.version || 'N/A'}</span>
        </div>
        <div className="w-px h-3 bg-[#333] hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 uppercase font-bold">License:</span>
          <span className="text-white">{asset.license || 'N/A'}</span>
        </div>
        <div className="w-px h-3 bg-[#333] hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 uppercase font-bold">File_Ext:</span>
          <span className="text-white">{asset.fileType || 'N/A'}</span>
        </div>
        <div className="w-px h-3 bg-[#333] hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 uppercase font-bold">Updated:</span>
          <span className="text-white">{formatDate(asset.created_at)}</span>
        </div>
        
        {/* README Toggle Button */}
        {asset.readmeUrl && (
          <>
            <div className="w-px h-3 bg-[#333] hidden sm:block"></div>
            <button
              onClick={() => setViewMode(viewMode === 'readme' ? 'gallery' : 'readme')}
              className={`flex items-center gap-2 px-2 py-1 border transition-all hover:bg-[#222] ${
                viewMode === 'readme' 
                  ? 'border-yellow-400 text-yellow-400' 
                  : 'border-[#333] text-gray-400 hover:text-white'
              }`}
            >
              <FileText size={14} />
              <span className="uppercase font-bold">README</span>
            </button>
          </>
        )}
        
        {/* Tags Inline */}
        <div className="sm:ml-auto flex flex-wrap gap-2 border-t border-[#333] sm:border-0 pt-2 sm:pt-0 w-full sm:w-auto">
           {[asset.category, asset.fileType?.replace('.','') || 'N/A', 'MOTION', 'DEV'].filter(Boolean).map(tag => (
             <span key={tag} className="flex items-center text-[10px] uppercase text-gray-500 hover:text-white transition-colors cursor-default">
               <Hash size={10} className="mr-0.5 text-yellow-600"/>{tag}
             </span>
           ))}
        </div>
      </div>

      {/* Full Width Cinema Viewer / Carousel */}
      <div className="w-full aspect-video max-h-[60vh] bg-[#0a0a0a] border border-[#333] relative overflow-hidden group mb-4 select-none">
        {viewMode === 'readme' ? (
          /* README Viewer */
          <div className="w-full h-full overflow-y-auto p-8">
            {loadingReadme ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                Loading documentation...
              </div>
            ) : readmeContent ? (
              <Suspense fallback={<div className="text-gray-400">Loading markdown...</div>}>
                <div style={{
                  fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#e0e0e0'
                }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                          <Suspense fallback={<pre className="bg-[#1a1a1a] p-4 rounded">{children}</pre>}>
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </Suspense>
                        ) : (
                          <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-yellow-400 font-mono text-sm" {...props}>
                            {children}
                          </code>
                        );
                      },
                      h1: ({children}) => <h1 className="text-2xl font-bold text-yellow-400 mb-4 border-b border-yellow-400/20 pb-2">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-bold text-white mb-3 mt-6">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-bold text-gray-300 mb-2 mt-4">{children}</h3>,
                      p: ({children}) => <p className="mb-4 text-gray-300">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-300">{children}</ol>,
                      li: ({children}) => <li className="ml-4">{children}</li>,
                      a: ({href, children}) => <a href={href} className="text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-yellow-400/50 pl-4 italic text-gray-400 mb-4">{children}</blockquote>,
                    }}
                  >
                    {readmeContent}
                  </ReactMarkdown>
                </div>
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No documentation available
              </div>
            )}
          </div>
        ) : activeImage ? (
          /* Gallery Viewer */
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
             <div className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-line">
               {asset.fullDesc || 'No description available.'}
             </div>
           </div>
           
           {!isWork && (
             <div className="md:col-span-1">
                <div className="bg-[#151515] border border-[#333] font-mono text-xs text-gray-400 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400/20"></div>
                  <button
                    onClick={() => setIsInstallationOpen(!isInstallationOpen)}
                    className="w-full p-5 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
                  >
                    <p className="uppercase font-bold text-yellow-500 tracking-wider">Installation:</p>
                    <ChevronDown 
                      size={16} 
                      className={`text-yellow-500 transition-transform duration-200 ${isInstallationOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isInstallationOpen && (
                    <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <ol className="list-decimal list-inside space-y-2 marker:text-gray-600">
                        {asset.installationSteps && asset.installationSteps.length > 0 ? (
                          asset.installationSteps.map((step, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: step.replace(/{fileType}/g, `<span class="text-white">${asset.fileType}</span>`) }} />
                          ))
                        ) : (
                          <>
                            <li>Download <span className="text-white">{asset.fileType}</span> file</li>
                            <li>Extract to root dir</li>
                            <li>Run via terminal</li>
                          </>
                        )}
                      </ol>
                    </div>
                  )}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
