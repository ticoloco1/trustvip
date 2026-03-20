'use client';
import { useState } from 'react';
import { Hash, Megaphone, Globe, Monitor, Smartphone, Radio, Layout, Check, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const A = '#8b5cf6';

const PLACEMENTS = [
  { id:'leaderboard', name:'Leaderboard', size:'728×90', pos:'Topo de todas as páginas',    icon:Monitor,   daily:100, weekly:600, monthly:2000 },
  { id:'sidebar',     name:'Sidebar',     size:'300×250', pos:'Coluna direita — diretório', icon:Layout,    daily:50,  weekly:300, monthly:1000 },
  { id:'ticker',      name:'Ticker',      size:'Logo + texto', pos:'Ticker de slugs',        icon:Radio,     daily:80,  weekly:480, monthly:1600 },
  { id:'minisite',    name:'Mini-site',   size:'728×90', pos:'Rodapé dos mini-sites',        icon:Smartphone,daily:40,  weekly:240, monthly:800  },
];

const SITES = [
  { id:'jobinlink', label:'JobinLink',  color:'#8b5cf6', desc:'Profissionais, devs, recrutadores' },
  { id:'trustbank', label:'TrustBank',  color:'#c9a84c', desc:'Advogados, médicos, executivos' },
  { id:'hashpo',    label:'Hashpo',     color:'#ec4899', desc:'Criadores, web3, crypto' },
  { id:'mybik',     label:'MyBik',      color:'#9333ea', desc:'Mercado geral' },
];

export default function AdsPage() {
  const { user } = useAuth();
  const [placement, setPlacement] = useState(PLACEMENTS[0]);
  const [selectedSites, setSelectedSites] = useState<string[]>(['jobinlink']);
  const [duration, setDuration] = useState<'daily'|'weekly'|'monthly'>('weekly');
  const [form, setForm] = useState({ title:'', description:'', link:'', imageUrl:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleSite = (id:string) => setSelectedSites(p=>p.includes(id)?p.filter(s=>s!==id):[...p,id]);
  const total = placement[duration] * Math.max(selectedSites.length,1);

  const handleSubmit = async () => {
    if (!form.title.trim()||!form.link.trim()||!selectedSites.length) { setError('Preencha título, link e selecione ao menos 1 plataforma'); return; }
    setLoading(true); setError('');
    try {
      const userId = user ? (await supabase.auth.getUser()).data.user?.id : null;
      await supabase.from('ads').insert({
        title:form.title, description:form.description||null,
        link_url:form.link, image_url:form.imageUrl||null,
        platforms:selectedSites, placement:placement.id,
        plan:duration, amount_usdc:total, status:'pending',
        advertiser_id:userId||null,
      } as any);
      setSuccess(true);
    } catch(e:any) { setError(e.message||'Erro ao enviar campanha'); }
    setLoading(false);
  };

  if (success) return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign:'center', animation:'fadeUp 0.4s ease' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(16,185,129,0.12)', border:'0.5px solid rgba(16,185,129,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <Check style={{ width:36, height:36, color:'#10b981' }}/>
        </div>
        <h1 style={{ fontSize:24, fontWeight:700, color:'#111827', marginBottom:8 }}>Campanha enviada!</h1>
        <p style={{ color:'#6b7280', marginBottom:24 }}>Nossa equipe revisará e ativará em até 24h.</p>
        <a href="/" style={{ padding:'12px 28px', borderRadius:14, background:A, color:'#fff', fontSize:14, fontWeight:600, textDecoration:'none' }}>Voltar ao início</a>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', color:'#111827', fontFamily:"-apple-system,'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ position:'fixed', top:-200, left:'50%', transform:'translateX(-50%)', width:700, height:700, borderRadius:'50%', background:`${A}08`, filter:'blur(120px)', pointerEvents:'none', zIndex:0 }}/>

      <nav style={{ position:'sticky', top:0, zIndex:50, padding:'12px 24px', borderBottom:'1px solid #e5e7eb', background:'rgba(255,255,255,0.95)', backdropFilter:'none', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}><Hash style={{ width:18, height:18, color:A }}/><span style={{ fontSize:16, fontWeight:800, color:A }}>jobinlink</span></a>
        <span style={{ fontSize:13, color:'#9ca3af' }}>Anunciar</span>
      </nav>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 20px', position:'relative', zIndex:1 }}>

        {/* Hero */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:20, background:`${A}12`, border:`0.5px solid ${A}30`, color:A, fontSize:12, fontWeight:600, marginBottom:16 }}>
            <Megaphone style={{ width:14, height:14 }}/> Alcance 100.000+ profissionais
          </div>
          <h1 style={{ fontSize:36, fontWeight:800, color:'#111827', marginBottom:12, letterSpacing:'-0.02em' }}>
            Anuncie nas<br/><span style={{ background:`linear-gradient(135deg,${A},#06b6d4)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>4 plataformas</span>
          </h1>
          <p style={{ fontSize:16, color:'rgba(241,245,249,0.45)', maxWidth:480, margin:'0 auto' }}>
            Advogados, médicos, devs, criadores e fundadores. Pague em USDC. Sem mínimo.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:36 }}>
          {[{v:'100k+',l:'Profissionais ativos'},{v:'2.4M',l:'Pageviews/mês'},{v:'48',l:'Países'},{v:'$85k',l:'Renda média'}].map(s=>(
            <div key={s.l} style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:16, padding:'16px', textAlign:'center' }}>
              <p style={{ fontSize:22, fontWeight:800, color:'#111827', margin:0 }}>{s.v}</p>
              <p style={{ fontSize:11, color:'#9ca3af', margin:0 }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Step 1: Placement */}
        <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:20, padding:'24px', marginBottom:14 }}>
          <p style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:24, height:24, borderRadius:'50%', background:A, color:'#fff', fontSize:12, fontWeight:800, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>1</span>
            Escolha o formato
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:10 }}>
            {PLACEMENTS.map(p=>{
              const Icon=p.icon; const active=placement.id===p.id;
              return (
                <button key={p.id} onClick={()=>setPlacement(p)}
                  style={{ textAlign:'left', padding:'14px', borderRadius:14, border:`${active?'1.5':'0.5'}px solid ${active?A:'rgba(255,255,255,0.08)'}`, background:active?`${A}10`:'rgba(255,255,255,0.02)', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s', position:'relative' }}>
                  {active&&<div style={{ position:'absolute', top:10, right:10, width:18, height:18, borderRadius:'50%', background:A, display:'flex', alignItems:'center', justifyContent:'center' }}><Check style={{ width:11, height:11, color:'#fff' }}/></div>}
                  <Icon style={{ width:18, height:18, color:active?A:'#9ca3af', marginBottom:8 }}/>
                  <p style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:2 }}>{p.name}</p>
                  <p style={{ fontSize:11, color:'#9ca3af', marginBottom:6 }}>{p.size} · {p.pos}</p>
                  <p style={{ fontSize:12, fontWeight:700, color:active?A:'rgba(241,245,249,0.6)' }}>${p.daily}/dia · ${p.weekly}/sem</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Platforms */}
        <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:20, padding:'24px', marginBottom:14 }}>
          <p style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:4, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:24, height:24, borderRadius:'50%', background:A, color:'#fff', fontSize:12, fontWeight:800, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>2</span>
            Escolha as plataformas
          </p>
          <p style={{ fontSize:12, color:'#9ca3af', marginBottom:14 }}>Preço multiplica por plataforma</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
            {SITES.map(s=>{
              const sel=selectedSites.includes(s.id);
              return (
                <button key={s.id} onClick={()=>toggleSite(s.id)}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:14, border:`${sel?'1.5':'0.5'}px solid ${sel?s.color:'rgba(255,255,255,0.08)'}`, background:sel?`${s.color}08`:'rgba(255,255,255,0.02)', cursor:'pointer', fontFamily:'inherit', textAlign:'left', transition:'all 0.2s' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Globe style={{ width:18, height:18, color:s.color }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:'#111827', margin:0 }}>{s.label}</p>
                    <p style={{ fontSize:11, color:'#9ca3af', margin:0 }}>{s.desc}</p>
                  </div>
                  {sel&&<Check style={{ width:16, height:16, color:s.color, flexShrink:0 }}/>}
                </button>
              );
            })}
          </div>
          <button onClick={()=>setSelectedSites(SITES.map(s=>s.id))} style={{ marginTop:10, fontSize:12, color:A, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
            Selecionar todas as 4
          </button>
        </div>

        {/* Step 3: Duration */}
        <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:20, padding:'24px', marginBottom:14 }}>
          <p style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:24, height:24, borderRadius:'50%', background:A, color:'#fff', fontSize:12, fontWeight:800, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>3</span>
            Duração
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {(['daily','weekly','monthly'] as const).map(d=>{
              const active=duration===d;
              return (
                <button key={d} onClick={()=>setDuration(d)}
                  style={{ padding:'14px', borderRadius:14, border:`${active?'1.5':'0.5'}px solid ${active?A:'rgba(255,255,255,0.08)'}`, background:active?`${A}10`:'rgba(255,255,255,0.02)', cursor:'pointer', fontFamily:'inherit', textAlign:'center', transition:'all 0.2s' }}>
                  <p style={{ fontSize:14, fontWeight:700, color:'#111827', margin:'0 0 4px', textTransform:'capitalize' }}>{d==='daily'?'Diário':d==='weekly'?'Semanal':'Mensal'}</p>
                  <p style={{ fontSize:20, fontWeight:800, color:active?A:'#f8fafc', margin:0 }}>${placement[d] * Math.max(selectedSites.length,1)}</p>
                  <p style={{ fontSize:11, color:'#9ca3af', margin:0 }}>{selectedSites.length>1?`${selectedSites.length} plataformas`:'1 plataforma'}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Creative */}
        <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:20, padding:'24px', marginBottom:14 }}>
          <p style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:24, height:24, borderRadius:'50%', background:A, color:'#fff', fontSize:12, fontWeight:800, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>4</span>
            Criativo
          </p>
          {[
            { k:'title',    label:'Título *',      placeholder:'Nome da empresa ou produto' },
            { k:'description',label:'Descrição',   placeholder:'O que você oferece (opcional)' },
            { k:'link',     label:'URL de destino *', placeholder:'https://suaempresa.com' },
            { k:'imageUrl', label:'URL do banner', placeholder:'https://... (728×90px recomendado)' },
          ].map(f=>(
            <div key={f.k} style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#6b7280', marginBottom:6 }}>{f.label}</label>
              <input value={(form as any)[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.placeholder}
                style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'0.5px solid rgba(255,255,255,0.12)', background:'white', color:'#111827', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
            </div>
          ))}
          <div style={{ padding:'10px 14px', borderRadius:12, background:'rgba(59,130,246,0.08)', border:'0.5px solid rgba(59,130,246,0.2)', fontSize:12, color:'rgba(147,197,253,0.8)' }}>
            📐 Leaderboard & mini-site: 728×90px · Sidebar: 300×250px · Ticker: logo 40×40 + texto
          </div>
        </div>

        {/* Summary + Pay */}
        <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:16 }}>
            {[
              {l:'Formato', v:`${placement.name} (${placement.size})`},
              {l:'Plataformas', v:selectedSites.join(', ')||'—'},
              {l:'Duração', v:duration==='daily'?'Diário':duration==='weekly'?'Semanal':'Mensal'},
            ].map(r=>(
              <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #e5e7eb', fontSize:13 }}>
                <span style={{ color:'#6b7280' }}>{r.l}</span>
                <span style={{ color:'#111827', fontWeight:500 }}>{r.v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, marginTop:4 }}>
              <span style={{ fontSize:15, fontWeight:700, color:'#111827' }}>Total</span>
              <span style={{ fontSize:28, fontWeight:800, color:A }}>${total} USDC</span>
            </div>
          </div>
          {error&&<div style={{ padding:'10px 14px', borderRadius:12, background:'rgba(239,68,68,0.08)', border:'0.5px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:12, marginBottom:14 }}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading||!form.title||!form.link||!selectedSites.length}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'14px', borderRadius:14, border:'none', background:(!form.title||!form.link||!selectedSites.length)?'rgba(255,255,255,0.08)':A, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', opacity:(!form.title||!form.link||!selectedSites.length)?0.4:1, fontFamily:'inherit', transition:'all 0.2s' }}>
            {loading?<Loader2 style={{ width:18, height:18, animation:'spin 1s linear infinite' }}/>:<Megaphone style={{ width:18, height:18 }}/>}
            {loading?'Enviando...`':`Enviar campanha · $${total} USDC`}
            {!loading&&<ArrowRight style={{ width:16, height:16 }}/>}
          </button>
          <p style={{ textAlign:'center', fontSize:11, color:'#9ca3af', marginTop:10 }}>
            Pague via Polygon USDC · Revisado em 24h · Cancelamento antes da revisão = reembolso total
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
