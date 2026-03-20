'use client';
import { useState, useRef } from 'react';
import { Shield, Home, User, Palette, Layout, FileText, DollarSign, Wallet, Star, MessageSquare, Settings, Hash, Video, Eye, EyeOff, Menu, X, Check, Loader2, Copy, Save, Lock, Camera, ChevronRight, Coins, TrendingUp, Plus, BadgeCheck, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useSlugs, useTransactions, useStats } from '@/hooks/useSupabase';
import { PageBuilder, StickerPicker, type MiniSitePage, type StickerId } from '@/components/minisite/PageBuilder';
import { FeedComposer } from '@/components/minisite/FeedSystem';
import { TEMPLATES, TEMPLATE_CATEGORIES, getByCategory } from '@/lib/templates';
import { isConfigured } from '@/lib/supabase';

const NAV = [
  { id:'overview',   label:'Overview',    icon:Home },
  { id:'profile',    label:'Profile',     icon:User },
  { id:'templates',  label:'Templates',   icon:Palette },
  { id:'modules',    label:'Modules',     icon:Layout },
  { id:'content',    label:'Content',     icon:FileText },
  { id:'monetize',   label:'Monetize',    icon:DollarSign },
  { id:'wallet',     label:'Wallet',      icon:Wallet },
  { id:'slugs',      label:'Slugs',       icon:Hash },
  { id:'plans',      label:'Plans',       icon:Star },
  { id:'settings',   label:'Settings',    icon:Settings },
];

