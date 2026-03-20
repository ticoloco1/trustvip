'use client';
import { useState } from 'react';
import { Shield, BadgeCheck, Award, MapPin, Mail, Phone, Linkedin, Lock, Unlock, X, Hash, Check, ExternalLink, Play, FileText, ShoppingBag, Clock, Heart, Share2 } from 'lucide-react';
import { FeedModule, CountdownTimer } from './FeedSystem';
import { CVModule } from './CVSystem';
import { VideoGallery } from './VideoPaywall';
import { getTemplateById } from '@/lib/templates';

const STICKER_MAP: Record<string, { emoji:string; label:string; color:string }> = {
  open_work:    { emoji:'💼', label:'Open to Work',  color:'bg-green-50 text-green-700 border-green-200' },
  available:    { emoji:'✅', label:'Available',      color:'bg-green-50 text-green-700 border-green-200' },
  hiring:       { emoji:'🤝', label:'We\'re Hiring',  color:'bg-blue-50 text-blue-700 border-blue-200' },
  freelance:    { emoji:'💻', label:'Freelance',      color:'bg-purple-50 text-purple-700 border-purple-200' },
  verified:     { emoji:'✔️',  label:'Verified',       color:'bg-blue-50 text-blue-700 border-blue-200' },
  pro:          { emoji:'⭐', label:'Pro Creator',    color:'bg-yellow-50 text-yellow-700 border-yellow-200' },
  gold:         { emoji:'🥇', label:'Gold Member',   color:'bg-yellow-50 text-yellow-700 border-yellow-200' },
  lawyer:       { emoji:'⚖️',  label:'Attorney',       color:'bg-slate-50 text-slate-700 border-slate-200' },
  doctor:       { emoji:'🩺', label:'Doctor',         color:'bg-sky-50 text-sky-700 border-sky-200' },
  crypto:       { emoji:'🔷', label:'Web3 Native',   color:'bg-indigo-50 text-indigo-700 border-indigo-200' },
};

