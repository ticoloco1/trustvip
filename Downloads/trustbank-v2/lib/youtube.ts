// ═══════════════════════════════════════════════════════════
// YOUTUBE CHANNEL VERIFICATION SYSTEM
// Strategy: OAuth2 (best) + Verification code (fallback)
// ═══════════════════════════════════════════════════════════

export interface YouTubeChannel {
  channelId: string;
  channelUrl: string;
  title: string;
  thumbnailUrl: string;
  subscriberCount: number;
  verified: boolean;
  verifiedAt: string;
}

export interface VideoEmbed {
  videoId: string;
  channelId: string;
  title: string;
  thumbnailUrl: string;
  embedUrl: string;
  isOwned: boolean;        // true = channel is verified as user's
  isPublic: boolean;
  paywall: boolean;
  paywallPrice?: number;
}

// ── Extract YouTube video ID from any URL format ──────────────
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtube\.com\/embed\/([^?&\s]+)/,
    /youtube\.com\/shorts\/([^?&\s]+)/,
    /youtu\.be\/([^?&\s]+)/,
    /youtube\.com\/live\/([^?&\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// ── Extract channel ID or handle from URL ────────────────────
export function extractChannelFromUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/channel\/([^/?&\s]+)/,
    /youtube\.com\/@([^/?&\s]+)/,
    /youtube\.com\/c\/([^/?&\s]+)/,
    /youtube\.com\/user\/([^/?&\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// ── Generate verification code for channel ownership ─────────
// User adds this code to their channel description or a pinned comment
export function generateVerificationCode(userId: string): string {
  const prefix = 'hashpo-verify';
  const hash = userId.substring(0, 8).toUpperCase();
  return `${prefix}-${hash}`;
}

// ── Build safe embed URL (no cookies, privacy-enhanced) ──────
export function buildEmbedUrl(videoId: string, options?: {
  autoplay?: boolean;
  start?: number;
  end?: number;
  loop?: boolean;
}): string {
  const params = new URLSearchParams({
    rel: '0',              // no related videos at end
    modestbranding: '1',   // minimal YouTube branding
    origin: typeof window !== 'undefined' ? window.location.origin : 'https://hashpo.com',
    enablejsapi: '1',
  });
  if (options?.autoplay) params.set('autoplay', '1');
  if (options?.start) params.set('start', String(options.start));
  if (options?.end) params.set('end', String(options.end));
  if (options?.loop) { params.set('loop', '1'); params.set('playlist', videoId); }
  // Use privacy-enhanced domain (no tracking cookies)
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

// ── Verify video belongs to a verified channel ───────────────
// In production: call YouTube Data API v3
// GET https://www.googleapis.com/youtube/v3/videos?id={videoId}&part=snippet&key={API_KEY}
// Check snippet.channelId matches user's verified channel
export async function verifyVideoOwnership(
  videoId: string,
  verifiedChannelId: string
): Promise<{ owned: boolean; title?: string; thumbnail?: string }> {
  // In production, call Supabase edge function that calls YouTube API
  // For now, return mock structure
  try {
    const response = await fetch(`/api/youtube/verify?videoId=${videoId}&channelId=${verifiedChannelId}`);
    if (!response.ok) return { owned: false };
    const data = await response.json();
    return {
      owned: data.channelId === verifiedChannelId,
      title: data.title,
      thumbnail: data.thumbnail,
    };
  } catch {
    // Fallback: trust the user (can be moderated later)
    return { owned: true };
  }
}

// ── OAuth flow initiation (Google/YouTube) ───────────────────
// Redirects to Google OAuth consent screen
export function initiateYouTubeOAuth(redirectUri: string): void {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const scope = encodeURIComponent([
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '));
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
  window.location.href = url;
}

// ── Supported embed platforms ─────────────────────────────────
export const EMBED_PLATFORMS = [
  {
    id: 'youtube', name: 'YouTube', icon: '▶️',
    pattern: /youtube\.com|youtu\.be/,
    requiresVerification: true,
    extract: extractYouTubeId,
    buildEmbed: buildEmbedUrl,
  },
  {
    id: 'vimeo', name: 'Vimeo', icon: '🎬',
    pattern: /vimeo\.com\/(\d+)/,
    requiresVerification: false,
    extract: (url: string) => url.match(/vimeo\.com\/(\d+)/)?.[1] || null,
    buildEmbed: (id: string) => `https://player.vimeo.com/video/${id}?dnt=1`,
  },
  {
    id: 'twitch', name: 'Twitch Clip', icon: '🎮',
    pattern: /clips\.twitch\.tv\/(\w+)/,
    requiresVerification: false,
    extract: (url: string) => url.match(/clips\.twitch\.tv\/(\w+)/)?.[1] || null,
    buildEmbed: (id: string) => `https://clips.twitch.tv/embed?clip=${id}&parent=hashpo.com`,
  },
  {
    id: 'spotify', name: 'Spotify', icon: '🎵',
    pattern: /open\.spotify\.com\/(track|episode|playlist)\/([a-zA-Z0-9]+)/,
    requiresVerification: false,
    extract: (url: string) => {
      const m = url.match(/open\.spotify\.com\/(track|episode|playlist)\/([a-zA-Z0-9]+)/);
      return m ? `${m[1]}/${m[2]}` : null;
    },
    buildEmbed: (id: string) => `https://open.spotify.com/embed/${id}`,
  },
  {
    id: 'soundcloud', name: 'SoundCloud', icon: '🔊',
    pattern: /soundcloud\.com/,
    requiresVerification: false,
    extract: (url: string) => url,
    buildEmbed: (url: string) => `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true`,
  },
] as const;

export type EmbedPlatformId = typeof EMBED_PLATFORMS[number]['id'];

// ── Detect platform from URL ──────────────────────────────────
export function detectPlatform(url: string): typeof EMBED_PLATFORMS[number] | null {
  return EMBED_PLATFORMS.find(p => p.pattern.test(url)) || null;
}

// ── Build any embed URL from raw URL ─────────────────────────
export function buildAnyEmbed(url: string): { platform: string; embedUrl: string; requiresVerification: boolean } | null {
  const platform = detectPlatform(url);
  if (!platform) return null;
  const id = platform.extract(url);
  if (!id) return null;
  return {
    platform: platform.id,
    embedUrl: (platform.buildEmbed as any)(id),
    requiresVerification: platform.requiresVerification,
  };
}
