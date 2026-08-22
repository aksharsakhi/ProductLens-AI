import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Fingerprint, ArrowRight, Package } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('analyst');
  const [username, setUsername] = useState('demo_analyst');
  const [password, setPassword] = useState('unihack2026');

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin({
      id: `USR-${Math.floor(Math.random() * 10000)}`,
      name: username,
      role: role.toUpperCase(), // ANALYST or ADMIN
      lastLogin: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050810] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 animate-slide-up relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="h-16 w-16 bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center mb-4 shadow-2xl shadow-indigo-500/20">
            <Package className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white tracking-tight">
            ProductLens <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-mono">Enterprise Catalog Management</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => { setRole('analyst'); setUsername('demo_analyst'); }}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'analyst' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="h-4 w-4" /> Analyst
              </button>
              <button
                type="button"
                onClick={() => { setRole('admin'); setUsername('sys_admin'); }}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'admin' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-4 w-4" /> Admin
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field !pl-10 !py-3 bg-slate-950/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field !pl-10 !py-3 bg-slate-950/50 text-slate-400 font-mono tracking-widest"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                role === 'admin' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              <Fingerprint className="h-5 w-5" />
              <span>Authenticate to {role === 'admin' ? 'Admin Portal' : 'Workspace'}</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-500">
              Authorized Personnel Only. SSO Enabled via Unilog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
