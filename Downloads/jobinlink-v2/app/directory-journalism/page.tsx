'use client';
import { useState } from 'react';
import { Hash, Search, Newspaper, Gavel, Clock, DollarSign, Filter, ChevronRight, Eye, Lock, TrendingUp } from 'lucide-react';

const ARTICLES = [
  { title:'Exclusive: The Hidden Crypto Lobby in Washington', author:'Maria Gonzalez', preview:'Three years of unreported donations from blockchain firms to key Senate committees...', price:299, bids:7, ends:'4h', exclusive:true, reads:1240 },
  { title:'Inside the AI Chip War — TSMC\'s Secret Roadmap', author:'David Kim', preview:'Internal documents reveal production plans for 2nm chips destined for US military...', price:499, bids:12, ends:'6h', exclusive:true, reads:3100 },
  { title:'Brazil\'s Agribusiness and the Amazon: New Evidence', author:'Carlos Neto', preview:'Satellite data and local testimonies connect soy exporters to 400km² of new deforestation...', price:199, bids:4, ends:'1d', exclusive:false, reads:890 },
  { title:'The Nurse Shortage Crisis Nobody Is Talking About', author:'Anne Dubois', preview:'Hospitals across Europe are quietly outsourcing ER care to private contractors with...', price:149, bids:2, ends:'2d', exclusive:false, reads:560 },
];

export default function JournalismDirectory() {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'auction'|'buy'>('auction');
  const filtered = ARTICLES.filter(a => search === '' || a.title.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-2 text-xs mb-3 text-[#52525b]">
            <a href="/" className="hover:text-white">JobinLink</a><span>/</span>
            <a href="/directory" className="hover:text-white">Directories</a><span>/</span>
            <span className="text-white">Journalism</span>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#27272a] bg-[#18181b] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500 focus:outline-none transition-all"
                placeholder="Search articles, authors..." />
            </div>
            {(['auction','buy'] as const).map(v => (
              <button key={v} onClick={() => setMode(v)}
                className={`rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${mode === v ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-[#27272a] bg-[#111113] text-[#71717a] hover:text-white'}`}>
                {v === 'auction' ? '🔨 Auction' : '💳 Buy Now'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Journalism & Investigations</h1>
          <span className="text-xs text-[#52525b]">{filtered.length} articles</span>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <Gavel className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-[#a1a1aa]">
            Journalists auction exclusivity rights. Media outlets bid to publish first. Payment goes <strong className="text-amber-300">directly to the journalist's wallet</strong> via USDC on Polygon — no publisher middleman.
          </p>
        </div>

        <div className="space-y-3">
          {filtered.map((a, i) => (
            <div key={i} className="rounded-2xl border border-[#27272a] bg-[#111113] p-5 hover:border-amber-500/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-sm font-semibold text-white">{a.title}</h3>
                    {a.exclusive && <span className="text-[10px] rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 px-2 py-0.5">Exclusive</span>}
                  </div>
                  <p className="text-xs text-[#71717a] mb-2">by {a.author}</p>
                  <p className="text-xs text-[#52525b] line-clamp-2 mb-3">{a.preview}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-[#52525b]">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{a.reads.toLocaleString()} reads</span>
                    <span className="flex items-center gap-1"><Gavel className="h-3 w-3" />{a.bids} bids</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Ends in {a.ends}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-lg font-bold text-amber-400">${a.price}</p>
                  <button className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-all">
                    <Gavel className="h-3.5 w-3.5" /> Place Bid
                  </button>
                  <button className="text-xs text-[#52525b] hover:text-white transition-colors">Buy now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-5 text-center">
          <Newspaper className="h-10 w-10 text-[#3f3f46] mx-auto mb-3" />
          <p className="text-sm font-semibold text-white mb-1">Are you a journalist?</p>
          <p className="text-xs text-[#71717a] mb-3">List your investigation. Set a minimum bid. Media outlets compete to publish first. You receive 100% of the winning bid directly in USDC.</p>
          <a href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-all">
            List an article <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
