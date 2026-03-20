'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { cn, formatCurrency, formatDate, getProfileUrl } from '@/lib/utils';
import { toast } from 'sonner';
import {
  User, Palette, Layout, Wallet, Sparkles, Settings, Eye, Save, Loader2,
  Bell, BarChart3, MessageSquare, Calendar, ChevronRight, TrendingUp,
  Users, Globe, Star, Briefcase, Crown, Coins, Plus, Check, X,
  GripVertical, LayoutGrid, Columns2, Columns3, ArrowUpRight, ArrowRight,
  Lock, Unlock, Video, Hash, Building2, FileText, ImageIcon, ShoppingBag,
  Gavel, Map, Link2, Zap, RefreshCw, ExternalLink, Copy, Shield,
  Heart, Coffee, Music, Camera, Code, Pen, Stethoscope, Scale, Home,
  Car, Tag, Trophy, Activity, Clock, DollarSign, CreditCard, Phone,
  Mail, Linkedin, Instagram, Twitter, Youtube, BookOpen, Newspaper,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  location: string;
  skills: string;
  contact_email: string;
  contact_phone: string;
  contact_linkedin: string;
  contact_instagram?: string;
  contact_twitter?: string;
  contact_youtube?: string;
  is_published: boolean;
  wallet_address: string;
  paywall_enabled: boolean;
  paywall_mode: 'none' | 'videos' | 'full';
  paywall_interval: 'monthly' | 'daily';
  paywall_price_cents: number;
  minisite_paid_until?: string | null;
  minisite_plan?: 'none' | 'starter' | 'pro' | 'elite';
  user_type: 'seeker' | 'company';
  photo_url?: string | null;
  banner_url?: string | null;
  slug?: string;
  credits?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',    label: 'Overview',  icon: BarChart3 },
  { id: 'profile',     label: 'Perfil',        icon: User },
  { id: 'appearance',  label: 'Appearance',     icon: Palette },
  { id: 'modules',     label: 'Modules',       icon: Layout },
  { id: 'content',     label: 'Content',      icon: FileText },
  { id: 'monetize',    label: 'Monetize',     icon: DollarSign },
  { id: 'wallet',      label: 'Wallet',      icon: Wallet },
  { id: 'plans',       label: 'Plans',        icon: Sparkles },
  { id: 'messages',    label: 'Messages',     icon: MessageSquare },
  { id: 'calendar',    label: 'Calendar',        icon: Calendar },
  { id: 'settings',    label: 'Settings', icon: Settings },
];

const MODULES: Record<string, { label: string; icon: string; desc: string; category: string }> = {
  video:         { label: 'Main Video',              icon: '🎬', desc: 'Video presentation', category: 'media' },
  bio:           { label: 'Bio & Skills',            icon: '📝', desc: 'About you and skills', category: 'profile' },
  links:         { label: 'Links',                   icon: '🔗', desc: 'Important links', category: 'profile' },
  cv:            { label: 'Resume / CV',             icon: '💼', desc: 'Experience and education', category: 'profile' },
  contact:       { label: 'Contact',                 icon: '📞', desc: 'Contact methods', category: 'profile' },
  portfolio:     { label: 'Portfolio',               icon: '🎥', desc: 'Work gallery', category: 'media' },
  posts:         { label: 'Posts / Feed',            icon: '💬', desc: 'Publications and articles', category: 'content' },
  classificados: { label: 'Classifieds',             icon: '📋', desc: 'Real estate, cars, products', category: 'commerce' },
  nfts:          { label: 'NFTs & Digital',          icon: '🖼️',  desc: 'Digital art and NFTs', category: 'commerce' },
  slugs:         { label: 'Slugs for Sale',          icon: '🏷️',  desc: 'Slug marketplace', category: 'commerce' },
  leilao:        { label: 'Auction',                 icon: '🔨', desc: 'Item and content auctions', category: 'commerce' },
  paywall_posts: { label: 'Paid Content',            icon: '🔒', desc: 'Articles and photos by subscription', category: 'monetize' },
  onlyfans:      { label: 'Exclusive Content',       icon: '⭐', desc: 'Premium photos and videos', category: 'monetize' },
  agenda:        { label: 'Bookings & Appointments', icon: '📅', desc: 'Schedule services and consultations', category: 'service' },
  map:           { label: 'Map / Location',          icon: '📍', desc: 'Where you are', category: 'profile' },
  social:        { label: 'Social Networks',         icon: '🌐', desc: 'Instagram, LinkedIn etc.', category: 'profile' },
  ticker:        { label: 'Slug Ticker',             icon: '📡', desc: 'Featured slugs for sale', category: 'commerce' },
  boost:         { label: 'Boost',                icon: '🚀', desc: 'Destaque no diretório', category: 'monetize' },
  ia_assistant:  { label: 'AI Assistant',        icon: '🤖', desc: 'Chat IA personalizado', category: 'service' },
  curriculum_ia: { label: 'AI Resume',            icon: '✨', desc: 'Currículo gerado por IA', category: 'service' },
};

