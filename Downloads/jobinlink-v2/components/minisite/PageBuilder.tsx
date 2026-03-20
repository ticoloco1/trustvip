'use client';
import { useState } from 'react';
import { Plus, X, GripVertical, Check, Globe, Hash, Link2, Star, Zap, Award, Heart, Coffee, Music, Camera, Code, Pen, BookOpen, Briefcase, Home, ShoppingBag, Gavel, Video, Map, FileText, Users, MessageSquare } from 'lucide-react';

// ─── Sticker definitions ──────────────────────────────────────
export const STICKERS = [
  // Status
  { id:'open_work',     emoji:'💼', label:'Open to Work',     color:'#22c55e' },
  { id:'available',     emoji:'✅', label:'Available Now',    color:'#22c55e' },
  { id:'busy',          emoji:'🔴', label:'Busy',             color:'#ef4444' },
  { id:'hiring',        emoji:'🤝', label:'We\'re Hiring',    color:'#3b82f6' },
  { id:'freelance',     emoji:'💻', label:'Freelance',        color:'#8b5cf6' },
  // Identity
  { id:'verified',      emoji:'✔️',  label:'Verified',         color:'#3b82f6' },
  { id:'pro',           emoji:'⭐', label:'Pro Creator',      color:'#f59e0b' },
  { id:'gold',          emoji:'🥇', label:'Gold Member',      color:'#c9a84c' },
  { id:'new',           emoji:'🆕', label:'New Here',         color:'#06b6d4' },
  { id:'top10',         emoji:'🏆', label:'Top 10%',          color:'#f59e0b' },
  // Mood / vibes
  { id:'coffee',        emoji:'☕', label:'Coffee Lover',     color:'#92400e' },
  { id:'music',         emoji:'🎵', label:'Music',            color:'#ec4899' },
  { id:'crypto',        emoji:'🔷', label:'Web3 Native',      color:'#7c3aed' },
  { id:'builder',       emoji:'🔨', label:'Builder',          color:'#ea580c' },
  { id:'traveler',      emoji:'✈️',  label:'Traveler',         color:'#0ea5e9' },
  // Profession
  { id:'dev',           emoji:'💻', label:'Developer',        color:'#6366f1' },
  { id:'designer',      emoji:'🎨', label:'Designer',         color:'#ec4899' },
  { id:'writer',        emoji:'✍️',  label:'Writer',           color:'#8b5cf6' },
  { id:'photographer',  emoji:'📸', label:'Photographer',     color:'#f97316' },
  { id:'lawyer',        emoji:'⚖️',  label:'Attorney',         color:'#c9a84c' },
  { id:'doctor',        emoji:'🩺', label:'Doctor',           color:'#0ea5e9' },
  { id:'nft',           emoji:'🖼️',  label:'NFT Artist',       color:'#bf00ff' },
  { id:'onlyfans',      emoji:'🔞', label:'18+ Creator',      color:'#ff006e' },
] as const;

export type StickerId = typeof STICKERS[number]['id'];

// ─── Sticker badge component ──────────────────────────────────
export function StickerBadge({
  stickerId, size = 'sm',
}: { stickerId: StickerId; size?: 'sm' | 'md' }) {
  const sticker = STICKERS.find(s => s.id === stickerId);
  if (!sticker) return null;
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2 py-1 text-[10px]'}`}
      style={{ background: `${sticker.color}15`, color: sticker.color, border: `1px solid ${sticker.color}30` }}
    >
      <span className={size === 'md' ? 'text-sm' : 'text-xs'}>{sticker.emoji}</span>
      {sticker.label}
    </div>
  );
}

