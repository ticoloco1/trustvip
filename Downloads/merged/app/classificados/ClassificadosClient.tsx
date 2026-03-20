'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Hash, Car, Home, Package, Tag, MapPin, DollarSign, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const A = '#8b5cf6';

const CATS = [
  { id:'all',      label:'Todos',    icon:Tag,      color:A },
  { id:'carros',   label:'Carros',   icon:Car,      color:'#f59e0b' },
  { id:'imoveis',  label:'Imóveis',  icon:Home,     color:'#10b981' },
  { id:'produtos', label:'Produtos', icon:Package,  color:'#06b6d4' },
  { id:'servicos', label:'Serviços', icon:Tag,      color:'#ec4899' },
];

function WCard({ children, delay=0, style }: any) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background:'white', border:'0.5px solid rgba(255,255,255,0.09)',
      borderRadius:18, backdropFilter:'none', WebkitBackdropFilter:'none',
      overflow:'hidden', opacity:v?1:0,
      transform:v?'translateY(0) scale(1)':'translateY(18px) scale(0.97)',
      transition:`opacity 0.4s ease ${delay}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
      cursor:'pointer', ...style
    }}>
      {children}
    </div>
  );
}

export default function ClassificadosClient() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');

  useEffect(() => {
    let q = supabase.from('classified_listings').select('*').eq('status','active');
    if (cat !== 'all') q = q.eq('category', cat);
    q.order('created_at', { ascending:false }).limit(60)
      .then(({ data }) => { setItems(data||[]); setLoading(false); });
  }, [cat]);

  const filtered = items.filter(c =>
    !search.trim() ||
    (c.title||'').toLowerCase().includes(search.toLowerCase()) ||
    (c.description||'').toLowerCase().includes(search.toLowerCase())
  );

  const CatIcon = CATS.find(c=>c.id===cat)?.icon || Tag;
  const catColor = CATS.find(c=>c.id===cat)?.color || A;

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', color:'#111827', fontFamily:"-apple-system,'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ position:'fixed', top:-200, left:'50%', transform:'translateX(-50%)', width:600, height:600, borderRadius:'50%', background:`${A}08`, filter:'blur(120px)', pointerEvents:'none', zIndex:0 }}/>

      {/* Nav */}
      <nav style={{ position:'sticky', top:0, zIndex:50, padding:'12px 24px', borderBottom:'1px solid #e5e7eb', background:'rgba(255,255,255,0.95)', backdropFilter:'none', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <Hash style={{ width:18, height:18, color:A }}/><span style={{ fontSize:16, fontWeight:800, color:A }}>jobinlink</span>
        </a>
        <div style={{ display:'flex', gap:10 }}>
          {user && (
            <Link href="/classificados/novo" style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:12, background:A, color:'#fff', fontSize:13, fontWeight:600, textDecoration:'none' }}>
              <Plus style={{ width:14, height:14 }}/> Novo anúncio
            </Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'28px 20px', position:'relative', zIndex:1 }}>

        {/* Header */}
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#111827', marginBottom:6 }}>Classificados</h1>
          <p style={{ fontSize:14, color:'#9ca3af' }}>Carros · Imóveis · Produtos · Serviços</p>
        </div>

        {/* Search */}
        <div style={{ position:'relative', marginBottom:20 }}>
          <Search style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'rgba(141,92,246,0.6)' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por título, descrição..."
            style={{ width:'100%', padding:'12px 14px 12px 40px', borderRadius:14, border:'0.5px solid rgba(255,255,255,0.12)', background:'white', color:'#111827', fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
        </div>

        {/* Category filter */}
        <div style={{ display:'flex', gap:8, overflowX:'auto', marginBottom:24, paddingBottom:4 }}>
          {CATS.map(c => {
            const Icon = c.icon;
            const active = cat===c.id;
            return (
              <button key={c.id} onClick={()=>setCat(c.id)}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:12, border:`0.5px solid ${active?c.color+'50':'rgba(255,255,255,0.08)'}`, background:active?`${c.color}12`:'rgba(255,255,255,0.03)', color:active?c.color:'#6b7280', fontSize:13, fontWeight:active?600:400, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', transition:'all 0.2s' }}>
                <Icon style={{ width:14, height:14 }}/> {c.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
            <Loader2 style={{ width:32, height:32, color:A, animation:'spin 1s linear infinite' }}/>
          </div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <CatIcon style={{ width:48, height:48, color:`${catColor}40`, margin:'0 auto 16px', display:'block' }}/>
            <p style={{ fontSize:16, fontWeight:600, color:'#6b7280' }}>{search?'Nenhum resultado para sua busca':'Nenhum anúncio disponível'}</p>
            {!search && user && (
              <Link href="/classificados/novo" style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:16, padding:'10px 20px', borderRadius:12, background:A, color:'#fff', fontSize:13, fontWeight:600, textDecoration:'none' }}>
                <Plus style={{ width:14, height:14 }}/> Criar primeiro anúncio
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {filtered.map((item,i) => {
              const img = (item.image_urls&&item.image_urls[0])||item.image_url||null;
              const price = item.price!=null ? Number(item.price) : null;
              const catCfg = CATS.find(c=>c.id===item.category)||CATS[0];
              const CIcon = catCfg.icon;
              return (
                <Link key={item.id} href={`/classificados/${item.id}`} style={{ textDecoration:'none' }}>
                  <WCard delay={i*30}>
                    {/* Image */}
                    <div style={{ height:180, background:'white', position:'relative', overflow:'hidden' }}>
                      {img ? (
                        <img src={img} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      ) : (
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
                          <CIcon style={{ width:40, height:40, color:`${catCfg.color}40` }}/>
                        </div>
                      )}
                      <div style={{ position:'absolute', top:10, left:10 }}>
                        <span style={{ fontSize:10, padding:'3px 10px', borderRadius:20, background:`${catCfg.color}cc`, color:'#fff', fontWeight:700 }}>
                          {catCfg.label}
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ padding:'14px 16px' }}>
                      <p style={{ fontSize:14, fontWeight:600, color:'#111827', marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</p>
                      {price!==null && (
                        <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:6 }}>
                          <DollarSign style={{ width:14, height:14, color:'#10b981' }}/>
                          <span style={{ fontSize:16, fontWeight:800, color:'#10b981' }}>{price.toLocaleString('pt-BR',{style:'currency',currency:item.currency||'BRL'})}</span>
                        </div>
                      )}
                      {(item.cidade||item.estado) && (
                        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                          <MapPin style={{ width:12, height:12, color:'#9ca3af' }}/>
                          <span style={{ fontSize:12, color:'#9ca3af' }}>{[item.cidade,item.estado].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </WCard>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
