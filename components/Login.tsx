
import React, { useState } from 'react';
import { Terminal, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        onLogin();
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || 'AUTHENTICATION_FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-mono animate-in fade-in duration-500">
      <div className="border border-[#333] bg-[#111] p-8 md:p-12 max-w-md w-full relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-yellow-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-yellow-400"></div>

        <div className="flex flex-col items-center gap-4 mb-8">
          <Terminal size={48} className="text-yellow-400" />
          <h1 className="text-xl font-bold font-source tracking-wider">SYSTEM_ACCESS</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="w-full bg-black border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none transition-colors"
              placeholder="admin@getlemons.xyz"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="w-full bg-black border border-[#333] p-3 text-white focus:border-yellow-400 focus:outline-none transition-colors"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center border border-red-900/50 bg-red-900/10 p-2 break-words">
              {error.toUpperCase()}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold uppercase py-3 hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
};
