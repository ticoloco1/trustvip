'use client';
import { useState } from 'react';
import { Hash, ChevronLeft, Plus, Loader2, Check, Car, Home, Package, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const A = '#8b5cf6';
const CATS = [
  { id:'carros',   label:'Carros',    icon:Car,     color:'#f59e0b' },
  { id:'imoveis',  label:'Imóveis',   icon:Home,    color:'#10b981' },
  { id:'produtos', label:'Produtos',  icon:Package, color:'#06b6d4' },
  { id:'servicos', label:'Serviços',  icon:Tag,     color:'#ec4899' },
  { id:'outros',   label:'Outros',    icon:Tag,     color:A },
];

function GInput({ label, value, onChange, placeholder, type='text', required=false }: any) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#6b7280', marginBottom:6 }}>{label}{required&&<span style={{ color:'#ef4444' }}> *</span>}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required}
        style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'0.5px solid rgba(255,255,255,0.12)', background:'white', color:'#111827', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as any }}/>
    </div>
  );
}

export default function ClassificadoNovo() {
  const { user } = useAuth();
  const router = useRouter();
  const [cat, setCat] = useState('produtos');
  const [form, setForm] = useState({ title:'', description:'', price:'', currency:'BRL', cidade:'', estado:'', contact_phone:'', contact_whatsapp:'', contact_email:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k:string) => (v:string) => setForm(p=>({...p,[k]:v}));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Título é obrigatório'); return; }
    if (!user) { router.push('/login'); return; }
    setLoading(true); setError('');
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const siteRes = await supabase.from('mini_sites').select('id').eq('user_id',userId!).maybeSingle();
      const { data, error:e } = await supabase.from('classified_listings').insert({
        user_id:userId!, site_id:siteRes.data?.id||null,
        title:form.title, description:form.description||null,
        category:cat, price:parseFloat(form.price)||null,
        currency:form.currency, cidade:form.cidade||null, estado:form.estado||null,
        contact_phone:form.contact_phone||null, contact_whatsapp:form.contact_whatsapp||null,
        contact_email:form.contact_email||null, status:'active',
      } as any).select('id').single();
      if (e) throw e;
      router.push(`/classificados/${data.id}`);
    } catch(e:any) { setError(e.message||'Erro ao criar anúncio'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', color:'#111827', fontFamily:"-apple-system,'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ position:'fixed', top:-150, left:'50%', transform:'translateX(-50%)', width:600, height:600, borderRadius:'50%', background:`${A}07`, filter:'blur(100px)', pointerEvents:'none', zIndex:0 }}/>

      <nav style={{ position:'sticky', top:0, zIndex:50, padding:'12px 24px', borderBottom:'1px solid #e5e7eb', background:'rgba(255,255,255,0.95)', backdropFilter:'none', display:'flex', alignItems:'center', gap:12 }}>
        <Link href="/classificados" style={{ display:'flex', alignItems:'center', gap:6, color:'#6b7280', textDecoration:'none', fontSize:13 }}>
          <ChevronLeft style={{ width:16, height:16 }}/> Classificados
        </Link>
        <span style={{ color:'rgba(255,255,255,0.15)' }}>·</span>
        <span style={{ fontSize:13, color:'rgba(241,245,249,0.7)' }}>Novo anúncio</span>
      </nav>

      <div style={{ maxWidth:560, margin:'0 auto', padding:'28px 20px', position:'relative', zIndex:1 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'#111827', marginBottom:24 }}>Criar anúncio</h1>

        {/* Category */}
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:12, fontWeight:500, color:'#6b7280', marginBottom:10 }}>Categoria *</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {CATS.map(c=>{
              const Icon=c.icon; const active=cat===c.id;
              return (
                <button key={c.id} onClick={()=>setCat(c.id)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:12, border:`0.5px solid ${active?c.color+'50':'rgba(255,255,255,0.08)'}`, background:active?`${c.color}12`:'rgba(255,255,255,0.03)', color:active?c.color:'#6b7280', fontSize:13, fontWeight:active?600:400, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
                  <Icon style={{ width:14, height:14 }}/>{c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:20, padding:24, marginBottom:14 }}>
          <p style={{ fontSize:13, fontWeight:600, color:'rgba(241,245,249,0.6)', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.06em', fontSize:11 }}>Informações do anúncio</p>
          <GInput label="Título" value={form.title} onChange={set('title')} placeholder="Ex: iPhone 13 Pro Max 256GB" required/>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#6b7280', marginBottom:6 }}>Descrição</label>
            <textarea value={form.description} onChange={e=>set('description')(e.target.value)} placeholder="Descreva seu anúncio..." rows={4}
              style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'0.5px solid rgba(255,255,255,0.12)', background:'white', color:'#111827', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as any, resize:'vertical' }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12 }}>
            <GInput label="Preço" value={form.price} onChange={set('price')} placeholder="1500.00" type="number"/>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#6b7280', marginBottom:6 }}>Moeda</label>
              <select value={form.currency} onChange={e=>set('currency')(e.target.value)}
                style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'0.5px solid rgba(255,255,255,0.12)', background:'rgba(20,20,30,1)', color:'#111827', fontSize:13, fontFamily:'inherit', outline:'none' }}>
                <option value="BRL">BRL</option><option value="USD">USD</option><option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:20, padding:24, marginBottom:14 }}>
          <p style={{ fontSize:11, fontWeight:600, color:'#6b7280', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.06em' }}>Localização</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <GInput label="Cidade" value={form.cidade} onChange={set('cidade')} placeholder="São Paulo"/>
            <GInput label="Estado" value={form.estado} onChange={set('estado')} placeholder="SP"/>
          </div>
        </div>

        <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:20, padding:24, marginBottom:20 }}>
          <p style={{ fontSize:11, fontWeight:600, color:'#6b7280', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.06em' }}>Contato</p>
          <GInput label="WhatsApp" value={form.contact_whatsapp} onChange={set('contact_whatsapp')} placeholder="+55 11 99999-9999" type="tel"/>
          <GInput label="Telefone" value={form.contact_phone} onChange={set('contact_phone')} placeholder="+55 11 99999-9999" type="tel"/>
          <GInput label="Email" value={form.contact_email} onChange={set('contact_email')} placeholder="seu@email.com" type="email"/>
        </div>

        {error&&<div style={{ padding:'10px 14px', borderRadius:12, background:'rgba(239,68,68,0.08)', border:'0.5px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:12, marginBottom:14 }}>{error}</div>}

        {!user&&<div style={{ padding:'10px 14px', borderRadius:12, background:`${A}10`, border:`0.5px solid ${A}25`, color:A, fontSize:12, marginBottom:14 }}>Faça login para publicar. <Link href="/login" style={{ fontWeight:700, color:A }}>Entrar →</Link></div>}

        <button onClick={handleSubmit} disabled={loading||!form.title.trim()}
          style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'14px', borderRadius:14, border:'none', background:!form.title.trim()?'rgba(255,255,255,0.08)':A, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', opacity:!form.title.trim()?0.4:1, fontFamily:'inherit', transition:'all 0.2s' }}>
          {loading?<Loader2 style={{ width:18, height:18, animation:'spin 1s linear infinite' }}/>:<Plus style={{ width:18, height:18 }}/>}
          {loading?'Publicando...':'Publicar anúncio'}
        </button>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
