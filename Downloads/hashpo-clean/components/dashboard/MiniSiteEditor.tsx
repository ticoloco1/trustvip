'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMySite, useSiteLinks, useSiteVideos } from '@/hooks/useMiniSite';
import { supabase } from '@/lib/supabase';
import TemplatePickerGrid from '@/components/editor/TemplatePickerGrid';
import CvEditor from '@/components/editor/CvEditor';
import SocialLinkPicker, { SOCIAL_NETWORKS } from '@/components/editor/SocialLinkPicker';
import type { MiniSiteTemplate } from '@/lib/data/miniSiteTemplates';
import {
  Globe, Link2, Plus, Trash2, Eye, Camera, Upload,
  LayoutGrid, Columns2, Columns3, Save, Gem, RefreshCw,
  Palette, Lock, Layers, DollarSign, Image, MapPin, Building, Store
} from 'lucide-react';

const THEMES = [
  { id:'cosmic',   label:'Cosmic',   colors:'from-purple-900 via-indigo-900 to-violet-800',   accent:'#a855f7' },
  { id:'ocean',    label:'Ocean',    colors:'from-blue-900 via-cyan-900 to-teal-800',          accent:'#06b6d4' },
  { id:'forest',   label:'Forest',   colors:'from-emerald-900 via-green-900 to-teal-900',      accent:'#10b981' },
  { id:'sunset',   label:'Sunset',   colors:'from-orange-900 via-amber-900 to-yellow-800',     accent:'#f59e0b' },
  { id:'midnight', label:'Midnight', colors:'from-slate-900 via-gray-900 to-zinc-900',         accent:'#64748b' },
];

const BG_STYLES = [
  { id:'dark',             label:'Escuro',       preview:'bg-gray-900' },
  { id:'white',            label:'Branco',       preview:'bg-white' },
  { id:'beige',            label:'Bege',         preview:'bg-amber-50' },
  { id:'sand',             label:'Areia',        preview:'bg-yellow-100' },
  { id:'warm',             label:'Calor',        preview:'bg-orange-50' },
  { id:'yellow',           label:'Amarelo',      preview:'bg-yellow-50' },
  { id:'pastel-blue',      label:'Azul Claro',   preview:'bg-sky-50' },
  { id:'pastel-pink',      label:'Rosa',         preview:'bg-pink-50' },
  { id:'pastel-lavender',  label:'Lavanda',      preview:'bg-violet-50' },
  { id:'light-gray',       label:'Cinza Claro',  preview:'bg-gray-100' },
  { id:'silver',           label:'Prata',        preview:'bg-slate-200' },
  { id:'brushed-steel',    label:'Aço',          preview:'bg-zinc-300' },
];

const FONT_SIZES = [
  { id:'sm', label:'Pequena' },
  { id:'md', label:'Média' },
  { id:'lg', label:'Grande' },
];

const PHOTO_SHAPES = [
  { id:'round',  label:'Redonda' },
  { id:'square', label:'Quadrada' },
];

const PHOTO_SIZES = [
  { id:'sm', label:'Pequena' },
  { id:'md', label:'Média' },
  { id:'lg', label:'Grande' },
];

const VIEW_TIERS = [
  { value:1, label:'1 view' },
  { value:5, label:'5 views' },
  { value:20, label:'20 views' },
];

// Upload with base64 fallback
async function uploadImage(file: File, bucket: string, path: string): Promise<string|null> {
  try {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert:true, contentType:file.type });
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    }
  } catch {}
  // Fallback: compress to base64
  try {
    const img = document.createElement('img');
    const url = URL.createObjectURL(file);
    await new Promise<void>(r => { img.onload=()=>r(); img.src=url; });
    const maxW = 600;
    const scale = Math.min(1, maxW / img.width);
    const canvas = document.createElement('canvas');
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    return canvas.toDataURL('image/jpeg', 0.75);
  } catch { return null; }
}

