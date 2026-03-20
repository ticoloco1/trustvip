'use client';
import { useState } from 'react';
import { BadgeCheck, Award, MapPin, Lock, Hash, ExternalLink, Play, FileText, Briefcase, GraduationCap, ShoppingBag, Star, Globe, X, Check, Eye, Heart, Share2, DollarSign, Gavel } from 'lucide-react';
import { FeedModule, CountdownTimer } from './FeedSystem';
import { VideoGallery, ProtectedVideoEmbed, VideoUnlockModal } from './VideoPaywall';
import { CVModule } from './CVSystem';
import { StickerBadge, type StickerId } from './PageBuilder';
import { buildAnyEmbed } from '@/lib/youtube';

interface Profile {
  slug: string; name: string; title?: string; bio?: string; location?: string;
  skills?: string[]; user_type: string; photo_url?: string | null; banner_url?: string | null;
  badge?: 'blue' | 'gold' | null; stickers?: StickerId[];
  contact_email?: string | null; contact_phone?: string | null;
  contact_linkedin?: string | null; contact_instagram?: string | null;
  contact_twitter?: string | null; contact_youtube?: string | null;
  paywall_enabled?: boolean; paywall_price?: number; paywall_interval?: string;
  site_customization?: any; template?: any; links?: any[]; feed_posts?: any[];
  videos?: any[]; articles?: any[]; classifieds?: any[]; cv?: any[];
  cv_contact?: any; slugs_for_sale?: any[]; pages?: any[];
}

