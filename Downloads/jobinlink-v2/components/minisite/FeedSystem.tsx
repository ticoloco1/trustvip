'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, X, Clock, Pin, Heart, Share2, Loader2, Plus, AlertCircle, Star } from 'lucide-react';

export interface FeedPost {
  id: string;
  text: string;
  images: string[];
  created_at: string;
  expires_at: string;
  pinned_until?: string | null;
  likes: number;
  liked?: boolean;
}

// ── Countdown Timer (digital clock) ─────────────────────────
export function CountdownTimer({ expiresAt, color = '#8b5cf6', size = 'sm' }: {
  expiresAt: string; color?: string; size?: 'sm' | 'md';
}) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setTime({ d:0,h:0,m:0,s:0, expired:true }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  if (time.expired) return (
    <span className="text-[10px] font-mono text-red-400">EXPIRED</span>
  );

  const pad = (n: number) => String(n).padStart(2, '0');
  const display = time.d > 0
    ? `${time.d}d ${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`
    : `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`;

  return (
    <div className="flex items-center gap-1">
      <Clock className={size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3'} style={{ color }} />
      <span
        className={`font-mono font-bold tabular-nums tracking-widest ${size === 'md' ? 'text-xs' : 'text-[10px]'}`}
        style={{ color, textShadow: `0 0 8px ${color}60` }}
      >
        {display}
      </span>
    </div>
  );
}

// ── Single Feed Card ─────────────────────────────────────────
export function FeedCard({
  post, accent = '#8b5cf6', cardBg = '#111113', border = '#27272a', text = '#fafafa', muted = '#71717a',
  onLike, onPin,
}: {
  post: FeedPost; accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
  onLike?: (id: string) => void; onPin?: (id: string) => void;
}) {
  const isPinned = post.pinned_until && new Date(post.pinned_until) > new Date();
  const imgCount = post.images.length;

  return (
    <div className="rounded-2xl overflow-hidden transition-all hover:opacity-95" style={{ background: cardBg, border: `1px solid ${border}` }}>
      {/* Images grid — max 4 */}
      {imgCount > 0 && (
        <div className={`grid ${imgCount === 1 ? 'grid-cols-1' : imgCount === 2 ? 'grid-cols-2' : imgCount === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-px overflow-hidden`}
          style={{ maxHeight: 200 }}>
          {post.images.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt="" className="w-full object-cover"
              style={{ height: imgCount === 1 ? 200 : imgCount === 2 ? 200 : 100 }} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {isPinned && (
          <div className="flex items-center gap-1 mb-2">
            <Pin className="h-3 w-3" style={{ color: accent }} />
            <span className="text-[10px] font-medium" style={{ color: accent }}>Pinned</span>
          </div>
        )}

        {/* Text — max 300 chars */}
        <p className="text-sm leading-relaxed" style={{ color: text }}>
          {post.text.slice(0, 300)}{post.text.length > 300 ? '…' : ''}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${border}` }}>
          {/* Countdown */}
          <CountdownTimer expiresAt={post.expires_at} color={isPinned ? '#f59e0b' : accent} />

          {/* Actions */}
          <div className="flex items-center gap-3">
            {onLike && (
              <button onClick={() => onLike(post.id)}
                className="flex items-center gap-1 text-xs transition-all hover:scale-110"
                style={{ color: post.liked ? '#ef4444' : muted }}>
                <Heart className={`h-3.5 w-3.5 ${post.liked ? 'fill-current' : ''}`} />
                <span>{post.likes + (post.liked ? 1 : 0)}</span>
              </button>
            )}
            {onPin && !isPinned && (
              <button onClick={() => onPin(post.id)}
                className="flex items-center gap-1 text-[10px] rounded-lg px-2 py-1 transition-all"
                style={{ color: accent, border: `1px solid ${accent}30`, background: `${accent}10` }}>
                <Pin className="h-3 w-3" /> Pin $10
              </button>
            )}
            <button className="transition-all hover:scale-110" style={{ color: muted }}>
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feed Composer (dashboard) ────────────────────────────────
export function FeedComposer({
  onPost, accent = '#8b5cf6', cardBg = '#111113', border = '#27272a', text = '#fafafa', muted = '#71717a',
}: {
  onPost?: (post: Omit<FeedPost, 'id' | 'created_at' | 'expires_at' | 'likes'>) => void;
  accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
}) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const maxChars = 300;
  const remaining = maxChars - content.length;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) {
      alert('Maximum 4 photos per post');
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImages(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    await new Promise(r => setTimeout(r, 800));
    onPost?.({ text: content, images, liked: false });
    setContent('');
    setImages([]);
    setPosting(false);
  };

  return (
    <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <p className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: text }}>
        <Clock className="h-3.5 w-3.5" style={{ color: accent }} />
        New post — disappears in 7 days
      </p>

      {/* Text area */}
      <textarea
        value={content}
        onChange={e => { if (e.target.value.length <= maxChars) setContent(e.target.value); }}
        rows={3}
        placeholder="What's on your mind? (max 300 characters)"
        className="w-full rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none transition-all"
        style={{ background: `${cardBg}`, border: `1px solid ${remaining < 20 ? '#ef4444' : border}`, color: text }}
      />

      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {images.map((img, i) => (
            <div key={i} className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/70 flex items-center justify-center text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <button onClick={() => fileRef.current?.click()}
            disabled={images.length >= 4}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition-all disabled:opacity-30"
            style={{ color: accent, border: `1px solid ${accent}30`, background: `${accent}08` }}>
            <Camera className="h-3.5 w-3.5" />
            {images.length}/4 photos
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImage} />
          <span className={`text-xs font-mono ${remaining < 20 ? 'text-red-400' : ''}`} style={{ color: remaining >= 20 ? muted : undefined }}>
            {remaining}
          </span>
        </div>
        <button onClick={handlePost} disabled={!content.trim() || posting}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40 hover:opacity-80"
          style={{ background: accent, color: '#fff' }}>
          {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Post
        </button>
      </div>

      {/* Pin info */}
      <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: `${accent}08`, border: `1px solid ${accent}15` }}>
        <Star className="h-3.5 w-3.5 flex-shrink-0" style={{ color: accent }} />
        <p className="text-[10px]" style={{ color: muted }}>
          Pin a post for 1 year for <strong style={{ color: accent }}>$10.00</strong> — it stays visible even after 7 days and appears at the top.
        </p>
      </div>
    </div>
  );
}

// ── Feed Module (public mini-site) ───────────────────────────
export function FeedModule({
  posts, accent, cardBg, border, text, muted, isOwner = false,
}: {
  posts: FeedPost[]; accent?: string; cardBg?: string; border?: string; text?: string; muted?: string; isOwner?: boolean;
}) {
  const [localPosts, setLocalPosts] = useState<FeedPost[]>(posts);
  const now = new Date();
  const visible = localPosts.filter(p => new Date(p.expires_at) > now || (p.pinned_until && new Date(p.pinned_until) > now));
  // Pinned first, then by date
  const sorted = [...visible].sort((a, b) => {
    const aPinned = a.pinned_until && new Date(a.pinned_until) > now ? 1 : 0;
    const bPinned = b.pinned_until && new Date(b.pinned_until) > now ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (sorted.length === 0) return null;

  return (
    <div className="space-y-3">
      {sorted.map(post => (
        <FeedCard key={post.id} post={post} accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}
          onLike={id => setLocalPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p))}
          onPin={isOwner ? id => {
            // In production: call Supabase + Stripe for $10 payment
            alert('Pin this post for $10? (Stripe integration needed)');
          } : undefined}
        />
      ))}
    </div>
  );
}
