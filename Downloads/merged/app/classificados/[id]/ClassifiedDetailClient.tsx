'use client';
import { useState, useEffect } from 'react';
import { Hash, MapPin, DollarSign, Phone, Mail, MessageCircle, ChevronLeft, Car, Home, Package, Tag, Share2, Check } from 'lucide-react';
import Link from 'next/link';

const A = '#8b5cf6';
const CATS: any = { carros:{l:'Carros',i:Car,c:'#f59e0b'}, imoveis:{l:'Imóveis',i:Home,c:'#10b981'}, produtos:{l:'Produtos',i:Package,c:'#06b6d4'}, servicos:{l:'Serviços',i:Tag,c:'#ec4899'} };

export default function ClassifiedDetailClient({ classified:c }: { classified:any }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(()=>setV(true),50); }, []);

  const imgs = (c.image_urls&&c.image_urls.length>0) ? c.image_urls : (c.image_url?[c.image_url]:[]);
  const cat = CATS[c.category] || { l:c.category||'Anúncio', i:Tag, c:A };
  const price = c.price!=null ? Number(c.price) : null;

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', color:'#111827', fontFamily:"-apple-system,'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ position:'fixed', top:-150, left:'50%', transform:'translateX(-50%)', width:600, height:600, borderRadius:'50%', background:`${A}07`, filter:'blur(100px)', pointerEvents:'none', zIndex:0 }}/>

      <nav style={{ position:'sticky', top:0, zIndex:50, padding:'12px 24px', borderBottom:'1px solid #e5e7eb', background:'rgba(255,255,255,0.95)', backdropFilter:'none', display:'flex', alignItems:'center', gap:12 }}>
        <Link href="/classificados" style={{ display:'flex', alignItems:'center', gap:6, color:'#6b7280', textDecoration:'none', fontSize:13 }}>
          <ChevronLeft style={{ width:16, height:16 }}/> Classificados
        </Link>
        <span style={{ color:'rgba(255,255,255,0.15)' }}>·</span>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none' }}>
          <Hash style={{ width:16, height:16, color:A }}/><span style={{ fontSize:14, fontWeight:700, color:A }}>jobinlink</span>
        </a>
      </nav>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'28px 20px', position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, opacity:v?1:0, transform:v?'translateY(0)':'translateY(16px)', transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>

          {/* Images */}
          <div>
            <div style={{ borderRadius:18, overflow:'hidden', background:'white', border:'0.5px solid rgba(255,255,255,0.09)', aspectRatio:'16/10', marginBottom:10 }}>
              {imgs.length>0
                ? <img src={imgs[imgIdx]} alt={c.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}><cat.i style={{ width:60, height:60, color:`${cat.c}40` }}/></div>
              }
            </div>
            {imgs.length>1&&(
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {imgs.map((img:string,i:number)=>(
                  <button key={i} onClick={()=>setImgIdx(i)}
                    style={{ width:60, height:40, borderRadius:8, overflow:'hidden', border:`2px solid ${imgIdx===i?A:'rgba(255,255,255,0.1)'}`, cursor:'pointer', padding:0, background:'none' }}>
                    <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:`${cat.c}18`, color:cat.c, border:`0.5px solid ${cat.c}30`, fontWeight:600 }}>{cat.l}</span>
              <button onClick={share} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#9ca3af', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                {copied?<><Check style={{ width:12, height:12 }}/> Copiado!</>:<><Share2 style={{ width:12, height:12 }}/> Compartilhar</>}
              </button>
            </div>

            <h1 style={{ fontSize:22, fontWeight:800, color:'#111827', marginBottom:12, lineHeight:1.2 }}>{c.title}</h1>

            {price!==null&&(
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <DollarSign style={{ width:20, height:20, color:'#10b981' }}/>
                <span style={{ fontSize:28, fontWeight:800, color:'#10b981' }}>{price.toLocaleString('pt-BR',{style:'currency',currency:c.currency||'BRL'})}</span>
              </div>
            )}

            {(c.cidade||c.estado)&&(
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14, fontSize:13, color:'#6b7280' }}>
                <MapPin style={{ width:14, height:14 }}/>{[c.cidade,c.estado,c.pais].filter(Boolean).join(', ')}
              </div>
            )}

            {c.description&&(
              <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:14, padding:'14px 16px', marginBottom:16 }}>
                <p style={{ fontSize:13, lineHeight:1.65, color:'rgba(241,245,249,0.7)', whiteSpace:'pre-wrap', margin:0 }}>{c.description}</p>
              </div>
            )}

            {/* Contact */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {c.contact_whatsapp&&(
                <a href={`https://wa.me/${c.contact_whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', borderRadius:14, background:'#25d366', color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none' }}>
                  <MessageCircle style={{ width:18, height:18 }}/> WhatsApp
                </a>
              )}
              {c.contact_phone&&(
                <a href={`tel:${c.contact_phone}`}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', borderRadius:14, border:'0.5px solid rgba(255,255,255,0.12)', background:'white', color:'rgba(241,245,249,0.7)', fontSize:13, textDecoration:'none' }}>
                  <Phone style={{ width:16, height:16 }}/> {c.contact_phone}
                </a>
              )}
              {c.contact_email&&(
                <a href={`mailto:${c.contact_email}`}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', borderRadius:14, border:'0.5px solid rgba(255,255,255,0.12)', background:'white', color:'rgba(241,245,249,0.7)', fontSize:13, textDecoration:'none' }}>
                  <Mail style={{ width:16, height:16 }}/> {c.contact_email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
