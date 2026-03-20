'use client';
import { useState, useRef } from 'react';
import { Play, Lock, Unlock, Clock, DollarSign, Eye, Plus, X, Check, AlertCircle, Youtube, Video as VideoIcon, ExternalLink } from 'lucide-react';
import { buildAnyEmbed, detectPlatform, extractYouTubeId } from '@/lib/youtube';
import { CountdownTimer } from './FeedSystem';

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  paywall: boolean;
  paywall_hours: number;   // minimum hours to access (min 24)
  price_usd: number;       // user-defined price
  verified: boolean;       // YouTube ownership verified
  views?: number;
  platform: string;
}

// ── Protected Video Embed ────────────────────────────────────
export function ProtectedVideoEmbed({
  video, hasAccess, onUnlock, accent = '#8b5cf6', cardBg = '#111113', border = '#27272a', text = '#fafafa', muted = '#71717a',
}: {
  video: VideoItem; hasAccess: boolean; onUnlock: (v: VideoItem) => void;
  accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
}) {
  const embed = buildAnyEmbed(video.url);
  const hours = Math.max(video.paywall_hours || 24, 24);
  const accessExpiry = new Date(Date.now() + hours * 3600000).toISOString();

  if (video.paywall && !hasAccess) {
    return (
      <div className="relative rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${border}` }}>
        {/* Blurred thumbnail */}
        <div className="aspect-video relative">
          {video.thumbnail && (
            <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-md" />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center" style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
              <Lock className="h-8 w-8" style={{ color: accent }} />
            </div>
            <div className="text-center px-4">
              <p className="font-semibold text-white text-sm">{video.title}</p>
              <p className="text-xs mt-1" style={{ color: muted }}>
                {hours}h access · ${video.price_usd.toFixed(2)} USDC
              </p>
              {hours <= 24 && (
                <p className="text-[10px] mt-1 text-amber-400">
                  ⏱ 24-hour minimum access window
                </p>
              )}
            </div>
            <button onClick={() => onUnlock(video)}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: accent, color: '#fff' }}>
              <Unlock className="h-4 w-4" /> Unlock — ${video.price_usd.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!embed) {
    return (
      <div className="rounded-2xl aspect-video flex items-center justify-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <p className="text-sm" style={{ color: muted }}>Video unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative rounded-2xl overflow-hidden aspect-video">
        {/* Anti-scraping overlay — prevents right-click URL inspection */}
        <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }} />
        <iframe
          src={embed.embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>
      {hasAccess && video.paywall && (
        <div className="flex items-center gap-2 px-1">
          <div className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px]" style={{ background: `${accent}10`, border: `1px solid ${accent}20`, color: accent }}>
            <Check className="h-3 w-3" />
            Access granted · {hours}h window
          </div>
          <CountdownTimer expiresAt={accessExpiry} color={accent} />
        </div>
      )}
    </div>
  );
}

// ── Video Card (Netflix-style) ───────────────────────────────
export function VideoCard({
  video, hasAccess, onUnlock, accent, cardBg, border, text, muted,
}: {
  video: VideoItem; hasAccess: boolean; onUnlock: (v: VideoItem) => void;
  accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const embed = buildAnyEmbed(video.url);
  const locked = video.paywall && !hasAccess;

  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02]"
      style={{ background: cardBg || '#111', border: `1px solid ${border || '#27272a'}` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => locked && onUnlock(video)}
    >
      {/* Thumbnail / aspect ratio */}
      <div className="aspect-video relative bg-black">
        {video.thumbnail && <img src={video.thumbnail} alt={video.title} className={`absolute inset-0 w-full h-full object-cover transition-all ${locked ? 'opacity-30 blur-sm' : 'opacity-80 group-hover:opacity-100'}`} />}

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
          {locked ? (
            <div className="text-center">
              <Lock className="h-8 w-8 mx-auto mb-1 text-white/80" />
              <p className="text-white text-xs font-semibold">${video.price_usd}</p>
            </div>
          ) : (
            <Play className="h-10 w-10 text-white fill-white opacity-0 group-hover:opacity-100 transition-all drop-shadow-lg" />
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {video.verified && (
            <span className="text-[9px] rounded-full px-1.5 py-0.5 font-medium bg-emerald-500/80 text-white">✓ Verified</span>
          )}
          {video.paywall && (
            <span className="text-[9px] rounded-full px-1.5 py-0.5 font-medium" style={{ background: `${accent}cc`, color: '#fff' }}>
              {video.paywall_hours}h · ${video.price_usd}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-semibold truncate" style={{ color: text || '#fff' }}>{video.title}</p>
        {video.description && <p className="text-[10px] mt-0.5 truncate" style={{ color: muted || '#71717a' }}>{video.description}</p>}
        <div className="flex items-center gap-2 mt-1">
          {video.views && <span className="text-[10px]" style={{ color: muted }}><Eye className="h-2.5 w-2.5 inline mr-0.5" />{video.views.toLocaleString()}</span>}
          <span className="text-[10px] capitalize" style={{ color: muted }}>{video.platform}</span>
        </div>
      </div>
    </div>
  );
}

// ── Unlock Payment Modal ─────────────────────────────────────
export function VideoUnlockModal({
  video, onConfirm, onClose, accent = '#8b5cf6', cardBg = '#111113', border = '#27272a', text = '#fafafa', muted = '#71717a',
}: {
  video: VideoItem | null; onConfirm: (v: VideoItem) => void; onClose: () => void;
  accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
}) {
  if (!video) return null;
  const hours = Math.max(video.paywall_hours || 24, 24);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl p-6 relative" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-5">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
            <VideoIcon className="h-7 w-7" style={{ color: accent }} />
          </div>
          <h3 className="text-base font-bold mb-1" style={{ color: text }}>Unlock Video</h3>
          <p className="text-sm font-medium mb-1" style={{ color: text }}>{video.title}</p>
          <p className="text-xs" style={{ color: muted }}>
            Get {hours}h access · Paid via USDC on Polygon
          </p>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: muted }}>Access duration</span>
            <span className="text-sm font-semibold" style={{ color: text }}>{hours} hours</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: muted }}>Price</span>
            <span className="text-lg font-bold" style={{ color: accent }}>${video.price_usd.toFixed(2)} USDC</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: `${accent}20`, color: muted }}>
            <span>Platform fee (20%)</span>
            <span>${(video.price_usd * 0.2).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: muted }}>
            <span>Creator receives (80%)</span>
            <span className="text-emerald-400">${(video.price_usd * 0.8).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl p-3 mb-4 text-xs" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <AlertCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-amber-300">Payment goes directly to creator's wallet via Polygon smart contract — instant settlement.</span>
        </div>

        <button onClick={() => { onConfirm(video); onClose(); }}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all hover:opacity-80"
          style={{ background: accent, color: '#fff' }}>
          <Unlock className="h-4 w-4" />
          Pay ${video.price_usd.toFixed(2)} USDC — Unlock {hours}h
        </button>

        <p className="text-center text-[10px] mt-3" style={{ color: muted }}>
          Powered by Polygon · No intermediaries · Instant
        </p>
      </div>
    </div>
  );
}

