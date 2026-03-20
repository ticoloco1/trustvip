'use client';
import { useState } from 'react';
import { Hash, Search, Tag, Gavel, TrendingUp, Clock, DollarSign } from 'lucide-react';

const SLUGS = [
  { slug: 'dev.pro', price: 15000, bids: 3, ends: '2h', category: 'tech', featured: true },
  { slug: 'doctor', price: 50000, bids: 7, ends: '5h', category: 'saude', featured: true },
  { slug: 'advogado.sp', price: 12000, bids: 2, ends: '12h', category: 'juridico', featured: false },
  { slug: 'fotografo', price: 8000, bids: 5, ends: '1d', category: 'arte', featured: false },
  { slug: 'chef.pro', price: 6000, bids: 1, ends: '2d', category: 'gastronomia', featured: false },
  { slug: 'designer.ux', price: 9500, bids: 4, ends: '3h', category: 'tech', featured: true },
  { slug: 'news.br', price: 30000, bids: 8, ends: '6h', category: 'midia', featured: true },
  { slug: 'imoveis.rj', price: 20000, bids: 6, ends: '8h', category: 'imoveis', featured: false },
];

const CATS = ['todos', 'tech', 'saude', 'juridico', 'arte', 'midia', 'imoveis'];

export default function Slugs() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('todos');
  const [view, setView] = useState<'buy'|'auction'>('buy');

  const filtered = SLUGS.filter(s =>
    (cat === 'todos' || s.category === cat) &&
    (search === '' || s.slug.includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Header */}
      <div className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <a href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <Hash className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm">JobinLink</span>
            </a>
            <span className="text-[#3f3f46]">/</span>
            <span className="text-sm text-[#71717a]">Slugs</span>
          </div>

          {/* Ticker */}
          <div className="overflow-hidden rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-2 mb-4">
            <div className="flex gap-6 animate-ticker whitespace-nowrap">
              {[...SLUGS, ...SLUGS].map((s, i) => (
                <span key={i} className="text-xs text-violet-300">
                  <span className="text-violet-400 font-mono font-semibold">#{s.slug}</span>
                  <span className="text-violet-300/50 mx-1">→</span>
                  <span className="text-white font-semibold">${(s.price/100).toFixed(0)}</span>
                  <span className="text-[#52525b] mx-2">•</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#27272a] bg-[#18181b] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500 focus:outline-none transition-all"
                placeholder="Buscar slugs..." />
            </div>
            <div className="flex gap-2">
              {(['buy','auction'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                    view === v ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-[#27272a] bg-[#111113] text-[#71717a] hover:text-white'
                  }`}>
                  {v === 'buy' ? <><Tag className="h-3.5 w-3.5" /> Comprar</> : <><Gavel className="h-3.5 w-3.5" /> Leilão</>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                cat === c ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-[#27272a] text-[#71717a] hover:text-white'
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Slugs disponíveis', value: SLUGS.length, icon: Tag, color: 'text-violet-400 bg-violet-500/10' },
            { label: 'Em leilão ativo', value: 4, icon: Gavel, color: 'text-amber-400 bg-amber-500/10' },
            { label: 'Vendidos hoje', value: 12, icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-[#27272a] bg-[#111113] p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-[#71717a]">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Slug grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filtered.map(s => (
            <div key={s.slug} className="group rounded-2xl border border-[#27272a] bg-[#111113] p-4 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all cursor-pointer">
              {s.featured && (
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-[10px] rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 px-2 py-0.5 font-medium">⭐ Destaque</span>
                </div>
              )}
              <p className="text-lg font-bold text-white font-mono mb-1">#{s.slug}</p>
              <span className="text-[10px] rounded-full bg-[#27272a] text-[#71717a] px-2 py-0.5 capitalize mb-3 inline-block">{s.category}</span>
              <div className="border-t border-[#27272a] pt-3 mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#71717a]">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-white font-semibold">${(s.price/100).toFixed(0)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#52525b]">
                    <Gavel className="h-3 w-3" /> {s.bids} lances
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Clock className="h-3 w-3" /> Termina em {s.ends}
                </div>
                <button className="w-full rounded-xl bg-violet-600 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition-all mt-1">
                  {view === 'auction' ? 'Fazer lance' : 'Comprar agora'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
