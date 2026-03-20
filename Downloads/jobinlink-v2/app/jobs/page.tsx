'use client';
import { useState } from 'react';
import { Search, MapPin, Briefcase, Clock, DollarSign, Hash, Building2, Filter } from 'lucide-react';

const JOBS = [
  { id:1, title:'Senior React Developer', company:'TechCorp', location:'São Paulo (Remoto)', salary:'R$12k–18k', type:'CLT', time:'2h', tags:['React','TypeScript','Next.js'] },
  { id:2, title:'Designer UX/UI', company:'StartupXYZ', location:'Rio de Janeiro', salary:'R$8k–12k', type:'PJ', time:'5h', tags:['Figma','CSS','Motion'] },
  { id:3, title:'Fotógrafo de Eventos', company:'Events Pro', location:'São Paulo', salary:'R$3k–6k', type:'Freelance', time:'1d', tags:['Fotografia','Lightroom'] },
  { id:4, title:'Advogado Trabalhista', company:'LegalPro', location:'Brasília', salary:'R$10k–15k', type:'CLT', time:'2d', tags:['Direito','CLT','Negociação'] },
  { id:5, title:'Jornalista Digital', company:'NewsMedia', location:'Remoto', salary:'R$4k–7k', type:'PJ', time:'3d', tags:['Jornalismo','SEO','WordPress'] },
  { id:6, title:'Desenvolvedor Full-Stack', company:'AgencyBR', location:'Curitiba (Híbrido)', salary:'R$9k–14k', type:'CLT', time:'4d', tags:['Node.js','React','AWS'] },
];

export default function Jobs() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('todos');

  const filtered = JOBS.filter(j =>
    (type === 'todos' || j.type === type) &&
    (search === '' || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <a href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <Hash className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm">JobinLink</span>
            </a>
            <span className="text-[#3f3f46]">/</span>
            <span className="text-sm text-[#71717a]">Vagas</span>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#27272a] bg-[#18181b] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500 focus:outline-none transition-all"
                placeholder="Buscar vagas, empresas..." />
            </div>
            <div className="flex gap-2">
              {['todos','CLT','PJ','Freelance'].map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all hidden sm:block ${
                    type === t ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-[#27272a] bg-[#111113] text-[#71717a] hover:text-white'
                  }`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-white">{filtered.length} vagas</h1>
          <button className="flex items-center gap-2 text-xs text-[#71717a] hover:text-white">
            <Filter className="h-3.5 w-3.5" /> Filtros
          </button>
        </div>
        {filtered.map(job => (
          <div key={job.id} className="rounded-2xl border border-[#27272a] bg-[#111113] p-5 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-[#27272a] flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white mb-1">{job.title}</h3>
                  <p className="text-xs text-[#71717a] mb-2">{job.company}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-[#52525b]">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />há {job.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`text-[10px] rounded-full border px-2 py-0.5 font-medium ${
                  job.type === 'CLT' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' :
                  job.type === 'PJ' ? 'border-blue-500/20 text-blue-400 bg-blue-500/10' :
                  'border-amber-500/20 text-amber-400 bg-amber-500/10'
                }`}>{job.type}</span>
                <button className="rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 transition-all">
                  Candidatar
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#27272a]">
              {job.tags.map(tag => (
                <span key={tag} className="rounded-lg bg-[#27272a] px-2 py-1 text-[11px] text-[#a1a1aa]">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
