'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMySite, useSiteLinks, useSiteVideos, useFeedPosts } from '@/hooks/useMiniSite';
import { GRADIENTS } from '@/lib/utils';
import TemplatePickerGrid from '@/components/editor/TemplatePickerGrid';
import type { MiniSiteTemplate } from '@/lib/data/miniSiteTemplates';
import {
  Hash, User, Palette, Link2, Video, FileText, DollarSign,
  Settings, Eye, X, Loader2, Save, Camera, Copy, Lock,
  Plus, Trash2, Globe, Briefcase, Pin, TrendingUp, Coins, Unlock,
  LayoutGrid, Columns2, Columns3, Sparkles, ExternalLink, Tag,
  AlertCircle, ChevronRight, Layers, Check, Home
} from 'lucide-react';

const A = '#a855f7';

const BG_THEMES = [
  { id:'dark',           label:'Dark',     preview:'#0a0a0f' },
  { id:'midnight',       label:'Midnight', preview:'#050508' },
  { id:'white',          label:'White',    preview:'#ffffff' },
  { id:'beige',          label:'Cream',    preview:'#faf7f2' },
  { id:'pastel-blue',    label:'Sky',      preview:'#f0f9ff' },
  { id:'pastel-pink',    label:'Rose',     preview:'#fdf2f8' },
  { id:'pastel-lavender',label:'Lavender', preview:'#f5f3ff' },
  { id:'light-gray',     label:'Silver',   preview:'#f1f5f9' },
];

const ACCENT_COLORS = [
  '#a855f7','#8b5cf6','#ec4899','#ef4444',
  '#f59e0b','#10b981','#06b6d4','#3b82f6',
  '#14b8a6','#f97316','#84cc16','#6366f1',
];

const NAV = [
  { id:'overview',   label:'Overview',    icon:Home },
  { id:'templates',  label:'Templates',   icon:Layers },
  { id:'profile',    label:'Profile',     icon:User },
  { id:'appearance', label:'Appearance',  icon:Palette },
  { id:'links',      label:'Links',       icon:Link2 },
  { id:'videos',     label:'Videos',      icon:Video },
  { id:'feed',       label:'Feed',        icon:FileText },
  { id:'cv',         label:'CV & Contact',icon:Briefcase },
  { id:'monetize',   label:'Monetize',    icon:DollarSign },
  { id:'settings',   label:'Settings',    icon:Settings },
];

