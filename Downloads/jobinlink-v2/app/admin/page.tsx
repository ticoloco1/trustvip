'use client';
import { useState } from 'react';
import {
  Settings, Users, DollarSign, Hash, Shield, Bell, BarChart3,
  Search, Filter, MoreVertical, CheckCircle2, XCircle, AlertCircle,
  Trash2, Lock, Unlock, Star, Crown, Edit2, Save, Plus, Minus,
  TrendingUp, Activity, Globe, Zap, Eye, Ban, RefreshCw,
  ChevronRight, ChevronDown, Percent, Coins, Building2, Newspaper,
  Camera, Video, FileText, BookOpen, Map, Package, ArrowUpRight,
  ArrowDownLeft, Loader2, X, Check, Award, BadgeCheck
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
type Section = 'overview' | 'users' | 'pricing' | 'slugs' | 'content' | 'payments' | 'settings' | 'badges';

// ─── Mock data ────────────────────────────────────────────────
const USERS_DATA = [
  { id:'1', name:'Sarah Chen', email:'sarah@example.com', slug:'sarah-chen', type:'seeker', plan:'pro', status:'active', verified:true, badge:'blue', credits:450, joined:'2025-01-12', revenue:247.50, platform:'jobinlink' },
  { id:'2', name:'TechCorp Inc', email:'admin@techcorp.com', slug:'techcorp', type:'company', plan:'elite', status:'active', verified:true, badge:'gold', credits:2100, joined:'2025-02-01', revenue:990.00, platform:'jobinlink' },
  { id:'3', name:'Marcus Dev', email:'marcus@dev.io', slug:'marcus-dev', type:'seeker', plan:'starter', status:'active', verified:false, badge:null, credits:80, joined:'2025-03-05', revenue:49.80, platform:'jobinlink' },
  { id:'4', name:'Ana Lima', email:'ana@lima.br', slug:'ana-lima', type:'seeker', plan:'pro', status:'suspended', verified:true, badge:'blue', credits:0, joined:'2024-12-20', revenue:119.70, platform:'hashpo' },
  { id:'5', name:'LegalPro LLC', email:'contact@legalpro.com', slug:'legalpro', type:'company', plan:'elite', status:'active', verified:true, badge:'gold', credits:5000, joined:'2025-01-30', revenue:2970.00, platform:'trustbank' },
  { id:'6', name:'Yuki Tanaka', email:'yuki@tanaka.jp', slug:'yuki-t', type:'seeker', plan:'free', status:'active', verified:false, badge:null, credits:0, joined:'2025-03-18', revenue:0, platform:'jobinlink' },
];

const TRANSACTIONS = [
  { id:'1', type:'in', from:'CV Unlock', amount:9.99, user:'TechCorp Inc', platform:'jobinlink', tx:'0x3f9a...', time:'2 min ago', status:'confirmed' },
  { id:'2', type:'in', from:'Paywall Sub', amount:14.99, user:'Marcus Dev', platform:'hashpo', tx:'0x8c2b...', time:'15 min', status:'confirmed' },
  { id:'3', type:'fee', from:'Platform fee 20%', amount:3.00, user:'Sarah Chen', platform:'jobinlink', tx:'0x1d4e...', time:'1h', status:'confirmed' },
  { id:'4', type:'in', from:'Slug Auction', amount:300.00, user:'LegalPro LLC', platform:'trustbank', tx:'0x7a3f...', time:'3h', status:'confirmed' },
  { id:'5', type:'out', from:'Creator payout', amount:149.50, user:'Ana Lima', platform:'hashpo', tx:'0x2b8c...', time:'5h', status:'confirmed' },
];

const SLUGS_DATA = [
  { slug:'lawyer', owner:'LegalPro LLC', price:5000, status:'active', platform:'trustbank', category:'legal', bids:0 },
  { slug:'dev.pro', owner:null, price:500, status:'for_sale', platform:'all', category:'tech', bids:4 },
  { slug:'doctor', owner:null, price:2000, status:'auction', platform:'all', category:'health', bids:8 },
  { slug:'sarah-chen', owner:'Sarah Chen', price:0, status:'active', platform:'jobinlink', category:'personal', bids:0 },
  { slug:'crypto.io', owner:null, price:1200, status:'auction', platform:'trustbank', category:'finance', bids:11 },
];

const PRICING_CONFIG = {
  cv_unlock_usd: 9.99,
  cv_creator_pct: 50,
  platform_fee_pct: 20,
  paywall_min_monthly_usd: 4.99,
  paywall_max_monthly_usd: 99.99,
  paywall_daily_usd: 1.99,
  slug_listing_fee_usd: 0,
  slug_auction_fee_pct: 5,
  minisite_starter_usd: 4.99,
  minisite_pro_usd: 14.99,
  minisite_elite_usd: 29.99,
  minisite_starter_yr_usd: 49.00,
  minisite_pro_yr_usd: 149.00,
  minisite_elite_yr_usd: 299.00,
  company_plan_usd: 49.00,
  company_plan_yr_usd: 490.00,
  journalism_auction_fee_pct: 15,
  classified_listing_usd: 2.99,
  blue_badge_usd: 0,
  gold_badge_usd: 0,
  usdc_to_credits: 100,
};

// ─── Components ───────────────────────────────────────────────
function NavItem({ id, label, icon: Icon, active, badge, onClick }: any) {
  return (
    <button onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left ${
        active ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#111113]'
      }`}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="h-5 min-w-5 px-1 rounded-full bg-red-500/80 flex items-center justify-center text-[10px] font-bold text-white">{badge}</span>
      )}
    </button>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, trend }: any) {
  return (
    <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${trend >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-[#71717a] mt-0.5">{label}</p>
      {sub && <p className="text-xs text-[#52525b] mt-0.5">{sub}</p>}
    </div>
  );
}

function PriceField({ label, keyName, value, onSave, suffix = 'USD', isPercent = false }: any) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(value));
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#27272a] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#e4e4e7]">{label}</p>
        <p className="text-xs text-[#52525b] font-mono">{keyName}</p>
      </div>
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <div className="relative">
              {!isPercent && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#52525b]">$</span>}
              <input
                value={val} onChange={e => setVal(e.target.value)}
                className={`w-24 rounded-lg border border-violet-500/40 bg-[#18181b] ${isPercent ? 'px-3' : 'pl-5 pr-2'} py-1.5 text-sm text-white focus:outline-none`}
                autoFocus
              />
              {isPercent && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#52525b]">%</span>}
            </div>
            <button onClick={() => { onSave(keyName, parseFloat(val)); setEditing(false); }}
              className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30">
              <Check className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => { setVal(String(value)); setEditing(false); }}
              className="h-7 w-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20">
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold text-white min-w-[60px] text-right">
              {isPercent ? `${value}%` : `$${value}`}
            </span>
            <button onClick={() => setEditing(true)}
              className="h-7 w-7 rounded-lg border border-[#27272a] bg-[#18181b] flex items-center justify-center text-[#71717a] hover:text-violet-400 hover:border-violet-500/40 transition-all">
              <Edit2 className="h-3 w-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function UserRow({ user, onAction }: any) {
  const [menu, setMenu] = useState(false);
  const statusColors: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    suspended: 'text-red-400 bg-red-500/10 border-red-500/20',
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };
  return (
    <tr className="border-b border-[#27272a] hover:bg-[#111113]/50 transition-all">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-white">{user.name}</p>
              {user.badge === 'blue' && <BadgeCheck className="h-4 w-4 text-blue-400" />}
              {user.badge === 'gold' && <Award className="h-4 w-4 text-amber-400" />}
            </div>
            <p className="text-xs text-[#52525b]">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-[#71717a] font-mono">/{user.slug}</td>
      <td className="px-4 py-3">
        <span className="text-[10px] rounded-full border border-[#27272a] px-2 py-0.5 text-[#71717a]">{user.type}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-[10px] rounded-full border px-2 py-0.5 font-medium ${statusColors[user.status] || statusColors.pending}`}>
          {user.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-[10px] rounded-full border border-[#27272a] px-2 py-0.5 ${
          user.plan === 'elite' ? 'text-amber-400 border-amber-500/20' : user.plan === 'pro' ? 'text-violet-400 border-violet-500/20' : 'text-[#71717a]'
        }`}>{user.plan}</span>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-white">${user.revenue.toFixed(2)}</td>
      <td className="px-4 py-3 text-xs text-[#52525b]">{user.platform}</td>
      <td className="px-4 py-3">
        <div className="relative">
          <button onClick={() => setMenu(!menu)}
            className="h-7 w-7 rounded-lg border border-[#27272a] flex items-center justify-center text-[#71717a] hover:text-white transition-all">
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
          {menu && (
            <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-[#27272a] bg-[#111113] shadow-xl overflow-hidden">
              {[
                { label:'View Profile', icon:Eye, action:'view', color:'text-[#a1a1aa]' },
                { label:'Grant Blue Badge', icon:BadgeCheck, action:'blue_badge', color:'text-blue-400' },
                { label:'Grant Gold Badge', icon:Award, action:'gold_badge', color:'text-amber-400' },
                { label:'Edit Credits', icon:Coins, action:'credits', color:'text-violet-400' },
                { label: user.status==='active'?'Suspend':'Reactivate', icon:user.status==='active'?Ban:CheckCircle2, action:'toggle_status', color:user.status==='active'?'text-red-400':'text-emerald-400' },
                { label:'Delete User', icon:Trash2, action:'delete', color:'text-red-500' },
              ].map(item => (
                <button key={item.action} onClick={() => { onAction(user, item.action); setMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[#18181b] transition-all ${item.color}`}>
                  <item.icon className="h-3.5 w-3.5" /> {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────
export default function AdminPanel() {
  const [section, setSection] = useState<Section>('overview');
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [pricing, setPricing] = useState(PRICING_CONFIG);
  const [users, setUsers] = useState(USERS_DATA);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string|null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePriceSave = (key: string, value: number) => {
    setPricing(prev => ({ ...prev, [key]: value }));
    showToast(`✓ ${key} updated to ${value}`);
  };

  const handleUserAction = (user: any, action: string) => {
    if (action === 'toggle_status') {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
      showToast(`${user.name} ${user.status === 'active' ? 'suspended' : 'reactivated'}`);
    } else if (action === 'blue_badge') {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, badge: 'blue', verified: true } : u));
      showToast(`Blue badge granted to ${user.name}`);
    } else if (action === 'gold_badge') {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, badge: 'gold', verified: true } : u));
      showToast(`Gold badge granted to ${user.name}`);
    } else if (action === 'delete') {
      if (confirm(`Delete ${user.name}?`)) {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        showToast(`${user.name} deleted`);
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.slug.toLowerCase().includes(search.toLowerCase());
    const matchFilter = userFilter === 'all' || u.status === userFilter || u.type === userFilter || u.plan === userFilter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = users.reduce((s, u) => s + u.revenue, 0);
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;

  const NAV_ITEMS = [
    { id: 'overview',  label: 'Overview',     icon: BarChart3 },
    { id: 'users',     label: 'Users',         icon: Users,       badge: suspendedUsers },
    { id: 'pricing',   label: 'Pricing & Fees',icon: DollarSign },
    { id: 'slugs',     label: 'Slug Manager',  icon: Hash },
    { id: 'content',   label: 'Content',       icon: FileText },
    { id: 'payments',  label: 'Payments',      icon: Activity },
    { id: 'badges',    label: 'Badges & Trust',icon: Shield },
    { id: 'settings',  label: 'Settings',      icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl border border-violet-500/30 bg-[#111113] px-4 py-3 text-sm text-white shadow-xl animate-slide-up">
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-[#27272a] bg-[#09090b] fixed h-full z-10">
        <div className="px-4 py-4 border-b border-[#27272a]">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Admin Panel</span>
          </div>
          <p className="text-xs text-[#52525b]">Super administrator access</p>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.id} {...item} active={section === item.id} onClick={setSection} />
          ))}
        </nav>
        <div className="px-4 pb-4 border-t border-[#27272a] pt-3">
          <div className="rounded-xl bg-red-500/5 border border-red-500/10 px-3 py-2 text-xs text-red-400">
            ⚠ Admin access only
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-60">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <h1 className="text-sm font-semibold text-white">{NAV_ITEMS.find(n => n.id === section)?.label}</h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#52525b]" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  className="w-48 rounded-xl border border-[#27272a] bg-[#111113] pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-[#52525b] focus:border-violet-500/50 focus:outline-none transition-all"
                  placeholder="Search users, slugs..." />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-6">

          {/* ══ OVERVIEW ══ */}
          {section === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} sub="All platforms" icon={DollarSign} color="text-emerald-400 bg-emerald-500/10" trend={18} />
                <StatCard label="Active Users" value={activeUsers} sub={`${suspendedUsers} suspended`} icon={Users} color="text-violet-400 bg-violet-500/10" trend={5} />
                <StatCard label="Platform Revenue" value={`$${(totalRevenue * 0.2).toFixed(0)}`} sub="20% avg fee" icon={Percent} color="text-amber-400 bg-amber-500/10" trend={22} />
                <StatCard label="Slugs Active" value={SLUGS_DATA.filter(s=>s.status==='active').length} sub={`${SLUGS_DATA.filter(s=>s.status==='auction').length} in auction`} icon={Hash} color="text-blue-400 bg-blue-500/10" />
              </div>

              {/* Platform breakdown */}
              <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-5">
                <p className="text-sm font-semibold text-white mb-4">Revenue by Platform</p>
                <div className="space-y-3">
                  {[
                    { name:'JobinLink.com', rev:2847, users:4, color:'bg-violet-500' },
                    { name:'TrustBank.xyz', rev:2970, users:1, color:'bg-amber-500' },
                    { name:'Hashpo.com', rev:169, users:1, color:'bg-pink-500' },
                    { name:'MyBik.com', rev:0, users:0, color:'bg-cyan-500' },
                  ].map(p => (
                    <div key={p.name} className="flex items-center gap-3">
                      <div className="w-28 text-xs text-[#71717a]">{p.name}</div>
                      <div className="flex-1 h-2 rounded-full bg-[#27272a]">
                        <div className={`h-2 rounded-full ${p.color}`} style={{ width: `${(p.rev / 3000) * 100}%` }} />
                      </div>
                      <div className="w-16 text-right text-xs font-semibold text-white">${p.rev.toFixed(0)}</div>
                      <div className="w-16 text-right text-xs text-[#52525b]">{p.users} users</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent transactions quick view */}
              <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-0 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a]">
                  <p className="text-sm font-semibold text-white">Recent Transactions</p>
                  <button onClick={() => setSection('payments')} className="text-xs text-violet-400">View all</button>
                </div>
                <div className="divide-y divide-[#27272a]">
                  {TRANSACTIONS.slice(0,4).map(tx => (
                    <div key={tx.id} className="flex items-center gap-4 px-5 py-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        tx.type==='in' ? 'bg-emerald-500/10 text-emerald-400' : tx.type==='fee' ? 'bg-violet-500/10 text-violet-400' : 'bg-red-500/10 text-red-400'
                      }`}>{tx.type==='in'?'↓':tx.type==='fee'?'%':'↑'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{tx.from} — {tx.user}</p>
                        <p className="text-[10px] text-[#52525b]">{tx.time} · {tx.platform}</p>
                      </div>
                      <p className={`text-sm font-semibold flex-shrink-0 ${tx.type==='in'?'text-emerald-400':tx.type==='fee'?'text-violet-400':'text-red-400'}`}>
                        {tx.type==='out'?'-':'+'} ${tx.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ USERS ══ */}
          {section === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {['all','active','suspended','seeker','company','pro','elite'].map(f => (
                  <button key={f} onClick={() => setUserFilter(f)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                      userFilter === f ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-[#27272a] text-[#71717a] hover:text-white'
                    }`}>{f}</button>
                ))}
                <span className="text-xs text-[#52525b] ml-auto">{filteredUsers.length} users</span>
              </div>

              <div className="rounded-2xl border border-[#27272a] bg-[#111113] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#27272a] bg-[#09090b]/50">
                        {['User','Slug','Type','Status','Plan','Revenue','Platform','Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-[#52525b] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => <UserRow key={u.id} user={u} onAction={handleUserAction} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ PRICING ══ */}
          {section === 'pricing' && (
            <div className="space-y-5 max-w-2xl">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <p className="text-xs text-[#a1a1aa]">Changes take effect immediately and apply to all 4 platforms sharing this database.</p>
              </div>

              {[
                {
                  title: 'CV Directory', icon: FileText, color: 'text-violet-400',
                  fields: [
                    { label:'CV Contact Unlock Price', key:'cv_unlock_usd', value:pricing.cv_unlock_usd },
                    { label:'Creator Share', key:'cv_creator_pct', value:pricing.cv_creator_pct, isPercent:true },
                  ]
                },
                {
                  title: 'Platform Fees', icon: Percent, color: 'text-emerald-400',
                  fields: [
                    { label:'General Platform Fee', key:'platform_fee_pct', value:pricing.platform_fee_pct, isPercent:true },
                    { label:'Journalism Auction Fee', key:'journalism_auction_fee_pct', value:pricing.journalism_auction_fee_pct, isPercent:true },
                    { label:'Slug Auction Fee', key:'slug_auction_fee_pct', value:pricing.slug_auction_fee_pct, isPercent:true },
                  ]
                },
                {
                  title: 'Paywall Prices', icon: Lock, color: 'text-pink-400',
                  fields: [
                    { label:'Min Monthly Paywall', key:'paywall_min_monthly_usd', value:pricing.paywall_min_monthly_usd },
                    { label:'Max Monthly Paywall', key:'paywall_max_monthly_usd', value:pricing.paywall_max_monthly_usd },
                    { label:'Daily Access Price', key:'paywall_daily_usd', value:pricing.paywall_daily_usd },
                  ]
                },
                {
                  title: 'Mini-site Plans', icon: Globe, color: 'text-blue-400',
                  fields: [
                    { label:'Starter (monthly)', key:'minisite_starter_usd', value:pricing.minisite_starter_usd },
                    { label:'Pro (monthly)', key:'minisite_pro_usd', value:pricing.minisite_pro_usd },
                    { label:'Elite (monthly)', key:'minisite_elite_usd', value:pricing.minisite_elite_usd },
                    { label:'Starter (yearly)', key:'minisite_starter_yr_usd', value:pricing.minisite_starter_yr_usd },
                    { label:'Pro (yearly)', key:'minisite_pro_yr_usd', value:pricing.minisite_pro_yr_usd },
                    { label:'Elite (yearly)', key:'minisite_elite_yr_usd', value:pricing.minisite_elite_yr_usd },
                    { label:'Company Plan (monthly)', key:'company_plan_usd', value:pricing.company_plan_usd },
                    { label:'Company Plan (yearly)', key:'company_plan_yr_usd', value:pricing.company_plan_yr_usd },
                  ]
                },
                {
                  title: 'Other Fees', icon: Coins, color: 'text-amber-400',
                  fields: [
                    { label:'Classified Listing Fee', key:'classified_listing_usd', value:pricing.classified_listing_usd },
                    { label:'Slug Listing Fee', key:'slug_listing_fee_usd', value:pricing.slug_listing_fee_usd },
                    { label:'USDC → Credits Rate', key:'usdc_to_credits', value:pricing.usdc_to_credits },
                  ]
                },
              ].map(group => {
                const GIcon = group.icon;
                return (
                  <div key={group.title} className="rounded-2xl border border-[#27272a] bg-[#111113] overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-[#27272a] bg-[#09090b]/40">
                      <div className={`h-8 w-8 rounded-xl bg-[#18181b] flex items-center justify-center ${group.color}`}>
                        <GIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-white">{group.title}</p>
                    </div>
                    <div className="px-5">
                      {group.fields.map(f => (
                        <PriceField key={f.key} {...f} onSave={handlePriceSave} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══ SLUGS ══ */}
          {section === 'slugs' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#27272a] bg-[#111113] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a]">
                  <p className="text-sm font-semibold text-white">Slug Manager</p>
                  <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition-all">
                    <Plus className="h-3.5 w-3.5" /> Add Slug
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#27272a] bg-[#09090b]/50">
                        {['Slug','Owner','Price','Status','Platform','Category','Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-[#52525b] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SLUGS_DATA.map((s, i) => (
                        <tr key={i} className="border-b border-[#27272a] hover:bg-[#111113]/50">
                          <td className="px-4 py-3 font-mono font-semibold text-white">#{s.slug}</td>
                          <td className="px-4 py-3 text-xs text-[#71717a]">{s.owner || <span className="text-[#3f3f46]">— available —</span>}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-white">{s.price > 0 ? `$${s.price}` : 'Free'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] rounded-full border px-2 py-0.5 font-medium ${
                              s.status==='active' ? 'border-emerald-500/20 text-emerald-400' :
                              s.status==='auction' ? 'border-amber-500/20 text-amber-400' :
                              'border-violet-500/20 text-violet-400'
                            }`}>{s.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#71717a]">{s.platform}</td>
                          <td className="px-4 py-3 text-xs text-[#71717a]">{s.category}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button className="h-7 px-2 rounded-lg border border-[#27272a] text-[10px] text-[#71717a] hover:text-violet-400 hover:border-violet-500/40 transition-all">Edit</button>
                              <button className="h-7 px-2 rounded-lg border border-[#27272a] text-[10px] text-[#71717a] hover:text-red-400 hover:border-red-500/40 transition-all">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ BADGES & TRUST ══ */}
          {section === 'badges' && (
            <div className="space-y-5 max-w-2xl">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Blue Badge', icon: BadgeCheck, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                    desc: 'Verified identity. Awarded to individuals who pass ID verification. Appears on all platforms.',
                    criteria: ['Government ID verified','Email verified','Phone verified','Profile complete'],
                    count: users.filter(u=>u.badge==='blue').length,
                  },
                  {
                    name: 'Gold Badge', icon: Award, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    desc: 'Premium business verification. For companies with legal registration and compliance check.',
                    criteria: ['Business registration','Tax ID verified','Website verified','Payment history clean'],
                    count: users.filter(u=>u.badge==='gold').length,
                  },
                ].map(badge => (
                  <div key={badge.name} className="rounded-2xl border border-[#27272a] bg-[#111113] p-5">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border mb-4 ${badge.color}`}>
                      <badge.icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-white">{badge.name}</p>
                      <span className="text-xs text-[#52525b]">{badge.count} issued</span>
                    </div>
                    <p className="text-xs text-[#71717a] mb-4">{badge.desc}</p>
                    <div className="space-y-1.5 mb-4">
                      {badge.criteria.map(c => (
                        <div key={c} className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                          <Check className="h-3 w-3 text-emerald-400" /> {c}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setSection('users')}
                      className="w-full rounded-xl border border-[#27272a] py-2 text-xs text-[#71717a] hover:text-white hover:border-violet-500/40 transition-all">
                      Manage in Users →
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-5">
                <p className="text-sm font-semibold text-white mb-4">SEO & Trust Score</p>
                <p className="text-xs text-[#71717a] mb-4">
                  Gold Badge profiles get boosted in directory listings and get rich snippet JSON-LD schema injected automatically — helping <strong className="text-white">trustbank.xyz/lawyer</strong> and similar slugs rank #1 in Google.
                </p>
                <div className="space-y-2">
                  {[
                    { feature:'Structured data (JSON-LD)', status:'active' },
                    { feature:'Dynamic sitemap (/sitemap.xml)', status:'active' },
                    { feature:'Open Graph meta tags per mini-site', status:'active' },
                    { feature:'Dynamic robots.txt', status:'active' },
                    { feature:'Canonical URLs per platform', status:'active' },
                    { feature:'Google Business Profile auto-link', status:'planned' },
                  ].map(f => (
                    <div key={f.feature} className="flex items-center justify-between">
                      <span className="text-xs text-[#a1a1aa]">{f.feature}</span>
                      <span className={`text-[10px] rounded-full px-2 py-0.5 border ${f.status==='active'?'border-emerald-500/20 text-emerald-400':'border-[#27272a] text-[#52525b]'}`}>{f.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ PAYMENTS ══ */}
          {section === 'payments' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <StatCard label="Total Volume" value="$6,086" icon={DollarSign} color="text-emerald-400 bg-emerald-500/10" trend={18} />
                <StatCard label="Platform Revenue" value="$1,217" sub="20% avg" icon={Percent} color="text-violet-400 bg-violet-500/10" />
                <StatCard label="Creator Payouts" value="$4,869" sub="Direct to wallets" icon={Zap} color="text-amber-400 bg-amber-500/10" />
              </div>
              <div className="rounded-2xl border border-[#27272a] bg-[#111113] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#27272a]">
                  <p className="text-sm font-semibold text-white">All Transactions</p>
                </div>
                <div className="divide-y divide-[#27272a]">
                  {TRANSACTIONS.map(tx => (
                    <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${tx.type==='in'?'bg-emerald-500/10 text-emerald-400':tx.type==='fee'?'bg-violet-500/10 text-violet-400':'bg-red-500/10 text-red-400'}`}>
                        {tx.type==='in'?'↓':tx.type==='fee'?'%':'↑'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{tx.from}</p>
                        <div className="flex items-center gap-2 text-xs text-[#52525b] mt-0.5">
                          <span>{tx.user}</span><span>·</span><span>{tx.platform}</span><span>·</span>
                          <span className="font-mono">{tx.tx}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-[#52525b]">{tx.time}</span>
                        <p className={`text-sm font-bold ${tx.type==='in'?'text-emerald-400':tx.type==='fee'?'text-violet-400':'text-red-400'}`}>
                          {tx.type==='out'?'-':'+'}${tx.amount.toFixed(2)}
                        </p>
                        <span className="text-[10px] rounded-full border border-emerald-500/20 text-emerald-400 px-2 py-0.5">{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {section === 'settings' && (
            <div className="space-y-5 max-w-xl">
              {[
                { title:'Platforms', items:['JobinLink.com — active','TrustBank.xyz — active','Hashpo.com — active','MyBik.com — coming soon'] },
                { title:'Database', items:['Supabase — 1 shared DB','Row Level Security — enabled','Real-time enabled — yes'] },
                { title:'Blockchain', items:['Network: Polygon','USDC Contract: 0x2791...','Platform wallet: 0x...','Smart wallet provider: pending'] },
                { title:'SEO', items:['Dynamic sitemaps — active','JSON-LD schemas — active','robots.txt — active'] },
              ].map(group => (
                <div key={group.title} className="rounded-2xl border border-[#27272a] bg-[#111113] p-5">
                  <p className="text-sm font-semibold text-white mb-4">{group.title}</p>
                  <div className="space-y-2">
                    {group.items.map(item => {
                      const active = item.includes('active') || item.includes('enabled') || item.includes('yes');
                      const soon = item.includes('coming soon') || item.includes('pending');
                      return (
                        <div key={item} className="flex items-center justify-between">
                          <span className="text-xs text-[#a1a1aa]">{item.split('—')[0]}</span>
                          <span className={`text-[10px] rounded-full px-2 py-0.5 border ${
                            active ? 'border-emerald-500/20 text-emerald-400' :
                            soon ? 'border-amber-500/20 text-amber-400' :
                            'border-[#27272a] text-[#52525b]'
                          }`}>{item.split('—')[1]?.trim() || 'set'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ CONTENT ══ */}
          {section === 'content' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label:'Articles', count:9100, icon:BookOpen, color:'text-emerald-400' },
                  { label:'Photos', count:5600, icon:Camera, color:'text-pink-400' },
                  { label:'Videos', count:3200, icon:Video, color:'text-red-400' },
                  { label:'Classifieds', count:22000, icon:Map, color:'text-orange-400' },
                ].map(c => (
                  <div key={c.label} className="rounded-2xl border border-[#27272a] bg-[#111113] p-5">
                    <c.icon className={`h-6 w-6 mb-3 ${c.color}`} />
                    <p className="text-2xl font-bold text-white">{c.count.toLocaleString()}</p>
                    <p className="text-xs text-[#71717a]">{c.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-8 text-center">
                <p className="text-sm font-semibold text-white mb-2">Content moderation</p>
                <p className="text-xs text-[#71717a]">Connect Supabase to moderate real content items — approve, reject, feature or remove.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