const PLANS = [
  { id: 'starter', name: 'Starter',  price: 499, priceYear: 4900, color: 'emerald', features: ['1 page','5 modules','Domínio jobinlink.com','Basic analytics'] },
  { id: 'pro',     name: 'Pro',      price: 1499, priceYear: 14900, color: 'violet',  features: ['5 pages','All modules','Paywall','Advanced analytics','AI assistant'] },
  { id: 'elite',   name: 'Elite',    price: 2999, priceYear: 27900, color: 'amber',   features: ['10 pages','Everything in Pro','Leilão of slugs','AI Resume','Priority support','Custom domain'] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Badge({ children, color = 'violet' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red:     'bg-red-500/10 text-red-400 border-red-500/20',
    blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', colors[color] || colors.violet)}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, trend }: any) {
  const colors: Record<string, string> = {
    violet: 'text-violet-400 bg-violet-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber:   'text-amber-400 bg-amber-500/10',
    blue:    'text-blue-400 bg-blue-500/10',
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#27272a] bg-[#111113] p-5 transition-all hover:border-[#3f3f46]">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', colors[color] || colors.violet)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            <TrendingUp className="h-3 w-3" />
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-[#71717a]">{label}</p>
      {sub && <p className="text-xs text-[#52525b] mt-1">{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between border-b border-[#27272a] pb-4 mb-6">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-[#71717a] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-[#27272a] bg-[#111113] p-6', className)}>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#a1a1aa]">{label}</label>
      {children}
      {hint && <p className="text-xs text-[#52525b]">{hint}</p>}
    </div>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-xl border border-[#27272a] bg-[#18181b] px-4 py-2.5 text-sm text-[#fafafa] placeholder:text-[#52525b]',
        'focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all',
        className
      )}
    />
  );
}

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full rounded-xl border border-[#27272a] bg-[#18181b] px-4 py-2.5 text-sm text-[#fafafa] placeholder:text-[#52525b]',
        'focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all resize-none',
        className
      )}
    />
  );
}

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#e4e4e7]">{label}</p>
        {desc && <p className="text-xs text-[#71717a] mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 flex-shrink-0 rounded-full transition-colors focus:outline-none',
          checked ? 'bg-violet-600' : 'bg-[#27272a]'
        )}
      >
        <span className={cn(
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )} />
      </button>
    </div>
  );
}