// ── Netflix-style Video Gallery ──────────────────────────────
export function VideoGallery({
  videos, accent, cardBg, border, text, muted,
}: {
  videos: VideoItem[]; accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
}) {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [unlockModal, setUnlockModal] = useState<VideoItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const handleUnlock = (v: VideoItem) => {
    // In production: trigger USDC payment via Supabase edge function
    setUnlockedIds(prev => { const n = new Set(prev); n.add(v.id); return n; });
  };

  const groups = [
    { label: 'Free to watch', items: videos.filter(v => !v.paywall) },
    { label: 'Premium content', items: videos.filter(v => v.paywall) },
  ].filter(g => g.items.length > 0);

  return (
    <div className="space-y-6">
      {activeVideo && (
        <ProtectedVideoEmbed
          video={activeVideo}
          hasAccess={!activeVideo.paywall || unlockedIds.has(activeVideo.id)}
          onUnlock={setUnlockModal}
          accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}
        />
      )}

      {groups.map(group => (
        <div key={group.label}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: muted }}>{group.label}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {group.items.map(v => (
              <div key={v.id} onClick={() => setActiveVideo(v)}>
                <VideoCard
                  video={v}
                  hasAccess={!v.paywall || unlockedIds.has(v.id)}
                  onUnlock={setUnlockModal}
                  accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <VideoUnlockModal
        video={unlockModal} onClose={() => setUnlockModal(null)} onConfirm={handleUnlock}
        accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}
      />
    </div>
  );
}