export default function TrustMiniSite({ profile }: { profile: any }) {
  const tmpl = getTemplateById(profile.template_id || 'clean-white');
  const { colors: c, style: s } = tmpl;
  const pages = profile.site_customization?.pages || [{ id:'p1', title:'Profile', modules:['feed','bio','cv','contact','social'], layout:1 }];
  const [activePage, setActivePage] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [unlockModal, setUnlockModal] = useState<any>(null);
  const [unlockedVideos, setUnlockedVideos] = useState(new Set<string>());
  const isPaywalled = profile.paywall_enabled && !subscribed;
  const current = pages[activePage] || pages[0];
  const cols = current?.layout || 1;
  const fontStyle = { fontFamily: `'${s.fontFamily}', Georgia, system-ui, sans-serif` };
  const photoSizePx = { sm:64, md:80, lg:112, xl:140 }[s.photoSize] || 96;
  const photoRadius = s.photoShape === 'circle' ? '9999px' : s.photoShape === 'square' ? '4px' : s.photoShape === 'hexagon' ? '0' : '16px';
  const photoClip = s.photoShape === 'hexagon' ? 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' : undefined;
  const initials = profile.name?.charAt(0)?.toUpperCase() || '?';

  const renderModule = (mod: string) => {
    switch (mod) {
      case 'feed': return (
        <FeedModule key={mod} posts={profile.feed_posts || []}
          accent={c.accent} cardBg={c.card} border={c.border} text={c.text} muted={c.muted} />
      );
      case 'bio': return (
        <div key={mod} className="rounded-2xl p-5" style={{ background:c.card, border:`1px solid ${c.border}` }}>
          {profile.bio && <p className="text-sm leading-relaxed mb-4" style={{ color:c.muted }}>{profile.bio}</p>}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((sk: string) => (
                <span key={sk} className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background:`${c.accent}12`, color:c.accent, border:`1px solid ${c.accent}25` }}>{sk}</span>
              ))}
            </div>
          )}
        </div>
      );
      case 'cv': return (
        <CVModule key={mod}
          entries={profile.cv || []}
          contact={{ email:profile.contact_email, phone:profile.contact_phone, linkedin:profile.contact_linkedin }}
          name={profile.name} contactLocked={true} contactPrice={20} badge={profile.badge}
          accent={c.accent} cardBg={c.card} border={c.border} text={c.text} muted={c.muted} />
      );
      case 'links': {
        const links = profile.links || [];
        if (!links.length) return null;
        return (
          <div key={mod} className="space-y-2">
            {links.map((l: any, i: number) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl p-4 transition-all hover:opacity-80"
                style={{ background:c.card, border:`1px solid ${c.border}` }}>
                <span className="text-lg">{l.icon||'🔗'}</span>
                <span className="flex-1 text-sm font-medium" style={{ color:c.text }}>{l.label}</span>
                <ExternalLink className="h-4 w-4 opacity-30" style={{ color:c.accent }} />
              </a>
            ))}
          </div>
        );
      }
      case 'video': {
        const videos = profile.videos || [];
        if (!videos.length) return null;
        return <VideoGallery key={mod} videos={videos} accent={c.accent} cardBg={c.card} border={c.border} text={c.text} muted={c.muted} />;
      }
      case 'social': {
        const socials = [
          { key:'contact_linkedin', icon:Linkedin, label:'LinkedIn', color:'text-blue-600' },
          { key:'contact_instagram', icon:Hash, label:'Instagram', color:'text-pink-600' },
          { key:'contact_twitter', icon:Hash, label:'Twitter', color:'text-gray-900' },
          { key:'contact_youtube', icon:Play, label:'YouTube', color:'text-red-600' },
        ].filter(s => profile[s.key]);
        if (!socials.length) return null;
        return (
          <div key={mod} className="flex flex-wrap gap-2">
            {socials.map(({ key, icon:Icon, label, color }) => (
              <a key={key} href={profile[key]?.startsWith('http')?profile[key]:`https://${profile[key]}`}
                target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:opacity-80 ${color}`}
                style={{ background:c.card, border:`1px solid ${c.border}` }}>
                <Icon className="h-4 w-4" /> {label}
              </a>
            ))}
          </div>
        );
      }
      case 'contact': return (
        <div key={mod} className="rounded-2xl p-5" style={{ background:c.card, border:`1px solid ${c.border}` }}>
          <p className="text-sm font-semibold mb-3" style={{ color:c.text }}>Contact</p>
          {isPaywalled ? (
            <div className="text-center py-3">
              <Lock className="h-7 w-7 mx-auto mb-2" style={{ color:c.accent }} />
              <p className="text-sm font-medium mb-1" style={{ color:c.text }}>Contact locked</p>
              <p className="text-xs mb-3" style={{ color:c.muted }}>Subscribe for full access</p>
              <button onClick={()=>setPaywallOpen(true)} className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background:c.accent, color:c.accentFg }}>
                Subscribe ${profile.paywall_price||9.99}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {profile.contact_email && <a href={`mailto:${profile.contact_email}`} className="flex items-center gap-2 text-sm" style={{ color:c.accent }}>📧 {profile.contact_email}</a>}
              {profile.contact_phone && <p className="flex items-center gap-2 text-sm" style={{ color:c.muted }}>📱 {profile.contact_phone}</p>}
            </div>
          )}
        </div>
      );
      case 'classifieds': {
        const items = profile.classifieds || [];
        if (!items.length) return null;
        return (
          <div key={mod}>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color:c.text }}>
              <ShoppingBag className="h-4 w-4" style={{ color:c.accent }} /> Classifieds
            </p>
            <div className="space-y-3">
              {items.map((item: any) => (
                <div key={item.id} className="rounded-2xl p-4" style={{ background:c.card, border:`1px solid ${c.border}` }}>
                  <div className="flex items-start justify-between">
                    <div><p className="text-sm font-semibold" style={{ color:c.text }}>{item.title}</p><p className="text-xs mt-0.5" style={{ color:c.muted }}>{item.category}{item.location&&` · ${item.location}`}</p></div>
                    <span className="text-sm font-bold" style={{ color:c.accent }}>${item.price?.toLocaleString()}</span>
                  </div>
                  <button className="mt-3 w-full rounded-xl py-2 text-xs font-semibold" style={{ background:`${c.accent}12`, color:c.accent, border:`1px solid ${c.accent}25` }}>Pay with USDC</button>
                </div>
              ))}
            </div>
          </div>
        );
      }
      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background:c.bg, ...fontStyle }}>
      {/* Nav */}
      <nav className="border-b sticky top-0 z-40 backdrop-blur-xl bg-white/90" style={{ borderColor:c.border }}>
        <div className="mx-auto max-w-3xl px-4 flex h-14 items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
              <Shield className="h-3 w-3 text-white" />
            </div>
            <span className="font-serif font-bold text-gray-900 text-sm">TrustBank</span>
          </a>
          <a href="/signup" className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-80" style={{ background:c.accent }}>
            Create yours
          </a>
        </div>
      </nav>

      {/* Banner */}
      <div className="h-36 sm:h-48 relative overflow-hidden" style={{ background:`linear-gradient(135deg, ${c.accent}20, ${c.bg})` }}>
        {profile.banner_url && <img src={profile.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        {/* Header */}
        <div className="-mt-14 mb-8">
          <div className={`flex ${s.headerAlign==='center'?'flex-col items-center text-center':'items-end justify-between'} gap-4 mb-4`}>
            {/* Photo */}
            {profile.photo_url
              ? <img src={profile.photo_url} alt={profile.name} style={{ width:photoSizePx, height:photoSizePx, borderRadius:photoRadius, objectFit:'cover', clipPath:photoClip, flexShrink:0, boxShadow:'0 0 0 4px white, 0 2px 12px rgba(0,0,0,0.1)' }} />
              : <div style={{ width:photoSizePx, height:photoSizePx, borderRadius:photoRadius, clipPath:photoClip, background:`linear-gradient(135deg, ${c.accent}, ${c.accent}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:photoSizePx/3, fontWeight:700, color:c.accentFg, flexShrink:0, boxShadow:'0 0 0 4px white, 0 2px 12px rgba(0,0,0,0.1)' }}>
                  {initials}
                </div>
            }
            {s.headerAlign !== 'center' && (
              <button onClick={()=>isPaywalled?setPaywallOpen(true):null}
                className="flex-shrink-0 mb-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-80"
                style={{ background:isPaywalled?`${c.accent}15`:c.accent, color:isPaywalled?c.accent:c.accentFg, border:isPaywalled?`1px solid ${c.accent}30`:'none' }}>
                {isPaywalled?<><Lock className="h-3.5 w-3.5 inline mr-1.5"/>Subscribe</>:'Contact'}
              </button>
            )}
          </div>
          <div className={s.headerAlign==='center'?'text-center':''}>
            <div className="flex items-center gap-2 flex-wrap mb-1" style={{ justifyContent:s.headerAlign==='center'?'center':'flex-start' }}>
              <h1 className="text-2xl font-bold" style={{ color:c.text }}>{profile.name}</h1>
              {profile.badge==='blue' && <BadgeCheck className="h-6 w-6 text-blue-500" title="Verified" />}
              {profile.badge==='gold' && <Award className="h-6 w-6 text-yellow-500" title="Verified Business" />}
            </div>
            {profile.title && <p className="text-sm mb-2" style={{ color:c.muted }}>{profile.title}</p>}
            {profile.location && (
              <p className="flex items-center gap-1.5 text-sm mb-3" style={{ color:`${c.muted}99`, justifyContent:s.headerAlign==='center'?'center':'flex-start' }}>
                <MapPin className="h-3.5 w-3.5" /> {profile.location}
              </p>
            )}
            {/* Stickers */}
            {profile.stickers?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3" style={{ justifyContent:s.headerAlign==='center'?'center':'flex-start' }}>
                {profile.stickers.map((sid: string) => {
                  const st = STICKER_MAP[sid]; if (!st) return null;
                  return <span key={sid} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium ${st.color}`}>{st.emoji} {st.label}</span>;
                })}
              </div>
            )}
            {s.headerAlign === 'center' && (
              <button onClick={()=>isPaywalled?setPaywallOpen(true):null}
                className="inline-flex items-center gap-2 mt-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-80"
                style={{ background:isPaywalled?`${c.accent}15`:c.accent, color:isPaywalled?c.accent:c.accentFg, border:isPaywalled?`1px solid ${c.accent}30`:'none' }}>
                {isPaywalled?<><Lock className="h-3.5 w-3.5"/>Subscribe ${profile.paywall_price||9.99}</>:'Contact'}
              </button>
            )}
          </div>
        </div>

        {/* Page tabs */}
        {pages.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            {pages.map((pg: any, i: number) => (
              <button key={pg.id} onClick={()=>setActivePage(i)}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all"
                style={{ background:activePage===i?c.accent:c.card, color:activePage===i?c.accentFg:c.muted, border:`1px solid ${activePage===i?c.accent:c.border}` }}>
                {pg.icon} {pg.title}
              </button>
            ))}
          </div>
        )}

        {/* Modules */}
        <div className={`grid gap-5 ${cols===2?'sm:grid-cols-2':cols===3?'sm:grid-cols-2 lg:grid-cols-3':'grid-cols-1'}`}>
          {(current?.modules || []).map((mod: string) => renderModule(mod))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center" style={{ borderColor:c.border }}>
          <p className="text-xs" style={{ color:`${c.muted}80` }}>
            Powered by <a href="/" style={{ color:c.accent }}>TrustBank</a>
            {' · '}
            <a href="/signup" style={{ color:c.accent }}>Create your profile</a>
          </p>
        </div>
      </div>

      {/* Paywall Modal */}
      {paywallOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-6 relative bg-white border border-gray-100 shadow-xl">
            <button onClick={()=>setPaywallOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="h-5 w-5"/></button>
            <div className="text-center mb-5">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-yellow-50 border border-yellow-100">
                <Lock className="h-7 w-7 text-yellow-600"/>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Unlock {profile.name}'s profile</h3>
              <p className="text-sm text-gray-500">Full access to contact, articles, videos and more.</p>
            </div>
            <div className="space-y-3 mb-4">
              {[{ label:'Monthly', price:profile.paywall_price||9.99, period:'/mo', featured:false }, { label:'Annual', price:(profile.paywall_price||9.99)*10, period:'/yr', featured:true }].map(plan => (
                <button key={plan.period} onClick={()=>{setSubscribed(true);setPaywallOpen(true);}}
                  className="w-full flex items-center justify-between rounded-2xl p-4 transition-all hover:opacity-80"
                  style={{ background:plan.featured?c.accent:'#f9fafb', border:`1px solid ${plan.featured?c.accent:'#e5e7eb'}`, color:plan.featured?c.accentFg:'#374151' }}>
                  <div className="text-left"><p className="text-sm font-semibold">{plan.label}</p>{plan.featured&&<p className="text-xs opacity-70">Save 17%</p>}</div>
                  <p className="text-lg font-bold">${plan.price}<span className="text-xs font-normal opacity-70">{plan.period}</span></p>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400">USDC on Polygon · Cancel anytime</p>
          </div>
        </div>
      )}
    </div>
  );
}
