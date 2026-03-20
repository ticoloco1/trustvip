'use client';
import { useState } from 'react';
import { Hash, Search, ArrowRight } from 'lucide-react';
export default function Page() {
  const [search, setSearch] = useState('');
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center gap-2 text-xs mb-3 text-[#52525b]">
            <a href="/" className="hover:text-white">JobinLink</a><span>/</span>
            <a href="/directory" className="hover:text-white">Directories</a><span>/</span>
            <span className="text-white">Directory</span>
          </div>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#27272a] bg-[#18181b] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500 focus:outline-none transition-all"
              placeholder="Search..." />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-5">
        <h1 className="text-xl font-bold text-white">Directory</h1>
        <p className="text-sm text-[#71717a]">Connect Supabase to load real profiles. Payments processed via USDC on Polygon.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="rounded-2xl border border-[#27272a] bg-[#111113] p-5 hover:border-violet-500/40 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-[#27272a] flex items-center justify-center text-xl mb-4">{'🎨📸🎬✍️🏢⭐'[i]}</div>
              <p className="text-sm font-semibold text-white mb-1">Sample Profile {i+1}</p>
              <p className="text-xs text-[#71717a] mb-3">Connect Supabase to load real data</p>
              <button className="w-full rounded-xl border border-[#27272a] py-2 text-xs text-[#71717a] hover:border-violet-500/40 hover:text-white transition-all">View Profile</button>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-violet-500/10 bg-violet-500/5 p-5 text-center">
          <p className="text-sm font-semibold text-white mb-2">List your profile here</p>
          <p className="text-xs text-[#71717a] mb-4">Get discovered. Get paid in USDC directly to your wallet.</p>
          <a href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-all">Get started <ArrowRight className="h-4 w-4"/></a>
        </div>
      </div>
    </div>
  );
}