// ─── Sortable Module Item ─────────────────────────────────────────────────────
function SortableModule({ id, enabled, onToggle }: { id: string; enabled: boolean; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const mod = MODULES[id] || { label: id, icon: '📦', desc: '', category: '' };
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 transition-all select-none',
        enabled ? 'border-violet-500/30 bg-violet-500/5' : 'border-[#27272a] bg-[#18181b] opacity-60',
        isDragging && 'shadow-2xl shadow-violet-500/20 scale-[1.02]'
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none text-[#52525b] hover:text-[#a1a1aa]">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="text-base w-6">{mod.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#e4e4e7] truncate">{mod.label}</p>
        <p className="text-xs text-[#52525b] truncate">{mod.desc}</p>
      </div>
      <Badge color={enabled ? 'violet' : 'red'}>{mod.category}</Badge>
      <button onClick={onToggle} className={cn(
        'h-7 w-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
        enabled ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30' : 'bg-[#27272a] text-[#71717a] hover:bg-[#3f3f46]'
      )}>
        {enabled ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

// ─── Analytics Chart (simple bars) ───────────────────────────────────────────
function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm bg-violet-500/40 hover:bg-violet-500/70 transition-all"
            style={{ height: `${(v / max) * 100}%`, minHeight: 2 }}
          />
          <span className="text-[9px] text-[#52525b]">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function Dashboard() {
  const { user, loading: authLoading, credits, refreshCredits } = useAuth();
  const router = useRouter();
  const [section, setSection]         = useState('overview');
  const [profile, setProfile]         = useState<Profile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [slug, setSlug]               = useState('');
  const [moduleOrder, setModuleOrder] = useState<string[]>(Object.keys(MODULES));
  const [enabled, setEnabled]         = useState<Set<string>>(new Set(['bio', 'links', 'cv', 'contact', 'social']));
  const [layoutCols, setLayout]       = useState<1 | 2 | 3>(1);
  const [savingMods, setSavingMods]   = useState(false);
  const [notifications, setNotifs]    = useState([
    { id: 1, text: 'New visitor on your profile', time: '2 min', read: false },
    { id: 2, text: 'Slug "dev.pro" available for auction', time: '1h', read: false },
    { id: 3, text: 'Mini-site subscription renewed', time: '3h', read: true },
  ]);
  const [messages, setMessages]       = useState([
    { id: 1, from: 'TechCorp', avatar: '🏢', text: "We'd love to see your portfolio...", time: '10 min', unread: true },
    { id: 2, from: 'Ana Lima', avatar: '👩', text: 'Thanks for reaching out!', time: '2h', unread: false },
  ]);
  const bioRef = useRef<HTMLTextAreaElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) loadProfile();
  }, [user, authLoading]);

  const loadProfile = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user!.id).maybeSingle();
      if (data) {
        setProfile({
          id: data.id,
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          location: data.location || '',
          skills: (data.skills || []).join(', '),
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          contact_linkedin: data.contact_linkedin || '',
          is_published: data.is_published || false,
          wallet_address: (data as any).wallet_address || '',
          paywall_enabled: (data as any).paywall_enabled || false,
          paywall_mode: (data as any).paywall_mode || 'none',
          paywall_interval: (data as any).paywall_interval || 'monthly',
          paywall_price_cents: (data as any).paywall_price_cents || 0,
          minisite_paid_until: (data as any).minisite_paid_until || null,
          minisite_plan: (data as any).minisite_plan || 'none',
          user_type: data.user_type || 'seeker',
          photo_url: data.photo_url || null,
          banner_url: (data as any).banner_url || null,
          slug: data.slug || '',
          credits: data.credits || 0,
        });
        setSlug(data.slug || '');
        const cust = (data as any).site_customization || {};
        if (cust.module_order) setModuleOrder(cust.module_order);
        if (cust.enabled_modules) setEnabled(new Set(cust.enabled_modules));
        if (cust.layout) setLayout(cust.layout);
      } else {
        setProfile({
          name: user?.user_metadata?.name || '',
          title: '', bio: '', location: '', skills: '',
          contact_email: user?.email || '',
          contact_phone: '', contact_linkedin: '',
          is_published: false, wallet_address: '',
          paywall_enabled: false, paywall_mode: 'none',
          paywall_interval: 'monthly', paywall_price_cents: 0,
          user_type: 'seeker',
        });
        setSlug(user?.email?.split('@')[0] || '');
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    try {
      const payload: any = {
        name: profile.name, title: profile.title, bio: profile.bio,
        location: profile.location,
        skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean),
        contact_email: profile.contact_email,
        contact_phone: profile.contact_phone,
        contact_linkedin: profile.contact_linkedin,
        is_published: profile.is_published,
        wallet_address: profile.wallet_address || null,
        paywall_enabled: profile.paywall_enabled,
        paywall_mode: profile.paywall_mode,
        paywall_interval: profile.paywall_interval,
        paywall_price_cents: profile.paywall_price_cents,
        user_id: user.id,
        slug: slug || user.email?.split('@')[0] || 'meu-perfil',
        user_type: profile.user_type,
      };
      if (profile.id) {
        const { error } = await supabase.from('profiles').update(payload).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('profiles').insert(payload);
        if (error) throw error;
      }
      toast.success('Perfil salvo!');
      loadProfile();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModules = async () => {
    if (!user) return;
    setSavingMods(true);
    try {
      const { data: profileData } = await supabase.from('profiles').select('site_customization').eq('user_id', user.id).maybeSingle();
      const cust = profileData?.site_customization || {};
      const updated = {
        ...cust,
        module_order: moduleOrder,
        enabled_modules: Array.from(enabled),
        layout: layoutCols,
      };
      await supabase.from('profiles').update({ site_customization: updated }).eq('user_id', user.id);
      toast.success('Modules salvos!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar');
    } finally {
      setSavingMods(false);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setModuleOrder(prev => arrayMove(prev, prev.indexOf(String(active.id)), prev.indexOf(String(over.id))));
    }
  };

  const toggleModule = (id: string) => setEnabled(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const insertBio = (open: string, close: string) => {
    if (!profile || !bioRef.current) return;
    const ta = bioRef.current;
    const s = ta.selectionStart || 0, e2 = ta.selectionEnd || s;
    const sel = profile.bio.slice(s, e2);
    const next = profile.bio.slice(0, s) + open + sel + close + profile.bio.slice(e2);
    if (next.length > 500) return;
    setProfile({ ...profile, bio: next });
  };

  const isPublished = profile?.is_published && profile?.minisite_paid_until && new Date(profile.minisite_paid_until) > new Date();
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadMsgs = messages.filter(m => m.unread).length;

  if (authLoading || loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-[#71717a] text-sm">Loading...</p>
      </div>
    </div>
  );

  if (!profile) return null;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#09090b] flex">

      {/* ═══ SIDEBAR ═══ */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#27272a] bg-[#09090b] fixed h-full z-20">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#27272a]">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
            <Hash className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">JobinLink</span>
        </div>

        {/* User quick info */}
        <div className="px-4 py-4 border-b border-[#27272a]">
          <div className="flex items-center gap-3 rounded-xl bg-[#111113] border border-[#27272a] p-3">
            {profile.photo_url ? (
              <img src={profile.photo_url} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-500/30" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                {profile.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{profile.name || 'Seu Nome'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={cn('h-1.5 w-1.5 rounded-full', isPublished ? 'bg-emerald-400 animate-pulse-ring' : 'bg-[#52525b]')} />
                <p className="text-xs text-[#71717a]">{isPublished ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          </div>
          {/* Credits */}
          <div className="mt-2 flex items-center justify-between rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <Coins className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs text-violet-300">{credits} créditos</span>
            </div>
            <button onClick={refreshCredits} className="text-violet-400 hover:text-violet-300">
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-0.5">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            const badge = item.id === 'messages' ? unreadMsgs : item.id === 'overview' ? unreadNotifs : 0;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left',
                  active
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#111113]'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badge > 0 && (
                  <span className="h-5 w-5 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 pb-4 pt-2 border-t border-[#27272a] space-y-2">
          <a href={getProfileUrl(slug, profile.user_type === 'company')} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 w-full rounded-xl border border-[#27272a] bg-[#111113] px-3 py-2.5 text-xs font-medium text-[#a1a1aa] hover:border-violet-500/40 hover:text-white transition-all">
            <Eye className="h-3.5 w-3.5" /> View my profile
            <ExternalLink className="h-3 w-3 ml-auto" />
          </a>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save all
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile logo */}
              <div className="lg:hidden h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <Hash className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">{NAV.find(n => n.id === section)?.label}</h1>
                <p className="text-xs text-[#52525b]">jobinlink.com/{slug || '...'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Notifications bell */}
              <button className="relative h-9 w-9 rounded-xl border border-[#27272a] bg-[#111113] flex items-center justify-center text-[#71717a] hover:text-white hover:border-[#3f3f46] transition-all"
                onClick={() => setSection('overview')}>
                <Bell className="h-4 w-4" />
                {unreadNotifs > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500" />}
              </button>
              {/* Status badge */}
              <div className={cn('hidden sm:flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium',
                isPublished
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  : 'border-[#27272a] bg-[#111113] text-[#71717a]'
              )}>
                <div className={cn('h-1.5 w-1.5 rounded-full', isPublished ? 'bg-emerald-400' : 'bg-[#52525b]')} />
                {isPublished ? 'Published' : 'Draft'}
              </div>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-all">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span className="hidden sm:block">Save</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 pb-24 lg:pb-8 space-y-6 animate-fade-in">

          {/* ══ OVERVIEW ══ */}
          {section === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Visits today" value="147" sub="+23 vs ontem" icon={Activity} color="violet" trend={18} />
                <StatCard label="Followers" value="1.2k" sub="Últimos 30 dias" icon={Users} color="emerald" trend={5} />
                <StatCard label="Credits" value={credits} sub="≈ ${(credits/100).toFixed(2)}" icon={Coins} color="amber" />
                <StatCard label="Mini-site" value={isPublished ? 'Ativo' : 'Inativo'} sub={profile.minisite_plan || 'Sem plano'} icon={Globe} color="blue" />
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                {/* Chart */}
                <Card className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Visits — last 7 days</p>
                      <p className="text-xs text-[#71717a] mt-0.5">Real-time data</p>
                    </div>
                    <Badge>This week</Badge>
                  </div>
                  <MiniChart data={[45, 72, 38, 95, 67, 110, 147]} />
                </Card>

                {/* Notifications */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white">Notifications</p>
                    {unreadNotifs > 0 && <Badge>{unreadNotifs} new</Badge>}
                  </div>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className={cn(
                        'flex items-start gap-3 rounded-xl p-3 transition-all cursor-pointer',
                        n.read ? 'bg-[#18181b]' : 'bg-violet-500/5 border border-violet-500/10'
                      )} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                        <div className={cn('h-2 w-2 rounded-full mt-1.5 flex-shrink-0', n.read ? 'bg-[#3f3f46]' : 'bg-violet-400')} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#e4e4e7]">{n.text}</p>
                          <p className="text-[10px] text-[#52525b] mt-0.5">{n.time} ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Quick actions */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Edit profile', icon: User, action: () => setSection('profile'), color: 'violet' },
                  { label: 'Choose template', icon: Palette, action: () => setSection('appearance'), color: 'blue' },
                  { label: 'Activate paywall', icon: Lock, action: () => setSection('monetize'), color: 'amber' },
                  { label: 'Buy credits', icon: Coins, action: () => setSection('wallet'), color: 'emerald' },
                ].map(({ label, icon: Icon, action, color }) => {
                  const colors: Record<string, string> = {
                    violet: 'border-violet-500/20 hover:border-violet-500/50 hover:bg-violet-500/5',
                    blue:   'border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5',
                    amber:  'border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5',
                    emerald:'border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5',
                  };
                  const iconColors: Record<string, string> = { violet:'text-violet-400', blue:'text-blue-400', amber:'text-amber-400', emerald:'text-emerald-400' };
                  return (
                    <button key={label} onClick={action}
                      className={cn('flex items-center gap-3 rounded-xl border bg-[#111113] p-4 text-left transition-all', colors[color])}>
                      <Icon className={cn('h-5 w-5', iconColors[color])} />
                      <span className="text-sm font-medium text-[#e4e4e7]">{label}</span>
                      <ChevronRight className="h-4 w-4 text-[#52525b] ml-auto" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ PROFILE ══ */}
          {section === 'profile' && (
            <div className="space-y-5 max-w-4xl">
              <SectionHeader title="Profile Information" subtitle="Your public data on your mini-site and directory" />

              {/* Banner + Avatar */}
              <Card className="overflow-hidden p-0">
                <div className="h-32 bg-gradient-to-r from-violet-900/60 via-pink-900/40 to-indigo-900/60 relative">
                  {profile.banner_url && <img src={profile.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="flex items-center gap-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-2 text-xs text-white/80 hover:bg-black/60 transition-all">
                      <ImageIcon className="h-3.5 w-3.5" /> Change banner
                    </button>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="-mt-12 mb-4 flex items-end justify-between">
                    <div className="relative">
                      {profile.photo_url ? (
                        <img src={profile.photo_url} alt="" className="h-20 w-20 rounded-2xl object-cover ring-4 ring-[#09090b]" />
                      ) : (
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white ring-4 ring-[#09090b]">
                          {profile.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                      <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-violet-600 border-2 border-[#09090b] flex items-center justify-center hover:bg-violet-500 transition-all">
                        <Camera className="h-3 w-3 text-white" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <button onClick={() => navigator.clipboard.writeText(getProfileUrl(slug, profile.user_type === 'company'))}
                        className="flex items-center gap-1.5 rounded-xl border border-[#27272a] bg-[#18181b] px-3 py-2 text-xs text-[#a1a1aa] hover:text-white transition-all">
                        <Copy className="h-3.5 w-3.5" /> Copy link
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name">
                      <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Seu nome" />
                    </Field>
                    <Field label="Slug / URL" hint={`jobinlink.com/u/${slug || '...'}`}>
                      <Input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))} placeholder="meu-slug" />
                    </Field>
                    <Field label="Professional title">
                      <Input value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} placeholder="Ex: Designer UX Senior" />
                    </Field>
                    <Field label="Location">
                      <Input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} placeholder="São Paulo, Brasil" />
                    </Field>
                    <Field label="Skills" hint="Comma separated" className="sm:col-span-2">
                      <Input value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} placeholder="React, Node.js, Figma, Design..." />
                    </Field>
                  </div>
                </div>
              </Card>

              {/* Bio editor */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#a1a1aa]">Bio / About</label>
                  <span className={cn('text-xs rounded-full px-2 py-0.5 border', profile.bio.length > 450 ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 'border-[#27272a] text-[#52525b]')}>
                    {profile.bio.length}/500
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[['H1','[[h1]]','[[/h1]]'],['H2','[[h2]]','[[/h2]]'],['H3','[[h3]]','[[/h3]]'],['§','[[p]]','[[/p]]'],['**B**','**','**'],['_I_','_','_']].map(([lbl, o, c]) => (
                    <button key={lbl} onClick={() => insertBio(o, c)}
                      className="rounded-lg border border-[#27272a] bg-[#18181b] px-2.5 py-1 text-xs text-[#a1a1aa] hover:border-violet-500/50 hover:text-white transition-all font-mono">
                      {lbl}
                    </button>
                  ))}
                </div>
                <Textarea
                  ref={bioRef}
                  rows={5}
                  value={profile.bio}
                  onChange={e => { if (e.target.value.length <= 500) setProfile({...profile, bio: e.target.value}); }}
                  placeholder="[[h1]]Olá, sou...[[/h1]]&#10;[[p]]Apresentação profissional aqui...[[/p]]"
                />
              </Card>

              {/* Contacts */}
              <Card>
                <p className="text-sm font-semibold text-white mb-4">Contacts Contatos & Redes Sociais Social Media</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: 'E-mail', key: 'contact_email', icon: Mail, placeholder: 'email@exemplo.com' },
                    { label: 'Phone / WhatsApp', key: 'contact_phone', icon: Phone, placeholder: '+55 11 99999-9999' },
                    { label: 'LinkedIn', key: 'contact_linkedin', icon: Linkedin, placeholder: 'linkedin.com/in/...' },
                    { label: 'Instagram', key: 'contact_instagram', icon: Instagram, placeholder: 'instagram.com/...' },
                    { label: 'Twitter / X', key: 'contact_twitter', icon: Twitter, placeholder: 'x.com/...' },
                    { label: 'YouTube', key: 'contact_youtube', icon: Youtube, placeholder: 'youtube.com/@...' },
                  ].map(({ label, key, icon: Icon, placeholder }) => (
                    <Field key={key} label={label}>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
                        <Input
                          className="pl-9"
                          value={(profile as any)[key] || ''}
                          onChange={e => setProfile({...profile, [key]: e.target.value})}
                          placeholder={placeholder}
                        />
                      </div>
                    </Field>
                  ))}
                </div>
              </Card>

              {/* Publish */}
              <Card>
                <div className="space-y-4">
                  <Toggle
                    checked={profile.is_published}
                    onChange={v => setProfile({...profile, is_published: v})}
                    label="Publish to directory"
                    desc="Your profile will appear in searches and the public directory"
                  />
                </div>
              </Card>

              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-all">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Perfil
                </button>
              </div>
            </div>
          )}

          {/* ══ MODULES ══ */}
          {section === 'modules' && (
            <div className="space-y-5 max-w-3xl">
              <SectionHeader title="Modules do Mini-site" subtitle="Drag to reorder · click to enable/disable" />

              {/* Layout cols */}
              <Card>
                <p className="text-sm font-semibold text-white mb-4">Column layout</p>
                <div className="grid grid-cols-3 gap-3">
                  {([1,2,3] as const).map(cols => {
                    const icons = [<LayoutGrid className="h-5 w-5" />, <Columns2 className="h-5 w-5" />, <Columns3 className="h-5 w-5" />];
                    const labels = ['1 Column', '2 Columns', '3 Columns'];
                    const descs = ['Content focused', 'Balanced', 'Compact'];
                    const active = layoutCols === cols;
                    return (
                      <button key={cols} onClick={() => setLayout(cols)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all',
                          active ? 'border-violet-500 bg-violet-500/10 text-violet-300' : 'border-[#27272a] bg-[#18181b] text-[#71717a] hover:border-[#3f3f46] hover:text-[#a1a1aa]'
                        )}>
                        <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', active ? 'bg-violet-500/20' : 'bg-[#27272a]')}>
                          {icons[cols - 1]}
                        </div>
                        <p className="text-xs font-semibold">{labels[cols - 1]}</p>
                        <p className="text-[10px] text-[#52525b]">{descs[cols - 1]}</p>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Module list */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Modules disponíveis</p>
                    <p className="text-xs text-[#71717a] mt-0.5">{enabled.size} of {Object.keys(MODULES).length} active</p>
                  </div>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={moduleOrder} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {moduleOrder.map(id => (
                        <SortableModule key={id} id={id} enabled={enabled.has(id)} onToggle={() => toggleModule(id)} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <div className="mt-4 flex justify-end">
                  <button onClick={handleSaveModules} disabled={savingMods}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-all">
                    {savingMods ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save módulos
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* ══ MONETIZE ══ */}
          {section === 'monetize' && (
            <div className="space-y-5 max-w-3xl">
              <SectionHeader title="Monetization" subtitle="Paywall, exclusive content and auctions" />

              <Card>
                <div className="space-y-5">
                  <Toggle
                    checked={profile.paywall_enabled}
                    onChange={v => setProfile({...profile, paywall_enabled: v, paywall_mode: v ? 'full' : 'none'})}
                    label="Enable Paywall"
                    desc="Charge for access to your mini-site — monthly or daily. Platform fee: 20%"
                  />
                  {profile.paywall_enabled && (
                    <div className="border-t border-[#27272a] pt-5 grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs text-[#71717a] mb-2 block">Tipo of cobrança</label>
                        <div className="flex gap-2">
                          {(['monthly','daily'] as const).map(v => (
                            <button key={v} onClick={() => setProfile({...profile, paywall_interval: v})}
                              className={cn('flex-1 rounded-xl border py-2 text-xs font-medium transition-all',
                                profile.paywall_interval === v
                                  ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                                  : 'border-[#27272a] bg-[#18181b] text-[#71717a] hover:border-[#3f3f46]'
                              )}>
                              {v === 'monthly' ? 'Monthly' : 'Daily'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Field label="Price (USD)">
                        <Input
                          type="text" inputMode="decimal"
                          value={((profile.paywall_price_cents || 990) / 100).toFixed(2)}
                          onChange={e => { const n = parseFloat(e.target.value.replace(',','.')); setProfile({...profile, paywall_price_cents: Number.isFinite(n) ? Math.round(n*100) : 0}); }}
                        />
                      </Field>
                      <div className="flex items-end pb-1">
                        <p className="text-xs text-[#52525b]">{profile.paywall_interval === 'monthly' ? 'Recurring monthly subscription' : 'Pagamento por 24h of acesso'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Content types */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Newspaper, title: 'Journalism Jornalismo & Artigos Articles', desc: 'Venda matérias e reportagens via paywall ou leilão of exclusividade', color: 'blue' },
                  { icon: Camera, title: 'Premium Photography', desc: 'Portfolio with exclusive photos unlocked by subscription', color: 'violet' },
                  { icon: Video, title: 'Exclusive Video', desc: 'Content estilo OnlyFans com acesso por assinatura mensal', color: 'pink' },
                  { icon: Code, title: 'Freelancer / Dev', desc: 'Portfólio técnico com proposta of projetos e contato protegido', color: 'emerald' },
                  { icon: Stethoscope, title: 'Health Saúde & Consultas Consultations', desc: 'Calendar online com pagamento e acesso ao prontuário', color: 'red' },
                  { icon: Scale, title: 'Legal', desc: 'Legal consultations via paywall with locked contact', color: 'amber' },
                ].map(({ icon: Icon, title, desc, color }) => {
                  const colors: Record<string, string> = {
                    blue: 'border-blue-500/20 hover:border-blue-500/40',
                    violet: 'border-violet-500/20 hover:border-violet-500/40',
                    pink: 'border-pink-500/20 hover:border-pink-500/40',
                    emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
                    red: 'border-red-500/20 hover:border-red-500/40',
                    amber: 'border-amber-500/20 hover:border-amber-500/40',
                  };
                  const iconColors: Record<string, string> = {
                    blue:'text-blue-400 bg-blue-500/10', violet:'text-violet-400 bg-violet-500/10',
                    pink:'text-pink-400 bg-pink-500/10', emerald:'text-emerald-400 bg-emerald-500/10',
                    red:'text-red-400 bg-red-500/10', amber:'text-amber-400 bg-amber-500/10',
                  };
                  return (
                    <div key={title} className={cn('rounded-2xl border bg-[#111113] p-5 transition-all card-hover cursor-pointer', colors[color])}>
                      <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-3', iconColors[color])}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-[#71717a] mt-1.5 leading-relaxed">{desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* CV com IA + desbloqueio 50/50 */}
              <Card className="border-violet-500/20 bg-gradient-to-br from-violet-900/20 to-[#111113]">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white">AI Resume + 50/50 Unlock</p>
                      <Badge color="violet">Novo</Badge>
                    </div>
                    <p className="text-xs text-[#71717a] leading-relaxed">
                      The AI (DeepSeek) generates a complete professional resume. The candidate's contact is locked —
                      companies pay to unlock and the value is split 50% to you, 50% to the platform.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition-all">
                        <Sparkles className="h-3.5 w-3.5" /> Enable AI Resume
                      </button>
                      <span className="text-xs text-[#52525b]">Requires Pro or Elite plan</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ══ WALLET ══ */}
          {section === 'wallet' && (
            <div className="space-y-5 max-w-2xl">
              <SectionHeader title="Wallet & Credits" subtitle="Manage credits and receive via USDC on Polygon" />

              {/* Balance */}
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-900/40 to-pink-900/20 p-6">
                <p className="text-xs text-violet-300/70 uppercase tracking-widest mb-2">Current balance</p>
                <div className="flex items-end gap-2 mb-1">
                  <p className="text-5xl font-bold text-white">{credits}</p>
                  <p className="text-xl text-violet-300 mb-1">créditos</p>
                </div>
                <p className="text-sm text-violet-300/60">≈ ${(credits / 100).toFixed(2)} USD</p>
              </div>

              {/* Plans payment */}
              <Card>
                <p className="text-sm font-semibold text-white mb-4">Monthlyidade do Mini-site</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: 'starter', name: 'Starter', price: 499, period: '/mo', credits: 1590 },
                    { id: 'pro',     name: 'Pro',     price: 1499, period: '/mo', credits: 3990 },
                    { id: 'elite',   name: 'Elite',   price: 2999, period: '/mo', credits: 9900 },
                    { id: 'starter-year', name: 'Starter Anual', price: 14900, period: '/yr', credits: 14900 },
                  ].map(plan => (
                    <button key={plan.id}
                      className="flex flex-col gap-1 rounded-xl border border-[#27272a] bg-[#18181b] p-4 hover:border-violet-500/40 transition-all text-left">
                      <p className="text-xs text-[#71717a]">{plan.name}</p>
                      <p className="text-lg font-bold text-white">${(plan.price/100).toFixed(2)}<span className="text-xs text-[#52525b] font-normal">{plan.period}</span></p>
                      <p className="text-xs text-violet-400">{plan.credits} créditos</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* USDC topup */}
              <Card>
                <p className="text-sm font-semibold text-white mb-2">Add via USDC (Polygon)</p>
                <div className="rounded-xl bg-[#18181b] border border-[#27272a] p-4 text-xs text-[#71717a] space-y-1 mb-4">
                  <p className="text-[#a1a1aa] font-medium mb-1">How it works:</p>
                  <p>1. Send USDC to the platform wallet (Polygon)</p>
                  <p>2. Paste the transaction hash below</p>
                  <p>3. System detects and adds automatically</p>
                  <p className="text-violet-400 font-medium mt-2">1 USDC = 100 créditos</p>
                </div>
                <div className="flex gap-2">
                  <Input className="font-mono text-xs" placeholder="0x... hash da transação" />
                  <button className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-500 transition-all">
                    <Coins className="h-3.5 w-3.5" /> Creditar
                  </button>
                </div>
              </Card>

              {/* Wallet address */}
              <Card>
                <Field label="Your Polygon address (0x...)" hint="Register to receive credits automatically">
                  <Input
                    className="font-mono text-xs"
                    placeholder="0x..."
                    value={profile.wallet_address}
                    onChange={e => setProfile({...profile, wallet_address: e.target.value})}
                  />
                </Field>
                <div className="mt-3 flex justify-end">
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-[#27272a] px-4 py-2 text-xs text-[#a1a1aa] hover:bg-[#3f3f46] hover:text-white transition-all">
                    <Save className="h-3.5 w-3.5" /> Save endereço
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* ══ PLANS ══ */}
          {section === 'plans' && (
            <div className="space-y-5">
              <SectionHeader title="Plans" subtitle="From Starter to Elite — choose what fits you" />
              <div className="grid sm:grid-cols-3 gap-4 max-w-4xl">
                {PLANS.map((plan, i) => {
                  const colorMap: Record<string, { border: string; bg: string; badge: string; btn: string }> = {
                    emerald: { border: 'border-emerald-500/30', bg: 'from-emerald-900/20', badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', btn: 'bg-emerald-600 hover:bg-emerald-500' },
                    violet:  { border: 'border-violet-500/30',  bg: 'from-violet-900/20',  badge: 'text-violet-400 bg-violet-500/10 border-violet-500/20',   btn: 'bg-violet-600 hover:bg-violet-500' },
                    amber:   { border: 'border-amber-500/30',   bg: 'from-amber-900/20',   badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',     btn: 'bg-amber-600 hover:bg-amber-500' },
                  };
                  const c = colorMap[plan.color];
                  return (
                    <div key={plan.id} className={cn(
                      'relative rounded-2xl border bg-gradient-to-b to-[#111113] p-6',
                      c.border, c.bg,
                      i === 1 && 'ring-1 ring-violet-500/50'
                    )}>
                      {i === 1 && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold text-white">Most popular</span>
                        </div>
                      )}
                      <p className="text-sm font-bold text-white mb-2">{plan.name}</p>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-white">${(plan.price/100).toFixed(2)}</span>
                        <span className="text-xs text-[#71717a]">/mo</span>
                        <p className="text-xs text-[#52525b] mt-0.5">ou ${(plan.priceYear/100).toFixed(2)}/yr</p>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                            <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                      <button className={cn('w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all', c.btn)}>
                        Subscribe {plan.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ MESSAGES ══ */}
          {section === 'messages' && (
            <div className="space-y-4 max-w-2xl">
              <SectionHeader title="Messages" subtitle="Chat with visitors and companies" />
              <Card className="divide-y divide-[#27272a] p-0 overflow-hidden">
                {messages.map(msg => (
                  <div key={msg.id} className={cn('flex items-start gap-4 p-4 hover:bg-[#18181b] transition-all cursor-pointer', msg.unread && 'bg-violet-500/5')}>
                    <div className="h-10 w-10 rounded-full bg-[#27272a] flex items-center justify-center text-lg flex-shrink-0">{msg.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-white">{msg.from}</p>
                        <p className="text-xs text-[#52525b]">{msg.time}</p>
                      </div>
                      <p className="text-xs text-[#71717a] truncate">{msg.text}</p>
                    </div>
                    {msg.unread && <div className="h-2 w-2 rounded-full bg-violet-400 flex-shrink-0 mt-2" />}
                  </div>
                ))}
              </Card>
              <div className="text-center text-xs text-[#52525b] py-4">
                Full chat coming soon — requires Pro plan
              </div>
            </div>
          )}

          {/* ══ CALENDAR ══ */}
          {section === 'calendar' && (
            <div className="space-y-4 max-w-2xl">
              <SectionHeader title="Calendar & Consultas" subtitle="Manage your schedule and services" />
              <Card className="text-center py-12">
                <Calendar className="h-12 w-12 text-[#3f3f46] mx-auto mb-4" />
                <p className="text-sm font-semibold text-white mb-2">Calendar em breve</p>
                <p className="text-xs text-[#71717a] mb-4">Sistema of agendamento com integração of pagamento<br />available on Pro and Elite plans.</p>
                <button onClick={() => setSection('plans')}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-all">
                  View plans <ArrowRight className="h-4 w-4" />
                </button>
              </Card>
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {section === 'settings' && (
            <div className="space-y-5 max-w-2xl">
              <SectionHeader title="Settings" subtitle="Conta, preferências e segurança" />
              <Card>
                <p className="text-sm font-semibold text-white mb-4">Tipo of conta</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { value: 'seeker', label: 'Professional', desc: 'Profile /u/username', icon: User },
                    { value: 'company', label: 'Company', desc: 'Profile /c/company', icon: Building2 },
                  ].map(({ value, label, desc, icon: Icon }) => (
                    <button key={value} onClick={() => setProfile({...profile, user_type: value as any})}
                      className={cn('flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                        profile.user_type === value
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-[#27272a] bg-[#18181b] hover:border-[#3f3f46]'
                      )}>
                      <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', profile.user_type === value ? 'bg-violet-500/20' : 'bg-[#27272a]')}>
                        <Icon className={cn('h-5 w-5', profile.user_type === value ? 'text-violet-400' : 'text-[#71717a]')} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#e4e4e7]">{label}</p>
                        <p className="text-xs text-[#52525b]">{desc}</p>
                      </div>
                      {profile.user_type === value && <Check className="h-4 w-4 text-violet-400 ml-auto" />}
                    </button>
                  ))}
                </div>
              </Card>
              <Card>
                <p className="text-sm font-semibold text-white mb-4">Account Conta & Segurança Security</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-[#18181b] border border-[#27272a] px-4 py-3">
                    <div>
                      <p className="text-sm text-[#e4e4e7]">E-mail</p>
                      <p className="text-xs text-[#71717a]">{user?.email}</p>
                    </div>
                    <Badge color="emerald">Verified</Badge>
                  </div>
                  <button className="w-full flex items-center justify-between rounded-xl bg-[#18181b] border border-[#27272a] px-4 py-3 hover:border-[#3f3f46] transition-all">
                    <span className="text-sm text-[#e4e4e7]">Change password</span>
                    <ChevronRight className="h-4 w-4 text-[#52525b]" />
                  </button>
                  <button className="w-full flex items-center justify-between rounded-xl bg-red-500/5 border border-red-500/20 px-4 py-3 hover:bg-red-500/10 transition-all">
                    <span className="text-sm text-red-400">Delete account</span>
                    <ChevronRight className="h-4 w-4 text-red-400/50" />
                  </button>
                </div>
              </Card>
              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-all">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save configurações
                </button>
              </div>
            </div>
          )}

          {/* ══ APPEARANCE / CONTENT ══ */}
          {(section === 'appearance' || section === 'content') && (
            <div className="space-y-4 max-w-2xl">
              <SectionHeader
                title={section === 'appearance' ? 'Appearance' : 'Content'}
                subtitle={section === 'appearance' ? 'Templates, colors and fonts for your mini-site' : 'Páginas, posts e conteúdo do mini-site'}
              />
              <Card className="text-center py-12">
                <div className="h-12 w-12 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  {section === 'appearance' ? <Palette className="h-6 w-6 text-violet-400" /> : <FileText className="h-6 w-6 text-violet-400" />}
                </div>
                <p className="text-sm font-semibold text-white mb-2">
                  {section === 'appearance' ? 'Editor of aparência' : 'Editor of conteúdo'}
                </p>
                <p className="text-xs text-[#71717a] mb-4">
                  {section === 'appearance'
                    ? 'Templates, cores, fontes e personalização completa do mini-site.'
                    : 'Up to 10 pages with rich editor, text, photos and videos.'}
                  <br />Connect Supabase to enable.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-[#52525b]">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  Waiting for Supabase configuration (.env)
                </div>
              </Card>
            </div>
          )}

        </div>
      </main>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#27272a] bg-[#09090b]/95 backdrop-blur-xl">
        <div className="flex">
          {NAV.slice(0,6).map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button key={item.id} onClick={() => setSection(item.id)}
                className={cn('flex-1 flex flex-col items-center py-3 gap-1 text-[10px] font-medium transition-colors',
                  active ? 'text-violet-400' : 'text-[#52525b]'
                )}>
                <Icon className="h-5 w-5" />
                {item.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
