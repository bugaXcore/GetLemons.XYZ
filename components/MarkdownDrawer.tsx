
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { X } from 'lucide-react';
import remarkGfm from 'remark-gfm';

// Lazy load markdown libraries for better performance
const ReactMarkdown = lazy(() => import('react-markdown'));
const SyntaxHighlighter = lazy(() => 
  import('react-syntax-highlighter').then(mod => ({ default: mod.Prism }))
);

// Import style directly (it's just a JSON object, not a component)
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export const MarkdownDrawer: React.FC<MarkdownDrawerProps> = ({ isOpen, onClose, url, title }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && url) {
      fetchMarkdown();
    }
  }, [isOpen, url]);

  const fetchMarkdown = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load README');
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load markdown');
      console.error('Error fetching markdown:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-end"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Drawer */}
      <div 
        className="relative w-full lg:w-2/3 xl:w-1/2 h-full bg-[#0a0a0a] border-l border-[#222] shadow-2xl
                   flex flex-col animate-slide-in-right overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#222] bg-[#0a0a0a]/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                {title || 'Documentation'}
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-1">README.md</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#222] transition-colors rounded text-gray-400 hover:text-white"
            aria-label="Close drawer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading documentation...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-400 mb-2">⚠️ {error}</p>
                <p className="text-gray-600 text-sm">Unable to load markdown file</p>
              </div>
            </div>
          )}

          {!isLoading && !error && content && (
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            backgroundColor: '#1a1a1a',
                            padding: '1.5rem',
                            borderRadius: '4px',
                            border: '1px solid #333',
                            fontSize: '0.875rem',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </Suspense>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        /* Markdown Content Styles - Minimalistic Dark Theme */
        .markdown-content {
          color: #e5e5e5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Source Sans Pro', sans-serif;
          line-height: 1.7;
          max-width: 100%;
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          color: white;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }

        .markdown-content h1 {
          font-size: 2rem;
          border-bottom: 1px solid #333;
          padding-bottom: 0.5rem;
          margin-top: 0;
        }

        .markdown-content h2 {
          font-size: 1.5rem;
          border-bottom: 1px solid #222;
          padding-bottom: 0.5rem;
        }

        .markdown-content h3 {
          font-size: 1.25rem;
        }

        .markdown-content h4 {
          font-size: 1.1rem;
        }

        .markdown-content p {
          margin-bottom: 1rem;
        }

        .markdown-content a {
          color: #fbbf24;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .markdown-content a:hover {
          border-bottom-color: #fbbf24;
        }

        .markdown-content code {
          background-color: #1a1a1a;
          border: 1px solid #333;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          color: #fbbf24;
        }

        .markdown-content pre {
          margin: 1.5rem 0;
          overflow-x: auto;
        }

        .markdown-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: inherit;
        }

        .markdown-content ul,
        .markdown-content ol {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }

        .markdown-content li {
          margin-bottom: 0.5rem;
        }

        .markdown-content blockquote {
          border-left: 3px solid #fbbf24;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #aaa;
          font-style: italic;
        }

        .markdown-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5rem 0;
        }

        .markdown-content table th,
        .markdown-content table td {
          border: 1px solid #333;
          padding: 0.75rem;
          text-align: left;
        }

        .markdown-content table th {
          background-color: #1a1a1a;
          font-weight: 600;
          color: white;
        }

        .markdown-content table tr:hover {
          background-color: #0f0f0f;
        }

        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          border: 1px solid #333;
          margin: 1rem 0;
        }

        .markdown-content hr {
          border: none;
          border-top: 1px solid #333;
          margin: 2rem 0;
        }

        /* Mobile adjustments */
        @media (max-width: 1024px) {
          .animate-slide-in-right {
            animation: slide-in-up 0.3s ease-out;
          }
          
          @keyframes slide-in-up {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );
};