// ─── Sticker picker (dashboard editor) ───────────────────────
export function StickerPicker({
  selected, onChange, max = 5, accent = '#8b5cf6', cardBg = '#111113', border = '#27272a', text = '#fafafa', muted = '#71717a',
}: {
  selected: StickerId[]; onChange: (ids: StickerId[]) => void;
  max?: number; accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
}) {
  const toggle = (id: StickerId) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color: text }}>Header stickers</p>
        <span className="text-xs" style={{ color: muted }}>{selected.length}/{max} selected</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {STICKERS.map(s => {
          const isSelected = selected.includes(s.id as StickerId);
          return (
            <button key={s.id} onClick={() => toggle(s.id as StickerId)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${isSelected ? 'ring-2' : 'opacity-60 hover:opacity-100'}`}
              style={{
                background: isSelected ? `${s.color}20` : `${cardBg}`,
                color: s.color,
                border: `1px solid ${isSelected ? s.color : border}`,
                ringColor: s.color,
              }}>
              {isSelected && <Check className="h-2.5 w-2.5" />}
              <span className="text-xs">{s.emoji}</span> {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page Builder ─────────────────────────────────────────────
export const ALL_MODULES = [
  { id:'feed',        label:'Feed (7-day stories)',    icon:'📡', desc:'Posts that disappear in 7 days' },
  { id:'bio',         label:'Bio & Skills',            icon:'📝', desc:'About you and expertise' },
  { id:'links',       label:'Links',                   icon:'🔗', desc:'Important links' },
  { id:'video',       label:'Main Video',              icon:'▶️',  desc:'Featured video with optional paywall' },
  { id:'portfolio',   label:'Video Portfolio',         icon:'🎬', desc:'Netflix-style video grid' },
  { id:'cv',          label:'Resume / CV',             icon:'💼', desc:'Work experience + locked contact' },
  { id:'articles',    label:'Articles & Blog',         icon:'📰', desc:'Written content with paywall' },
  { id:'classifieds', label:'Classifieds / Shop',      icon:'🏪', desc:'Items for sale' },
  { id:'slugs',       label:'Slugs for Sale',          icon:'🏷️',  desc:'Your slugs marketplace' },
  { id:'social',      label:'Social Networks',         icon:'🌐', desc:'Instagram, LinkedIn etc.' },
  { id:'contact',     label:'Contact',                 icon:'📞', desc:'Contact form / details' },
  { id:'map',         label:'Map / Location',          icon:'📍', desc:'Where you are' },
  { id:'nfts',        label:'NFTs & Digital',          icon:'🖼️',  desc:'Digital art and collectibles' },
  { id:'paywall_full',label:'Exclusive Zone',          icon:'🔒', desc:'Full paywall section' },
  { id:'booking',     label:'Book / Schedule',         icon:'📅', desc:'Appointments and consultations' },
  { id:'store',       label:'Digital Store',           icon:'💳', desc:'Digital products and downloads' },
] as const;

export type ModuleId = typeof ALL_MODULES[number]['id'];

export interface MiniSitePage {
  id: string;
  title: string;
  slug: string;
  modules: ModuleId[];
  layout: 1 | 2 | 3;
  icon?: string;
}

function ModuleToggle({ mod, enabled, onToggle, accent, border, text, muted, cardBg }: any) {
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 transition-all ${enabled ? '' : 'opacity-50'}`}
      style={{ background: enabled ? `${accent}08` : cardBg, border: `1px solid ${enabled ? `${accent}30` : border}` }}>
      <span className="text-base w-6 flex-shrink-0">{mod.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: text }}>{mod.label}</p>
        <p className="text-[10px] truncate" style={{ color: muted }}>{mod.desc}</p>
      </div>
      <button onClick={onToggle}
        className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
        style={{ background: enabled ? `${accent}20` : border, color: enabled ? accent : muted }}>
        {enabled ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

// ─── Page Builder Component ───────────────────────────────────
export function PageBuilder({
  pages, onChange, maxPages = 10,
  accent = '#8b5cf6', cardBg = '#111113', border = '#27272a', text = '#fafafa', muted = '#71717a',
}: {
  pages: MiniSitePage[]; onChange: (pages: MiniSitePage[]) => void; maxPages?: number;
  accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
}) {
  const [activePage, setActivePage] = useState(0);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);

  const addPage = () => {
    if (pages.length >= maxPages) return;
    const newPage: MiniSitePage = {
      id: `page-${Date.now()}`,
      title: `Page ${pages.length + 1}`,
      slug: `page-${pages.length + 1}`,
      modules: ['bio', 'links'],
      layout: 1,
      icon: '📄',
    };
    onChange([...pages, newPage]);
    setActivePage(pages.length);
  };

  const removePage = (idx: number) => {
    if (pages.length <= 1) return;
    const next = pages.filter((_, i) => i !== idx);
    onChange(next);
    setActivePage(Math.min(activePage, next.length - 1));
  };

  const updatePage = (idx: number, updates: Partial<MiniSitePage>) => {
    onChange(pages.map((p, i) => i === idx ? { ...p, ...updates } : p));
  };

  const toggleModule = (pageIdx: number, modId: ModuleId) => {
    const page = pages[pageIdx];
    const mods = page.modules.includes(modId)
      ? page.modules.filter(m => m !== modId)
      : [...page.modules, modId];
    updatePage(pageIdx, { modules: mods });
  };

  const current = pages[activePage];

  return (
    <div className="space-y-4">
      {/* Page tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {pages.map((page, i) => (
          <div key={page.id} className="relative group">
            <button onClick={() => setActivePage(i)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                activePage === i ? 'border' : 'border'
              }`}
              style={{
                background: activePage === i ? `${accent}15` : cardBg,
                borderColor: activePage === i ? accent : border,
                color: activePage === i ? accent : muted,
              }}>
              <span>{page.icon || '📄'}</span>
              {editingTitle === page.id ? (
                <input
                  value={page.title} autoFocus
                  onChange={e => updatePage(i, { title: e.target.value })}
                  onBlur={() => setEditingTitle(null)}
                  onKeyDown={e => e.key === 'Enter' && setEditingTitle(null)}
                  className="bg-transparent border-none outline-none w-20 text-sm"
                  style={{ color: accent }}
                />
              ) : (
                <span onDoubleClick={() => setEditingTitle(page.id)}>{page.title}</span>
              )}
            </button>
            {pages.length > 1 && (
              <button onClick={() => removePage(i)}
                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full hidden group-hover:flex items-center justify-center text-white"
                style={{ background: '#ef4444' }}>
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        ))}
        {pages.length < maxPages && (
          <button onClick={addPage}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium border transition-all hover:opacity-80"
            style={{ borderColor: border, color: muted, borderStyle: 'dashed' }}>
            <Plus className="h-4 w-4" /> Add page
          </button>
        )}
        <span className="text-xs ml-1" style={{ color: muted }}>{pages.length}/{maxPages}</span>
      </div>

      {/* Current page config */}
      {current && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input value={current.icon || '📄'} onChange={e => updatePage(activePage, { icon: e.target.value })}
                className="bg-transparent border-none outline-none w-8 text-lg cursor-pointer" />
              <div>
                <input value={current.title} onChange={e => updatePage(activePage, { title: e.target.value })}
                  className="font-semibold text-sm bg-transparent border-none outline-none"
                  style={{ color: text }} />
                <p className="text-[10px]" style={{ color: muted }}>/{current.slug}</p>
              </div>
            </div>
            {/* Column layout */}
            <div className="flex gap-1">
              {([1,2,3] as const).map(c => (
                <button key={c} onClick={() => updatePage(activePage, { layout: c })}
                  className="h-7 w-7 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: current.layout === c ? accent : border,
                    color: current.layout === c ? '#fff' : muted,
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: muted }}>Modules on this page</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {ALL_MODULES.map(mod => (
                <ModuleToggle
                  key={mod.id} mod={mod}
                  enabled={current.modules.includes(mod.id as ModuleId)}
                  onToggle={() => toggleModule(activePage, mod.id as ModuleId)}
                  accent={accent} cardBg={cardBg} border={border} text={text} muted={muted}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
