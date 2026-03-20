'use client';
import { useState } from 'react';
import { Play, Lock, Unlock, X, Loader2, Clock, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Video {
  id: string;
  youtube_id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price_usdc: number;       // user sets price
  access_hours: number;     // min 24h
  is_free: boolean;
  preview_seconds?: number; // free preview before paywall
}

interface VideoPaywallProps {
  videos: Video[];
  profileId?: string;
  accent: string; cardBg: string; border: string; text: string; muted: string;
}

// Extract YouTube ID from URL or ID string
function getYouTubeId(input: string) {
  const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : input;
}

// Single video card
function VideoCard({ video, profileId, accent, cardBg, border, text, muted }: any) {
  const [unlocked, setUnlocked] = useState(video.is_free);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payMethod, setPayMethod] = useState<'usdc'|'stripe'>('usdc');
  const [accessExpiry, setAccessExpiry] = useState<Date|null>(null);

  const ytId = getYouTubeId(video.youtube_id);
  const thumbnail = video.thumbnail || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  const platformCut = Math.round(video.price_usdc * 0.30);
  const creatorCut = video.price_usdc - platformCut;

  const handleUnlock = async () => {
    setLoading(true); setError('');
    try {
      await new Promise(r => setTimeout(r, 1500)); // simulate payment
      if (profileId) {
        await supabase.from('unlocks').insert({
          target_id: profileId, type: 'video',
          content_id: video.id, amount_usdc: video.price_usdc,
          access_hours: video.access_hours, platform: 'trustbank'
        });
      }
      const expiry = new Date(Date.now() + video.access_hours * 3600000);
      setAccessExpiry(expiry);
      setUnlocked(true);
      setModal(false);
    } catch (e: any) {
      setError(e.message || 'Payment failed');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="rounded-2xl overflow-hidden transition-all hover:shadow-sm"
        style={{ background:cardBg, border:`1px solid ${border}` }}>
        {/* Thumbnail */}
        <div className="relative cursor-pointer group" onClick={() => unlocked ? null : setModal(true)}>
          <img src={thumbnail} alt={video.title} className="w-full object-cover"
            style={{ height:'200px', filter: unlocked ? 'none' : 'blur(2px) brightness(0.7)' }}/>

          {!unlocked ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="h-14 w-14 rounded-full bg-black/60 flex items-center justify-center">
                <Lock className="h-6 w-6 text-white"/>
              </div>
              <span className="rounded-full px-3 py-1.5 text-xs font-bold text-white"
                style={{ background:`${accent}cc` }}>
                ${video.price_usdc} USDC · {video.access_hours}h access
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/30">
              <div className="h-14 w-14 rounded-full bg-black/70 flex items-center justify-center">
                <Play className="h-7 w-7 text-white fill-white ml-1"/>
              </div>
            </div>
          )}

          {/* Free badge */}
          {video.is_free && (
            <span className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white bg-green-500">
              FREE
            </span>
          )}

          {/* Access timer */}
          {unlocked && !video.is_free && accessExpiry && (
            <div className="absolute top-2 right-2 rounded-full px-2 py-1 text-[10px] font-mono font-bold text-white bg-black/70 flex items-center gap-1">
              <Clock className="h-3 w-3"/>
              Access until {accessExpiry.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Unlocked: show video */}
        {unlocked && (
          <div className="relative" style={{ paddingTop:'56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0&modestbranding=1`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {/* Info */}
        <div className="p-4">
          <p className="text-sm font-semibold mb-1" style={{ color:text }}>{video.title}</p>
          {video.description && (
            <p className="text-xs leading-relaxed mb-3" style={{ color:muted }}>{video.description}</p>
          )}
          {!unlocked && (
            <button onClick={() => setModal(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background:accent }}>
              <Unlock className="h-4 w-4"/>
              Unlock for ${video.price_usdc} · {video.access_hours}h
            </button>
          )}
          {unlocked && !video.is_free && (
            <div className="flex items-center gap-2 text-xs" style={{ color:muted }}>
              <Eye className="h-3.5 w-3.5"/>
              <span>Access active · {video.access_hours}h from purchase</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-white border border-gray-100 shadow-2xl">
            <button onClick={() => setModal(false)} className="absolute top-4 right-4 text-gray-400">
              <X className="h-5 w-5"/>
            </button>

            <div className="mb-4">
              <img src={thumbnail} alt="" className="w-full h-40 object-cover rounded-2xl mb-4"
                style={{ filter:'blur(1px) brightness(0.8)' }}/>
              <h3 className="text-base font-bold text-gray-900 mb-1">{video.title}</h3>
              <p className="text-xs text-gray-500">{video.access_hours}h access after purchase</p>
            </div>

            <div className="rounded-2xl p-4 mb-4 bg-gray-50 border border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-500">Price</span>
                <span className="text-lg font-bold text-gray-900">${video.price_usdc} USDC</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:'70%', background:accent }}/>
                </div>
                <span>Creator 70% · Platform 30%</span>
              </div>
            </div>

            {/* Min 24h warning */}
            {video.access_hours < 24 && (
              <div className="rounded-xl p-3 mb-3 bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700">⚠ Minimum access is 24 hours</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { id:'usdc', label:'USDC', sub:'Polygon wallet', icon:'🔷' },
                { id:'stripe', label:'Card', sub:'Visa / Mastercard', icon:'💳' },
              ].map(m => (
                <button key={m.id} onClick={() => setPayMethod(m.id as any)}
                  className="rounded-xl p-3 text-left transition-all border"
                  style={{ border:`1.5px solid ${payMethod===m.id ? accent : '#e5e7eb'}`, background: payMethod===m.id ? `${accent}08` : '#fafafa' }}>
                  <span className="text-lg block mb-0.5">{m.icon}</span>
                  <p className="text-xs font-semibold text-gray-900">{m.label}</p>
                  <p className="text-[10px] text-gray-400">{m.sub}</p>
                </button>
              ))}
            </div>

            {error && <p className="text-xs text-red-500 mb-3 text-center">{error}</p>}

            <button onClick={handleUnlock} disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background:accent }}>
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin"/>Processing...</>
                : <><Play className="h-4 w-4"/>Pay ${video.price_usdc} · Watch now</>
              }
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Video Gallery (public) ───────────────────────────────
export function VideoGallery({ videos=[], profileId, accent, cardBg, border, text, muted }: VideoPaywallProps) {
  if (!videos.length) return null;
  return (
    <div className="space-y-4">
      {videos.map(v => (
        <VideoCard key={v.id} video={v} profileId={profileId} accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}/>
      ))}
    </div>
  );
}
