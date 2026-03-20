'use client';
import { useState } from 'react';
import { Hash, Search, Video, FileText, Briefcase, Camera, Newspaper, BookOpen, Building2, Users, ArrowRight, Star, TrendingUp, Zap, Lock, Map } from 'lucide-react';
const DIRS = [
  { id:'cv', title:'Resume / CV', desc:'Find top professionals. Unlock contact — pay per unlock, 50/50 split with the professional.', icon:FileText, color:'text-violet-400 bg-violet-500/10 border-violet-500/20', count:'12,400+', badge:'Pay-to-unlock', href:'/directory-cv', paid:true },
  { id:'video', title:'Video Creators', desc:'Hire video producers and editors. Preview reels, subscribe or pay per project.', icon:Video, color:'text-red-400 bg-red-500/10 border-red-500/20', count:'3,200+', badge:'Paywall', href:'/directory-video', paid:false },
  { id:'companies', title:'Companies & Jobs', desc:'Companies pay to list and access CVs. Post jobs, search verified candidates.', icon:Building2, color:'text-blue-400 bg-blue-500/10 border-blue-500/20', count:'840+', badge:'Subscription', href:'/directory-companies', paid:true },
  { id:'journalism', title:'Journalism', desc:'Buy exclusive articles and investigations. Auction-based or direct purchase.', icon:Newspaper, color:'text-amber-400 bg-amber-500/10 border-amber-500/20', count:'1,800+', badge:'Auction', href:'/directory-journalism', paid:true },
  { id:'photography', title:'Photography', desc:'License photos, hire photographers, subscribe to exclusive galleries.', icon:Camera, color:'text-pink-400 bg-pink-500/10 border-pink-500/20', count:'5,600+', badge:'License', href:'/directory-photography', paid:false },
  { id:'articles', title:'Articles & Blog', desc:'Paid articles, newsletters and content from independent writers.', icon:BookOpen, color:'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', count:'9,100+', badge:'Paywall', href:'/directory-articles', paid:true },
  { id:'classified', title:'Classifieds', desc:'Real estate, cars, products and services. Buy, sell or rent — pay with USDC.', icon:Map, color:'text-orange-400 bg-orange-500/10 border-orange-500/20', count:'22,000+', badge:'Free to browse', href:'/directory-classified', paid:false },
  { id:'freelance', title:'Freelancers', desc:'Designers, developers, consultants. Book and pay directly on-chain.', icon:Zap, color:'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', count:'7,300+', badge:'Book & Pay', href:'/directory', paid:false },
];
export default function DirectoryHub() {
  const [search, setSearch] = useState('');
  const filtered = DIRS.filter(d => search==='' || d.title.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <a href="/" className="flex items-center gap-2"><div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center"><Hash className="h-3.5 w-3.5 text-white" /></div><span className="font-bold text-white text-sm">JobinLink</span></a>
            <span className="text-[#3f3f46]">/</span><span className="text-sm text-[#71717a]">Directories</span>
          </div>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-[#27272a] bg-[#18181b] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500 focus:outline-none transition-all" placeholder="Search all directories..." />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">All Directories</h1>
          <p className="text-[#71717a] max-w-xl mx-auto text-sm leading-relaxed">One shared database across JobinLink, TrustBank, Hashpo and MyBik.</p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-[#52525b]">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />62,000+ profiles</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" />4 platforms</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" />Paid via USDC</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(dir => {
            const Icon = dir.icon;
            return (
              <a key={dir.id} href={dir.href} className="group rounded-2xl border border-[#27272a] bg-[#111113] p-5 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all flex flex-col">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 border ${dir.color}`}><Icon className="h-5 w-5" /></div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-white">{dir.title}</h3>
                  {dir.paid && <Lock className="h-3.5 w-3.5 text-[#52525b] flex-shrink-0 mt-0.5" />}
                </div>
                <p className="text-xs text-[#71717a] leading-relaxed flex-1 mb-4">{dir.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-[#52525b]">{dir.count} listings</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] rounded-full border border-[#27272a] px-2 py-0.5 text-[#71717a]">{dir.badge}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#52525b] group-hover:text-violet-400 transition-colors" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
        <div className="mt-10 rounded-2xl border border-violet-500/10 bg-violet-500/5 p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0"><Zap className="h-5 w-5 text-violet-400" /></div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">One database, four platforms</p>
              <p className="text-xs text-[#71717a] leading-relaxed max-w-2xl">All profiles, slugs, content and payments live in a single Supabase database shared across <strong className="text-[#a1a1aa]">jobinlink.com</strong>, <strong className="text-[#a1a1aa]">trustbank.xyz</strong>, <strong className="text-[#a1a1aa]">hashpo.com</strong> and <strong className="text-[#a1a1aa]">mybik.com</strong>. A slug bought on TrustBank works on all sites. Payments go directly to creator wallets via Polygon — no holding, no delays.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