function ProfilePhoto({ url, name, shape, size, accent }: any) {
  const px = { sm:64, md:96, lg:128, xl:160 }[size as string] || 96;
  const clip = shape === 'hexagon' ? { clipPath:'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } : {};
  const radius = shape === 'circle' ? '9999px' : shape === 'square' ? '0' : shape === 'hexagon' ? '0' : '16px';
  return url
    ? <img src={url} alt={name} style={{ width:px, height:px, borderRadius:radius, objectFit:'cover', flexShrink:0, ...clip }} />
    : <div style={{ width:px, height:px, borderRadius:radius, background:`linear-gradient(135deg,${accent},${accent}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:px/3, fontWeight:'bold', color:'#fff', flexShrink:0, ...clip }}>
        {name?.charAt(0)?.toUpperCase() || '?'}
      </div>;
}

export default function MiniSite({ profile }: { profile: Profile }) {
  const cust = profile.site_customization || {};
  const tmpl = profile.template || {};
  const bg      = cust.bg_color      || tmpl.colors?.bg      || '#09090b';
  const cardBg  = cust.card_bg_color || tmpl.colors?.card     || '#111113';
  const text    = cust.text_color    || tmpl.colors?.text     || '#fafafa';
  const muted   = tmpl.colors?.muted                          || '#71717a';
  const accent  = cust.accent_color  || tmpl.colors?.accent   || '#8b5cf6';
  const accentFg= tmpl.colors?.accentFg                       || '#ffffff';
  const border  = tmpl.colors?.border                         || '#27272a';
  const font    = cust.font_family   || tmpl.style?.fontFamily || 'Plus Jakarta Sans';
  const photoShape  = cust.photo_style === 'square' ? 'square' : (tmpl.style?.photoShape || 'circle');
  const photoSize   = tmpl.style?.photoSize   || 'lg';
  const headerAlign = tmpl.style?.headerAlign || 'center';
  const hasScanlines= tmpl.style?.hasScanlines || false;
  const hasGrid     = tmpl.style?.hasGrid     || false;
  const hasGlow     = tmpl.style?.hasGlow     || false;
  const pages       = profile.pages || [{ id:'p1', title:'Home', modules:['feed','bio','links','video','cv','portfolio','articles','classifieds','slugs','contact','social'], layout:1 }];
  const [activePage, setActivePage] = useState(0);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [unlockModal, setUnlockModal] = useState<any>(null);
  const [unlockedVideos, setUnlockedVideos] = useState<Set<string>>(new Set());
  const isPaywalled = profile.paywall_enabled && !subscribed;
  const current = pages[activePage] || pages[0];
  const cols = current?.layout || 1;

  const renderModule = (mod: string) => {
    switch (mod) {
      case 'feed': return (
        <FeedModule key={mod}
          posts={profile.feed_posts || [
            { id:'1', text:'Just finished a major project! Sharing more soon. 🚀', images:[], created_at:new Date().toISOString(), expires_at:new Date(Date.now()+5*864e5).toISOString(), likes:24 },
            { id:'2', text:'Behind the scenes today. The creative process never stops. Three days left on this post.', images:[], created_at:new Date().toISOString(), expires_at:new Date(Date.now()+3*864e5).toISOString(), likes:18 },
          ]}
          accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}
        />
      );
      case 'bio': return (
        <div key={mod} className="rounded-2xl p-5" style={{ background:cardBg, border:`1px solid ${border}` }}>
          {profile.bio && <p className="text-sm leading-relaxed mb-4" style={{ color:muted }}>{profile.bio}</p>}
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(s => (
                <span key={s} className="rounded-xl px-3 py-1.5 text-xs font-medium" style={{ background:`${accent}15`, color:accent, border:`1px solid ${accent}30` }}>{s}</span>
              ))}
            </div>
          )}
        </div>
      );
      case 'links': {
        const links = profile.links || [{ label:'Portfolio', url:'#', icon:'🔗' }, { label:'Book a call', url:'#', icon:'📅' }];
        return (
          <div key={mod} className="space-y-2">
            {links.map((l:any, i:number) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl p-4 transition-all hover:opacity-80 group"
                style={{ background:cardBg, border:`1px solid ${border}` }}>
                <span className="text-lg">{l.icon || '🔗'}</span>
                <span className="flex-1 text-sm font-medium" style={{ color:text }}>{l.label}</span>
                <ExternalLink className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color:accent }} />
              </a>
            ))}
          </div>
        );
      }
      case 'video': {
        const videos = profile.videos || [];
        const main = videos[0];
        if (!main) return null;
        return (
          <div key={mod}>
            <ProtectedVideoEmbed video={{ ...main, paywall_hours: main.paywall_hours || 24, price_usd: main.price_usd || main.price || 9.99, platform: main.platform || 'youtube', verified: main.verified || false }} hasAccess={!main.paywall || unlockedVideos.has(main.id)} onUnlock={setUnlockModal} accent={accent} cardBg={cardBg} border={border} text={text} muted={muted} />
            {main.title && <p className="text-sm font-medium mt-2" style={{ color:text }}>{main.title}</p>}
          </div>
        );
      }
      case 'portfolio': {
        const videos = (profile.videos || [
          { id:'v1', title:'Showreel 2024', url:'https://youtube.com/watch?v=dQw4w9WgXcQ', paywall:false, paywall_hours:24, price_usd:0, platform:'youtube', verified:true },
          { id:'v2', title:'Behind the Scenes', url:'https://youtube.com/watch?v=dQw4w9WgXcQ', paywall:true, paywall_hours:24, price_usd:4.99, platform:'youtube', verified:true },
          { id:'v3', title:'Client Project', url:'https://youtube.com/watch?v=dQw4w9WgXcQ', paywall:true, paywall_hours:48, price_usd:9.99, platform:'youtube', verified:false },
        ]);
        return (
          <div key={mod}>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color:text }}>
              <Play className="h-4 w-4" style={{ color:accent }} /> Videos
            </p>
            <VideoGallery videos={videos} accent={accent} cardBg={cardBg} border={border} text={text} muted={muted} />
          </div>
        );
      }
      case 'cv': return (
        <CVModule key={mod}
          entries={profile.cv || [
            { id:'c1', type:'experience', title:'Senior Designer', company:'TechCorp', period:'2022–Present', description:'Led design for 40+ products', current:true },
            { id:'c2', type:'experience', title:'Product Designer', company:'StartupXYZ', period:'2019–2022' },
            { id:'c3', type:'education', title:'BA Design', company:'Stanford', period:'2015–2019' },
          ]}
          contact={profile.cv_contact || { email:profile.contact_email||undefined, phone:profile.contact_phone||undefined, linkedin:profile.contact_linkedin||undefined }}
          name={profile.name}
          contactLocked={true}
          contactPrice={20}
          badge={profile.badge}
          accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}
        />
      );
      case 'articles': {
        const articles = profile.articles || [
          { id:'a1', title:'How I built my first SaaS', preview:'The complete story from idea to first paying customer...', paywall:false, published_at:new Date().toISOString() },
          { id:'a2', title:'My exact client acquisition playbook', preview:'This is the exact system I use to land 6-figure clients...', paywall:true, price:4.99, published_at:new Date().toISOString() },
        ];
        return (
          <div key={mod} className="space-y-3">
            <p className="text-sm font-semibold flex items-center gap-2" style={{ color:text }}><FileText className="h-4 w-4" style={{ color:accent }} /> Articles</p>
            {articles.map((a:any) => (
              <div key={a.id} className="rounded-2xl p-4 cursor-pointer hover:opacity-90 transition-all" style={{ background:cardBg, border:`1px solid ${border}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1 truncate" style={{ color:text }}>{a.title}</p>
                    <p className="text-xs line-clamp-2" style={{ color:muted }}>{a.preview}</p>
                  </div>
                  {a.paywall && <span className="flex-shrink-0 rounded-xl px-2 py-1 text-[10px] font-semibold" style={{ background:`${accent}15`, color:accent }}>${a.price}</span>}
                </div>
                {a.paywall && <div className="flex items-center gap-1 mt-2"><Lock className="h-3 w-3" style={{ color:accent }} /><span className="text-[10px]" style={{ color:muted }}>Unlock to read full article</span></div>}
              </div>
            ))}
          </div>
        );
      }
      case 'classifieds': {
        const items = profile.classifieds || [
          { id:'cl1', title:'MacBook Pro 14" M3', price:1800, category:'Electronics', location:'NYC' },
          { id:'cl2', title:'1BR Apartment for Rent', price:2200, category:'Real Estate', location:'Manhattan' },
        ];
        return (
          <div key={mod}>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color:text }}><ShoppingBag className="h-4 w-4" style={{ color:accent }} /> Classifieds</p>
            <div className={`grid gap-3 ${cols >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {items.map((item:any) => (
                <div key={item.id} className="rounded-2xl p-4" style={{ background:cardBg, border:`1px solid ${border}` }}>
                  <div className="flex items-start justify-between">
                    <div><p className="text-sm font-semibold" style={{ color:text }}>{item.title}</p><p className="text-xs mt-0.5" style={{ color:muted }}>{item.category}{item.location && ` · ${item.location}`}</p></div>
                    <span className="text-sm font-bold" style={{ color:accent }}>${item.price.toLocaleString()}</span>
                  </div>
                  <button className="mt-3 w-full rounded-xl py-2 text-xs font-semibold transition-all" style={{ background:`${accent}15`, color:accent, border:`1px solid ${accent}30` }}>Pay with USDC</button>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'slugs': {
        const slugs = profile.slugs_for_sale || [];
        if (!slugs.length) return null;
        return (
          <div key={mod}>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color:text }}><Hash className="h-4 w-4" style={{ color:accent }} /> Slugs for Sale</p>
            <div className="space-y-2">
              {slugs.map((s:any) => (
                <div key={s.slug} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background:cardBg, border:`1px solid ${border}` }}>
                  <span className="font-mono text-sm font-bold" style={{ color:accent }}>#{s.slug}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color:text }}>${s.price?.toLocaleString()}</span>
                    <button className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background:accent, color:accentFg }}>{s.status==='auction'?'Bid':'Buy'}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'social': {
        const socials = [
          { key:'contact_linkedin',  icon:'💼', label:'LinkedIn' },
          { key:'contact_instagram', icon:'📸', label:'Instagram' },
          { key:'contact_twitter',   icon:'🐦', label:'Twitter' },
          { key:'contact_youtube',   icon:'▶️',  label:'YouTube' },
        ].filter(s => (profile as any)[s.key]);
        if (!socials.length) return null;
        return (
          <div key={mod} className="flex flex-wrap gap-2">
            {socials.map(s => (
              <a key={s.key} href={(profile as any)[s.key]?.startsWith('http') ? (profile as any)[s.key] : `https://${(profile as any)[s.key]}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:opacity-80"
                style={{ background:cardBg, border:`1px solid ${border}`, color:accent }}>
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        );
      }
      case 'contact': return (
        <div key={mod} className="rounded-2xl p-5" style={{ background:cardBg, border:`1px solid ${border}` }}>
          <p className="text-sm font-semibold mb-3" style={{ color:text }}>Contact</p>
          {isPaywalled ? (
            <div className="text-center py-4">
              <Lock className="h-8 w-8 mx-auto mb-2" style={{ color:accent }} />
              <p className="text-sm font-semibold mb-1" style={{ color:text }}>Contact locked</p>
              <p className="text-xs mb-3" style={{ color:muted }}>Subscribe to unlock · ${profile.paywall_price || 9.99}/{profile.paywall_interval || 'mo'}</p>
              <button onClick={()=>setPaywallOpen(true)} className="rounded-xl px-5 py-2.5 text-sm font-semibold" style={{ background:accent, color:accentFg }}>Unlock</button>
            </div>
          ) : (
            <div className="space-y-2">
              {profile.contact_email && <a href={`mailto:${profile.contact_email}`} className="flex items-center gap-2 text-sm" style={{ color:accent }}>📧 {profile.contact_email}</a>}
              {profile.contact_phone && <p className="flex items-center gap-2 text-sm" style={{ color:muted }}>📱 {profile.contact_phone}</p>}
            </div>
          )}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background:bg, fontFamily:`'${font}',system-ui,sans-serif` }}>
      {hasScanlines && <div className="fixed inset-0 pointer-events-none z-50 opacity-5" style={{ background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.8) 2px,rgba(0,0,0,0.8) 4px)' }} />}
      {hasGrid && <div className="fixed inset-0 pointer-events-none opacity-10" style={{ backgroundImage:`linear-gradient(${accent}15 1px,transparent 1px),linear-gradient(90deg,${accent}15 1px,transparent 1px)`, backgroundSize:'40px 40px' }} />}

      {/* Nav */}
      <nav className="border-b sticky top-0 z-40 backdrop-blur-xl" style={{ background:`${bg}cc`, borderColor:border }}>
        <div className="mx-auto max-w-3xl px-4 flex h-12 items-center justify-between">
          <a href="/" className="flex items-center gap-1.5 text-xs hover:opacity-70" style={{ color:muted }}>
            <Hash className="h-3.5 w-3.5" style={{ color:accent }} />
            <span style={{ color:accent }}>JobinLink</span>
          </a>
          <a href="/signup" className="rounded-lg px-3 py-1.5 text-xs font-semibold hover:opacity-80" style={{ background:accent, color:accentFg }}>Create yours</a>
        </div>
      </nav>

      {/* Banner */}
      <div className="h-36 sm:h-48 relative overflow-hidden" style={{ background:`linear-gradient(135deg,${accent}40,${bg})` }}>
        {profile.banner_url && <img src={profile.banner_url} alt="banner" className="absolute inset-0 w-full h-full object-cover opacity-50" />}
        {hasGlow && <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse at 50% 100%,${accent}20,transparent 70%)` }} />}
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        {/* Header */}
        <div className="-mt-16 mb-8">
          <div className={`flex ${headerAlign==='center'?'flex-col items-center text-center':'items-end justify-between'} gap-4 mb-4`}>
            <ProfilePhoto url={profile.photo_url} name={profile.name} shape={photoShape} size={photoSize} accent={accent} />
            {headerAlign !== 'center' && (
              <button onClick={()=>isPaywalled?setPaywallOpen(true):null}
                className="flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold mb-2 hover:opacity-80 transition-all"
                style={{ background:isPaywalled?`${accent}20`:accent, color:isPaywalled?accent:accentFg, border:isPaywalled?`1px solid ${accent}40`:'none' }}>
                {isPaywalled?<><Lock className="h-3.5 w-3.5 inline mr-1"/>Subscribe</>:'Contact'}
              </button>
            )}
          </div>

          <div className={headerAlign==='center'?'text-center':''}>
            <div className="flex items-center gap-2 flex-wrap mb-1" style={{ justifyContent:headerAlign==='center'?'center':'flex-start' }}>
              <h1 className="text-2xl font-bold" style={{ color:text }}>{profile.name}</h1>
              {profile.badge==='blue' && <BadgeCheck className="h-6 w-6 text-blue-400" />}
              {profile.badge==='gold' && <Award className="h-6 w-6 text-amber-400" />}
            </div>
            {profile.title && <p className="text-sm mb-2" style={{ color:muted }}>{profile.title}</p>}
            {profile.location && <p className="flex items-center gap-1.5 text-sm mb-3" style={{ color:`${muted}aa`, justifyContent:headerAlign==='center'?'center':'flex-start' }}><MapPin className="h-3.5 w-3.5"/>{ profile.location}</p>}

            {/* Stickers */}
            {profile.stickers && profile.stickers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3" style={{ justifyContent:headerAlign==='center'?'center':'flex-start' }}>
                {profile.stickers.map(s => <StickerBadge key={s} stickerId={s} />)}
              </div>
            )}

            {headerAlign==='center' && (
              <button onClick={()=>isPaywalled?setPaywallOpen(true):null}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold hover:opacity-80 transition-all mt-2"
                style={{ background:isPaywalled?`${accent}20`:accent, color:isPaywalled?accent:accentFg, border:isPaywalled?`1px solid ${accent}40`:'none' }}>
                {isPaywalled?<><Lock className="h-3.5 w-3.5"/>Subscribe ${profile.paywall_price||9.99}</>:'Contact'}
              </button>
            )}
          </div>
        </div>

        {/* Page tabs */}
        {pages.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            {pages.map((page:any, i:number) => (
              <button key={page.id} onClick={()=>setActivePage(i)}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
                style={{ background:activePage===i?accent:cardBg, color:activePage===i?accentFg:muted, border:`1px solid ${activePage===i?accent:border}` }}>
                {page.icon && <span>{page.icon}</span>}
                {page.title}
              </button>
            ))}
          </div>
        )}

        {/* Modules */}
        <div className={`grid gap-5 ${cols===2?'sm:grid-cols-2':cols===3?'sm:grid-cols-2 lg:grid-cols-3':'grid-cols-1'}`}>
          {(current?.modules || []).map((mod:string) => renderModule(mod))}
        </div>

        <div className="mt-12 pt-6 border-t text-center" style={{ borderColor:border }}>
          <p className="text-xs" style={{ color:`${muted}60` }}>
            Powered by <a href="/" style={{ color:accent }}>JobinLink</a> · <a href="/signup" style={{ color:accent }}>Create your free mini-site</a>
          </p>
        </div>
      </div>

      {/* Paywall modal */}
      {paywallOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-6 relative" style={{ background:cardBg, border:`1px solid ${border}` }}>
            <button onClick={()=>setPaywallOpen(false)} className="absolute top-4 right-4 text-zinc-400"><X className="h-5 w-5"/></button>
            <div className="text-center mb-5">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background:`${accent}15` }}>
                <Lock className="h-7 w-7" style={{ color:accent }}/>
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color:text }}>Unlock {profile.name}'s content</h3>
              <p className="text-xs" style={{ color:muted }}>Full access to contact, articles, videos and more.</p>
            </div>
            <div className="space-y-3 mb-5">
              {[
                { label:'Monthly', price:profile.paywall_price||9.99, period:'/mo', save:false },
                { label:'Annual', price:(profile.paywall_price||9.99)*10, period:'/yr', save:true },
              ].map(plan => (
                <button key={plan.period} onClick={()=>{setSubscribed(true);setPaywallOpen(false);}}
                  className="w-full flex items-center justify-between rounded-2xl p-4 transition-all hover:opacity-80"
                  style={{ background:plan.save?accent:`${accent}10`, border:`1px solid ${accent}${plan.save?'':'30'}`, color:plan.save?accentFg:text }}>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{plan.label}</p>
                    {plan.save && <p className="text-xs opacity-70">Save 17%</p>}
                  </div>
                  <p className="text-lg font-bold">${plan.price}<span className="text-xs font-normal opacity-70">{plan.period}</span></p>
                </button>
              ))}
            </div>
            <p className="text-center text-xs" style={{ color:muted }}>USDC on Polygon · Cancel anytime</p>
          </div>
        </div>
      )}

      {/* Video unlock modal */}
      <VideoUnlockModal
        video={unlockModal} onClose={()=>setUnlockModal(null)}
        onConfirm={(v:any)=>setUnlockedVideos(prev=>{const n=new Set(prev);n.add(v.id);return n;})}
        accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}
      />
    </div>
  );
}
