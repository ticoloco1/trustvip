'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Hash, Home, User, Palette, Layout, FileText, DollarSign,
  Wallet, Settings, Video, Eye, X, Check, Loader2, Save, Camera,
  Copy, Lock, Unlock, Plus, Trash2, Link2, Youtube, ChevronDown,
  Briefcase, Pin, TrendingUp, Coins, Globe, Phone, Mail, Linkedin,
  LayoutGrid, Columns2, Columns3, BadgeCheck, Award, Image, MapPin,
  Building, Tag, Layers, Star, Zap, RefreshCw, ExternalLink, AlertCircle,
  ChevronRight, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useSiteVideos, useSiteLinks, useFeedPosts } from '@/hooks/useMiniSite';

const A = '#6d28d9'; // accent
const A2 = '#7c3aed';

// ── Helpers ────────────────────────────────────────────────────
const Input = ({ label, value, onChange, placeholder, type='text', textarea=false, hint='' }: any) => (
  <div style={{ marginBottom: 18 }}>
    {label && <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#374151', marginBottom:7, letterSpacing:'0.01em' }}>{label}</label>}
    {textarea
      ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={4}
          style={{ width:'100%', padding:'13px 15px', borderRadius:12, border:'1.5px solid #e5e7eb', background:'white', fontSize:15, color:'#111827', fontFamily:'inherit', outline:'none', resize:'vertical', boxSizing:'border-box' as const, lineHeight:1.5 }}
          onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
      : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{ width:'100%', padding:'13px 15px', borderRadius:12, border:'1.5px solid #e5e7eb', background:'white', fontSize:15, color:'#111827', fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }}
          onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>}
    {hint && <p style={{ fontSize:12, color:'#9ca3af', marginTop:5 }}>{hint}</p>}
  </div>
);

