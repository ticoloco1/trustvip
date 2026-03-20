'use client';
import { useState } from 'react';
import { Shield, Check, Megaphone, Globe, Monitor, Smartphone, BarChart3, ArrowRight, Loader2, X, Image, Radio, Layout, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const PLACEMENTS = [
  {
    id: 'leaderboard',
    name: 'Leaderboard',
    size: '728×90',
    position: 'Top of all pages',
    icon: Monitor,
    daily: 100, weekly: 600, monthly: 2000,
    maxPerSite: 1,
    preview: 'w-full h-10',
    desc: 'Maximum visibility. Shown at the top of every page across selected platforms.',
  },
  {
    id: 'sidebar',
    name: 'Sidebar Rectangle',
    size: '300×250',
    position: 'Right sidebar',
    icon: Layout,
    daily: 50, weekly: 300, monthly: 1000,
    maxPerSite: 2,
    preview: 'w-32 h-24',
    desc: 'Shown in the right sidebar of the directory and profile pages.',
  },
  {
    id: 'ticker',
    name: 'Slug Ticker',
    size: 'Logo + text',
    position: 'Ticker bar (all pages + mini-sites)',
    icon: Radio,
    daily: 80, weekly: 480, monthly: 1600,
    maxPerSite: 3,
    preview: 'w-full h-8',
    desc: 'Your brand runs in the slug ticker shown on all pages AND inside user mini-sites.',
  },
  {
    id: 'minisite',
    name: 'Mini-site Banner',
    size: '728×90',
    position: 'Bottom of mini-sites',
    icon: Smartphone,
    daily: 40, weekly: 240, monthly: 800,
    maxPerSite: 1,
    preview: 'w-full h-10',
    desc: 'Shown at the bottom of professional mini-sites. High purchase intent audience.',
  },
];

const SITES = [
  { id:'trustbank', label:'TrustBank', desc:'Lawyers, doctors, executives', color:'#c9a84c', audience:'Premium professionals' },
  { id:'jobinlink', label:'JobinLink', desc:'All professionals', color:'#7c3aed', audience:'Job market' },
  { id:'hashpo', label:'Hashpo', desc:'Creators, web3', color:'#ec4899', audience:'Web3 native' },
  { id:'mybik', label:'MyBik', desc:'All professionals', color:'#9333ea', audience:'General market' },
];

export default function AdsPage() {
  const [step, setStep] = useState(1); // 1=placement 2=sites 3=duration 4=creative 5=checkout
  const [placement, setPlacement] = useState(PLACEMENTS[0]);
  const [selectedSites, setSelectedSites] = useState<string[]>(['trustbank']);
  const [duration, setDuration] = useState<'daily'|'weekly'|'monthly'>('weekly');
  const [creative, setCreative] = useState({ title:'', description:'', link:'', imageUrl:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleSite = (id: string) => {
    setSelectedSites(prev =>
      prev.includes(id) ? prev.filter(s => s!==id) : [...prev, id]
    );
  };

  const totalPrice = placement[duration] * selectedSites.length;

  const handleSubmit = async () => {
    if (!creative.title || !creative.link || selectedSites.length === 0) return;
    setLoading(true); setError('');
    try {
      await supabase.from('ads').insert({
        title: creative.title,
        description: creative.description,
        link_url: creative.link,
        image_url: creative.imageUrl,
        platforms: selectedSites,
        placement: placement.id,
        plan: duration,
        amount_usdc: totalPrice,
        status: 'pending',
      });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || 'Error submitting campaign');
    }
    setLoading(false);
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm animate-fade-up">
        <div className="h-20 w-20 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto mb-4">
          <Check className="h-10 w-10 text-green-500"/>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Campaign submitted!</h1>
        <p className="text-gray-500 mb-6">Our team will review and activate your ad within 24 hours. You'll be notified by email.</p>
        <a href="/" className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white">
          Back to TrustBank
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 flex h-14 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-white"/>
            </div>
            <span className="font-serif font-bold text-gray-900">TrustBank</span>
            <span className="text-gray-300 mx-2">·</span>
            <span className="text-sm text-gray-500">Advertise</span>
          </a>
          <a href="/ads/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            My campaigns
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-medium text-yellow-800 mb-6">
            <Megaphone className="h-3.5 w-3.5"/> Reach 100,000+ verified professionals
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Advertise across<br/>
            <span className="text-yellow-600">4 premium platforms</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Lawyers, doctors, executives, founders and creators — all in one network.
            Pay per campaign in USDC. No minimums.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { label:'Active professionals', value:'100k+' },
            { label:'Monthly page views', value:'2.4M' },
            { label:'Countries', value:'48' },
            { label:'Avg. income', value:'$85k' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* STEP 1 — Placement */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">1</span>
            Choose ad placement
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {PLACEMENTS.map(p => (
              <button key={p.id} onClick={() => setPlacement(p)}
                className={`text-left rounded-2xl border p-4 transition-all ${placement.id===p.id ? 'border-gray-900 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.size} · {p.position}</p>
                  </div>
                  {placement.id===p.id && (
                    <div className="h-5 w-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white"/>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-3">{p.desc}</p>
                <div className="flex gap-3 text-xs">
                  <span className="text-gray-900 font-semibold">${p.daily}/day</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-900 font-semibold">${p.weekly}/week</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-900 font-semibold">${p.monthly}/mo</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2 — Sites */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">2</span>
            Choose platforms
          </h2>
          <p className="text-xs text-gray-400 mb-5">Select one or all four. Price multiplies per platform.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {SITES.map(s => (
              <button key={s.id} onClick={() => toggleSite(s.id)}
                className={`flex items-center gap-3 rounded-xl p-4 text-left transition-all border ${
                  selectedSites.includes(s.id) ? 'border-gray-900 shadow-sm' : 'border-gray-100 hover:border-gray-300'
                }`}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:`${s.color}15` }}>
                  <Globe className="h-5 w-5" style={{ color:s.color }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                  <p className="text-[10px] text-gray-300">{s.audience}</p>
                </div>
                {selectedSites.includes(s.id) && (
                  <div className="h-5 w-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white"/>
                  </div>
                )}
              </button>
            ))}
          </div>
          <button onClick={() => setSelectedSites(SITES.map(s=>s.id))}
            className="mt-3 text-xs text-yellow-700 hover:underline">
            Select all 4 platforms
          </button>
        </div>

        {/* STEP 3 — Duration */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">3</span>
            Duration
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {(['daily','weekly','monthly'] as const).map(d => (
              <button key={d} onClick={() => setDuration(d)}
                className={`rounded-xl p-4 text-center transition-all border ${
                  duration===d ? 'border-gray-900 shadow-sm' : 'border-gray-100 hover:border-gray-300'
                }`}>
                <p className="text-sm font-bold text-gray-900 capitalize">{d}</p>
                <p className="text-xl font-black text-gray-900 my-1">
                  ${placement[d] * selectedSites.length}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedSites.length > 1 ? `${selectedSites.length} platforms` : '1 platform'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 4 — Creative */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">4</span>
            Ad creative
          </h2>
          <div className="space-y-4">
            {[
              { k:'title', label:'Ad title', p:'Your company or product name', req:true },
              { k:'description', label:'Short description', p:'What you offer (optional)', req:false },
              { k:'link', label:'Destination URL', p:'https://yourcompany.com', req:true },
              { k:'imageUrl', label:'Banner image URL', p:'https://... (728x90px recommended)', req:false },
            ].map(f => (
              <div key={f.k}>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  {f.label} {f.req && <span className="text-red-400">*</span>}
                </label>
                <input value={(creative as any)[f.k]}
                  onChange={e => setCreative(prev => ({ ...prev, [f.k]: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none transition-all"
                  placeholder={f.p}/>
              </div>
            ))}

            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="text-xs font-semibold text-blue-700 mb-1">📐 Size guide</p>
              <p className="text-xs text-blue-600">
                Leaderboard & mini-site: <strong>728×90px</strong> ·
                Sidebar: <strong>300×250px</strong> ·
                Ticker: <strong>logo 40×40 + text</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Order summary + Pay */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">5</span>
            Order summary
          </h2>
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Placement</span>
              <span className="text-gray-900 font-medium">{placement.name} ({placement.size})</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Platforms</span>
              <span className="text-gray-900 font-medium">{selectedSites.join(', ') || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="text-gray-900 font-medium capitalize">{duration}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-5">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-2xl font-black text-gray-900">${totalPrice} USDC</span>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600 mb-4">
              {error}
            </div>
          )}

          <button onClick={handleSubmit}
            disabled={loading || !creative.title || !creative.link || selectedSites.length===0}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white disabled:opacity-40 transition-all hover:opacity-90"
            style={{ background:'#1e3a8a' }}>
            {loading
              ? <><Loader2 className="h-4 w-4 animate-spin"/>Submitting...</>
              : <><Megaphone className="h-4 w-4"/>Submit campaign · ${totalPrice} USDC<ArrowRight className="h-4 w-4"/></>
            }
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            Pay via Polygon USDC · Reviewed within 24h · Cancel before review = full refund
          </p>
        </div>
      </div>
    </div>
  );
}
