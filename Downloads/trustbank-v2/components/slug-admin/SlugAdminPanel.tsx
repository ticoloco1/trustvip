'use client';
import { useState, useRef } from 'react';
import {
  Hash, Upload, Check, X, AlertCircle, DollarSign, Tag,
  Gavel, TrendingUp, Search, Filter, Edit2, Trash2,
  Download, Plus, RefreshCw, ChevronRight, Copy, Globe,
  Star, Award, BarChart3, Clock
} from 'lucide-react';

interface Slug {
  slug: string;
  status: 'available' | 'taken' | 'mine' | 'for_sale' | 'auction';
  length: number;
  category: string;
  price?: number;
  minBid?: number;
  platform: string;
  tier: 'premium' | 'standard' | 'common';
  maintenance?: number;
}

const TIER_PRICES: Record<string, Record<number | string, number>> = {
  '1_letter':   { price: 5900,  maintenance: 120 },
  '2_letters':  { price: 4400,  maintenance: 96 },
  '3_letters':  { price: 2900,  maintenance: 72 },
  '4_letters':  { price: 1500,  maintenance: 48 },
  '5_letters':  { price: 800,   maintenance: 36 },
  '6_letters':  { price: 400,   maintenance: 24 },
  '7_plus':     { price: 150,   maintenance: 12 },
  'premium_keyword': { price: 30000, maintenance: 500 },
};

const PREMIUM_KEYWORDS = ['lawyer','doctor','ceo','crypto','nft','defi','dao','ai','gpt','web3','finance','invest','forex','bitcoin','eth','matic','bank','legal','health','media','news','tech','dev'];

function getTier(slug: string): string {
  if (PREMIUM_KEYWORDS.includes(slug.toLowerCase())) return 'premium_keyword';
  const len = slug.length;
  if (len === 1) return '1_letter';
  if (len === 2) return '2_letters';
  if (len === 3) return '3_letters';
  if (len === 4) return '4_letters';
  if (len === 5) return '5_letters';
  if (len === 6) return '6_letters';
  return '7_plus';
}

function getSuggestedPrice(slug: string): number {
  const tier = getTier(slug);
  return TIER_PRICES[tier]?.price || 150;
}

function getMaintenance(slug: string): number {
  const tier = getTier(slug);
  return TIER_PRICES[tier]?.maintenance || 12;
}

