'use client';
import { useState, useEffect } from 'react';
import { Search, Hash, MapPin, Unlock, Eye, Video, Briefcase, Zap, BadgeCheck, Award, TrendingUp, Users, Loader2, ExternalLink, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const A = '#6d28d9';

const NAV_LINKS = [
  { href:'/', label:'Home' },
  { href:'/directory', label:'Diretório' },
  { href:'/slugs', label:'Slugs' },
  { href:'/classificados', label:'Classificados' },
  { href:'/ads', label:'Anunciar' },
  { href:'/dashboard', label:'Meu perfil' },
];

function Card({ children, style, hover=true }: any) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>hover&&setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ background:'white', border:'1px solid #e5e7eb', borderRadius:16, overflow:'hidden', boxShadow:hov?'0 4px 20px rgba(0,0,0,0.1)':'0 1px 4px rgba(0,0,0,0.06)', transition:'box-shadow 0.2s', ...style }}>
      {children}
    </div>
  );
}

const TABS = [{ id:'sites', label:'Mini-sites', icon:Users },{ id:'cvs', label:'CVs & Jobs', icon:Briefcase },{ id:'videos', label:'Vídeos', icon:Video }];

export default function DirectoryClient() {
  const { user } = useAuth();
  const [tab, setTab] = useState('sites');
  const [search, setSearch] = useState('');
  const [sites, setSites] = useState<any[]>([]);
  const [cvs, setCvs] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [boostModal, setBoostModal] = useState<any>(null);
  const [boostPos, setBoostPos] = useState(1);
  const [boostLoading, setBoostLoading] = useState(false);
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);
  const showToast = (msg:string,ok=true)=>{ setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  useEffect(()=>{
    Promise.all([
      supabase.from('mini_sites').select('id,slug,site_name,bio,avatar_url,show_cv,contact_price,boost_rank,boost_expires_at,badge').eq('published',true).eq('blocked',false).order('boost_rank',{ascending:false}).order('created_at',{ascending:false}).limit(100).then(({data})=>setSites(data||[])),
      supabase.from('mini_sites').select('id,slug,site_name,bio,avatar_url,contact_price,cv_headline,cv_location,cv_skills,badge').eq('published',true).eq('show_cv',true).eq('blocked',false).order('boost_rank',{ascending:false}).limit(100).then(({data})=>setCvs(data||[])),
      supabase.from('mini_site_videos').select('id,title,thumbnail_url,paywall_price,paywall_enabled,mini_sites!inner(slug,site_name,avatar_url)').order('created_at',{ascending:false}).limit(60).then(({data})=>setVideos(data||[])),
    ]).then(()=>setLoading(false));
  },[]);

  const handleBoost = async ()=>{
    if(!user||!boostModal) return;
    setBoostLoading(true);
    try {
      const expires=new Date(Date.now()+7*864e5).toISOString();
      await supabase.from('mini_sites').update({boost_rank:boostPos,boost_expires_at:expires} as any).eq('id',boostModal.id);
      setSites(p=>p.map((s:any)=>s.id===boostModal.id?{...s,boost_rank:boostPos}:s).sort((a:any,b:any)=>(b.boost_rank||0)-(a.boost_rank||0)));
      showToast(`✓ +${boostPos} posições por $${(boostPos*1.5).toFixed(2)} USDC`);
      setBoostModal(null);
    } catch(e:any){showToast(e.message||'Erro',false);}
    setBoostLoading(false);
  };

  const fs=(s:any)=>!search.trim()||[s.site_name,s.bio,s.cv_headline,s.cv_skills].some((f:any)=>(f||'').toLowerCase().includes(search.toLowerCase()));
  const isBoostActive=(s:any)=>s.boost_rank>0&&s.boost_expires_at&&new Date(s.boost_expires_at)>new Date();

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',color:'#111827',fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      {toast&&<div style={{position:'fixed',top:16,right:16,zIndex:200,padding:'12px 20px',borderRadius:14,background:toast.ok?'#f0fdf4':'#fef2f2',border:`1px solid ${toast.ok?'#86efac':'#fca5a5'}`,color:toast.ok?'#15803d':'#dc2626',fontSize:14,fontWeight:600,boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>{toast.msg}</div>}

      {/* NAV */}
      <header style={{background:'white',borderBottom:'1px solid #e5e7eb',position:'sticky',top:0,zIndex:100,boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
            <div style={{width:36,height:36,borderRadius:10,background:A,display:'flex',alignItems:'center',justifyContent:'center'}}><Hash style={{width:18,height:18,color:'white'}}/></div>
            <span style={{fontSize:18,fontWeight:800,color:A}}>jobinlink</span>
          </Link>
          <nav style={{display:'flex',alignItems:'center',gap:2}}>
            {NAV_LINKS.map(l=>(
              <Link key={l.href} href={l.href} style={{padding:'7px 14px',borderRadius:9,textDecoration:'none',fontSize:14,fontWeight:500,color:l.href==='/directory'?A:'#374151',background:l.href==='/directory'?'#ede9fe':'transparent',transition:'all 0.15s'}}>{l.label}</Link>
            ))}
          </nav>
          <div style={{display:'flex',gap:8}}>
            {user
              ? <Link href="/dashboard" style={{padding:'8px 16px',borderRadius:10,background:'#f3f4f6',color:'#374151',textDecoration:'none',fontSize:14,fontWeight:600}}>Dashboard</Link>
              : <Link href="/login" style={{padding:'8px 16px',borderRadius:10,background:A,color:'white',textDecoration:'none',fontSize:14,fontWeight:700}}>Entrar</Link>}
          </div>
        </div>
      </header>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'32px 20px'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:32,fontWeight:800,color:'#111827',marginBottom:6,letterSpacing:'-0.02em'}}>Diretório</h1>
          <p style={{fontSize:16,color:'#6b7280'}}>Profissionais · CVs · Vídeos</p>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
          {[{l:'Perfis publicados',v:sites.length,c:A,I:Users},{l:'CVs disponíveis',v:cvs.length,c:'#059669',I:Briefcase},{l:'Vídeos',v:videos.length,c:'#d97706',I:Video}].map(s=>(
            <Card key={s.l} style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${s.c}12`,border:`1px solid ${s.c}25`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><s.I style={{width:20,height:20,color:s.c}}/></div>
              <div><p style={{fontSize:22,fontWeight:800,color:'#111827',margin:0}}>{s.v}</p><p style={{fontSize:13,color:'#6b7280',margin:0}}>{s.l}</p></div>
            </Card>
          ))}
        </div>

        {/* Search + Tabs */}
        <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap',alignItems:'center'}}>
          <div style={{position:'relative',flex:1,minWidth:220}}>
            <Search style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:18,height:18,color:'#9ca3af'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar profissionais, habilidades..."
              style={{width:'100%',padding:'12px 16px 12px 44px',borderRadius:12,border:'1.5px solid #e5e7eb',background:'white',fontSize:15,color:'#111827',outline:'none',fontFamily:'inherit',boxSizing:'border-box' as const,transition:'border-color 0.2s'}}
              onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
          </div>
          <div style={{display:'flex',gap:8}}>
            {TABS.map(t=>{const Icon=t.icon;const active=tab===t.id;return(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{display:'flex',alignItems:'center',gap:6,padding:'10px 18px',borderRadius:12,border:`1.5px solid ${active?A:'#e5e7eb'}`,background:active?A:'white',color:active?'white':'#374151',fontSize:14,fontWeight:active?700:500,cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s'}}>
                <Icon style={{width:15,height:15}}/>{t.label}
              </button>
            );})}
          </div>
        </div>

        {loading&&<div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 style={{width:32,height:32,color:A,animation:'spin 1s linear infinite'}}/></div>}

        {/* Sites */}
        {!loading&&tab==='sites'&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
            {sites.filter(fs).length===0&&<p style={{gridColumn:'1/-1',textAlign:'center',color:'#9ca3af',padding:'50px 0',fontSize:16}}>Nenhum perfil encontrado</p>}
            {sites.filter(fs).map((site:any,i:number)=>(
              <Card key={site.id} style={{padding:20}}>
                {isBoostActive(site)&&<div style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,color:'#d97706',marginBottom:10,padding:'3px 10px',borderRadius:20,background:'#fef3c7',border:'1px solid #fcd34d',fontWeight:700}}><Zap style={{width:11,height:11}}/>Destaque</div>}
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  {site.avatar_url?<img src={site.avatar_url} alt="" style={{width:48,height:48,borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'2px solid #e5e7eb'}}/>
                    :<div style={{width:48,height:48,borderRadius:'50%',background:'#ede9fe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:A,flexShrink:0}}>{(site.site_name||'?').charAt(0)}</div>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}>
                      <p style={{fontSize:15,fontWeight:700,color:'#111827',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',margin:0}}>{site.site_name}</p>
                      {site.badge==='blue'&&<BadgeCheck style={{width:16,height:16,color:'#2563eb',flexShrink:0}}/>}
                      {site.badge==='gold'&&<Award style={{width:16,height:16,color:'#d97706',flexShrink:0}}/>}
                    </div>
                    <p style={{fontSize:12,fontFamily:'monospace',color:A,margin:0}}>/{site.slug}</p>
                  </div>
                </div>
                {site.bio&&<p style={{fontSize:13,color:'#6b7280',lineHeight:1.5,marginBottom:14,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as any}}>{site.bio}</p>}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  <Link href={`/${site.slug}`} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'9px',borderRadius:10,border:'1px solid #e5e7eb',background:'#f9fafb',color:'#374151',fontSize:13,textDecoration:'none',fontWeight:500,transition:'all 0.15s'}}><Eye style={{width:14,height:14}}/>Ver</Link>
                  {user&&<button onClick={()=>{setBoostModal(site);setBoostPos(1);}} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'9px',borderRadius:10,border:`1px solid ${A}25`,background:`${A}08`,color:A,fontSize:13,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}><TrendingUp style={{width:13,height:13}}/>Boost</button>}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CVs */}
        {!loading&&tab==='cvs'&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
            {cvs.filter(fs).length===0&&<p style={{gridColumn:'1/-1',textAlign:'center',color:'#9ca3af',padding:'50px 0',fontSize:16}}>Nenhum CV encontrado</p>}
            {cvs.filter(fs).map((site:any,i:number)=>(
              <Card key={site.id} style={{padding:20}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                  {site.avatar_url?<img src={site.avatar_url} alt="" style={{width:44,height:44,borderRadius:12,objectFit:'cover',flexShrink:0}}/>
                    :<div style={{width:44,height:44,borderRadius:12,background:'#ede9fe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:A,flexShrink:0}}>{(site.site_name||'?').charAt(0)}</div>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:5}}><p style={{fontSize:14,fontWeight:700,color:'#111827',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{site.site_name}</p>{site.badge==='blue'&&<BadgeCheck style={{width:15,height:15,color:'#2563eb'}}/>}</div>
                    {site.cv_headline&&<p style={{fontSize:12,color:A,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:600}}>{site.cv_headline}</p>}
                  </div>
                </div>
                {site.cv_location&&<div style={{display:'flex',alignItems:'center',gap:5,marginBottom:10,fontSize:13,color:'#6b7280'}}><MapPin style={{width:13,height:13}}/>{site.cv_location}</div>}
                {site.cv_skills&&<div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>{site.cv_skills.split(',').slice(0,4).map((sk:string)=><span key={sk} style={{fontSize:11,padding:'3px 9px',borderRadius:20,background:'#ede9fe',color:A,fontWeight:600}}>{sk.trim()}</span>)}</div>}
                <Link href={`/${site.slug}`} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px',borderRadius:12,background:A,color:'white',fontSize:13,fontWeight:700,textDecoration:'none'}}><Unlock style={{width:14,height:14}}/>Ver CV — ${site.contact_price||20} USDC</Link>
              </Card>
            ))}
          </div>
        )}

        {/* Videos */}
        {!loading&&tab==='videos'&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
            {videos.filter((v:any)=>!search.trim()||(v.title||'').toLowerCase().includes(search.toLowerCase())).length===0&&<p style={{gridColumn:'1/-1',textAlign:'center',color:'#9ca3af',padding:'50px 0',fontSize:16}}>Nenhum vídeo encontrado</p>}
            {videos.filter((v:any)=>!search.trim()||(v.title||'').toLowerCase().includes(search.toLowerCase())).map((v:any,i:number)=>{
              const site=v.mini_sites;
              return (
                <Card key={v.id} style={{padding:0}}>
                  <div style={{height:160,background:'#f3f4f6',position:'relative',overflow:'hidden'}}>
                    {v.thumbnail_url?<img src={v.thumbnail_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}><Video style={{width:40,height:40,color:'#d1d5db'}}/></div>}
                    {v.paywall_enabled&&<div style={{position:'absolute',top:8,right:8,padding:'3px 10px',borderRadius:20,background:`${A}ee`,color:'white',fontSize:11,fontWeight:700}}>${v.paywall_price} USDC</div>}
                  </div>
                  <div style={{padding:'12px 16px'}}>
                    <p style={{fontSize:14,fontWeight:600,color:'#111827',marginBottom:6,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.title}</p>
                    {site&&<Link href={`/${site.slug}`} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#6b7280',textDecoration:'none'}}><ExternalLink style={{width:11,height:11}}/>{site.site_name}</Link>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Boost Modal */}
      {boostModal&&(
        <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(4px)'}}>
          <div style={{width:'100%',maxWidth:360,background:'white',borderRadius:20,padding:28,boxShadow:'0 20px 60px rgba(0,0,0,0.15)',border:'1px solid #e5e7eb'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:20}}><Zap style={{width:20,height:20,color:'#d97706'}}/><h3 style={{fontSize:16,fontWeight:700,color:'#111827',margin:0}}>Boost — {boostModal.site_name}</h3></div>
            <p style={{fontSize:14,color:'#6b7280',marginBottom:14}}>Quantas posições subir?</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:18}}>
              {[1,5,10,50].map(n=><button key={n} onClick={()=>setBoostPos(n)} style={{padding:'10px 0',borderRadius:10,border:`1.5px solid ${boostPos===n?'#d97706':'#e5e7eb'}`,background:boostPos===n?'#fef3c7':'white',color:boostPos===n?'#92400e':'#374151',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>+{n}</button>)}
            </div>
            <div style={{padding:'12px 16px',borderRadius:12,background:'#f9fafb',border:'1px solid #f3f4f6',marginBottom:16,display:'flex',justifyContent:'space-between',fontSize:15,fontWeight:700}}>
              <span style={{color:'#6b7280'}}>+{boostPos} posições · 7 dias</span>
              <span style={{color:'#d97706'}}>${(boostPos*1.5).toFixed(2)} USDC</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <button onClick={()=>setBoostModal(null)} style={{padding:'11px',borderRadius:12,border:'1px solid #e5e7eb',background:'white',color:'#6b7280',fontSize:14,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>Cancelar</button>
              <button onClick={handleBoost} disabled={boostLoading} style={{padding:'11px',borderRadius:12,border:'none',background:'#d97706',color:'white',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                {boostLoading?<Loader2 style={{width:15,height:15,animation:'spin 1s linear infinite'}}/>:<Zap style={{width:15,height:15}}/>}Boost ${(boostPos*1.5).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
