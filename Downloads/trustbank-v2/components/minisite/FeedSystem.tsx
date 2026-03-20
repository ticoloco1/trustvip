'use client';
import { useState, useEffect, useRef } from 'react';
import { Pin, Heart, Share2, Image as ImageIcon, X, Loader2, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Countdown Timer ──────────────────────────────────────
function useCountdown(expiresAt: string) {
  const [time, setTime] = useState({ d:0, h:0, m:0, s:0, expired:false });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setTime({ d:0,h:0,m:0,s:0,expired:true }); return; }
      const d = Math.floor(diff/864e5);
      const h = Math.floor((diff%864e5)/36e5);
      const m = Math.floor((diff%36e5)/6e4);
      const s = Math.floor((diff%6e4)/1e3);
      setTime({ d,h,m,s,expired:false });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  return time;
}

function CountdownBadge({ expiresAt, accent, pinned }: { expiresAt:string; accent:string; pinned?:boolean }) {
  const { d,h,m,s,expired } = useCountdown(expiresAt);
  if (expired) return <span className="text-[10px] text-red-400 font-mono">Expired</span>;
  return (
    <div className="flex items-center gap-1.5">
      {pinned && <Pin className="h-3 w-3" style={{ color:accent }}/>}
      <Clock className="h-3 w-3 opacity-50"/>
      <span className="font-mono text-[11px] font-semibold" style={{ color:pinned?accent:'inherit' }}>
        {pinned
          ? `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
          : d > 0 ? `${d}d ${h}h` : `${h}h ${m}m ${s}s`
        }
      </span>
    </div>
  );
}

// ─── Single Post ──────────────────────────────────────────
function FeedPost({ post, accent, cardBg, border, text, muted }: any) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((l: number) => liked ? l-1 : l+1);
  };

  return (
    <div className="rounded-2xl p-4 transition-all hover:shadow-sm"
      style={{ background:cardBg, border:`1px solid ${post.pinned?accent+'40':border}`,
        boxShadow: post.pinned ? `0 0 0 1px ${accent}20` : undefined }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {post.pinned && (
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background:`${accent}15`, color:accent, border:`1px solid ${accent}30` }}>
              <Pin className="h-2.5 w-2.5"/> Pinned · 1 year
            </span>
          )}
        </div>
        <CountdownBadge expiresAt={post.expires_at} accent={accent} pinned={post.pinned}/>
      </div>

      {/* Text */}
      <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap" style={{ color:text }}>
        {post.text}
      </p>

      {/* Images */}
      {post.images?.length > 0 && (
        <div className={`grid gap-1.5 mb-3 rounded-xl overflow-hidden ${
          post.images.length === 1 ? 'grid-cols-1' :
          post.images.length === 2 ? 'grid-cols-2' :
          post.images.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
        }`}>
          {post.images.map((img: string, i: number) => (
            <img key={i} src={img} alt="" className="w-full object-cover rounded-lg"
              style={{ height: post.images.length === 1 ? '240px' : '140px' }}/>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2" style={{ borderTop:`1px solid ${border}` }}>
        <button onClick={handleLike}
          className="flex items-center gap-1.5 text-xs transition-all hover:scale-110"
          style={{ color: liked ? '#e11d48' : muted }}>
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`}/>
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-all"
          style={{ color:muted }}>
          <Share2 className="h-4 w-4"/>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

// ─── Feed Module (public view) ────────────────────────────
export function FeedModule({ posts=[], accent, cardBg, border, text, muted }: any) {
  const sorted = [...posts].sort((a,b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }).filter(p => new Date(p.expires_at).getTime() > Date.now() || p.pinned);

  if (!sorted.length) return (
    <div className="rounded-2xl p-8 text-center" style={{ background:cardBg, border:`1px solid ${border}` }}>
      <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" style={{ color:accent }}/>
      <p className="text-xs" style={{ color:muted }}>No posts yet — posts disappear after 7 days</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {sorted.map(post => (
        <FeedPost key={post.id} post={post} accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}/>
      ))}
    </div>
  );
}

// ─── Feed Composer (dashboard) ────────────────────────────
export function FeedComposer({ profileId, platform, onPost, accent, cardBg, border, text, muted }: any) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pinModal, setPinModal] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const MAX = 300;

  // Load existing posts
  useEffect(() => {
    if (!profileId) return;
    supabase.from('feed_posts').select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending:false })
      .limit(10)
      .then(({ data }) => setPosts(data||[]));
  }, [profileId]);

  const handlePost = async (pinned = false) => {
    if (!content.trim()) return;
    if (content.length > MAX) return;
    setLoading(true); setError('');

    const expires_at = pinned
      ? new Date(Date.now() + 365*864e5).toISOString()  // 1 year for pinned
      : new Date(Date.now() + 7*864e5).toISOString();    // 7 days normal

    const { data, error: e } = await supabase.from('feed_posts').insert({
      profile_id: profileId,
      platform: platform || 'trustbank',
      text: content.trim(),
      images,
      pinned,
      expires_at,
      likes: 0,
    }).select().single();

    setLoading(false);
    if (e) { setError(e.message); return; }
    if (data) {
      setPosts(prev => [data, ...prev]);
      setContent('');
      setImages([]);
      onPost?.(data);
    }
    if (pinned) setPinModal(false);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || images.length >= 4) return;
    const reader = new FileReader();
    reader.onload = ev => setImages(prev => [...prev, ev.target?.result as string]);
    reader.readAsDataURL(file);
  };

  const removeImage = (i: number) => setImages(prev => prev.filter((_,idx) => idx !== i));

  const remaining = MAX - content.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="space-y-4">
      {/* Composer */}
      <div className="rounded-2xl p-4" style={{ background:cardBg, border:`1px solid ${border}` }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share an update... (disappears in 7 days)"
          rows={3}
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:opacity-40"
          style={{ color:text }}
        />

        {/* Image previews */}
        {images.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="h-20 w-20 rounded-xl object-cover"/>
                <button onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="h-3 w-3 text-white"/>
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop:`1px solid ${border}` }}>
          <div className="flex items-center gap-3">
            <button onClick={() => fileRef.current?.click()}
              disabled={images.length >= 4}
              className="flex items-center gap-1.5 text-xs disabled:opacity-30 transition-all hover:opacity-70"
              style={{ color:muted }}>
              <ImageIcon className="h-4 w-4"/>
              <span>{images.length}/4</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage}/>
            <span className={`text-xs font-mono ${isOverLimit ? 'text-red-400' : remaining < 50 ? 'text-amber-500' : ''}`}
              style={{ color: !isOverLimit && remaining >= 50 ? muted : undefined }}>
              {remaining}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPinModal(true)}
              disabled={!content.trim() || isOverLimit || loading}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium disabled:opacity-30 transition-all"
              style={{ background:`${accent}15`, color:accent, border:`1px solid ${accent}30` }}>
              <Pin className="h-3.5 w-3.5"/> Pin · $10
            </button>
            <button onClick={() => handlePost(false)}
              disabled={!content.trim() || isOverLimit || loading}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold disabled:opacity-30 transition-all"
              style={{ background:accent, color:'#ffffff' }}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin"/> : 'Post'}
            </button>
          </div>
        </div>
      </div>

      {/* Pin modal */}
      {pinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-white border border-gray-100 shadow-xl">
            <button onClick={() => setPinModal(false)} className="absolute top-4 right-4 text-gray-400"><X className="h-5 w-5"/></button>
            <div className="text-center mb-5">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background:`${accent}15`, border:`1px solid ${accent}30` }}>
                <Pin className="h-7 w-7" style={{ color:accent }}/>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Pin this post</h3>
              <p className="text-sm text-gray-500">Stays at the top for <strong>1 year</strong>. Visible even after 7 days.</p>
            </div>
            <div className="rounded-2xl p-4 mb-4 bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 line-clamp-3">{content}</p>
            </div>
            <div className="flex items-center justify-between mb-4 p-3 rounded-xl"
              style={{ background:`${accent}10`, border:`1px solid ${accent}25` }}>
              <span className="text-sm font-medium" style={{ color:accent }}>Pin for 1 year</span>
              <span className="text-lg font-bold" style={{ color:accent }}>$10.00 USDC</span>
            </div>
            <button onClick={() => handlePost(true)} disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background:accent }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <>Pay $10 · Pin post</>}
            </button>
          </div>
        </div>
      )}

      {/* Existing posts */}
      {posts.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold opacity-60" style={{ color:text }}>Your posts</p>
          {posts.map(post => (
            <FeedPost key={post.id} post={post} accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}/>
          ))}
        </div>
      )}
    </div>
  );
}
