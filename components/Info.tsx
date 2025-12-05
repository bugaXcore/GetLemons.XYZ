import React from 'react';

export const Info: React.FC = () => {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-8 py-20 min-h-screen font-mono">
      <div className="border border-[#333] p-8 md:p-12 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-4 uppercase font-source">System Info</h1>
          <div className="w-full h-px bg-[#333] mb-6"></div>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-500">VERSION</span>
              <span>1.0.0-LEMON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">BUILD</span>
              <span>2024.10.27</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">MAINTAINER</span>
              <span>GETLEMONS_ADMIN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">STATUS</span>
              <span className="text-green-500">ONLINE</span>
            </div>
          </div>
        </div>

        <div>
           <h2 className="text-xl font-bold mb-4 uppercase font-source">License</h2>
           <p className="text-sm text-gray-400 leading-relaxed">
             All assets provided within this repository are distributed under their respective licenses specified on the asset card. 
             Unless otherwise stated, tools are provided "AS IS" without warranty of any kind.
           </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 uppercase font-source">Contact</h2>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-sm hover:text-white hover:underline block text-gray-400">&gt; EMAIL_ADMIN</a>
            <a href="#" className="text-sm hover:text-white hover:underline block text-gray-400">&gt; TWITTER_HANDLE</a>
            <a href="#" className="text-sm hover:text-white hover:underline block text-gray-400">&gt; GITHUB_PROFILE</a>
          </div>
        </div>
      </div>
    </section>
  );
};