export default function SlugAdminPanel() {
  const [tab, setTab] = useState<'import' | 'manage' | 'pricing'>('import');
  const [rawInput, setRawInput] = useState('');
  const [parsed, setParsed] = useState<Slug[]>([]);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [search, setSearch] = useState('');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // My slugs (mock)
  const [mySlugs, setMySlugs] = useState<Slug[]>([
    { slug:'lawyer', status:'for_sale', length:6, category:'legal', price:30000, platform:'trustbank', tier:'premium', maintenance:500 },
    { slug:'doctor', status:'for_sale', length:6, category:'health', price:25000, platform:'trustbank', tier:'premium', maintenance:500 },
    { slug:'ceo', status:'auction', length:3, category:'business', minBid:5000, platform:'all', tier:'premium', maintenance:500 },
    { slug:'ai', status:'for_sale', length:2, category:'tech', price:4400, platform:'hashpo', tier:'premium', maintenance:96 },
    { slug:'dev', status:'for_sale', length:3, category:'tech', price:2900, platform:'all', tier:'standard', maintenance:72 },
    { slug:'nft', status:'auction', length:3, category:'crypto', minBid:2000, platform:'hashpo', tier:'premium', maintenance:72 },
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleParse = () => {
    const lines = rawInput.split(/[\n,\s;]+/).map(s => s.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')).filter(Boolean);
    const unique = [...new Set(lines)];
    const existing = new Set(mySlugs.map(s => s.slug));

    const result: Slug[] = unique.map(slug => ({
      slug,
      status: existing.has(slug) ? 'mine' : 'available',
      length: slug.length,
      category: PREMIUM_KEYWORDS.includes(slug) ? 'premium' : 'general',
      price: getSuggestedPrice(slug),
      platform: 'all',
      tier: PREMIUM_KEYWORDS.includes(slug) ? 'premium' : slug.length <= 3 ? 'premium' : 'standard',
      maintenance: getMaintenance(slug),
    }));

    setParsed(result);
  };

  const handleImport = async () => {
    setImporting(true);
    await new Promise(r => setTimeout(r, 1500));
    const newSlugs = parsed.filter(s => s.status === 'available');
    setMySlugs(prev => [...prev, ...newSlugs.map(s => ({ ...s, status: 'for_sale' as const }))]);
    setImporting(false);
    setImported(true);
    setTab('manage');
    showToast(`✓ ${newSlugs.length} slugs imported to your panel`);
  };

  const filteredSlugs = mySlugs.filter(s =>
    search === '' || s.slug.includes(search.toLowerCase())
  );

  const totalValue = mySlugs.reduce((sum, s) => sum + (s.price || s.minBid || 0), 0);

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl border border-violet-500/30 bg-[#111113] px-4 py-3 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}

      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-4 text-center">
          <p className="text-2xl font-bold text-white">{mySlugs.length}</p>
          <p className="text-xs text-[#71717a]">Total slugs</p>
        </div>
        <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-4 text-center">
          <p className="text-2xl font-bold text-violet-400">${totalValue.toLocaleString()}</p>
          <p className="text-xs text-[#71717a]">Portfolio value</p>
        </div>
        <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{mySlugs.filter(s=>s.status==='auction').length}</p>
          <p className="text-xs text-[#71717a]">In auction</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id:'import', label:'Bulk Import', icon:Upload },
          { id:'manage', label:'My Slugs', icon:Hash },
          { id:'pricing', label:'Pricing Tiers', icon:DollarSign },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              tab===t.id ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'border border-[#27272a] text-[#71717a] hover:text-white'
            }`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── BULK IMPORT ── */}
      {tab === 'import' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-5">
            <h3 className="text-sm font-semibold text-white mb-2">Paste slugs (any format)</h3>
            <p className="text-xs text-[#71717a] mb-4">Paste thousands of slugs separated by commas, newlines or spaces. Duplicates and already-owned slugs are filtered automatically.</p>
            <textarea
              value={rawInput} onChange={e => setRawInput(e.target.value)}
              rows={8} placeholder="lawyer, doctor, ceo, ai, defi&#10;nft web3 crypto&#10;dev.pro design.co&#10;a b c x y z&#10;..."
              className="w-full rounded-xl border border-[#27272a] bg-[#18181b] px-4 py-3 text-sm text-white placeholder:text-[#52525b] font-mono focus:border-violet-500/50 focus:outline-none transition-all resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={handleParse}
                className="flex items-center gap-2 rounded-xl border border-[#27272a] bg-[#18181b] px-4 py-2.5 text-sm font-medium text-[#a1a1aa] hover:text-white hover:border-violet-500/40 transition-all">
                <Filter className="h-4 w-4" /> Parse & Filter
              </button>
              {parsed.length > 0 && (
                <button onClick={handleImport} disabled={importing}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-all">
                  {importing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Import {parsed.filter(s=>s.status==='available').length} available slugs
                </button>
              )}
            </div>
          </div>

          {/* Parse preview */}
          {parsed.length > 0 && (
            <div className="rounded-2xl border border-[#27272a] bg-[#111113] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a]">
                <p className="text-sm font-semibold text-white">Preview — {parsed.length} slugs parsed</p>
                <div className="flex gap-3 text-xs">
                  <span className="text-emerald-400">{parsed.filter(s=>s.status==='available').length} available</span>
                  <span className="text-[#52525b]">{parsed.filter(s=>s.status==='mine').length} already owned</span>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#27272a]">
                {parsed.map(s => (
                  <div key={s.slug} className="flex items-center gap-3 px-5 py-2.5">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${s.status==='available'?'bg-emerald-500/20':'bg-[#27272a]'}`}>
                      {s.status==='available' ? <Check className="h-3 w-3 text-emerald-400"/> : <X className="h-3 w-3 text-[#52525b]"/>}
                    </div>
                    <span className={`font-mono text-sm font-semibold ${s.status==='available'?'text-white':'text-[#52525b]'}`}>#{s.slug}</span>
                    <span className="text-xs text-[#52525b]">{s.slug.length} chars</span>
                    {s.tier === 'premium' && <span className="text-[10px] rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 px-2 py-0.5">premium</span>}
                    <span className="ml-auto text-sm font-semibold text-violet-400">${s.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MY SLUGS ── */}
      {tab === 'manage' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#27272a] bg-[#111113] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500/50 focus:outline-none transition-all"
              placeholder="Search slugs..." />
          </div>

          <div className="rounded-2xl border border-[#27272a] bg-[#111113] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#27272a] bg-[#09090b]/50">
                    {['Slug','Length','Tier','Platform','Status','Price','Maintenance/yr','Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-[#52525b] font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSlugs.map(s => (
                    <tr key={s.slug} className="border-b border-[#27272a] hover:bg-[#18181b] transition-all">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">#{s.slug}</span>
                          {PREMIUM_KEYWORDS.includes(s.slug) && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#71717a]">{s.slug.length}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] rounded-full border px-2 py-0.5 ${s.tier==='premium'?'border-amber-500/20 text-amber-400':'border-[#27272a] text-[#71717a]'}`}>
                          {s.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#71717a] capitalize">{s.platform}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] rounded-full border px-2 py-0.5 ${
                          s.status==='for_sale'?'border-violet-500/20 text-violet-400':
                          s.status==='auction'?'border-amber-500/20 text-amber-400':
                          'border-emerald-500/20 text-emerald-400'
                        }`}>{s.status.replace('_',' ')}</span>
                      </td>
                      <td className="px-4 py-3">
                        {editingPrice === s.slug ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-[#52525b]">$</span>
                            <input
                              defaultValue={s.price || s.minBid || 0}
                              onBlur={e => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) {
                                  setMySlugs(prev => prev.map(sl => sl.slug===s.slug ? {...sl, price: val} : sl));
                                  showToast(`Price updated for #${s.slug}`);
                                }
                                setEditingPrice(null);
                              }}
                              className="w-20 rounded-lg border border-violet-500/40 bg-[#18181b] px-2 py-1 text-xs text-white focus:outline-none"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <button onClick={() => setEditingPrice(s.slug)} className="flex items-center gap-1 text-sm font-semibold text-white hover:text-violet-400 transition-all">
                            ${(s.price || s.minBid || 0).toLocaleString()}
                            <Edit2 className="h-3 w-3 text-[#52525b]" />
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#71717a]">${s.maintenance}/yr</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="h-7 px-2 rounded-lg border border-[#27272a] text-[10px] text-[#71717a] hover:text-amber-400 hover:border-amber-500/40 transition-all">
                            {s.status === 'auction' ? 'End' : 'Auction'}
                          </button>
                          <button className="h-7 px-2 rounded-lg border border-[#27272a] text-[10px] text-[#71717a] hover:text-red-400 hover:border-red-500/40 transition-all">
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PRICING TIERS ── */}
      {tab === 'pricing' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-semibold text-white">Premium keyword slugs</p>
            </div>
            <p className="text-xs text-[#71717a]">
              Slugs like <span className="text-amber-400 font-mono">#lawyer #doctor #ceo #crypto</span> have special pricing.
              These are registered by you and listed at premium prices. Trustbank.xyz/lawyer — the most valuable.
            </p>
          </div>

          <div className="rounded-2xl border border-[#27272a] bg-[#111113] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#27272a]">
              <p className="text-sm font-semibold text-white">Price by slug length</p>
              <p className="text-xs text-[#71717a] mt-0.5">These are default suggested prices — you can override per-slug in the Manage tab</p>
            </div>
            <div className="divide-y divide-[#27272a]">
              {[
                { key:'1_letter', label:'1 letter (a, b, c...)', example:'#x #y' },
                { key:'2_letters', label:'2 letters', example:'#ai #io' },
                { key:'3_letters', label:'3 letters', example:'#ceo #dev' },
                { key:'4_letters', label:'4 letters', example:'#tech #nfts' },
                { key:'5_letters', label:'5 letters', example:'#defi #legal' },
                { key:'6_letters', label:'6 letters', example:'#lawyer #doctor' },
                { key:'7_plus', label:'7+ letters', example:'#designer' },
                { key:'premium_keyword', label:'Premium keyword', example:'#lawyer #bitcoin', premium: true },
              ].map(tier => (
                <div key={tier.key} className={`flex items-center gap-4 px-5 py-3.5 ${(tier as any).premium ? 'bg-amber-500/5' : ''}`}>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${(tier as any).premium ? 'text-amber-300' : 'text-white'}`}>{tier.label}</p>
                    <p className="text-xs text-[#52525b] font-mono">{tier.example}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${(tier as any).premium ? 'text-amber-400' : 'text-violet-400'}`}>
                      ${TIER_PRICES[tier.key]?.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#52525b]">${TIER_PRICES[tier.key]?.maintenance}/yr maintenance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-5">
            <p className="text-sm font-semibold text-white mb-3">Platform distribution</p>
            <div className="space-y-2 text-xs text-[#71717a]">
              <div className="flex justify-between"><span>trustbank.xyz/slug</span><span className="text-amber-400">Highest value (premium professionals)</span></div>
              <div className="flex justify-between"><span>jobinlink.com/u/slug</span><span className="text-violet-400">All professionals</span></div>
              <div className="flex justify-between"><span>hashpo.com/slug</span><span className="text-pink-400">Crypto/creative community</span></div>
              <div className="flex justify-between"><span>mybik.com/slug</span><span className="text-blue-400">Business/B2B</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