export default function MiniSiteEditor() {
  const { user, loading:authLoading } = useAuth();
  const router = useRouter();
  const { site, loading:siteLoading, update } = useMySite(user);
  const { links, addLink, deleteLink } = useSiteLinks(site?.id);
  const { videos, addVideo, deleteVideo } = useSiteVideos(site?.id);

  const [toast, setToast] = useState('');
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(''),3000); };

  // Profile
  const [siteName, setSiteName] = useState('');
  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Appearance
  const [selectedTheme, setSelectedTheme] = useState('cosmic');
  const [bgStyle, setBgStyle] = useState('dark');
  const [fontSize, setFontSize] = useState('md');
  const [photoShape, setPhotoShape] = useState('round');
  const [photoSize, setPhotoSize] = useState('md');
  const [layoutCols, setLayoutCols] = useState(2);
  const [templateId, setTemplateId] = useState('blank');
  const [address, setAddress] = useState('');

  // CV
  const [showCv, setShowCv] = useState(false);
  const [cvContent, setCvContent] = useState('');
  const [cvHeadline, setCvHeadline] = useState('');
  const [cvLocation, setCvLocation] = useState('');
  const [cvSkills, setCvSkills] = useState<string[]>([]);
  const [cvExperience, setCvExperience] = useState<any[]>([]);
  const [cvEducation, setCvEducation] = useState<any[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactPrice, setContactPrice] = useState('20');

  // Extra sections
  const [showDomains, setShowDomains] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);

  // Video form
  const [ytUrl, setYtUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [paywallEnabled, setPaywallEnabled] = useState(false);
  const [paywallPrice, setPaywallPrice] = useState('0.15');
  const [nftEnabled, setNftEnabled] = useState(false);
  const [nftPrice, setNftPrice] = useState('1.00');
  const [nftMaxViews, setNftMaxViews] = useState('1');
  const [nftMaxEditions, setNftMaxEditions] = useState('');
  const [rechargeEnabled, setRechargeEnabled] = useState(false);
  const [rechargePrice, setRechargePrice] = useState('0.50');

  // Link form
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!site) return;
    setSiteName(site.site_name||'');
    setSlug(site.slug||'');
    setBio(site.bio||'');
    setAvatarUrl(site.avatar_url||'');
    setSelectedTheme((site as any).theme||'cosmic');
    setTemplateId((site as any).template_id||'blank');
    setBgStyle((site as any).bg_style||'dark');
    setFontSize((site as any).font_size||'md');
    setPhotoShape((site as any).photo_shape||'round');
    setPhotoSize((site as any).photo_size||'md');
    setLayoutCols((site as any).layout_columns||2);
    setAddress((site as any).address||'');
    setShowCv(site.show_cv||false);
    setCvContent((site as any).cv_content||'');
    setCvHeadline((site as any).cv_headline||'');
    setCvLocation((site as any).cv_location||'');
    setCvSkills((site as any).cv_skills||[]);
    setCvExperience((site as any).cv_experience||[]);
    setCvEducation((site as any).cv_education||[]);
    setContactEmail((site as any).contact_email||'');
    setContactPhone((site as any).contact_phone||'');
    setContactPrice(String((site as any).contact_price||20));
    setShowDomains((site as any).show_domains||false);
    setShowProperties((site as any).show_properties||false);
    setShowPhotos((site as any).show_photos||false);
    // Load photos
    if (site.id) {
      supabase.from('mini_site_photos').select('*').eq('site_id',site.id).order('sort_order')
        .then(({data})=>setPhotos(data||[]));
    }
  },[site]);

  if (authLoading||siteLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
  );
  if (!user) { router.replace('/auth'); return null; }

  const currentTheme = THEMES.find(t=>t.id===selectedTheme)||THEMES[0];
  const publicUrl = typeof window!=='undefined' ? `${window.location.origin}/s/${slug||'preview'}` : `/s/${slug||'preview'}`;

  const handleSave = async() => {
    setSaving(true);
    await update({
      site_name:siteName, slug:slug||user.email?.split('@')[0]||'user',
      bio, avatar_url:avatarUrl||null,
      theme:selectedTheme, template_id:templateId, bg_style:bgStyle,
      font_size:fontSize, photo_shape:photoShape, photo_size:photoSize,
      layout_columns:layoutCols, address,
      show_cv:showCv, cv_content:cvContent, cv_headline:cvHeadline,
      cv_location:cvLocation, cv_skills:cvSkills, cv_experience:cvExperience,
      cv_education:cvEducation, contact_email:contactEmail,
      contact_phone:contactPhone, contact_price:parseFloat(contactPrice)||20,
      show_domains:showDomains, show_properties:showProperties, show_photos:showPhotos,
    });
    setSaving(false);
    showToast('✓ Mini-site saved!');
  };

  const handleAvatarUpload = async(file:File) => {
    setUploadingAvatar(true);
    showToast('Uploading...');
    const ext = file.name.split('.').pop()||'jpg';
    const url = await uploadImage(file, 'platform-assets', `${user.id}/avatar.${ext}`);
    if (url) { setAvatarUrl(url); showToast('✓ Avatar updated!'); }
    else showToast('Upload failed — using local preview');
    setUploadingAvatar(false);
  };

  const extractYtId = (url:string) => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\\w-]{11})/);
    return m?.[1]||url;
  };

  const handleAddVideo = async() => {
    if(!site?.id||!ytUrl) return;
    const ytId = extractYtId(ytUrl);
    await addVideo({
      title:videoTitle||`Video ${ytId}`, youtube_id:ytId,
      thumbnail_url:`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      paywall_enabled:paywallEnabled, paywall_price:paywallEnabled?parseFloat(paywallPrice)||0.15:0,
      nft_enabled:nftEnabled, nft_price:nftEnabled?parseFloat(nftPrice)||1:0,
      nft_max_views:parseInt(nftMaxViews)||1,
      nft_max_editions:nftMaxEditions?parseInt(nftMaxEditions):undefined,
      recharge_enabled:rechargeEnabled, recharge_price:rechargeEnabled?parseFloat(rechargePrice)||0:0,
      sort_order:videos?.length||0,
    });
    setYtUrl(''); setVideoTitle(''); setPaywallEnabled(false); setNftEnabled(false);
    showToast('✓ Video added!');
  };

  const handleAddLink = async(title:string, url:string, icon:string) => {
    if(!site?.id||!title||!url) return;
    await addLink({ title, url, icon, locked:false, lock_price:0, type:'link' });
    showToast('✓ Link added!');
  };

  const handlePhotoUpload = async(file:File) => {
    if(!site?.id) return;
    setUploadingPhoto(true);
    const ext = file.name.split('.').pop()||'jpg';
    const url = await uploadImage(file,'platform-assets',`${user.id}/photos/${Date.now()}.${ext}`);
    if (url) {
      const {data} = await supabase.from('mini_site_photos').insert({site_id:site.id,url,user_id:user.id}).select().single();
      if(data) setPhotos(p=>[...p,data]);
      showToast('✓ Foto adicionada!');
    } else showToast('Upload failed');
    setUploadingPhoto(false);
  };

  const inp = "w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-xs outline-none focus:border-purple-400 transition-colors placeholder-gray-500";
  const sw = (checked:boolean, onChange:(v:boolean)=>void) => (
    <button onClick={()=>onChange(!checked)} className="relative w-11 h-6 rounded-full transition-colors shrink-0" style={{background:checked?'#a855f7':'#374151'}}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{left:checked?'22px':'2px'}}/>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-2xl">{toast}</div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-gray-950/95 sticky top-0 z-20 backdrop-blur">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-purple-400"/>
          <h1 className="text-lg font-black">Mini-Site Editor</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href={publicUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:underline font-bold">
            <Eye className="w-3.5 h-3.5"/> Preview
          </a>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 disabled:opacity-60">
            <Save className="w-4 h-4"/> {saving?'Saving...':'Save Site'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        {/* Templates — top full width */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4"/> Escolha um Template
          </h2>
          <TemplatePickerGrid selectedId={templateId} onSelect={(tpl:MiniSiteTemplate)=>{
            setTemplateId(tpl.id); setSelectedTheme(tpl.theme);
            setLayoutCols(tpl.layoutColumns); setShowCv(tpl.showCv);
            showToast(`✓ Template "${tpl.name}" aplicado!`);
          }}/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Editor */}
          <div className="lg:col-span-3 space-y-5">

            {/* Profile */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <LayoutGrid className="w-4 h-4"/> Perfil
              </h2>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Username (URL do mini-site)</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 whitespace-nowrap">hashpo.com/s/</span>
                  <input value={slug} onChange={e=>setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))} placeholder="seuusername" className={inp}/>
                </div>
              </div>
              {/* Avatar */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-2"><Camera className="w-3 h-3"/> Profile Photo</label>
                <div className="flex items-center gap-4">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"/>
                    : <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-black text-gray-500 border-2 border-gray-700">{siteName?.[0]?.toUpperCase()||'?'}</div>}
                  <div>
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 hover:border-purple-500 transition-colors">
                      <Upload className="w-3.5 h-3.5"/>
                      {uploadingAvatar?'Uploading...':'Upload Photo'}
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingAvatar}
                        onChange={e=>{ const f=e.target.files?.[0]; if(f) handleAvatarUpload(f); e.target.value=''; }}/>
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">JPG PNG WebP · Max 5MB · Se o bucket não existir, usa base64</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Display Name</label>
                <input value={siteName} onChange={e=>setSiteName(e.target.value)} placeholder="Seu Nome" className={inp}/>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Bio</label>
                <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} className={`${inp} resize-vertical`}/>
              </div>
            </div>

            {/* Theme */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4"/> Tema de Cor
              </h2>
              <div className="flex gap-3">
                {THEMES.map(theme=>(
                  <button key={theme.id} onClick={()=>setSelectedTheme(theme.id)}
                    className={`relative flex flex-col items-center gap-1.5 transition-all ${selectedTheme===theme.id?'scale-105':'opacity-70 hover:opacity-100'}`}>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${theme.colors} border-2 ${selectedTheme===theme.id?'border-purple-400 ring-2 ring-purple-400/30':'border-gray-700'} flex items-center justify-center`}>
                      {selectedTheme===theme.id && <span className="text-white text-lg">✓</span>}
                    </div>
                    <span className="text-[10px] font-bold text-gray-300">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Style */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4"/> Fundo do Site
              </h2>
              <div className="flex flex-wrap gap-3">
                {BG_STYLES.map(bg=>(
                  <button key={bg.id} onClick={()=>setBgStyle(bg.id)}
                    className={`flex flex-col items-center gap-1.5 transition-all ${bgStyle===bg.id?'scale-105':'opacity-70 hover:opacity-100'}`}>
                    <div className={`w-12 h-12 rounded-xl ${bg.preview} border-2 ${bgStyle===bg.id?'border-purple-400 ring-2 ring-purple-400/30':'border-gray-700'} flex items-center justify-center shadow-sm`}>
                      {bgStyle===bg.id && <span className={bg.id==='dark'?'text-white text-sm':'text-gray-800 text-sm'}>✓</span>}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tamanho da Fonte</h2>
              <div className="flex gap-2">
                {FONT_SIZES.map(fs=>(
                  <button key={fs.id} onClick={()=>setFontSize(fs.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${fontSize===fs.id?'bg-purple-600 text-white border-purple-600':'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500'}`}>
                    {fs.id==='sm'?'A':fs.id==='md'?'A+':'A++'} {fs.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Shape & Size */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4"/> Formato da Foto
              </h2>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-2 block">Formato</label>
                <div className="flex gap-2">
                  {PHOTO_SHAPES.map(ps=>(
                    <button key={ps.id} onClick={()=>setPhotoShape(ps.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${photoShape===ps.id?'bg-purple-600 text-white border-purple-600':'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500'}`}>
                      <div className={`w-5 h-5 bg-gray-500 ${ps.id==='round'?'rounded-full':'rounded-sm'}`}/>
                      {ps.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-2 block">Tamanho</label>
                <div className="flex gap-2">
                  {PHOTO_SIZES.map(ps=>(
                    <button key={ps.id} onClick={()=>setPhotoSize(ps.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${photoSize===ps.id?'bg-purple-600 text-white border-purple-600':'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500'}`}>
                      {ps.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Layout */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Video Layout</h2>
              <div className="flex gap-2">
                {[1,2,3].map(n=>(
                  <button key={n} onClick={()=>setLayoutCols(n)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${layoutCols===n?'bg-purple-600 text-white border-purple-600':'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500'}`}>
                    {n===3?<Columns3 className="w-4 h-4"/>:<Columns2 className="w-4 h-4"/>}
                    {n} {n===1?'Column':'Columns'}
                  </button>
                ))}
              </div>
            </div>

            {/* CV & Contact */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4"/> CV / Resume & Contact
              </h2>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-300">Show Expandable CV</label>
                {sw(showCv, setShowCv)}
              </div>
              {showCv && (
                <CvEditor
                  cvContent={cvContent} setCvContent={setCvContent}
                  cvHeadline={cvHeadline} setCvHeadline={setCvHeadline}
                  cvLocation={cvLocation} setCvLocation={setCvLocation}
                  cvSkills={cvSkills} setCvSkills={setCvSkills}
                  cvExperience={cvExperience} setCvExperience={setCvExperience}
                  cvEducation={cvEducation} setCvEducation={setCvEducation}
                  contactEmail={contactEmail} setContactEmail={setContactEmail}
                  contactPhone={contactPhone} setContactPhone={setContactPhone}
                  contactPrice={contactPrice} setContactPrice={setContactPrice}
                />
              )}
            </div>

            {/* Videos */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-red-500">▶</span> Videos
              </h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">YouTube URL ou ID</label>
                    <input value={ytUrl} onChange={e=>setYtUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className={inp}/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Title</label>
                    <input value={videoTitle} onChange={e=>setVideoTitle(e.target.value)} placeholder="Video title" className={inp}/>
                  </div>
                </div>
                {/* Paywall */}
                <div className="flex items-center gap-3">
                  {sw(paywallEnabled, v=>{ setPaywallEnabled(v); if(v) setNftEnabled(false); })}
                  <span className="text-xs font-bold text-white flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-purple-400"/> Video Paywall (pay to watch)</span>
                </div>
                {paywallEnabled && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Price (USDC)</label>
                    <input type="number" value={paywallPrice} onChange={e=>setPaywallPrice(e.target.value)} min="0.10" step="0.01" className={`${inp} w-32`}/>
                    <p className="text-[10px] text-gray-500 italic mt-1">Access lasts 12 hours. 60% Creator / 40% Platform.</p>
                  </div>
                )}
                {/* NFT */}
                <div className="flex items-center gap-3">
                  {sw(nftEnabled, v=>{ setNftEnabled(v); if(v) setPaywallEnabled(false); })}
                  <span className="text-xs font-bold text-white flex items-center gap-1"><Gem className="w-3.5 h-3.5 text-purple-400"/> NFT Paywall (ownership + limited views)</span>
                </div>
                {nftEnabled && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Price (USDC)</label>
                        <input type="number" value={nftPrice} onChange={e=>setNftPrice(e.target.value)} className={inp}/>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">View Tier</label>
                        <div className="flex gap-1">
                          {VIEW_TIERS.map(t=>(
                            <button key={t.value} onClick={()=>setNftMaxViews(String(t.value))}
                              className={`flex-1 py-2 rounded text-[10px] font-bold border transition-all ${nftMaxViews===String(t.value)?'bg-purple-600 text-white border-purple-600':'bg-gray-800 text-gray-400 border-gray-700'}`}>
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Max Editions (∞ = blank)</label>
                        <input type="number" value={nftMaxEditions} onChange={e=>setNftMaxEditions(e.target.value)} min="1" className={inp}/>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {sw(rechargeEnabled, setRechargeEnabled)}
                      <span className="text-xs font-bold text-white flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5 text-purple-400"/> Allow Recharge</span>
                      {rechargeEnabled && (
                        <div className="flex items-center gap-2 ml-2">
                          <input type="number" value={rechargePrice} onChange={e=>setRechargePrice(e.target.value)} className={`${inp} w-20`}/>
                          <span className="text-[10px] text-gray-400">USDC</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <button onClick={handleAddVideo} disabled={!ytUrl||!site?.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-lg hover:bg-purple-700 disabled:opacity-50">
                  <Plus className="w-4 h-4"/> Add Video
                </button>
              </div>
              {(videos||[]).length>0&&(
                <div className="space-y-2">
                  {(videos||[]).map((v:any)=>(
                    <div key={v.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <img src={v.thumbnail_url||`https://img.youtube.com/vi/${v.youtube_id}/default.jpg`} alt="" className="w-20 h-12 rounded object-cover shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{v.title}</p>
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          {v.nft_enabled&&<span className="text-[10px] text-purple-400 font-bold">NFT · ${v.nft_price}</span>}
                          {v.paywall_enabled&&<span className="text-[10px] text-purple-400 font-bold">Paywall ${v.paywall_price}</span>}
                          {!v.nft_enabled&&!v.paywall_enabled&&<span className="text-[10px] text-gray-500">Free</span>}
                        </div>
                      </div>
                      <button onClick={()=>deleteVideo(v.id)} className="text-red-400 hover:text-red-300 shrink-0"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Links & Social */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4 text-purple-400"/> Links & Social
              </h2>
              <SocialLinkPicker onAdd={handleAddLink} disabled={!site?.id}/>
              <div className="border-t border-gray-800 pt-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Custom Link</p>
                <div className="flex gap-2">
                  <input value={linkTitle} onChange={e=>setLinkTitle(e.target.value)} placeholder="Title" className={`${inp} flex-1`}/>
                  <input value={linkUrl} onChange={e=>setLinkUrl(e.target.value)} placeholder="https://..." className={`${inp} flex-1`}/>
                  <button onClick={async()=>{ if(!linkTitle||!linkUrl||!site?.id) return; await addLink({title:linkTitle,url:linkUrl,icon:'link',locked:false,lock_price:0,type:'link'}); setLinkTitle('');setLinkUrl('');showToast('✓ Link added!'); }}
                    disabled={!linkTitle||!linkUrl||!site?.id}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold disabled:opacity-50">
                    <Plus className="w-4 h-4"/>
                  </button>
                </div>
              </div>
              {(links||[]).map((l:any)=>{
                const social = SOCIAL_NETWORKS.find(s=>s.id===l.icon);
                return (
                  <div key={l.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2.5 border border-gray-700">
                    <div className="flex items-center gap-2.5">
                      {social?<span style={{color:social.color}}>{social.icon}</span>:<Link2 className="w-4 h-4 text-gray-500"/>}
                      <div>
                        <p className="text-xs font-bold text-white">{l.title}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-xs">{l.url}</p>
                      </div>
                    </div>
                    <button onClick={()=>deleteLink(l.id)} className="text-red-400 hover:text-red-300 ml-2 shrink-0"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                );
              })}
            </div>

            {/* Address */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4"/> Endereço / Localização
              </h2>
              <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Cidade, Estado, País" className={inp}/>
            </div>

            {/* Photo Gallery */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Image className="w-4 h-4"/> Galeria de Fotos
              </h2>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-300">Mostrar galeria no site</label>
                {sw(showPhotos,setShowPhotos)}
              </div>
              {showPhotos && (
                <>
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 hover:border-purple-500 w-fit transition-colors">
                    <Upload className="w-3.5 h-3.5"/> {uploadingPhoto?'Uploading...':'Upload Foto'}
                    <input type="file" accept="image/*" className="hidden" disabled={uploadingPhoto||!site?.id}
                      onChange={e=>{ const f=e.target.files?.[0]; if(f) handlePhotoUpload(f); e.target.value=''; }}/>
                  </label>
                  {photos.length>0&&(
                    <div className="grid grid-cols-3 gap-2">
                      {photos.map((p:any)=>(
                        <div key={p.id} className="relative group">
                          <img src={p.url} alt="" className="w-full aspect-square object-cover rounded-lg border border-gray-700"/>
                          <button onClick={async()=>{ await supabase.from('mini_site_photos').delete().eq('id',p.id); setPhotos(prev=>prev.filter(x=>x.id!==p.id)); }}
                            className="absolute top-1 right-1 p-1 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3"/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Extra Sections */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4"/> Seções Extras
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-gray-400"/><label className="text-xs font-bold text-gray-300">Mostrar Domínios à Venda</label></div>
                  {sw(showDomains,setShowDomains)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-400"/><label className="text-xs font-bold text-gray-300">Mostrar Imóveis à Venda</label></div>
                  {sw(showProperties,setShowProperties)}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Live Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Preview</h3>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded-full">
                  {currentTheme.label}
                </span>
              </div>
              <div className={`bg-gradient-to-br ${currentTheme.colors} rounded-2xl p-5 min-h-[500px] border border-white/10 shadow-2xl`}>
                <div className="flex flex-col items-center text-center space-y-2 mb-5">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="" className={`w-20 h-20 object-cover border-2 border-white/30 shadow-lg ${photoShape==='round'?'rounded-full':'rounded-xl'}`}/>
                    : <div className={`w-20 h-20 flex items-center justify-center text-3xl font-black text-white/90 border-2 border-white/20 ${photoShape==='round'?'rounded-full':'rounded-xl'}`} style={{backgroundColor:currentTheme.accent}}>
                        {siteName?.[0]?.toUpperCase()||'?'}
                      </div>}
                  <h4 className="text-lg font-black text-white">{siteName||'Seu Nome'}</h4>
                  {bio && <p className="text-xs text-white/60 max-w-[200px] leading-relaxed">{bio.slice(0,100)}{bio.length>100?'...':''}</p>}
                </div>

                {/* Links preview */}
                <div className="space-y-1.5 mb-4">
                  {(links||[]).slice(0,3).map((l:any)=>(
                    <div key={l.id} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/10">
                      <Link2 className="w-3 h-3 text-white/50 shrink-0"/>
                      <span className="text-xs text-white/80 truncate">{l.title}</span>
                    </div>
                  ))}
                  {(!links||links.length===0)&&['Instagram','Twitter','YouTube'].map(n=>(
                    <div key={n} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/10">
                      <Link2 className="w-3 h-3 text-white/20"/><span className="text-xs text-white/30">{n}</span>
                    </div>
                  ))}
                </div>

                {/* Videos preview */}
                {(videos||[]).length>0&&(
                  <div className={`grid gap-1.5 mb-3 ${layoutCols===1?'grid-cols-1':layoutCols===3?'grid-cols-3':'grid-cols-2'}`}>
                    {(videos||[]).slice(0,4).map((v:any)=>(
                      <div key={v.id} className="bg-white/10 rounded-lg overflow-hidden border border-white/10">
                        <img src={v.thumbnail_url||`https://img.youtube.com/vi/${v.youtube_id}/default.jpg`} alt="" className="w-full aspect-video object-cover"/>
                        <div className="p-1"><p className="text-[9px] text-white/70 font-bold truncate">{v.title}</p></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CV preview */}
                {showCv&&(
                  <div className="mt-3 bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-[10px] text-white/50 font-bold mb-1">📄 CV / Resume</p>
                    {cvHeadline&&<p className="text-[10px] text-white/70 font-bold">{cvHeadline}</p>}
                    {contactEmail&&(
                      <div className="flex items-center gap-1 mt-1">
                        <Lock className="w-3 h-3 text-white/30"/>
                        <span className="text-[9px] text-white/30">Contact locked · ${contactPrice} to unlock</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-[8px] text-white/20 text-center mt-5">hashpo.com</p>
              </div>

              <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 hover:border-purple-500 transition-colors">
                <Eye className="w-3.5 h-3.5"/> Open full preview
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