const Inp = ({ label, value, onChange, placeholder, type='text', textarea=false, hint='' }: any) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>}
    {textarea
      ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none focus:border-purple-400 transition-colors resize-vertical" style={{fontFamily:'inherit'}}/>
      : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none focus:border-purple-400 transition-colors"/>}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const Tog = ({ value, onChange, label, sub }: any) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div><p className="text-sm font-bold text-gray-900">{label}</p>{sub&&<p className="text-xs text-gray-400">{sub}</p>}</div>
    <button onClick={()=>onChange(!value)} className="relative w-12 h-6 rounded-full transition-colors shrink-0" style={{background:value?A:'#e5e7eb'}}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{left:value?'26px':'2px'}}/>
    </button>
  </div>
);

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { site, loading, update, uploadPhoto } = useMySite(user);
  const { links, addLink, deleteLink } = useSiteLinks(site?.id);
  const { videos, addVideo, deleteVideo } = useSiteVideos(site?.id);
  const { posts, addPost } = useFeedPosts(site?.id);

  const [section, setSection] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(''),3000); };

  const [siteName, setSiteName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [published, setPublished] = useState(false);
  const [accent, setAccent] = useState(A);
  const [bgStyle, setBgStyle] = useState('dark');
  const [gradient, setGradient] = useState('cosmic');
  const [cols, setCols] = useState(2);
  const [fontSize, setFontSize] = useState('md');
  const [showCv, setShowCv] = useState(false);
  const [cvHeadline, setCvHeadline] = useState('');
  const [cvLocation, setCvLocation] = useState('');
  const [cvSkills, setCvSkills] = useState('');
  const [cvSummary, setCvSummary] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactPrice, setContactPrice] = useState('20');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLocked, setLinkLocked] = useState(false);
  const [linkPrice, setLinkPrice] = useState('');
  const [ytUrl, setYtUrl] = useState('');
  const [vidTitle, setVidTitle] = useState('');
  const [vidPaywall, setVidPaywall] = useState(false);
  const [vidPrice, setVidPrice] = useState('5');
  const [feedText, setFeedText] = useState('');
  const [feedPin, setFeedPin] = useState(false);
  const [templateId, setTemplateId] = useState('blank');

  const photoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if(!site) return;
    setSiteName(site.site_name||'');
    setSlug(site.slug||'');
    setTagline((site as any).tagline||'');
    setBio(site.bio||'');
    setPublished(site.published||false);
    setAccent((site as any).accent_color||A);
    setBgStyle((site as any).bg_style||'dark');
    setGradient((site as any).gradient||'cosmic');
    setCols((site as any).columns||2);
    setFontSize((site as any).font_size||'md');
    setShowCv(site.show_cv||false);
    setCvHeadline((site as any).cv_headline||'');
    setCvLocation((site as any).cv_location||'');
    setCvSkills((site as any).cv_skills||'');
    setCvSummary((site as any).cv_summary||'');
    setContactEmail((site as any).contact_email||'');
    setContactPhone((site as any).contact_phone||'');
    setContactPrice(String((site as any).contact_price||20));
    setTemplateId((site as any).template_id||'blank');
  },[site]);

  const handleSave = async() => {
    setSaving(true);
    await update({
      site_name:siteName, slug, bio, tagline, accent_color:accent,
      bg_style:bgStyle, gradient, columns:cols, font_size:fontSize,
      show_cv:showCv, published, template_id:templateId,
      cv_headline:cvHeadline, cv_location:cvLocation, cv_skills:cvSkills, cv_summary:cvSummary,
      contact_email:contactEmail, contact_phone:contactPhone, contact_price:parseFloat(contactPrice)||20,
    });
    setSaving(false);
    showToast('✓ Saved!');
  };

  const handlePhoto = async(e:React.ChangeEvent<HTMLInputElement>, type:'avatar'|'banner') => {
    const file=e.target.files?.[0]; if(!file) return;
    showToast('Uploading...');
    const url = await uploadPhoto(file,type);
    showToast(url?'✓ Photo updated!':'Upload failed — add Storage buckets in Supabase');
    e.target.value='';
  };

  const handleTemplate = (tpl:MiniSiteTemplate) => {
    setTemplateId(tpl.id);
    setBgStyle(tpl.theme);
    setCols(tpl.layoutColumns);
    setShowCv(tpl.showCv);
    showToast(`✓ Template "${tpl.name}" applied!`);
  };

  const profileUrl = site?.slug ? `https://hashpo.com/@${site.slug}` : '';
  const initials = (site?.site_name||user?.email||'H').charAt(0).toUpperCase();

  if(loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" style={{color:A}}/>
    </div>
  );

  if(!user){ if(typeof window!=='undefined') router.replace('/auth'); return null; }

  const saveBtn = (
    <button onClick={handleSave} disabled={saving}
      className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-colors"
      style={{background:A}}>
      {saving?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}
      {saving?'Saving...':'Save'}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-bold border"
          style={{background:'#f0fdf4',borderColor:'#86efac',color:'#15803d'}}>
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:A}}>
            <Hash className="w-4 h-4 text-white"/>
          </div>
          <span className="font-black text-purple-700 text-sm">HASHPO</span>
        </div>

        {/* User card */}
        <div className="p-4 border-b border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="relative cursor-pointer shrink-0" onClick={()=>photoRef.current?.click()}>
                {site?.avatar_url
                  ? <img src={site.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover"/>
                  : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black" style={{background:`linear-gradient(135deg,${A},#7c3aed)`}}>{initials}</div>}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white" style={{background:A}}>
                  <Camera className="w-2 h-2 text-white"/>
                </div>
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e=>handlePhoto(e,'avatar')}/>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{site?.site_name||user.email?.split('@')[0]}</p>
                <p className="text-xs font-mono truncate" style={{color:A}}>/@{site?.slug||'...'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${published?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>
                {published?'🟢 Live':'🟡 Draft'}
              </span>
              {profileUrl && (
                <a href={profileUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-bold flex items-center gap-1" style={{color:A}}>
                  <Eye className="w-3 h-3"/> View
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {NAV.map(item=>{
            const Icon=item.icon; const active=section===item.id;
            return (
              <button key={item.id} onClick={()=>setSection(item.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-sm transition-all text-left"
                style={{fontWeight:active?700:500,color:active?A:'#6b7280',background:active?`${A}12`:'transparent'}}>
                <Icon className="w-4 h-4 shrink-0"/>
                {item.label}
                {active&&<ChevronRight className="w-3 h-3 ml-auto" style={{color:A}}/>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1.5">
          {profileUrl && (
            <button onClick={()=>{navigator.clipboard.writeText(profileUrl);showToast('✓ Copied!');}}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-medium hover:bg-gray-50">
              <Copy className="w-3.5 h-3.5"/> Copy link
            </button>
          )}
          <button onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100">
            <X className="w-3.5 h-3.5"/> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-base font-black text-gray-900">{NAV.find(n=>n.id===section)?.label}</h1>
          <div className="flex gap-2">
            {profileUrl&&<a href={profileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"><ExternalLink className="w-3.5 h-3.5"/> Preview</a>}
            {['profile','appearance','cv','templates'].includes(section)&&saveBtn}
          </div>
        </div>

        <div className="p-8 max-w-4xl space-y-6">

          {/* OVERVIEW */}
          {section==='overview'&&(
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{l:'Views',v:'—',i:TrendingUp,c:'#7c3aed',bg:'#ede9fe'},{l:'Earned',v:'$0',i:Coins,c:'#059669',bg:'#f0fdf4'},{l:'CV unlocks',v:'0',i:Unlock,c:'#d97706',bg:'#fffbeb'},{l:'Links',v:String(links?.length||0),i:Link2,c:'#0369a1',bg:'#e0f2fe'}].map(s=>(
                  <div key={s.l} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{background:s.bg}}><s.i className="w-4 h-4" style={{color:s.c}}/></div>
                    <p className="text-2xl font-black text-gray-900">{s.v}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-black text-gray-900">Your mini-site</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${published?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{published?'Published':'Draft'}</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  {site?.avatar_url?<img src={site.avatar_url} alt="" className="w-16 h-16 rounded-2xl object-cover"/>
                    :<div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl" style={{background:`linear-gradient(135deg,${A},#7c3aed)`}}>{initials}</div>}
                  <div>
                    <p className="font-black text-gray-900">{site?.site_name||'Your name'}</p>
                    <p className="text-sm text-gray-500">{(site as any)?.tagline||'Add your tagline'}</p>
                    <p className="text-xs font-mono mt-1" style={{color:A}}>hashpo.com/@{site?.slug||'...'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[{l:'Templates',i:Layers,s:'templates',c:A},{l:'Profile',i:User,s:'profile',c:'#059669'},{l:'Links',i:Link2,s:'links',c:'#0369a1'},{l:'Videos',i:Video,s:'videos',c:'#d97706'}].map(({l,i:I,s,c})=>(
                    <button key={l} onClick={()=>setSection(s)} className="flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition-all" style={{borderColor:`${c}30`,background:`${c}08`,color:c}}>
                      <I className="w-4 h-4"/>{l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-purple-600"/><p className="text-sm font-bold text-purple-700">Getting started</p></div>
                {['🎨 Choose a template — it sets your theme, layout and sections automatically','📸 Add a profile photo and banner','🔗 Add your social links and portfolio','📄 Enable your CV so companies can find you','✅ Publish your mini-site when ready'].map((tip,i)=>(
                  <p key={i} className="text-sm text-gray-700 mb-1.5 bg-white rounded-lg px-3 py-2 border border-gray-100">{tip}</p>
                ))}
              </div>
            </div>
          )}

          {/* TEMPLATES */}
          {section==='templates'&&(
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5" style={{color:A}}/>
                  <h2 className="font-black text-gray-900">Choose a Template</h2>
                </div>
                <p className="text-sm text-gray-500 mb-5">Pick a template to set your theme, layout and sections automatically. You can customize everything after.</p>
                {templateId!=='blank'&&(
                  <div className="mb-4 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2" style={{background:`${A}10`,color:A}}>
                    <Check className="w-4 h-4"/> Template applied — save to confirm
                  </div>
                )}
                <TemplatePickerGrid selectedId={templateId} onSelect={handleTemplate}/>
              </div>
              {saveBtn}
            </div>
          )}

          {/* PROFILE */}
          {section==='profile'&&(
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-36 relative cursor-pointer overflow-hidden" onClick={()=>bannerRef.current?.click()}
                  style={{background:site?.banner_url?undefined:GRADIENTS[gradient]||GRADIENTS.cosmic}}>
                  {site?.banner_url&&<img src={site.banner_url} alt="" className="w-full h-full object-cover"/>}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex items-center gap-2 bg-white/25 text-white px-4 py-2 rounded-xl text-sm font-bold"><Camera className="w-4 h-4"/> Change banner</div>
                  </div>
                  <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={e=>handlePhoto(e,'banner')}/>
                </div>
                <div className="px-6 pb-6" style={{marginTop:'-3rem'}}>
                  <div className="relative inline-block cursor-pointer mb-2" onClick={()=>photoRef.current?.click()}>
                    {site?.avatar_url?<img src={site.avatar_url} alt="" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"/>
                      :<div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-3xl border-4 border-white shadow-lg" style={{background:`linear-gradient(135deg,${A},#7c3aed)`}}>{initials}</div>}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white" style={{background:A}}><Camera className="w-3 h-3 text-white"/></div>
                    <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e=>handlePhoto(e,'avatar')}/>
                  </div>
                  <p className="text-xs text-gray-400">Click to change · Max 5MB</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <Inp label="Display name" value={siteName} onChange={setSiteName} placeholder="Ana Carvalho"/>
                <Inp label="URL slug" value={slug} onChange={setSlug} placeholder="anacarvalho" hint={`hashpo.com/@${slug||'yourname'}`}/>
                <Inp label="Tagline" value={tagline} onChange={setTagline} placeholder="Senior Designer · Speaker"/>
                <Inp label="Bio" value={bio} onChange={setBio} placeholder="Tell your story..." textarea/>
                <div className="border-t border-gray-100 pt-1">
                  <Tog value={published} onChange={setPublished} label="Published" sub="Visible in directory and search"/>
                </div>
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {section==='appearance'&&(
            <div className="space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Background Theme</h3>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {BG_THEMES.map(b=>(
                    <button key={b.id} onClick={()=>setBgStyle(b.id)} className="flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all" style={{borderColor:bgStyle===b.id?A:'#e5e7eb',background:bgStyle===b.id?`${A}08`:'white'}}>
                      <div className="w-full h-6 rounded-lg border border-gray-100 shadow-sm" style={{background:b.preview}}/>
                      <span className="text-xs font-bold" style={{color:bgStyle===b.id?A:'#6b7280'}}>{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Banner Gradient</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(GRADIENTS).map(([id,colors])=>(
                    <button key={id} onClick={()=>setGradient(id)} className="h-14 rounded-xl relative overflow-hidden transition-all" style={{background:colors,outline:gradient===id?`3px solid ${A}`:undefined,outlineOffset:'2px'}}>
                      <span className="absolute bottom-1 left-2 text-white text-xs font-bold capitalize shadow-sm">{id}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Accent Color</h3>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_COLORS.map(c=>(
                    <button key={c} onClick={()=>setAccent(c)} className="w-10 h-10 rounded-full transition-all" style={{background:c,boxShadow:accent===c?`0 0 0 3px white, 0 0 0 5px ${c}`:'none'}}>
                      {accent===c&&<Check className="w-4 h-4 text-white mx-auto"/>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Layout</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[{n:1,i:LayoutGrid,l:'Single'},{n:2,i:Columns2,l:'Double'},{n:3,i:Columns3,l:'Triple'}].map(({n,i:I,l})=>(
                    <button key={n} onClick={()=>setCols(n)} className="flex flex-col items-center gap-2 py-4 rounded-xl border-2 font-bold text-sm transition-all" style={{borderColor:cols===n?A:'#e5e7eb',background:cols===n?`${A}08`:'white',color:cols===n?A:'#6b7280'}}>
                      <I className="w-5 h-5"/>{l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LINKS */}
          {section==='links'&&(
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Add Link</h3>
                <Inp label="Title" value={linkTitle} onChange={setLinkTitle} placeholder="My Portfolio"/>
                <Inp label="URL" value={linkUrl} onChange={setLinkUrl} placeholder="https://..."/>
                <Tog value={linkLocked} onChange={setLinkLocked} label="Lock (charge to access)" sub="Visitor pays USDC to see the link"/>
                {linkLocked&&<Inp label="Price (USDC)" value={linkPrice} onChange={setLinkPrice} placeholder="5.00" type="number"/>}
                <button onClick={async()=>{
                  if(!linkTitle||!linkUrl) return;
                  await addLink({title:linkTitle,url:linkUrl,locked:linkLocked,lock_price:parseFloat(linkPrice)||0,type:'link'});
                  setLinkTitle('');setLinkUrl('');setLinkLocked(false);setLinkPrice('');
                  showToast('✓ Link added!');
                }} disabled={!linkTitle||!linkUrl} className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold disabled:opacity-50" style={{background:linkTitle&&linkUrl?A:'#e5e7eb',color:linkTitle&&linkUrl?'white':'#9ca3af'}}>
                  <Plus className="w-4 h-4"/> Add link
                </button>
              </div>
              {(links||[]).length>0&&(
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <p className="font-black text-gray-900 mb-3">Your links ({links?.length})</p>
                  <div className="space-y-2">
                    {(links||[]).map((l:any)=>(
                      <div key={l.id} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        {l.locked?<Lock className="w-4 h-4 shrink-0" style={{color:A}}/>:<Globe className="w-4 h-4 shrink-0 text-gray-400"/>}
                        <div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-900 truncate">{l.title}</p><p className="text-xs text-gray-400 truncate">{l.url}</p></div>
                        {l.locked&&<span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{background:`${A}15`,color:A}}>${l.lock_price}</span>}
                        <button onClick={()=>deleteLink(l.id)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIDEOS */}
          {section==='videos'&&(
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Add YouTube Video</h3>
                <Inp label="YouTube URL or ID" value={ytUrl} onChange={setYtUrl} placeholder="https://youtube.com/watch?v=..."/>
                <Inp label="Title" value={vidTitle} onChange={setVidTitle} placeholder="My intro video..."/>
                <Tog value={vidPaywall} onChange={setVidPaywall} label="Enable paywall" sub="Platform takes 30%"/>
                {vidPaywall&&<Inp label="Access price (USDC)" value={vidPrice} onChange={setVidPrice} placeholder="5.00" type="number"/>}
                <button onClick={async()=>{
                  if(!ytUrl||!vidTitle) return;
                  const match=ytUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                  const ytId=match?.[1]||ytUrl;
                  await addVideo({title:vidTitle,youtube_id:ytId,paywall_enabled:vidPaywall,paywall_price:parseFloat(vidPrice)||0,sort_order:videos?.length||0});
                  setYtUrl('');setVidTitle('');setVidPaywall(false);setVidPrice('5');
                  showToast('✓ Video added!');
                }} disabled={!ytUrl||!vidTitle} className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold disabled:opacity-50" style={{background:ytUrl&&vidTitle?A:'#e5e7eb',color:ytUrl&&vidTitle?'white':'#9ca3af'}}>
                  <Plus className="w-4 h-4"/> Add video
                </button>
              </div>
              {(videos||[]).length>0&&(
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <p className="font-black text-gray-900 mb-3">Your videos</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(videos||[]).map((v:any)=>(
                      <div key={v.id} className="rounded-xl overflow-hidden border border-gray-100">
                        <div className="relative"><img src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`} alt="" className="w-full h-24 object-cover"/>{v.paywall_enabled&&<span className="absolute top-1.5 right-1.5 text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{background:A}}>${v.paywall_price}</span>}</div>
                        <div className="p-2.5 flex items-center justify-between"><p className="text-xs font-bold text-gray-900 truncate flex-1">{v.title}</p><button onClick={()=>deleteVideo(v.id)} className="text-red-400 ml-2"><Trash2 className="w-3.5 h-3.5"/></button></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FEED */}
          {section==='feed'&&(
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Publish Post</h3>
                <Inp label="Content" value={feedText} onChange={setFeedText} placeholder="Share an update..." textarea/>
                <Tog value={feedPin} onChange={setFeedPin} label="Pin this post" sub="7 days · $10 USDC"/>
                <button onClick={async()=>{
                  if(!feedText.trim()) return;
                  await addPost({text:feedText,pinned:feedPin,images:[]});
                  setFeedText('');setFeedPin(false);
                  showToast(feedPin?'✓ Post pinned!':'✓ Published!');
                }} disabled={!feedText.trim()} className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold disabled:opacity-50" style={{background:feedText.trim()?feedPin?'#d97706':A:'#e5e7eb',color:feedText.trim()?'white':'#9ca3af'}}>
                  {feedPin?<Pin className="w-4 h-4"/>:<Plus className="w-4 h-4"/>}{feedPin?'Publish & Pin ($10)':'Publish post'}
                </button>
              </div>
            </div>
          )}

          {/* CV */}
          {section==='cv'&&(
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-center justify-between">
                <div><p className="font-bold text-gray-900 text-sm">CV Visibility</p><p className="text-xs text-gray-500">Public CV · Locked contact · Companies pay to unlock</p></div>
                <Tog value={showCv} onChange={setShowCv} label=""/>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Professional Profile</h3>
                <Inp label="Headline" value={cvHeadline} onChange={setCvHeadline} placeholder="Senior Engineer · 8 years"/>
                <Inp label="Location" value={cvLocation} onChange={setCvLocation} placeholder="São Paulo · Remote"/>
                <Inp label="Skills (comma separated)" value={cvSkills} onChange={setCvSkills} placeholder="React, TypeScript, Node.js"/>
                <Inp label="Summary" value={cvSummary} onChange={setCvSummary} placeholder="Brief professional summary..." textarea/>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3"><Lock className="w-4 h-4" style={{color:A}}/><h3 className="font-black text-gray-900">Locked Contact Info</h3></div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 flex gap-2"><AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/><p className="text-xs text-amber-700">Hidden until a company pays. You earn 50% of every unlock.</p></div>
                <Inp label="Email" value={contactEmail} onChange={setContactEmail} placeholder="contact@you.com" type="email"/>
                <Inp label="Phone / WhatsApp" value={contactPhone} onChange={setContactPhone} placeholder="+1 415..."/>
                <Inp label="Unlock price (USDC)" value={contactPrice} onChange={setContactPrice} placeholder="20" type="number" hint={`You receive $${(parseFloat(contactPrice||'20')*0.5).toFixed(2)} per unlock`}/>
              </div>
              {saveBtn}
            </div>
          )}

          {/* MONETIZE */}
          {section==='monetize'&&(
            <div className="space-y-3">
              {[
                {title:'CV Unlock',sub:'Companies pay $20 to see your contact',price:'$20 fixed',earn:'You earn $10 (50%)',i:Briefcase,c:'#059669'},
                {title:'Video Paywall',sub:'Charge USDC per video view',price:'You set the price',earn:'You earn 70%',i:Video,c:'#7c3aed'},
                {title:'Locked Links',sub:'Lock any link behind a paywall',price:'You set the price',earn:'You earn 70%',i:Lock,c:'#d97706'},
                {title:'Feed Pin',sub:'Pin a post at top for 7 days',price:'$10 fixed',earn:'7 days',i:Pin,c:'#ef4444'},
                {title:'Boost Position',sub:'Appear higher in directory',price:'$1.50/position',earn:'7 days',i:TrendingUp,c:'#0369a1'},
              ].map(m=>(
                <div key={m.title} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{background:`${m.c}12`}}><m.i className="w-5 h-5" style={{color:m.c}}/></div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-sm">{m.title}</p>
                    <p className="text-xs text-gray-500 mb-1.5">{m.sub}</p>
                    <div className="flex gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:`${m.c}12`,color:m.c}}>{m.price}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{m.earn}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS */}
          {section==='settings'&&(
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Account</h3>
                <div className="space-y-3">
                  <div className="border-b border-gray-100 pb-3"><p className="text-xs text-gray-400">Email</p><p className="font-bold text-gray-900">{user.email}</p></div>
                  <div><p className="text-xs text-gray-400">Mini-site URL</p><p className="font-mono font-bold text-sm" style={{color:A}}>hashpo.com/@{site?.slug||'...'}</p></div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <p className="font-bold text-red-600 mb-1 text-sm">Danger zone</p>
                <button onClick={signOut} className="px-4 py-2 bg-white border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 mt-2">Sign out</button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
