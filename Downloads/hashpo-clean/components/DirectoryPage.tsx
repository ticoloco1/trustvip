'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { supabase } from '@/lib/supabase';
import { Search, Users, Briefcase, Video, MapPin, Eye, TrendingUp, BadgeCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

const A = '#a855f7';

export default function DirectoryPage() {
  const [tab, setTab] = useState<'sites'|'cvs'|'videos'>('sites');
  const [search, setSearch] = useState('');
  const [sites, setSites] = useState<any[]>([]);
  const [cvs, setCvs] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    Promise.all([
      supabase.from('mini_sites').select('id,slug,site_name,bio,avatar_url,show_cv,contact_price,boost_rank,badge').eq('published',true).eq('blocked',false).order('boost_rank',{ascending:false}).order('created_at',{ascending:false}).limit(100).then(({data})=>setSites(data||[])),
      supabase.from('mini_sites').select('id,slug,site_name,bio,avatar_url,contact_price,cv_headline,cv_location,cv_skills,badge').eq('published',true).eq('show_cv',true).eq('blocked',false).order('boost_rank',{ascending:false}).limit(100).then(({data})=>setCvs(data||[])),
      supabase.from('mini_site_videos').select('id,title,thumbnail_url,paywall_price,paywall_enabled,youtube_id,mini_sites!inner(slug,site_name,avatar_url)').order('created_at',{ascending:false}).limit(60).then(({data})=>setVideos(data||[])),
    ]).then(()=>setLoading(false));
  },[]);

  const fs=(s:any)=>!search.trim()||[s.site_name,s.bio,s.cv_headline,s.cv_skills].some((f:any)=>(f||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Directory</h1>
          <p className="text-gray-500">Verified professionals · CVs · Videos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[{l:'Profiles',v:sites.length,i:Users,c:'#7c3aed',bg:'#ede9fe'},{l:'CVs',v:cvs.length,i:Briefcase,c:'#059669',bg:'#f0fdf4'},{l:'Videos',v:videos.length,i:Video,c:'#d97706',bg:'#fffbeb'}].map(s=>(
            <div key={s.l} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:s.bg}}><s.i className="w-5 h-5" style={{color:s.c}}/></div>
              <div><p className="text-2xl font-black text-gray-900">{s.v}</p><p className="text-xs text-gray-400">{s.l}</p></div>
            </div>
          ))}
        </div>

        {/* Search + tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search professionals, skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-purple-400 transition-colors"/>
          </div>
          <div className="flex gap-2">
            {(['sites','cvs','videos'] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all capitalize ${tab===t?'border-purple-600 bg-purple-600 text-white':'border-gray-200 bg-white text-gray-700 hover:border-purple-300'}`}>
                {t==='sites'?'Mini-sites':t==='cvs'?'CVs':t}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-purple-600 animate-spin"/></div>}

        {/* Sites */}
        {!loading && tab==='sites' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sites.filter(fs).length===0 && <p className="col-span-full text-center py-16 text-gray-400">No profiles found</p>}
            {sites.filter(fs).map((s:any)=>(
              <div key={s.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:border-purple-200 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  {s.avatar_url?<img src={s.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"/>
                    :<div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0" style={{background:`linear-gradient(135deg,${A},#7c3aed)`}}>{s.site_name?.[0]||'H'}</div>}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1"><p className="font-bold text-gray-900 truncate text-sm">{s.site_name}</p>{s.badge&&<BadgeCheck className="w-4 h-4 shrink-0" style={{color:s.badge==='gold'?'#d97706':'#2563eb'}}/> }</div>
                    <p className="text-xs font-mono truncate" style={{color:A}}>/@{s.slug}</p>
                  </div>
                </div>
                {s.bio && <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{s.bio}</p>}
                <Link href={`/s/${s.slug}`} className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors">
                  <Eye className="w-3.5 h-3.5"/> View profile
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* CVs */}
        {!loading && tab==='cvs' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.filter(fs).length===0 && <p className="col-span-full text-center py-16 text-gray-400">No CVs found</p>}
            {cvs.filter(fs).map((s:any)=>(
              <div key={s.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  {s.avatar_url?<img src={s.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover"/>
                    :<div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{background:`linear-gradient(135deg,${A},#7c3aed)`}}>{s.site_name?.[0]||'H'}</div>}
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{s.site_name}</p>
                    {s.cv_headline && <p className="text-xs truncate font-semibold" style={{color:A}}>{s.cv_headline}</p>}
                  </div>
                </div>
                {s.cv_location && <div className="flex items-center gap-1 text-xs text-gray-400 mb-2"><MapPin className="w-3 h-3"/>{s.cv_location}</div>}
                {s.cv_skills && <div className="flex flex-wrap gap-1 mb-3">{s.cv_skills.split(',').slice(0,3).map((sk:string)=><span key={sk} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{background:`${A}15`,color:A}}>{sk.trim()}</span>)}</div>}
                <Link href={`/s/${s.slug}`} className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-white text-xs font-bold transition-colors" style={{background:A}}>
                  Unlock CV — ${s.contact_price||20} USDC
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Videos */}
        {!loading && tab==='videos' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.filter((v:any)=>!search||v.title?.toLowerCase().includes(search.toLowerCase())).length===0 && <p className="col-span-full text-center py-16 text-gray-400">No videos found</p>}
            {videos.filter((v:any)=>!search||v.title?.toLowerCase().includes(search.toLowerCase())).map((v:any)=>{
              const s=(v.mini_sites as any)||{};
              return (
                <div key={v.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-36 bg-gray-100">
                    <img src={v.thumbnail_url||`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`} alt="" className="w-full h-full object-cover"/>
                    {v.paywall_enabled && <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{background:A}}>${v.paywall_price}</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-gray-900 truncate mb-1">{v.title}</p>
                    <Link href={`/s/${s.slug}`} className="text-xs text-gray-400 hover:text-purple-600 font-medium">{s.site_name}</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
