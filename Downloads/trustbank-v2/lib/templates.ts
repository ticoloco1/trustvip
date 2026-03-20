// ═══════════════════════════════════════════════
// 40 TEMPLATES — TrustBank (shared with all 4 sites)
// White base + colored accents + dark themes
// ═══════════════════════════════════════════════

export interface Template {
  id: string;
  name: string;
  category: string;
  emoji: string;
  vibe: string;
  columns: 1 | 2 | 3;
  colors: {
    bg: string; card: string; text: string; muted: string;
    accent: string; accentFg: string; border: string;
  };
  style: {
    photoShape: 'circle' | 'rounded' | 'square' | 'hexagon';
    photoSize: 'sm' | 'md' | 'lg' | 'xl';
    headerAlign: 'center' | 'left';
    fontFamily: string;
    cardStyle: 'flat' | 'elevated' | 'bordered' | 'glass' | 'neon';
    hasGlow: boolean;
    hasScanlines: boolean;
  };
}

export const TEMPLATES: Template[] = [

  // ── CLEAN WHITE (default) ──────────────────────────────────
  { id:'clean-white', name:'Clean White', category:'minimal', emoji:'⬜', vibe:'Simple & elegant', columns:1,
    colors:{ bg:'#ffffff', card:'#fafafa', text:'#111111', muted:'#737373', accent:'#111111', accentFg:'#ffffff', border:'#e5e5e5' },
    style:{ photoShape:'circle', photoSize:'lg', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'bordered', hasGlow:false, hasScanlines:false } },

  { id:'soft-gray', name:'Soft Gray', category:'minimal', emoji:'🌫️', vibe:'Calm and neutral', columns:1,
    colors:{ bg:'#f9fafb', card:'#ffffff', text:'#111827', muted:'#6b7280', accent:'#374151', accentFg:'#ffffff', border:'#e5e7eb' },
    style:{ photoShape:'circle', photoSize:'lg', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'paper', name:'Paper', category:'minimal', emoji:'📄', vibe:'Editorial warm', columns:2,
    colors:{ bg:'#faf9f7', card:'#ffffff', text:'#1c1917', muted:'#78716c', accent:'#44403c', accentFg:'#ffffff', border:'#e7e5e4' },
    style:{ photoShape:'square', photoSize:'lg', headerAlign:'left', fontFamily:'Playfair Display', cardStyle:'flat', hasGlow:false, hasScanlines:false } },

  // ── GOLD / PREMIUM ─────────────────────────────────────────
  { id:'trustbank-gold', name:'TrustBank Gold', category:'premium', emoji:'✨', vibe:'Luxury gold', columns:1,
    colors:{ bg:'#fdfcf8', card:'#ffffff', text:'#1c1917', muted:'#78716c', accent:'#c9a84c', accentFg:'#ffffff', border:'#fde68a' },
    style:{ photoShape:'rounded', photoSize:'xl', headerAlign:'center', fontFamily:'Playfair Display', cardStyle:'elevated', hasGlow:true, hasScanlines:false } },

  { id:'black-gold', name:'Black & Gold', category:'premium', emoji:'🥇', vibe:'Amex Black', columns:1,
    colors:{ bg:'#0a0a0a', card:'#141414', text:'#fafafa', muted:'#a3a3a3', accent:'#c9a84c', accentFg:'#0a0a0a', border:'#262626' },
    style:{ photoShape:'rounded', photoSize:'xl', headerAlign:'center', fontFamily:'Playfair Display', cardStyle:'bordered', hasGlow:true, hasScanlines:false } },

  { id:'champagne', name:'Champagne', category:'premium', emoji:'🥂', vibe:'Celebration luxury', columns:2,
    colors:{ bg:'#fffef7', card:'#ffffff', text:'#3d2c00', muted:'#9b7a2a', accent:'#b8961f', accentFg:'#ffffff', border:'#fde68a' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Playfair Display', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'executive-navy', name:'Executive Navy', category:'premium', emoji:'🏢', vibe:'Corporate authority', columns:2,
    colors:{ bg:'#f8fafc', card:'#ffffff', text:'#0f172a', muted:'#475569', accent:'#1e3a8a', accentFg:'#ffffff', border:'#e2e8f0' },
    style:{ photoShape:'rounded', photoSize:'md', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'bordered', hasGlow:false, hasScanlines:false } },

  // ── COLORFUL VIBRANT ───────────────────────────────────────
  { id:'violet-dream', name:'Violet Dream', category:'colorful', emoji:'💜', vibe:'Modern purple', columns:1,
    colors:{ bg:'#faf5ff', card:'#ffffff', text:'#2e1065', muted:'#7c3aed', accent:'#7c3aed', accentFg:'#ffffff', border:'#ede9fe' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'ocean-blue', name:'Ocean Blue', category:'colorful', emoji:'🌊', vibe:'Deep & trustworthy', columns:2,
    colors:{ bg:'#f0f9ff', card:'#ffffff', text:'#0c4a6e', muted:'#0369a1', accent:'#0284c7', accentFg:'#ffffff', border:'#bae6fd' },
    style:{ photoShape:'rounded', photoSize:'lg', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'emerald-fresh', name:'Emerald Fresh', category:'colorful', emoji:'💚', vibe:'Nature & growth', columns:2,
    colors:{ bg:'#f0fdf4', card:'#ffffff', text:'#14532d', muted:'#16a34a', accent:'#16a34a', accentFg:'#ffffff', border:'#bbf7d0' },
    style:{ photoShape:'circle', photoSize:'lg', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'rose-petal', name:'Rose Petal', category:'colorful', emoji:'🌹', vibe:'Warm & inviting', columns:1,
    colors:{ bg:'#fff1f2', card:'#ffffff', text:'#881337', muted:'#be123c', accent:'#e11d48', accentFg:'#ffffff', border:'#fecdd3' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'sunset-orange', name:'Sunset', category:'colorful', emoji:'🌅', vibe:'Warm & energetic', columns:2,
    colors:{ bg:'#fff7ed', card:'#ffffff', text:'#7c2d12', muted:'#c2410c', accent:'#f97316', accentFg:'#ffffff', border:'#fed7aa' },
    style:{ photoShape:'rounded', photoSize:'lg', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'sky-light', name:'Sky Light', category:'colorful', emoji:'☁️', vibe:'Calm & open', columns:1,
    colors:{ bg:'#f0f9ff', card:'#ffffff', text:'#0369a1', muted:'#0284c7', accent:'#38bdf8', accentFg:'#0c4a6e', border:'#e0f2fe' },
    style:{ photoShape:'circle', photoSize:'lg', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'flat', hasGlow:false, hasScanlines:false } },

  { id:'mint-cool', name:'Mint Cool', category:'colorful', emoji:'🍃', vibe:'Fresh & modern', columns:2,
    colors:{ bg:'#f0fdfa', card:'#ffffff', text:'#0f4c3a', muted:'#0d9488', accent:'#14b8a6', accentFg:'#ffffff', border:'#ccfbf1' },
    style:{ photoShape:'rounded', photoSize:'md', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'bordered', hasGlow:false, hasScanlines:false } },

  { id:'lavender', name:'Lavender', category:'colorful', emoji:'🫐', vibe:'Soft & creative', columns:1,
    colors:{ bg:'#f5f3ff', card:'#ffffff', text:'#2e1065', muted:'#6d28d9', accent:'#8b5cf6', accentFg:'#ffffff', border:'#ddd6fe' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'coral', name:'Coral', category:'colorful', emoji:'🪸', vibe:'Bold & playful', columns:2,
    colors:{ bg:'#fff5f0', card:'#ffffff', text:'#7c2d12', muted:'#ea580c', accent:'#fb923c', accentFg:'#ffffff', border:'#fed7aa' },
    style:{ photoShape:'rounded', photoSize:'lg', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'indigo-night', name:'Indigo', category:'colorful', emoji:'🔷', vibe:'Deep & focused', columns:1,
    colors:{ bg:'#eef2ff', card:'#ffffff', text:'#1e1b4b', muted:'#4338ca', accent:'#4f46e5', accentFg:'#ffffff', border:'#c7d2fe' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'amber-warm', name:'Amber', category:'colorful', emoji:'🟡', vibe:'Warm & positive', columns:2,
    colors:{ bg:'#fffbeb', card:'#ffffff', text:'#78350f', muted:'#b45309', accent:'#d97706', accentFg:'#ffffff', border:'#fde68a' },
    style:{ photoShape:'rounded', photoSize:'md', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'bordered', hasGlow:false, hasScanlines:false } },

  { id:'pink-pop', name:'Pink Pop', category:'colorful', emoji:'💗', vibe:'Fun & energetic', columns:1,
    colors:{ bg:'#fdf2f8', card:'#ffffff', text:'#831843', muted:'#be185d', accent:'#ec4899', accentFg:'#ffffff', border:'#fbcfe8' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'forest', name:'Forest', category:'colorful', emoji:'🌲', vibe:'Deep & stable', columns:2,
    colors:{ bg:'#f0fdf4', card:'#ffffff', text:'#14532d', muted:'#15803d', accent:'#16a34a', accentFg:'#ffffff', border:'#bbf7d0' },
    style:{ photoShape:'rounded', photoSize:'lg', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'slate-pro', name:'Slate Pro', category:'colorful', emoji:'🩶', vibe:'Professional & calm', columns:3,
    colors:{ bg:'#f8fafc', card:'#ffffff', text:'#0f172a', muted:'#475569', accent:'#475569', accentFg:'#ffffff', border:'#e2e8f0' },
    style:{ photoShape:'rounded', photoSize:'md', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'bordered', hasGlow:false, hasScanlines:false } },

  // ── DARK THEMES ────────────────────────────────────────────
  { id:'midnight-pro', name:'Midnight', category:'dark', emoji:'🌙', vibe:'Sleek dark', columns:1,
    colors:{ bg:'#09090b', card:'#111113', text:'#fafafa', muted:'#71717a', accent:'#8b5cf6', accentFg:'#ffffff', border:'#27272a' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'bordered', hasGlow:true, hasScanlines:false } },

  { id:'dark-ocean', name:'Dark Ocean', category:'dark', emoji:'🌊', vibe:'Deep blue night', columns:1,
    colors:{ bg:'#020c1b', card:'#0a192f', text:'#ccd6f6', muted:'#8892b0', accent:'#64ffda', accentFg:'#020c1b', border:'#1a2a4a' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'glass', hasGlow:true, hasScanlines:false } },

  { id:'carbon', name:'Carbon', category:'dark', emoji:'🖤', vibe:'Ultra minimal dark', columns:2,
    colors:{ bg:'#0a0a0a', card:'#141414', text:'#e5e5e5', muted:'#737373', accent:'#ffffff', accentFg:'#000000', border:'#262626' },
    style:{ photoShape:'square', photoSize:'md', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'bordered', hasGlow:false, hasScanlines:false } },

  { id:'dark-rose', name:'Dark Rose', category:'dark', emoji:'🌹', vibe:'Moody romance', columns:1,
    colors:{ bg:'#0d0007', card:'#1a0010', text:'#fce7f3', muted:'#f472b6', accent:'#ec4899', accentFg:'#ffffff', border:'#3d001a' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Playfair Display', cardStyle:'glass', hasGlow:true, hasScanlines:false } },

  { id:'aurora', name:'Aurora', category:'dark', emoji:'🌌', vibe:'Northern lights', columns:1,
    colors:{ bg:'#050510', card:'#0a0a20', text:'#e0e0ff', muted:'#8080c0', accent:'#7c3aed', accentFg:'#ffffff', border:'#1a1a40' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'glass', hasGlow:true, hasScanlines:false } },

  // ── PROFESSIONAL ───────────────────────────────────────────
  { id:'law-firm', name:'Law Firm', category:'professional', emoji:'⚖️', vibe:'Legal authority', columns:2,
    colors:{ bg:'#faf9f6', card:'#ffffff', text:'#1c1917', muted:'#57534e', accent:'#44403c', accentFg:'#ffffff', border:'#d6d3d1' },
    style:{ photoShape:'rounded', photoSize:'md', headerAlign:'left', fontFamily:'Playfair Display', cardStyle:'bordered', hasGlow:false, hasScanlines:false } },

  { id:'medical', name:'Medical', category:'professional', emoji:'🩺', vibe:'Healthcare clean', columns:1,
    colors:{ bg:'#f0f9ff', card:'#ffffff', text:'#0c4a6e', muted:'#0369a1', accent:'#0284c7', accentFg:'#ffffff', border:'#bae6fd' },
    style:{ photoShape:'circle', photoSize:'lg', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'consulting', name:'Consulting', category:'professional', emoji:'📊', vibe:'Data-driven', columns:3,
    colors:{ bg:'#f1f5f9', card:'#ffffff', text:'#0f172a', muted:'#64748b', accent:'#0f766e', accentFg:'#ffffff', border:'#cbd5e1' },
    style:{ photoShape:'circle', photoSize:'md', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'elevated', hasGlow:false, hasScanlines:false } },

  { id:'finance', name:'Finance', category:'professional', emoji:'💹', vibe:'Wall Street', columns:2,
    colors:{ bg:'#f8fafc', card:'#ffffff', text:'#0f172a', muted:'#334155', accent:'#0f172a', accentFg:'#ffffff', border:'#e2e8f0' },
    style:{ photoShape:'rounded', photoSize:'md', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'bordered', hasGlow:false, hasScanlines:false } },

  { id:'academic', name:'Academic', category:'professional', emoji:'🎓', vibe:'University & research', columns:1,
    colors:{ bg:'#fafaf9', card:'#ffffff', text:'#1c1917', muted:'#78716c', accent:'#7c3aed', accentFg:'#ffffff', border:'#e7e5e4' },
    style:{ photoShape:'circle', photoSize:'lg', headerAlign:'center', fontFamily:'Playfair Display', cardStyle:'flat', hasGlow:false, hasScanlines:false } },

  // ── CREATIVE ───────────────────────────────────────────────
  { id:'photographer', name:'Photographer', category:'creative', emoji:'📸', vibe:'Gallery dark', columns:3,
    colors:{ bg:'#0a0a0a', card:'#141414', text:'#f5f5f5', muted:'#888888', accent:'#ffffff', accentFg:'#000000', border:'#2a2a2a' },
    style:{ photoShape:'square', photoSize:'xl', headerAlign:'left', fontFamily:'Plus Jakarta Sans', cardStyle:'flat', hasGlow:false, hasScanlines:false } },

  { id:'artist', name:'Artist', category:'creative', emoji:'🎨', vibe:'Bold & expressive', columns:2,
    colors:{ bg:'#fffff0', card:'#ffffff', text:'#3d2a00', muted:'#92400e', accent:'#f59e0b', accentFg:'#ffffff', border:'#fde68a' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Playfair Display', cardStyle:'flat', hasGlow:false, hasScanlines:false } },

  { id:'musician', name:'Musician', category:'creative', emoji:'🎵', vibe:'Stage presence', columns:1,
    colors:{ bg:'#0f0020', card:'#1a0030', text:'#ffe0ff', muted:'#cc44aa', accent:'#ff6ec7', accentFg:'#ffffff', border:'#3a0060' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'glass', hasGlow:true, hasScanlines:false } },

  { id:'writer', name:'Writer', category:'creative', emoji:'✍️', vibe:'Editorial & clean', columns:1,
    colors:{ bg:'#fefefe', card:'#ffffff', text:'#1a1a1a', muted:'#666666', accent:'#1a1a1a', accentFg:'#ffffff', border:'#e0e0e0' },
    style:{ photoShape:'circle', photoSize:'md', headerAlign:'left', fontFamily:'Playfair Display', cardStyle:'flat', hasGlow:false, hasScanlines:false } },

  // ── RETRO ──────────────────────────────────────────────────
  { id:'synthwave', name:'Synthwave', category:'retro', emoji:'🌅', vibe:'Retro 80s', columns:1,
    colors:{ bg:'#0a0015', card:'#150025', text:'#ff99ff', muted:'#9955aa', accent:'#ff006e', accentFg:'#ffffff', border:'#4a0080' },
    style:{ photoShape:'hexagon', photoSize:'lg', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'neon', hasGlow:true, hasScanlines:true } },

  { id:'miami', name:'Miami Vice', category:'retro', emoji:'🌴', vibe:'Miami neon', columns:1,
    colors:{ bg:'#050010', card:'#0f0025', text:'#ffe0ff', muted:'#cc44aa', accent:'#ff6ec7', accentFg:'#ffffff', border:'#3a0060' },
    style:{ photoShape:'circle', photoSize:'xl', headerAlign:'center', fontFamily:'Plus Jakarta Sans', cardStyle:'neon', hasGlow:true, hasScanlines:true } },

  { id:'matrix', name:'Matrix', category:'retro', emoji:'💊', vibe:'Hacker green', columns:1,
    colors:{ bg:'#001200', card:'#001a00', text:'#ccffcc', muted:'#447744', accent:'#39ff14', accentFg:'#000000', border:'#003300' },
    style:{ photoShape:'square', photoSize:'md', headerAlign:'center', fontFamily:'JetBrains Mono', cardStyle:'bordered', hasGlow:true, hasScanlines:true } },

  { id:'brutalist', name:'Brutalist', category:'retro', emoji:'🏗️', vibe:'Raw & bold', columns:1,
    colors:{ bg:'#fffff0', card:'#ffffff', text:'#000000', muted:'#555555', accent:'#ff0000', accentFg:'#ffffff', border:'#000000' },
    style:{ photoShape:'square', photoSize:'xl', headerAlign:'left', fontFamily:'JetBrains Mono', cardStyle:'bordered', hasGlow:false, hasScanlines:false } },
];

export const TEMPLATE_CATEGORIES = [
  { id:'all',          label:'All',          emoji:'✨' },
  { id:'minimal',      label:'Minimal',      emoji:'⬜' },
  { id:'premium',      label:'Premium',      emoji:'✨' },
  { id:'colorful',     label:'Colorful',     emoji:'🎨' },
  { id:'dark',         label:'Dark',         emoji:'🌙' },
  { id:'professional', label:'Professional', emoji:'💼' },
  { id:'creative',     label:'Creative',     emoji:'🎭' },
  { id:'retro',        label:'Retro',        emoji:'🕹️' },
] as const;

export function getTemplateById(id: string) {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
}

export function getByCategory(cat: string) {
  if (cat === 'all') return TEMPLATES;
  return TEMPLATES.filter(t => t.category === cat);
}
