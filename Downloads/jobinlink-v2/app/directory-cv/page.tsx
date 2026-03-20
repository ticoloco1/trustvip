'use client';
import { useState } from 'react';
import { Hash, Search, FileText, Lock, Unlock, MapPin, Filter, Briefcase, GraduationCap, ChevronRight, Building2 } from 'lucide-react';

const PROFILES = [
  { name:'Sarah Chen', title:'Senior Product Designer', location:'San Francisco', skills:['Figma','UX Research','Prototyping'], exp:'8 years', edu:'Stanford', locked:true, rate:'$120/hr' },
  { name:'Marcus Dev', title:'Full-Stack Engineer', location:'Berlin (Remote)', skills:['React','Node.js','AWS','TypeScript'], exp:'6 years', edu:'TU Berlin', locked:true, rate:'$95/hr' },
  { name:'Ana Lima', title:'Data Scientist', location:'São Paulo', skills:['Python','ML','SQL','TensorFlow'], exp:'5 years', edu:'USP', locked:true, rate:'$80/hr' },
  { name:'James Porter', title:'Marketing Director', location:'London', skills:['Growth','SEO','Paid Media'], exp:'10 years', edu:'Oxford', locked:false, rate:'$110/hr' },
  { name:'Yuki Tanaka', title:'iOS Developer', location:'Tokyo (Remote)', skills:['Swift','UIKit','SwiftUI'], exp:'7 years', edu:'Tokyo U', locked:true, rate:'$90/hr' },
  { name:'Carla Souza', title:'UX Writer', location:'Remote', skills:['Content Design','Copywriting','Research'], exp:'4 years', edu:'PUC-Rio', locked:true, rate:'$65/hr' },
];

export default function CVDirectory() {
  const [search, setSearch] = useState('');
  const filtered = PROFILES.filter(p =>
    search === '' ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center gap-2 text-xs mb-3 text-[#52525b]">
            <a href="/" className="hover:text-white">JobinLink</a><span>/</span>
            <a href="/directory" className="hover:text-white">Directories</a><span>/</span>
            <span className="text-white">Resume / CV</span>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#27272a] bg-[#18181b] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500 focus:outline-none transition-all"
                placeholder="Search by name, title, skill..." />
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-[#27272a] bg-[#111113] px-4 py-2.5 text-xs text-[#71717a] hover:text-white transition-all">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Resume / CV Directory</h1>
          <span className="text-xs text-[#52525b]">{filtered.length} professionals</span>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-violet-500/20 bg-violet-500/5">
          <Lock className="h-4 w-4 text-violet-400 flex-shrink-0" />
          <p className="text-xs text-[#a1a1aa]">
            Contact details are locked. Companies pay <strong className="text-violet-300">$9.99 per unlock</strong> — split 50/50 with the professional instantly via USDC on Polygon.
          </p>
        </div>

        <div className="space-y-3">
          {filtered.map((p, i) => (
            <div key={i} className="rounded-2xl border border-[#27272a] bg-[#111113] p-5 hover:border-violet-500/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 border border-[#27272a] flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                      {!p.locked && <span className="text-[10px] rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 px-2 py-0.5">Open to contact</span>}
                    </div>
                    <p className="text-xs text-[#71717a] mb-2">{p.title}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-[#52525b] mb-3">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{p.exp}</span>
                      <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{p.edu}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.skills.map(s => <span key={s} className="rounded-lg bg-[#27272a] px-2 py-1 text-[11px] text-[#a1a1aa]">{s}</span>)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-white">{p.rate}</span>
                  {p.locked ? (
                    <button className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition-all">
                      <Unlock className="h-3.5 w-3.5" /> Unlock $9.99
                    </button>
                  ) : (
                    <button className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all">
                      <ChevronRight className="h-3.5 w-3.5" /> Contact
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-1">Are you a company?</p>
              <p className="text-xs text-[#71717a] mb-3">Subscribe for unlimited CV access, post jobs and appear in the company directory. All payments via USDC on Polygon.</p>
              <a href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-all">
                Start company plan <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
