'use client';
import { useState } from 'react';
import { usePublicSite, useSiteLinks, useSiteVideos } from '@/hooks/useMiniSite';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { THEMES, GRADIENTS } from '@/lib/utils';
import { Globe, ExternalLink, Play, Lock, Mail, Phone, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import Link from 'next/link';

const FONT_SIZES: Record<string,{h1:string;body:string;small:string}> = {
  sm:{ h1:"text-2xl", body:"text-sm", small:"text-xs" },
  md:{ h1:"text-4xl", body:"text-base", small:"text-sm" },
  lg:{ h1:"text-5xl md:text-6xl", body:"text-lg", small:"text-base" },
};
const PHOTO_SIZES: Record<string,string> = { sm:"w-20 h-20", md:"w-28 h-28", lg:"w-40 h-40" };

interface Props { slug: string; }

export default function MiniSiteView({ slug }:Props) {
  const { data:site, loading } = usePublicSite(slug);
  const { data:links } = useSiteLinks(site?.id);
  const { data:videos } = useSiteVideos(site?.id);
  const { user } = useAuth();
  const [cvOpen, setCvOpen] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [playingId, setPlayingId] = useState<string|null>(null);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-950 flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-purple-400/30 border-t-purple-400 rounded-full" style={{ animation:'spin 0.8s linear infinite', borderWidth:3 }}/>
    </div>
  );

  if (!site) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6">
      <Globe className="w-16 h-16 text-gray-300 mb-4"/>
      <h1 className="text-2xl font-black text-gray-700 mb-2">Mini-site not found</h1>
      <p className="text-gray-500 mb-6">This profile doesn't exist or hasn't been published yet.</p>
      <Link href="/" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700">Go to HASHPO</Link>
    </div>
  );

  const theme = THEMES[site.bg_style] || THEMES.dark;
  const accent = site.accent_color || '#a855f7';
  const gradient = GRADIENTS[site.gradient] || GRADIENTS.cosmic;
  const fs = FONT_SIZES[site.font_size] || FONT_SIZES.md;
  const photoSize = PHOTO_SIZES[site.photo_size] || PHOTO_SIZES.md;
  const cols = site.layout_columns || 2;
  const colClass = cols===1?'grid-cols-1':cols===3?'grid-cols-1 sm:grid-cols-3':'grid-cols-1 sm:grid-cols-2';

  const handleUnlockCV = async()=>{
    if(!user){ location.href='/auth'; return; }
    setUnlockLoading(true);
    try {
      await supabase.from('cv_unlocks').insert({ buyer_id:user.id, site_id:site.id, amount:site.contact_price||20 });
      setUnlocked(true);
    } catch(e) { console.error(e); }
    setUnlockLoading(false);
  };

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Banner */}
      <div className="relative h-48 md:h-56 overflow-hidden" style={{ background:site.banner_url?undefined:gradient }}>
        {site.banner_url && <img src={site.banner_url} alt="" className="w-full h-full object-cover"/>}
      </div>

      {/* Profile */}
      <div className="max-w-2xl mx-auto px-5 pb-20">
        <div className="-mt-14 mb-6 flex flex-col items-center text-center">
          {site.avatar_url
            ? <img src={site.avatar_url} alt="" className={`${photoSize} rounded-full object-cover border-4 shadow-xl mb-4`} style={{borderColor:accent+'50'}}/>
            : <div className={`${photoSize} rounded-full flex items-center justify-center text-white font-black text-4xl mb-4 border-4 shadow-xl`} style={{background:gradient,borderColor:accent+'50'}}>
                {site.site_name?.[0]?.toUpperCase()||'H'}
              </div>
          }
          <h1 className={`${fs.h1} font-black ${theme.text} mb-2`}>{site.site_name}</h1>
          {site.bio && <p className={`${fs.body} ${theme.sub} max-w-md leading-relaxed`}>{site.bio}</p>}
          {site.cv_headline && (
            <div className="flex items-center gap-1.5 mt-2">
              {site.cv_location && <><MapPin className="w-3.5 h-3.5" style={{color:accent}}/><span className={`${fs.small} ${theme.sub}`}>{site.cv_location}</span></>}
            </div>
          )}
          {site.cv_headline && <p className={`${fs.small} font-bold mt-1`} style={{color:accent}}>{site.cv_headline}</p>}
        </div>

        {/* Links */}
        {(links||[]).length > 0 && (
          <div className={`grid ${colClass} gap-3 mb-6`}>
            {(links||[]).map((l:any)=>(
              <a key={l.id} href={l.locked?undefined:l.url} target={l.locked?undefined:"_blank"} rel="noopener noreferrer"
                className={`flex items-center justify-between gap-3 p-4 rounded-2xl border ${theme.card} hover:opacity-80 transition-opacity cursor-pointer`}>
                <div className="flex items-center gap-3 min-w-0">
                  {l.locked ? <Lock className="w-4 h-4 shrink-0" style={{color:accent}}/> : <Globe className="w-4 h-4 shrink-0" style={{color:accent}}/>}
                  <span className={`${fs.body} font-bold ${theme.text} truncate`}>{l.title}</span>
                </div>
                {l.locked
                  ? <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0" style={{background:accent+'20',color:accent}}>${l.lock_price} USDC</span>
                  : <ExternalLink className="w-4 h-4 shrink-0 opacity-40"/>}
              </a>
            ))}
          </div>
        )}

        {/* Videos */}
        {(videos||[]).length > 0 && (
          <div className="mb-6">
            <h2 className={`${fs.body} font-black ${theme.text} mb-3 uppercase tracking-wide opacity-60`}>Videos</h2>
            <div className={`grid ${colClass} gap-3`}>
              {(videos||[]).map((v:any)=>(
                <div key={v.id} className={`rounded-2xl border overflow-hidden ${theme.card}`}>
                  <div className="relative aspect-video bg-black/30">
                    {playingId===v.id
                      ? <iframe src={`https://www.youtube.com/embed/${v.youtube_id}?autoplay=1`} allow="autoplay" allowFullScreen className="absolute inset-0 w-full h-full"/>
                      : <>
                          <img src={v.thumbnail_url||`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`} alt="" className="w-full h-full object-cover"/>
                          <button onClick={()=>setPlayingId(v.id)} className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><Play className="w-6 h-6 ml-1 text-gray-900"/></div>
                          </button>
                          {v.paywall_enabled && <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white" style={{background:accent}}>${v.paywall_price}</span>}
                        </>}
                  </div>
                  <div className="p-3">
                    <p className={`${fs.small} font-bold ${theme.text}`}>{v.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CV Section */}
        {site.show_cv && (
          <div className={`rounded-2xl border p-5 mb-6 ${theme.card}`}>
            <button onClick={()=>setCvOpen(!cvOpen)} className={`w-full flex items-center justify-between ${theme.text}`}>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" style={{color:accent}}/>
                <span className="font-black">Professional CV & Contact</span>
              </div>
              {cvOpen ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
            </button>

            {cvOpen && (
              <div className="mt-4 pt-4 border-t" style={{borderColor:accent+'20'}}>
                {site.cv_headline && <p className={`font-bold ${theme.text} mb-1`}>{site.cv_headline}</p>}
                {site.cv_skills && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {site.cv_skills.split(',').filter(Boolean).map((sk:string)=>(
                      <span key={sk} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{background:accent+'20',color:accent}}>{sk.trim()}</span>
                    ))}
                  </div>
                )}
                {unlocked ? (
                  <div className="space-y-2">
                    {site.contact_email && <a href={`mailto:${site.contact_email}`} className="flex items-center gap-2 text-sm" style={{color:accent}}><Mail className="w-4 h-4"/>{site.contact_email}</a>}
                    {site.contact_phone && <a href={`tel:${site.contact_phone}`} className="flex items-center gap-2 text-sm" style={{color:accent}}><Phone className="w-4 h-4"/>{site.contact_phone}</a>}
                  </div>
                ) : (
                  <div className="bg-black/20 rounded-xl p-4 text-center">
                    <Lock className="w-6 h-6 mx-auto mb-2" style={{color:accent}}/>
                    <p className={`${fs.small} ${theme.sub} mb-3`}>Contact details locked. Unlock to see email & phone.</p>
                    <button onClick={handleUnlockCV} disabled={unlockLoading}
                      className="w-full py-2.5 rounded-xl font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{background:accent}}>
                      {unlockLoading?'Processing...': `Unlock for $${site.contact_price||20} USDC · You pay, they earn 50%`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className={`${fs.small} ${theme.sub} hover:opacity-80`}>Powered by HASHPO</Link>
        </div>
      </div>
    </div>
  );
}