const Card = ({ children, style, accent }: any) => (
  <div style={{ background:'white', border:`1px solid ${accent ? accent+'30' : '#e5e7eb'}`, borderRadius:16, padding:24, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', ...style }}>
    {children}
  </div>
);

const STitle = ({ icon:Icon, title, sub, color=A }: any) => (
  <div style={{ marginBottom:20 }}>
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
      <div style={{ width:32, height:32, borderRadius:9, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon style={{ width:16, height:16, color }}/>
      </div>
      <h2 style={{ fontSize:16, fontWeight:800, color:'#111827', letterSpacing:'-0.01em' }}>{title}</h2>
    </div>
    {sub && <p style={{ fontSize:13, color:'#6b7280', marginLeft:40 }}>{sub}</p>}
  </div>
);

const Toggle = ({ value, onChange, label, sub }: any) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0' }}>
    <div>
      <p style={{ fontSize:14, fontWeight:600, color:'#111827', margin:0 }}>{label}</p>
      {sub && <p style={{ fontSize:12, color:'#9ca3af', margin:0 }}>{sub}</p>}
    </div>
    <button onClick={()=>onChange(!value)}
      style={{ width:48, height:26, borderRadius:13, border:'none', background:value?A:'#e5e7eb', position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:3, left:value?24:3, width:20, height:20, borderRadius:'50%', background:'white', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
    </button>
  </div>
);

const BG_THEMES = [
  { id:'white',       label:'White',      bg:'#ffffff', text:'dark' },
  { id:'light-gray',  label:'Silver',     bg:'#f1f5f9', text:'dark' },
  { id:'beige',       label:'Cream',      bg:'#faf7f2', text:'dark' },
  { id:'pastel-blue', label:'Sky',        bg:'#f0f9ff', text:'dark' },
  { id:'pastel-pink', label:'Rose',       bg:'#fdf2f8', text:'dark' },
  { id:'pastel-lav',  label:'Lavender',   bg:'#f5f3ff', text:'dark' },
  { id:'dark',        label:'Dark',       bg:'#0a0a0f', text:'light' },
  { id:'midnight',    label:'Midnight',   bg:'#050508', text:'light' },
  { id:'glass',       label:'Glass',      bg:'linear-gradient(135deg,#1e1b4b,#312e81)', text:'light' },
];

const GRADIENTS = [
  { id:'cosmic',   label:'Cosmic',   colors:'linear-gradient(135deg,#4c1d95,#7c3aed)' },
  { id:'ocean',    label:'Ocean',    colors:'linear-gradient(135deg,#0c4a6e,#06b6d4)' },
  { id:'forest',   label:'Forest',   colors:'linear-gradient(135deg,#14532d,#10b981)' },
  { id:'sunset',   label:'Sunset',   colors:'linear-gradient(135deg,#7c2d12,#f59e0b)' },
  { id:'rose',     label:'Rose',     colors:'linear-gradient(135deg,#831843,#f43f5e)' },
  { id:'midnight', label:'Night',    colors:'linear-gradient(135deg,#0f172a,#334155)' },
];

const ACCENT_COLORS = [
  '#6d28d9','#8b5cf6','#ec4899','#ef4444',
  '#f59e0b','#10b981','#06b6d4','#3b82f6',
  '#14b8a6','#f97316','#84cc16','#6366f1',
];

const FONT_OPTIONS = [
  { id:'plus-jakarta', label:'Plus Jakarta', sample:'Professional' },
  { id:'inter',        label:'Inter',        sample:'Modern' },
  { id:'poppins',      label:'Poppins',      sample:'Friendly' },
  { id:'playfair',     label:'Playfair',     sample:'Elegant' },
  { id:'mono',         label:'Monospace',    sample:'Technical' },
];

const NAV = [
  { id:'overview',    label:'Overview',      icon:Home },
  { id:'profile',     label:'Profile',       icon:User },
  { id:'appearance',  label:'Appearance',    icon:Palette },
  { id:'links',       label:'Links',         icon:Link2 },
  { id:'videos',      label:'Videos',        icon:Video },
  { id:'feed',        label:'Feed',          icon:FileText },
  { id:'cv',          label:'CV & Contact',  icon:Briefcase },
  { id:'photos',      label:'Photos',        icon:Image },
  { id:'classifieds', label:'Classifieds',   icon:Tag },
  { id:'monetize',    label:'Monetize',      icon:DollarSign },
  { id:'settings',    label:'Settings',      icon:Settings },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { profile, loading, update, uploadPhoto } = useProfile(user);
  const { videos, addVideo, deleteVideo } = useSiteVideos(profile?.id);
  const { links, addLink, deleteLink } = useSiteLinks(profile?.id);
  const { posts, addPost } = useFeedPosts(profile?.id);

  const [section, setSection] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(''), 3000); };

  // Profile fields
  const [siteName,  setSiteName]  = useState('');
  const [slug,      setSlug]      = useState('');
  const [tagline,   setTagline]   = useState('');
  const [bio,       setBio]       = useState('');
  const [published, setPublished] = useState(false);

  // Appearance
  const [accent,  setAccent]  = useState(A);
  const [bgStyle, setBgStyle] = useState('white');
  const [gradient,setGradient]= useState('cosmic');
  const [cols,    setCols]    = useState(2);
  const [fontId,  setFontId]  = useState('plus-jakarta');
  const [fontSize,setFontSize]= useState('md');

  // CV
  const [showCv,      setShowCv]      = useState(false);
  const [cvHeadline,  setCvHeadline]  = useState('');
  const [cvLocation,  setCvLocation]  = useState('');
  const [cvSkills,    setCvSkills]    = useState('');
  const [cvSummary,   setCvSummary]   = useState('');
  const [contactEmail,setContactEmail]= useState('');
  const [contactPhone,setContactPhone]= useState('');
  const [contactPrice,setContactPrice]= useState('20');

  // Links
  const [linkTitle,  setLinkTitle]  = useState('');
  const [linkUrl,    setLinkUrl]    = useState('');
  const [linkLocked, setLinkLocked] = useState(false);
  const [linkPrice,  setLinkPrice]  = useState('');

  // Videos
  const [ytUrl,       setYtUrl]       = useState('');
  const [vidTitle,    setVidTitle]    = useState('');
  const [vidPaywall,  setVidPaywall]  = useState(false);
  const [vidPrice,    setVidPrice]    = useState('5');

  // Feed
  const [feedText, setFeedText] = useState('');
  const [feedPin,  setFeedPin]  = useState(false);

  const photoRef  = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    setSiteName(profile.site_name || '');
    setSlug(profile.slug || '');
    setTagline((profile as any).tagline || '');
    setBio(profile.bio || '');
    setPublished(profile.published || false);
    setAccent((profile as any).accent_color || A);
    setBgStyle((profile as any).bg_style || 'white');
    setGradient((profile as any).gradient || 'cosmic');
    setCols((profile as any).columns || 2);
    setShowCv(profile.show_cv || false);
    setCvHeadline((profile as any).cv_headline || '');
    setCvLocation((profile as any).cv_location || '');
    setCvSkills((profile as any).cv_skills || '');
    setCvSummary((profile as any).cv_summary || '');
    setContactEmail((profile as any).contact_email || '');
    setContactPhone((profile as any).contact_phone || '');
    setContactPrice(String((profile as any).contact_price || 20));
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    await update({
      site_name: siteName, slug, bio, tagline,
      accent_color: accent, bg_style: bgStyle, gradient, columns: cols,
      show_cv: showCv, published,
      cv_headline: cvHeadline, cv_location: cvLocation,
      cv_skills: cvSkills, cv_summary: cvSummary,
      contact_email: contactEmail, contact_phone: contactPhone,
      contact_price: parseFloat(contactPrice) || 20,
    } as any);
    setSaving(false);
    showToast('✓ Saved!');
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar'|'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast('Uploading...');
    const url = await uploadPhoto(file, type);
    if (url) showToast('✓ Photo updated!');
    else showToast('Upload failed. Check Storage buckets in Supabase.');
    e.target.value = '';
  };

  const handleAddLink = async () => {
    if (!linkTitle || !linkUrl) return;
    await addLink({ title:linkTitle, url:linkUrl, locked:linkLocked, lock_price:parseFloat(linkPrice)||0, type:'link' });
    setLinkTitle(''); setLinkUrl(''); setLinkLocked(false); setLinkPrice('');
    showToast('✓ Link added!');
  };

  const handleAddVideo = async () => {
    if (!ytUrl || !vidTitle) return;
    const match = ytUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const ytId = match?.[1] || ytUrl;
    await addVideo({ title:vidTitle, youtube_id:ytId, paywall_enabled:vidPaywall, paywall_price:parseFloat(vidPrice)||0, sort_order:videos.length });
    setYtUrl(''); setVidTitle(''); setVidPaywall(false); setVidPrice('5');
    showToast('✓ Video added!');
  };

  const handleAddPost = async () => {
    if (!feedText.trim()) return;
    await addPost({ text:feedText, pinned:feedPin, images:[] });
    setFeedText(''); setFeedPin(false);
    showToast(feedPin ? '✓ Pinned post published!' : '✓ Post published!');
  };

  const profileUrl = profile?.slug ? `https://jobinlink.com/@${profile.slug}` : '';
  const initials = (profile?.site_name || user?.email || 'U').charAt(0).toUpperCase();

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Loader2 style={{ width:36, height:36, color:A, animation:'spin 1s linear infinite' }}/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) { if (typeof window !== 'undefined') window.location.href = '/login'; return null; }

  const saveBtn = (
    <button onClick={handleSave} disabled={saving}
      style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:12, border:'none', background:A, color:'white', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s', opacity:saving?0.7:1 }}>
      {saving ? <Loader2 style={{ width:15, height:15, animation:'spin 1s linear infinite' }}/> : <Save style={{ width:15, height:15 }}/>}
      {saving ? 'Saving...' : 'Save'}
    </button>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", display:'flex' }}>
      {/* ── Toast ── */}
      {toast && (
        <div style={{ position:'fixed', top:20, right:20, zIndex:200, padding:'13px 22px', borderRadius:14, background:toast.includes('fail')||toast.includes('Error')?'#fef2f2':'#f0fdf4', border:`1px solid ${toast.includes('fail')||toast.includes('Error')?'#fca5a5':'#86efac'}`, color:toast.includes('fail')||toast.includes('Error')?'#dc2626':'#15803d', fontSize:14, fontWeight:700, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', animation:'slideDown 0.2s ease' }}>
          {toast}
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside style={{ width:230, flexShrink:0, borderRight:'1px solid #e5e7eb', background:'white', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto' }}>
        {/* Logo */}
        <div style={{ padding:'20px', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:A, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Hash style={{ width:18, height:18, color:'white' }}/>
          </div>
          <span style={{ fontSize:16, fontWeight:800, color:A }}>jobinlink</span>
        </div>

        {/* User card */}
        <div style={{ padding:'16px' }}>
          <div style={{ background:'#f9fafb', border:'1px solid #f3f4f6', borderRadius:14, padding:'14px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ position:'relative', cursor:'pointer' }} onClick={()=>photoRef.current?.click()}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', border:`3px solid ${A}` }}/>
                  : <div style={{ width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg,${A},${A2})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'white' }}>{initials}</div>}
                <div style={{ position:'absolute', bottom:0, right:0, width:18, height:18, borderRadius:'50%', background:A, border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Camera style={{ width:9, height:9, color:'white' }}/>
                </div>
                <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>handlePhoto(e,'avatar')}/>
              </div>
              <div style={{ minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', margin:0 }}>{profile?.site_name || user?.email?.split('@')[0]}</p>
                <p style={{ fontSize:11, color:A, fontFamily:'monospace', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>/{profile?.slug || '...'}</p>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:11, fontWeight:600, color:published?'#059669':'#d97706', background:published?'#f0fdf4':'#fffbeb', padding:'3px 8px', borderRadius:20, border:`1px solid ${published?'#86efac':'#fcd34d'}` }}>
                {published ? '🟢 Live' : '🟡 Draft'}
              </span>
              {profileUrl && (
                <a href={profileUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:11, color:A, textDecoration:'none', display:'flex', alignItems:'center', gap:3, fontWeight:600 }}>
                  <Eye style={{ width:11, height:11 }}/> View
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'4px 10px', overflowY:'auto' }}>
          {NAV.map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button key={item.id} onClick={()=>setSection(item.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, border:'none', cursor:'pointer', fontSize:14, fontWeight:active?700:500, color:active?A:'#6b7280', background:active?`${A}10`:'transparent', marginBottom:2, textAlign:'left', transition:'all 0.15s', fontFamily:'inherit' }}>
                <Icon style={{ width:16, height:16, flexShrink:0 }}/>
                {item.label}
                {active && <ChevronRight style={{ width:13, height:13, marginLeft:'auto', color:A }}/>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:'12px 16px', borderTop:'1px solid #f3f4f6', display:'flex', flexDirection:'column', gap:8 }}>
          {profileUrl && (
            <button onClick={()=>{ navigator.clipboard.writeText(profileUrl); showToast('✓ Link copied!'); }}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 12px', borderRadius:10, border:'1px solid #e5e7eb', background:'white', color:'#6b7280', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              <Copy style={{ width:13, height:13 }}/> Copy link
            </button>
          )}
          <button onClick={()=>signOut()}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 12px', borderRadius:10, border:'1px solid #fca5a5', background:'#fef2f2', color:'#ef4444', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            <X style={{ width:13, height:13 }}/> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex:1, minWidth:0, overflowY:'auto' }}>
        {/* Header */}
        <div style={{ position:'sticky', top:0, zIndex:10, padding:'16px 32px', borderBottom:'1px solid #e5e7eb', background:'rgba(255,255,255,0.97)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h1 style={{ fontSize:16, fontWeight:800, color:'#111827', letterSpacing:'-0.01em' }}>
            {NAV.find(n=>n.id===section)?.label}
          </h1>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            {profileUrl && (
              <a href={profileUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:11, border:'1px solid #e5e7eb', background:'white', color:'#374151', fontSize:13, fontWeight:600, textDecoration:'none', transition:'all 0.15s' }}>
                <ExternalLink style={{ width:13, height:13 }}/> Preview
              </a>
            )}
            {['profile','appearance','cv'].includes(section) && saveBtn}
          </div>
        </div>

        <div style={{ padding:'28px 32px', maxWidth:900 }}>

          {/* ════ OVERVIEW ════ */}
          {section === 'overview' && (
            <div>
              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:24 }}>
                {[
                  { l:'Profile views', v:'—', i:TrendingUp, c:'#6d28d9', bg:'#ede9fe' },
                  { l:'USDC earned', v:'$0.00', i:Coins, c:'#059669', bg:'#f0fdf4' },
                  { l:'CV unlocks', v:'0', i:Unlock, c:'#d97706', bg:'#fffbeb' },
                  { l:'Links', v:String(links?.length||0), i:Link2, c:'#0369a1', bg:'#e0f2fe' },
                ].map(s=>(
                  <Card key={s.l} style={{ padding:'18px 20px' }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                      <s.i style={{ width:18, height:18, color:s.c }}/>
                    </div>
                    <p style={{ fontSize:26, fontWeight:800, color:'#111827', margin:0, letterSpacing:'-0.02em' }}>{s.v}</p>
                    <p style={{ fontSize:12, color:'#9ca3af', marginTop:4, fontWeight:500 }}>{s.l}</p>
                  </Card>
                ))}
              </div>

              {/* Mini-site card */}
              <Card style={{ marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <p style={{ fontSize:15, fontWeight:700, color:'#111827', margin:0 }}>Your mini-site</p>
                  <span style={{ fontSize:11, padding:'4px 12px', borderRadius:20, background:published?'#f0fdf4':'#fffbeb', color:published?'#059669':'#d97706', fontWeight:700, border:`1px solid ${published?'#86efac':'#fcd34d'}` }}>
                    {published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" style={{ width:64, height:64, borderRadius:16, objectFit:'cover', border:`3px solid ${A}30` }}/>
                    : <div style={{ width:64, height:64, borderRadius:16, background:`linear-gradient(135deg,${A},${A2})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, color:'white' }}>{initials}</div>}
                  <div>
                    <p style={{ fontSize:16, fontWeight:800, color:'#111827', margin:0 }}>{profile?.site_name || 'Your name'}</p>
                    <p style={{ fontSize:13, color:'#6b7280', margin:'2px 0' }}>{(profile as any)?.tagline || 'Add your tagline'}</p>
                    <p style={{ fontSize:12, fontFamily:'monospace', color:A, margin:0, fontWeight:600 }}>jobinlink.com/@{profile?.slug || '...'}</p>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                  {[
                    { l:'Edit Profile', i:User, s:'profile', c:A },
                    { l:'Appearance', i:Palette, s:'appearance', c:'#0369a1' },
                    { l:'Add Links', i:Link2, s:'links', c:'#059669' },
                    { l:'Add Videos', i:Video, s:'videos', c:'#d97706' },
                  ].map(({l,i:I,s,c})=>(
                    <button key={l} onClick={()=>setSection(s)}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, padding:'14px 8px', borderRadius:14, border:`1px solid ${c}20`, background:`${c}08`, color:c, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
                      <I style={{ width:20, height:20 }}/> {l}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Quick tips */}
              <Card style={{ background:`${A}05`, border:`1px solid ${A}20` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <Sparkles style={{ width:16, height:16, color:A }}/>
                  <p style={{ fontSize:14, fontWeight:700, color:A, margin:0 }}>Quick tips to get started</p>
                </div>
                {[
                  '📸 Add a profile photo — profiles with photos get 5x more views',
                  '🔗 Add at least 3 links to your social profiles and portfolio',
                  '📄 Enable your CV so companies can find and unlock your contact',
                  '🎬 Add a video intro to stand out in the directory',
                  '✅ Publish your mini-site when ready',
                ].map((tip,i)=>(
                  <p key={i} style={{ fontSize:13, color:'#374151', margin:'0 0 6px', padding:'8px 12px', borderRadius:8, background:'white', border:'1px solid #e5e7eb' }}>{tip}</p>
                ))}
              </Card>
            </div>
          )}

          {/* ════ PROFILE ════ */}
          {section === 'profile' && (
            <div>
              {/* Photo upload - LARGE */}
              <Card style={{ marginBottom:20, padding:0, overflow:'hidden' }}>
                {/* Banner */}
                <div style={{ height:160, background:GRADIENTS.find(g=>g.id===gradient)?.colors || GRADIENTS[0].colors, position:'relative', cursor:'pointer', overflow:'hidden' }}
                  onClick={()=>bannerRef.current?.click()}>
                  {(profile as any)?.banner_url && (
                    <img src={(profile as any).banner_url} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
                  )}
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.15)' }}>
                    <div style={{ background:'rgba(255,255,255,0.25)', borderRadius:12, padding:'8px 16px', display:'flex', alignItems:'center', gap:6, color:'white', fontSize:13, fontWeight:700 }}>
                      <Camera style={{ width:15, height:15 }}/> Change banner
                    </div>
                  </div>
                  <input ref={bannerRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>handlePhoto(e,'banner')}/>
                </div>

                {/* Avatar */}
                <div style={{ padding:'0 24px 24px', marginTop:-44 }}>
                  <div style={{ position:'relative', display:'inline-block', cursor:'pointer' }} onClick={()=>photoRef.current?.click()}>
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="" style={{ width:88, height:88, borderRadius:22, objectFit:'cover', border:'4px solid white', boxShadow:'0 4px 16px rgba(0,0,0,0.12)' }}/>
                      : <div style={{ width:88, height:88, borderRadius:22, background:`linear-gradient(135deg,${A},${A2})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:800, color:'white', border:'4px solid white', boxShadow:'0 4px 16px rgba(0,0,0,0.12)' }}>{initials}</div>}
                    <div style={{ position:'absolute', bottom:4, right:4, width:26, height:26, borderRadius:'50%', background:A, border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Camera style={{ width:12, height:12, color:'white' }}/>
                    </div>
                    <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>handlePhoto(e,'avatar')}/>
                  </div>
                  <p style={{ fontSize:12, color:'#9ca3af', marginTop:8 }}>Click to change photo · Max 5MB · JPG, PNG, WebP</p>
                </div>
              </Card>

              <Card>
                <STitle icon={User} title="Profile Information"/>
                <Input label="Display name" value={siteName} onChange={setSiteName} placeholder="Ana Carvalho"/>
                <Input label="URL slug" value={slug} onChange={setSlug} placeholder="anacarvalho"
                  hint={`Your profile: jobinlink.com/@${slug || 'yourname'}`}/>
                <Input label="Tagline" value={tagline} onChange={setTagline} placeholder="Senior Designer · UX Strategy · Speaker"/>
                <Input label="Bio" value={bio} onChange={setBio} placeholder="Tell your story..." textarea/>
                <div style={{ borderTop:'1px solid #f3f4f6', paddingTop:16 }}>
                  <Toggle value={published} onChange={setPublished} label="Published" sub="Visible in directory and search results"/>
                </div>
              </Card>
            </div>
          )}

          {/* ════ APPEARANCE ════ */}
          {section === 'appearance' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Background themes */}
              <Card>
                <STitle icon={Palette} title="Background Theme" sub="Choose how your mini-site looks"/>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))', gap:10 }}>
                  {BG_THEMES.map(b => (
                    <button key={b.id} onClick={()=>setBgStyle(b.id)}
                      style={{ padding:'10px 6px', borderRadius:14, border:`2px solid ${bgStyle===b.id?A:'#e5e7eb'}`, background:bgStyle===b.id?`${A}08`:'white', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:7, transition:'all 0.2s' }}>
                      <div style={{ width:44, height:28, borderRadius:8, background:b.bg, border:'1px solid #e5e7eb', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' }}/>
                      <span style={{ fontSize:11, color:bgStyle===b.id?A:'#6b7280', fontWeight:bgStyle===b.id?700:500 }}>{b.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Banner gradient */}
              <Card>
                <STitle icon={Layers} title="Banner Gradient" sub="Header image on your profile"/>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {GRADIENTS.map(g => (
                    <button key={g.id} onClick={()=>setGradient(g.id)}
                      style={{ height:52, borderRadius:12, border:`3px solid ${gradient===g.id?A:'transparent'}`, background:g.colors, cursor:'pointer', position:'relative', overflow:'hidden', transition:'all 0.2s' }}>
                      <span style={{ position:'absolute', bottom:4, left:8, fontSize:10, color:'white', fontWeight:700, textShadow:'0 1px 2px rgba(0,0,0,0.5)' }}>{g.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Accent color */}
              <Card>
                <STitle icon={Sparkles} title="Accent Color" sub="Buttons, links and highlights"/>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {ACCENT_COLORS.map(c=>(
                    <button key={c} onClick={()=>setAccent(c)}
                      style={{ width:42, height:42, borderRadius:'50%', background:c, border:`3px solid ${accent===c?'#111827':'transparent'}`, cursor:'pointer', transition:'all 0.2s', boxShadow:accent===c?`0 0 0 2px white, 0 0 0 4px ${c}`:undefined }}>
                      {accent===c && <Check style={{ width:16, height:16, color:'white', margin:'auto', display:'block' }}/>}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Layout columns */}
              <Card>
                <STitle icon={Layout} title="Layout" sub="How many columns for your links and content"/>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {[{n:1,i:LayoutGrid,l:'Single'},{n:2,i:Columns2,l:'Double'},{n:3,i:Columns3,l:'Triple'}].map(({n,i:I,l})=>(
                    <button key={n} onClick={()=>setCols(n)}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'18px 0', borderRadius:14, border:`2px solid ${cols===n?A:'#e5e7eb'}`, background:cols===n?`${A}08`:'white', cursor:'pointer', color:cols===n?A:'#6b7280', fontSize:13, fontWeight:cols===n?700:500, fontFamily:'inherit', transition:'all 0.2s' }}>
                      <I style={{ width:22, height:22 }}/> {l}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Font */}
              <Card>
                <STitle icon={FileText} title="Font Style" sub="Typography for your mini-site"/>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {FONT_OPTIONS.map(f=>(
                    <button key={f.id} onClick={()=>setFontId(f.id)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 16px', borderRadius:12, border:`1.5px solid ${fontId===f.id?A:'#e5e7eb'}`, background:fontId===f.id?`${A}08`:'white', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
                      <span style={{ fontSize:14, fontWeight:fontId===f.id?700:500, color:fontId===f.id?A:'#374151' }}>{f.label}</span>
                      <span style={{ fontSize:13, color:'#9ca3af' }}>{f.sample}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ════ LINKS ════ */}
          {section === 'links' && (
            <div>
              <Card style={{ marginBottom:16 }}>
                <STitle icon={Link2} title="Add Link" sub="Links appear on your mini-site · Lock them to charge USDC"/>
                <Input label="Title" value={linkTitle} onChange={setLinkTitle} placeholder="My Portfolio"/>
                <Input label="URL" value={linkUrl} onChange={setLinkUrl} placeholder="https://..."/>
                <Toggle value={linkLocked} onChange={setLinkLocked} label="Lock (charge to access)" sub="Visitor pays USDC to see the link"/>
                {linkLocked && <Input label="Price (USDC)" value={linkPrice} onChange={setLinkPrice} placeholder="5.00" type="number"/>}
                <button onClick={handleAddLink} disabled={!linkTitle||!linkUrl}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, width:'100%', padding:'13px', borderRadius:12, border:'none', background:!linkTitle||!linkUrl?'#e5e7eb':A, color:'white', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
                  <Plus style={{ width:16, height:16 }}/> Add link
                </button>
              </Card>

              {(links||[]).length > 0 && (
                <Card>
                  <p style={{ fontSize:15, fontWeight:700, color:'#111827', marginBottom:14 }}>Your links ({(links||[]).length})</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {(links||[]).map((l:any)=>(
                      <div key={l.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#f9fafb', border:'1px solid #f3f4f6', borderRadius:12 }}>
                        {l.locked ? <Lock style={{ width:15, height:15, color:A }}/> : <Globe style={{ width:15, height:15, color:'#9ca3af' }}/>}
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:14, fontWeight:600, color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', margin:0 }}>{l.title}</p>
                          <p style={{ fontSize:12, color:'#9ca3af', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', margin:0 }}>{l.url}</p>
                        </div>
                        {l.locked && <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:`${A}15`, color:A, fontWeight:700 }}>${l.lock_price}</span>}
                        <button onClick={()=>deleteLink(l.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', padding:4 }}>
                          <Trash2 style={{ width:15, height:15 }}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ════ VIDEOS ════ */}
          {section === 'videos' && (
            <div>
              <Card style={{ marginBottom:16 }}>
                <STitle icon={Youtube} title="Add YouTube Video" sub="Embed videos · Enable paywall to charge USDC for access"/>
                <Input label="YouTube URL or ID" value={ytUrl} onChange={setYtUrl} placeholder="https://youtube.com/watch?v=..."/>
                <Input label="Video title" value={vidTitle} onChange={setVidTitle} placeholder="My tutorial on..."/>
                <Toggle value={vidPaywall} onChange={setVidPaywall} label="Enable paywall" sub="You set the price · Platform takes 30%"/>
                {vidPaywall && <Input label="Access price (USDC)" value={vidPrice} onChange={setVidPrice} placeholder="5.00" type="number"/>}
                <button onClick={handleAddVideo} disabled={!ytUrl||!vidTitle}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, width:'100%', padding:'13px', borderRadius:12, border:'none', background:!ytUrl||!vidTitle?'#e5e7eb':A, color:'white', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                  <Plus style={{ width:16, height:16 }}/> Add video
                </button>
              </Card>

              {(videos||[]).length > 0 && (
                <Card>
                  <p style={{ fontSize:15, fontWeight:700, color:'#111827', marginBottom:14 }}>Your videos ({(videos||[]).length})</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
                    {(videos||[]).map((v:any)=>(
                      <div key={v.id} style={{ borderRadius:12, overflow:'hidden', border:'1px solid #e5e7eb', background:'white' }}>
                        <div style={{ position:'relative' }}>
                          <img src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`} alt="" style={{ width:'100%', height:120, objectFit:'cover' }}/>
                          {v.paywall_enabled && <span style={{ position:'absolute', top:6, right:6, fontSize:11, padding:'2px 8px', borderRadius:20, background:`${A}ee`, color:'white', fontWeight:700 }}>${v.paywall_price}</span>}
                        </div>
                        <div style={{ padding:'10px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <p style={{ fontSize:13, fontWeight:600, color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', margin:0, flex:1 }}>{v.title}</p>
                          <button onClick={()=>deleteVideo(v.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', padding:'2px 4px', flexShrink:0 }}>
                            <Trash2 style={{ width:14, height:14 }}/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ════ FEED ════ */}
          {section === 'feed' && (
            <div>
              <Card style={{ marginBottom:16 }}>
                <STitle icon={FileText} title="Publish Post" sub="Posts appear in your mini-site feed · Pin posts for $10/7 days"/>
                <Input label="Post content" value={feedText} onChange={setFeedText} placeholder="Share an update, project, or announcement..." textarea/>
                <Toggle value={feedPin} onChange={setFeedPin} label="Pin this post" sub="Stays at top for 7 days · $10 USDC"/>
                <button onClick={handleAddPost} disabled={!feedText.trim()}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, width:'100%', padding:'13px', borderRadius:12, border:'none', background:!feedText.trim()?'#e5e7eb':feedPin?'#d97706':A, color:'white', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                  {feedPin ? <Pin style={{ width:16, height:16 }}/> : <Plus style={{ width:16, height:16 }}/>}
                  {feedPin ? 'Publish & Pin ($10)' : 'Publish post'}
                </button>
              </Card>

              {(posts||[]).length > 0 && (
                <Card>
                  <p style={{ fontSize:15, fontWeight:700, color:'#111827', marginBottom:14 }}>Your posts ({(posts||[]).length})</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {(posts||[]).slice(0,5).map((p:any)=>(
                      <div key={p.id} style={{ padding:'14px 16px', background:'#f9fafb', border:`1px solid ${p.pinned?`${A}30`:'#f3f4f6'}`, borderRadius:12 }}>
                        {p.pinned && <span style={{ fontSize:11, color:A, fontWeight:700, display:'flex', alignItems:'center', gap:4, marginBottom:6 }}><Pin style={{ width:11, height:11 }}/> Pinned</span>}
                        <p style={{ fontSize:14, color:'#374151', margin:0, lineHeight:1.5 }}>{p.text}</p>
                        <p style={{ fontSize:11, color:'#9ca3af', marginTop:6 }}>{new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ════ CV & CONTACT ════ */}
          {section === 'cv' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <Card style={{ background:`${A}05`, border:`1px solid ${A}20` }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <p style={{ fontSize:15, fontWeight:700, color:'#111827', margin:0 }}>CV visibility</p>
                    <p style={{ fontSize:13, color:'#6b7280', marginTop:2 }}>Your CV is public · Contact details are locked · Companies pay to unlock</p>
                  </div>
                  <Toggle value={showCv} onChange={setShowCv} label="" />
                </div>
              </Card>

              <Card>
                <STitle icon={Briefcase} title="Professional Profile" sub="This appears publicly on your mini-site"/>
                <Input label="Professional headline" value={cvHeadline} onChange={setCvHeadline} placeholder="Senior Full-Stack Engineer · 8 years exp"/>
                <Input label="Location" value={cvLocation} onChange={setCvLocation} placeholder="São Paulo, Brazil · Remote"/>
                <Input label="Skills (comma separated)" value={cvSkills} onChange={setCvSkills} placeholder="React, TypeScript, Node.js, Python"/>
                <Input label="Professional summary" value={cvSummary} onChange={setCvSummary} placeholder="Brief professional summary..." textarea/>
              </Card>

              <Card>
                <STitle icon={Lock} title="Locked Contact Info" sub="Companies pay to unlock · You receive 50%"/>
                <div style={{ padding:'12px 16px', borderRadius:12, background:'#fef3c7', border:'1px solid #fcd34d', marginBottom:16, display:'flex', gap:10 }}>
                  <AlertCircle style={{ width:16, height:16, color:'#d97706', flexShrink:0, marginTop:1 }}/>
                  <p style={{ fontSize:13, color:'#92400e', margin:0, lineHeight:1.5 }}>This info is hidden until a company pays to unlock. You earn 50% of every unlock.</p>
                </div>
                <Input label="Email" value={contactEmail} onChange={setContactEmail} placeholder="contact@you.com" type="email"/>
                <Input label="Phone / WhatsApp" value={contactPhone} onChange={setContactPhone} placeholder="+1 415..."/>
                <Input label="Unlock price (USDC)" value={contactPrice} onChange={setContactPrice} placeholder="20" type="number"
                  hint={`You receive $${(parseFloat(contactPrice||'20')*0.5).toFixed(2)} per unlock`}/>
              </Card>
              {saveBtn}
            </div>
          )}

          {/* ════ PHOTOS ════ */}
          {section === 'photos' && (
            <Card>
              <STitle icon={Image} title="Photo Gallery" sub="Add photos to showcase your work on your mini-site"/>
              <div style={{ padding:'32px', border:'2px dashed #e5e7eb', borderRadius:14, textAlign:'center', marginBottom:20, cursor:'pointer', background:'#fafafa' }}
                onClick={()=>{ const i=document.createElement('input'); i.type='file'; i.accept='image/*'; i.multiple=true; i.click(); }}>
                <Image style={{ width:36, height:36, color:'#d1d5db', margin:'0 auto 10px' }}/>
                <p style={{ fontSize:14, fontWeight:600, color:'#6b7280', margin:0 }}>Click to upload photos</p>
                <p style={{ fontSize:12, color:'#9ca3af', margin:'4px 0 0' }}>JPG, PNG, WebP · Max 5MB each</p>
              </div>
              <div style={{ padding:'20px', borderRadius:12, background:`${A}05`, border:`1px solid ${A}20` }}>
                <p style={{ fontSize:13, color:'#6b7280', margin:0, textAlign:'center' }}>
                  📸 Photo gallery requires the <strong>Storage buckets</strong> to be configured in Supabase.<br/>
                  Run <code style={{ background:'#f3f4f6', padding:'2px 6px', borderRadius:4, fontSize:12 }}>supabase-storage-setup.sql</code> in your Supabase SQL Editor.
                </p>
              </div>
            </Card>
          )}

          {/* ════ CLASSIFIEDS ════ */}
          {section === 'classifieds' && (
            <div>
              <Card style={{ marginBottom:16 }}>
                <STitle icon={Tag} title="My Classifieds" sub="Cars, real estate, products and services listed on your mini-site"/>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16 }}>
                  {[
                    { l:'Cars & Vehicles', i:'🚗', c:'#3b82f6' },
                    { l:'Real Estate', i:'🏠', c:'#10b981' },
                    { l:'Products', i:'📦', c:'#f59e0b' },
                    { l:'Services', i:'⚙️', c:'#8b5cf6' },
                  ].map(({l,i,c})=>(
                    <Link key={l} href="/classificados/novo"
                      style={{ display:'flex', alignItems:'center', gap:10, padding:'14px', borderRadius:12, border:`1px solid ${c}30`, background:`${c}08`, textDecoration:'none', transition:'all 0.2s' }}>
                      <span style={{ fontSize:22 }}>{i}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{l}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/classificados/novo"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:'13px', borderRadius:12, background:A, color:'white', fontSize:14, fontWeight:700, textDecoration:'none' }}>
                  <Plus style={{ width:16, height:16 }}/> Create new classified ad
                </Link>
              </Card>
              <Link href="/classificados" style={{ display:'flex', alignItems:'center', gap:6, color:A, fontSize:14, fontWeight:600, textDecoration:'none', padding:'12px 0' }}>
                <ExternalLink style={{ width:14, height:14 }}/> View all classifieds →
              </Link>
            </div>
          )}

          {/* ════ MONETIZE ════ */}
          {section === 'monetize' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[
                { title:'CV Unlock', sub:'Companies pay to access your contact', price:'$20 fixed', earn:'You earn $10 (50%)', icon:Briefcase, color:'#059669' },
                { title:'Video Paywall', sub:'Charge USDC per video view', price:'You set the price', earn:'You earn 70%', icon:Video, color:'#6d28d9' },
                { title:'Locked Links', sub:'Lock any link behind a paywall', price:'You set the price', earn:'You earn 70%', icon:Lock, color:'#d97706' },
                { title:'Feed Pin', sub:'Keep a post at the top', price:'$10 fixed', earn:'7 days duration', icon:Pin, color:'#ef4444' },
                { title:'Boost Directory Position', sub:'Appear higher in search results', price:'$1.50 per position', earn:'7 days duration', icon:TrendingUp, color:'#0369a1' },
              ].map(m=>(
                <Card key={m.title} style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:`${m.color}12`, border:`1px solid ${m.color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <m.icon style={{ width:22, height:22, color:m.color }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:15, fontWeight:700, color:'#111827', margin:0 }}>{m.title}</p>
                    <p style={{ fontSize:13, color:'#6b7280', margin:'2px 0' }}>{m.sub}</p>
                    <div style={{ display:'flex', gap:8, marginTop:4 }}>
                      <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:`${m.color}12`, color:m.color, fontWeight:700 }}>{m.price}</span>
                      <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:'#f0fdf4', color:'#059669', fontWeight:700 }}>{m.earn}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* ════ SETTINGS ════ */}
          {section === 'settings' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <Card>
                <STitle icon={Settings} title="Account Settings"/>
                <div style={{ padding:'14px 0', borderBottom:'1px solid #f3f4f6' }}>
                  <p style={{ fontSize:13, color:'#9ca3af', margin:'0 0 4px' }}>Email</p>
                  <p style={{ fontSize:15, fontWeight:600, color:'#111827', margin:0 }}>{user?.email}</p>
                </div>
                <div style={{ padding:'14px 0', borderBottom:'1px solid #f3f4f6' }}>
                  <p style={{ fontSize:13, color:'#9ca3af', margin:'0 0 4px' }}>Account created</p>
                  <p style={{ fontSize:15, fontWeight:600, color:'#111827', margin:0 }}>{new Date(user?.created_at||Date.now()).toLocaleDateString()}</p>
                </div>
                <div style={{ padding:'14px 0' }}>
                  <p style={{ fontSize:13, color:'#9ca3af', margin:'0 0 4px' }}>Mini-site URL</p>
                  <p style={{ fontSize:15, fontWeight:600, color:A, margin:0, fontFamily:'monospace' }}>jobinlink.com/@{profile?.slug||'...'}</p>
                </div>
              </Card>

              <Card style={{ background:'#fef2f2', border:'1px solid #fca5a5' }}>
                <p style={{ fontSize:15, fontWeight:700, color:'#dc2626', marginBottom:8 }}>Danger zone</p>
                <p style={{ fontSize:13, color:'#6b7280', marginBottom:14 }}>Actions here cannot be undone.</p>
                <button onClick={()=>signOut()}
                  style={{ padding:'11px 20px', borderRadius:12, border:'1px solid #fca5a5', background:'white', color:'#ef4444', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                  Sign out
                </button>
              </Card>
            </div>
          )}

        </div>
      </main>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}