export default function TrustDashboard() {
  const { user, signOut } = useAuth();
  const { profile, loading, update, uploadPhoto } = useProfile(user);
  const { slugs } = useSlugs(profile?.id);
  const { transactions, balance } = useTransactions(profile?.id);
  const stats = useStats(profile?.id);

  const [section, setSection] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string|null>(null);
  const [templateCat, setTemplateCat] = useState('all');
  const photoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const [editName,setEditName]=useState('');
  const [editTitle,setEditTitle]=useState('');
  const [editBio,setEditBio]=useState('');
  const [editLocation,setEditLocation]=useState('');
  const [editSkills,setEditSkills]=useState('');
  const [editEmail,setEditEmail]=useState('');
  const [editPhone,setEditPhone]=useState('');
  const [editLinkedin,setEditLinkedin]=useState('');
  const [editPublished,setEditPublished]=useState(false);
  const [editStickers,setEditStickers]=useState<StickerId[]>([]);
  const [editPages,setEditPages]=useState<MiniSitePage[]>([{ id:'p1', title:'Profile', slug:'profile', icon:'⚖️', modules:['feed','bio','cv','contact','social'], layout:1 }]);
  const [selectedTemplate,setSelectedTemplate]=useState('clean-white');
  const [synced,setSynced]=useState(false);

  if (profile && !synced) {
    setEditName(profile.name||''); setEditTitle(profile.title||''); setEditBio(profile.bio||'');
    setEditLocation(profile.location||''); setEditSkills((profile.skills||[]).join(', '));
    setEditEmail(profile.contact_email||''); setEditPhone(profile.contact_phone||'');
    setEditLinkedin(profile.contact_linkedin||''); setEditPublished(profile.is_published||false);
    setEditStickers(profile.site_customization?.stickers||[]);
    if (profile.site_customization?.pages) setEditPages(profile.site_customization.pages);
    setSelectedTemplate(profile.site_customization?.template_id||'clean-white');
    setSynced(true);
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await update({
      name:editName, title:editTitle, bio:editBio, location:editLocation,
      skills:editSkills.split(',').map(s=>s.trim()).filter(Boolean),
      contact_email:editEmail, contact_phone:editPhone, contact_linkedin:editLinkedin,
      is_published:editPublished,
      site_customization:{ ...profile?.site_customization, stickers:editStickers, pages:editPages, template_id:selectedTemplate },
    } as any);
    setSaving(false);
    if (!error) showToast('✓ Saved!'); else showToast('Error saving');
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>, type:'avatar'|'banner') => {
    const file = e.target.files?.[0]; if(!file) return;
    showToast('Uploading...');
    const url = await uploadPhoto(file,type);
    if(url) showToast('✓ Photo updated!'); else showToast('Upload failed — check Storage buckets in Supabase');
  };

  const initials = (profile?.name||user?.email||'T').charAt(0).toUpperCase();

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"/>
    </div>
  );
  if (!user) { if(typeof window!=='undefined') window.location.href='/login'; return null; }

  const filteredTemplates = getByCategory(templateCat);

  return (
    <div className="min-h-screen bg-white flex">
      {toast && <div className="fixed top-4 right-4 z-50 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 shadow-lg animate-fade-up">{toast}</div>}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-56 flex-col border-r border-gray-100 bg-white ${mobileNav?'flex':'hidden lg:flex'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center"><Shield className="h-3.5 w-3.5 text-white"/></div>
            <span className="font-serif font-bold text-gray-900">TrustBank</span>
          </div>
          <button className="lg:hidden text-gray-400" onClick={()=>setMobileNav(false)}><X className="h-4 w-4"/></button>
        </div>

        <div className="px-3 py-3 border-b border-gray-100">
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <div className="flex items-center gap-2 mb-2">
              {profile?.photo_url
                ? <img src={profile.photo_url} alt="" className="h-8 w-8 rounded-full object-cover flex-shrink-0"/>
                : <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{initials}</div>
              }
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{profile?.name||user.email?.split('@')[0]}</p>
                <p className="text-[10px] text-gray-400 truncate">trustbank.xyz/{profile?.slug}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono">{hideBalance?'••••':`${(profile?.credits||0)/100} USDC`}</span>
              <button onClick={()=>setHideBalance(!hideBalance)} className="text-gray-300">{hideBalance?<Eye className="h-3 w-3"/>:<EyeOff className="h-3 w-3"/>}</button>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon; const active = section===item.id;
            return (
              <button key={item.id} onClick={()=>{setSection(item.id);setMobileNav(false);}}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left ${active?'bg-yellow-50 text-yellow-800 border border-yellow-200':'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Icon className="h-4 w-4 flex-shrink-0"/>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-4 pt-2 border-t border-gray-100 space-y-2">
          <a href={`/${profile?.slug}`} target="_blank" className="flex items-center gap-2 rounded-xl border border-gray-100 px-3 py-2 text-xs text-gray-500 hover:text-gray-900 transition-all">
            <Eye className="h-3.5 w-3.5"/> View profile
          </a>
          <button onClick={()=>signOut()} className="w-full flex items-center gap-2 rounded-xl border border-gray-100 px-3 py-2 text-xs text-gray-500 hover:text-red-500 transition-all">
            <X className="h-3.5 w-3.5"/> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-gray-400" onClick={()=>setMobileNav(true)}><Menu className="h-5 w-5"/></button>
              <h1 className="text-sm font-semibold text-gray-900">{NAV.find(n=>n.id===section)?.label}</h1>
            </div>
            <div className="flex items-center gap-2">
              {['profile','templates','modules'].includes(section) && (
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-all">
                  {saving?<Loader2 className="h-3.5 w-3.5 animate-spin"/>:<Save className="h-3.5 w-3.5"/>}
                  {saving?'Saving...':'Save'}
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl">

          {/* OVERVIEW */}
          {section==='overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {label:'Views',value:stats.views||'—',icon:TrendingUp,color:'bg-yellow-50 text-yellow-700'},
                  {label:'Earned',value:`$${stats.revenue.toFixed(2)}`,icon:Coins,color:'bg-green-50 text-green-700'},
                  {label:'CV unlocks',value:stats.unlocks,icon:Lock,color:'bg-blue-50 text-blue-700'},
                  {label:'My slugs',value:stats.slug_count,icon:Hash,color:'bg-purple-50 text-purple-700'},
                ].map(s=>(
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon className="h-4 w-4"/></div>
                    <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-900">Your mini-site</p>
                  <span className={`text-[10px] rounded-full px-2 py-0.5 border ${profile?.is_published?'bg-green-50 border-green-200 text-green-700':'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                    {profile?.is_published?'Published':'Draft'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  {profile?.photo_url
                    ?<img src={profile.photo_url} alt="" className="h-12 w-12 rounded-2xl object-cover flex-shrink-0"/>
                    :<div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white font-bold flex-shrink-0">{initials}</div>
                  }
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{profile?.name||'Your name'}</p>
                    <p className="text-xs text-gray-400">{profile?.title||'Add your title'}</p>
                    <p className="text-[10px] text-gray-300 font-mono">trustbank.xyz/{profile?.slug}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a href={`/${profile?.slug}`} target="_blank" className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 py-2 text-xs text-gray-500 hover:text-gray-900 transition-all">
                    <Eye className="h-3.5 w-3.5"/> View
                  </a>
                  <button onClick={()=>{navigator.clipboard.writeText(`https://trustbank.xyz/${profile?.slug}`);showToast('Link copied!');}}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 py-2 text-xs text-gray-500 hover:text-gray-900 transition-all">
                    <Copy className="h-3.5 w-3.5"/> Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{l:'Edit profile',i:User,a:'profile'},{l:'Templates',i:Palette,a:'templates'},{l:'Modules',i:Layout,a:'modules'},{l:'Slugs',i:Hash,a:'slugs'}].map(({l,i:I,a})=>(
                  <button key={l} onClick={()=>setSection(a)} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-xs text-gray-500 hover:border-yellow-200 hover:text-yellow-700 transition-all shadow-sm">
                    <I className="h-5 w-5"/>{l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {section==='profile' && (
            <div className="space-y-5 max-w-2xl">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="relative h-28 bg-gradient-to-r from-yellow-50 to-amber-50 cursor-pointer group" onClick={()=>bannerRef.current?.click()}>
                  {profile?.banner_url&&<img src={profile.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60"/>}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-all">
                    <span className="text-white text-xs flex items-center gap-2 bg-black/40 rounded-xl px-3 py-1.5"><Camera className="h-4 w-4"/>Change banner</span>
                  </div>
                  <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={e=>handlePhoto(e,'banner')}/>
                </div>
                <div className="px-5 pb-4 -mt-7">
                  <div className="relative inline-block cursor-pointer group" onClick={()=>photoRef.current?.click()}>
                    {profile?.photo_url
                      ?<img src={profile.photo_url} alt="" className="h-14 w-14 rounded-2xl object-cover ring-4 ring-white shadow-sm"/>
                      :<div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-xl font-bold text-white ring-4 ring-white shadow-sm">{initials}</div>
                    }
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all"><Camera className="h-4 w-4 text-white"/></div>
                  </div>
                  <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e=>handlePhoto(e,'avatar')}/>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {l:'Full name',v:editName,s:setEditName,p:'Dr. Jane Smith'},
                    {l:'Professional title',v:editTitle,s:setEditTitle,p:'Attorney · Doctor · CEO...'},
                    {l:'Location',v:editLocation,s:setEditLocation,p:'New York, NY'},
                    {l:'Skills / specialties',v:editSkills,s:setEditSkills,p:'Corporate Law, M&A...'},
                  ].map(f=>(
                    <div key={f.l} className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">{f.l}</label>
                      <input value={f.v} onChange={e=>f.s(e.target.value)} className="input" placeholder={f.p}/>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Bio</label>
                  <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} rows={4} className="input resize-none" placeholder="Your professional story..."/>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <div><p className="text-sm font-medium text-gray-900">Publish to directory</p><p className="text-xs text-gray-400">Visible in search and directory</p></div>
                  <button onClick={()=>setEditPublished(!editPublished)} className={`relative h-6 w-11 rounded-full transition-colors ${editPublished?'bg-yellow-500':'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${editPublished?'left-5':'left-0.5'}`}/>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <p className="text-sm font-semibold text-gray-900">Contact & Social</p>
                {[
                  {l:'Contact email',v:editEmail,s:setEditEmail,p:'contact@you.com',e:'📧'},
                  {l:'Phone / WhatsApp',v:editPhone,s:setEditPhone,p:'+1 212...',e:'📱'},
                  {l:'LinkedIn',v:editLinkedin,s:setEditLinkedin,p:'linkedin.com/in/...',e:'💼'},
                ].map(f=>(
                  <div key={f.l} className="flex items-center gap-3">
                    <span className="text-base w-6">{f.e}</span>
                    <input value={f.v} onChange={e=>f.s(e.target.value)} className="input flex-1" placeholder={f.p}/>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <StickerPicker selected={editStickers} onChange={setEditStickers}
                  accent="#c9a84c" cardBg="#ffffff" border="#e5e5e5" text="#111111" muted="#737373"/>
              </div>

              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-all">
                {saving?<Loader2 className="h-4 w-4 animate-spin"/>:<Save className="h-4 w-4"/>}
                {saving?'Saving...':'Save Profile'}
              </button>
            </div>
          )}

          {/* TEMPLATES — 40 templates */}
          {section==='templates' && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_CATEGORIES.map(cat=>(
                  <button key={cat.id} onClick={()=>setTemplateCat(cat.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${templateCat===cat.id?'border-yellow-400 bg-yellow-50 text-yellow-800':'border-gray-200 text-gray-500 hover:text-gray-900'}`}>
                    {cat.emoji} {cat.label} {cat.id==='all'?`(${TEMPLATES.length})`:''}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredTemplates.map(tmpl=>{
                  const isSelected = tmpl.id===selectedTemplate;
                  return (
                    <button key={tmpl.id} onClick={()=>{setSelectedTemplate(tmpl.id); showToast(`Template "${tmpl.name}" selected`);}}
                      className={`group rounded-2xl border-2 overflow-hidden transition-all text-left ${isSelected?'border-yellow-400 shadow-md shadow-yellow-100':'border-gray-100 hover:border-yellow-200'}`}>
                      <div className="h-24 relative p-3 flex flex-col justify-between" style={{ background:tmpl.colors.bg }}>
                        <div className="flex items-start justify-between">
                          <span className="text-base">{tmpl.emoji}</span>
                          <span className="text-[9px] rounded-full px-1.5 py-0.5 font-mono" style={{ color:tmpl.colors.accent, background:`${tmpl.colors.accent}15`, border:`1px solid ${tmpl.colors.accent}30` }}>
                            {tmpl.columns}col
                          </span>
                        </div>
                        <div>
                          <div className="h-1.5 w-8 rounded-full mb-1" style={{ background:tmpl.colors.accent }}/>
                          <div className="h-1 w-5 rounded-full opacity-40" style={{ background:tmpl.colors.text }}/>
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="h-7 w-7 rounded-full bg-yellow-500 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white"/>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="px-2.5 py-2" style={{ background:`${tmpl.colors.bg}dd` }}>
                        <p className="text-xs font-semibold truncate" style={{ color:tmpl.colors.text }}>{tmpl.name}</p>
                        <p className="text-[10px] truncate" style={{ color:tmpl.colors.muted }}>{tmpl.vibe}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-all">
                {saving?<Loader2 className="h-4 w-4 animate-spin"/>:<Save className="h-4 w-4"/>}
                Apply template
              </button>
            </div>
          )}

          {/* MODULES */}
          {section==='modules' && (
            <div className="space-y-5 max-w-2xl">
              <PageBuilder pages={editPages} onChange={setEditPages} accent="#c9a84c" cardBg="#ffffff" border="#e5e5e5" text="#111111" muted="#737373"/>
              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-all">
                {saving?<Loader2 className="h-4 w-4 animate-spin"/>:<Save className="h-4 w-4"/>}
                Save modules
              </button>
            </div>
          )}

          {/* CONTENT */}
          {section==='content' && (
            <div className="space-y-5 max-w-2xl">
              <FeedComposer onPost={()=>showToast('Post published!')} accent="#c9a84c" cardBg="#ffffff" border="#e5e5e5" text="#111111" muted="#737373"/>
            </div>
          )}

          {/* MONETIZE */}
          {section==='monetize' && (
            <div className="space-y-4 max-w-xl">
              {[
                {title:'Paywall',icon:Lock,color:'text-yellow-700 bg-yellow-50',desc:'Charge monthly or per-access for your full profile. 80% goes to you via USDC.'},
                {title:'CV Contact Unlock',icon:User,color:'text-blue-700 bg-blue-50',desc:'Your contact details are hidden. Companies pay $20 to unlock — you receive $10 instantly.'},
                {title:'Video Paywall',icon:Video,color:'text-purple-700 bg-purple-50',desc:'Lock videos. Set your price and access duration (minimum 24 hours).'},
                {title:'Article Paywall',icon:FileText,color:'text-green-700 bg-green-50',desc:'Charge per article. Readers pay once to unlock forever.'},
              ].map(item=>(
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3 hover:border-yellow-200 transition-all cursor-pointer">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}><item.icon className="h-5 w-5"/></div>
                  <div className="flex-1"><p className="text-sm font-semibold text-gray-900 mb-1">{item.title}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                  <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-1"/>
                </div>
              ))}
            </div>
          )}

          {/* WALLET */}
          {section==='wallet' && (
            <div className="space-y-5 max-w-xl">
              <div className="rounded-2xl overflow-hidden border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
                <p className="text-xs text-yellow-700 uppercase tracking-widest mb-2 font-semibold">USDC Balance</p>
                <p className="text-4xl font-bold text-gray-900">{hideBalance?'••••':balance.toFixed(2)}</p>
                <p className="text-sm text-yellow-700 mt-1">Polygon · Smart wallet</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <p className="text-sm font-semibold text-gray-900">Wallet address</p>
                <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <p className="font-mono text-xs text-yellow-700 flex-1 truncate">{profile?.smart_wallet||profile?.wallet_address||'Not set up yet'}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="rounded-xl border border-gray-100 py-2.5 text-xs text-gray-500 hover:text-gray-900 transition-all">Export to MetaMask</button>
                  <button className="rounded-xl bg-yellow-50 border border-yellow-200 py-2.5 text-xs text-yellow-700 hover:bg-yellow-100 transition-all">Withdraw USDC</button>
                </div>
              </div>
              {transactions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                  <Coins className="h-8 w-8 text-gray-200 mx-auto mb-2"/>
                  <p className="text-sm text-gray-400">No transactions yet</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                  {transactions.map(tx=>(
                    <div key={tx.id} className="flex items-center gap-3 px-5 py-3">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${tx.type==='in'?'bg-green-50 text-green-600':'bg-red-50 text-red-500'}`}>{tx.type==='in'?'↓':'↑'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-900 truncate">{tx.description||tx.type}</p>
                        <p className="text-[10px] text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className={`text-sm font-semibold ${tx.type==='in'?'text-green-600':'text-red-500'}`}>{tx.type==='in'?'+':'-'}${tx.amount_usdc?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SLUGS */}
          {section==='slugs' && (
            <div className="space-y-4 max-w-2xl">
              {slugs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                  <Hash className="h-10 w-10 text-gray-200 mx-auto mb-3"/>
                  <p className="text-sm font-semibold text-gray-900 mb-1">No slugs yet</p>
                  <p className="text-xs text-gray-400 mb-4">Own trustbank.xyz/lawyer or trustbank.xyz/doctor</p>
                  <a href="/slugs" className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-all">
                    Browse slug marketplace
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {slugs.map(s=>(
                    <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono font-bold text-yellow-700 text-lg">trustbank.xyz/{s.slug}</span>
                        <span className={`text-[10px] rounded-full px-2 py-0.5 border ${s.status==='active'?'bg-green-50 border-green-200 text-green-700':'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>{s.status}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 rounded-xl border border-gray-100 py-2 text-xs text-gray-500 hover:text-gray-900 transition-all">Edit price</button>
                        <button className="flex-1 rounded-xl bg-yellow-50 border border-yellow-200 py-2 text-xs text-yellow-700 hover:bg-yellow-100 transition-all">List for sale</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PLANS */}
          {section==='plans' && (
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
              {[
                {name:'Starter',price:'$15.90',period:'/mo',features:['3 pages','All 40 templates','Feed 7 days','Paywall','Analytics'],current:!profile?.minisite_plan||profile.minisite_plan==='none'},
                {name:'Professional',price:'$29.90',period:'/mo',features:['10 pages','AI Resume','Video paywall','CV lock','Slug auctions'],popular:true},
                {name:'Elite',price:'$59.90',period:'/mo',features:['Everything','Custom domain','White label','API access']},
              ].map(plan=>(
                <div key={plan.name} className={`relative bg-white rounded-2xl border p-5 shadow-sm ${(plan as any).popular?'border-yellow-400 shadow-yellow-100':'border-gray-100'}`}>
                  {(plan as any).popular&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-500 px-3 py-1 text-[11px] font-bold text-white">Popular</div>}
                  {(plan as any).current&&<div className="absolute -top-3 right-3 rounded-full bg-green-500 px-3 py-1 text-[11px] font-bold text-white">Active</div>}
                  <p className="font-bold text-gray-900 mb-1">{plan.name}</p>
                  <p className="text-2xl font-black text-gray-900 mb-4">{plan.price}<span className="text-xs font-normal text-gray-400">{plan.period}</span></p>
                  <ul className="space-y-1.5 mb-5">
                    {plan.features.map(f=><li key={f} className="flex items-center gap-1.5 text-xs text-gray-600"><Check className="h-3 w-3 text-green-500"/>{f}</li>)}
                  </ul>
                  <button className={`w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${(plan as any).current?'border border-gray-100 text-gray-400':'bg-gray-900 text-white hover:bg-gray-800'}`}>
                    {(plan as any).current?'Current plan':`Get ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS */}
          {section==='settings' && (
            <div className="space-y-4 max-w-md">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                {[{l:'Email',v:user.email||''},{l:'Slug',v:`trustbank.xyz/${profile?.slug||'...'}`},{l:'Plan',v:profile?.minisite_plan||'Free'},{l:'Platform',v:'TrustBank'}].map(f=>(
                  <div key={f.l} className="flex items-center justify-between text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                    <span className="text-gray-400">{f.l}</span>
                    <span className="text-gray-900 font-mono text-xs">{f.v}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>signOut()} className="w-full rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-medium text-red-500 hover:bg-red-100 transition-all">
                Sign out
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="flex">
          {NAV.slice(0,6).map(item=>{
            const Icon=item.icon; const active=section===item.id;
            return (
              <button key={item.id} onClick={()=>setSection(item.id)}
                className={`flex-1 flex flex-col items-center py-3 gap-1 text-[9px] font-medium transition-colors ${active?'text-yellow-600':'text-gray-400'}`}>
                <Icon className="h-5 w-5"/>
                {item.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
