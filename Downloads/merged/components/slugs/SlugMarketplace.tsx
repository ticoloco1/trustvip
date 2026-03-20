'use client';
import { useState, useEffect } from 'react';
import { Search, Crown, ShoppingCart, Tag, Gavel, FileKey, Send, Calendar, Shield, AlertTriangle, Timer, Check, X, Loader2, ExternalLink, Plus, Globe } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLang } from '@/hooks/useLang';
import { normalizeSlug, isFullName } from '@/lib/slug';
import { useCountdown } from '@/hooks/useCountdown';
import Navbar, { type CartItem } from '@/components/Navbar';

const A = '#6d28d9';

const DEFAULT_PRICES: Record<number,number> = { 1:2000, 2:1500, 3:1000, 4:500, 5:250, 6:100 };
const getDefaultPrice = (slug: string) => DEFAULT_PRICES[Math.min(slug.length, 6)] ?? 50;

const HOT_SLUGS = [
  { s:'lawyer', p:30000, hot:true },  { s:'doctor',  p:25000, hot:true },
  { s:'ai',     p:4400,  hot:true },  { s:'x',       p:5900,  hot:true },
  { s:'ceo',    p:18000, hot:false }, { s:'dev',     p:2900,  hot:false },
  { s:'crypto', p:1800,  hot:false }, { s:'coach',   p:500,   hot:false },
  { s:'surgeon',p:28000, hot:true },  { s:'founder', p:800,   hot:false },
  { s:'studio', p:1200,  hot:false }, { s:'brand',   p:900,   hot:false },
];

function SlugTier({ slug }: { slug: string }) {
  const len = slug.length;
  if (len<=1) return <span style={{fontSize:11,padding:'2px 7px',borderRadius:20,background:'#fef3c7',color:'#b45309',fontWeight:700}}>1L 👑</span>;
  if (len<=2) return <span style={{fontSize:11,padding:'2px 7px',borderRadius:20,background:'#ede9fe',color:A,fontWeight:700}}>2L 💎</span>;
  if (len<=3) return <span style={{fontSize:11,padding:'2px 7px',borderRadius:20,background:'#e0f2fe',color:'#0369a1',fontWeight:700}}>3L ⭐</span>;
  if (len<=4) return <span style={{fontSize:11,padding:'2px 7px',borderRadius:20,background:'#d1fae5',color:'#047857',fontWeight:700}}>4L</span>;
  return null;
}

function CD({ expiresAt }: { expiresAt: string }) {
  const { d,h,m,s,expired } = useCountdown(expiresAt);
  if (expired) return <span style={{color:'#dc2626',fontSize:12,fontWeight:700}}>Expired</span>;
  return <span style={{fontFamily:'monospace',fontSize:12,color:'#374151',fontWeight:600}}>{d}d {String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</span>;
}

export default function SlugMarketplace() {
  const { user } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState('search');
  const [search, setSearch] = useState('');
  const [registerSlug, setRegisterSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);
  const showToast = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3500); };

  const [premiumSlugs, setPremiumSlugs] = useState<any[]>([]);
  const [userListings, setUserListings] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<any[]>([]);
  const [mySites, setMySites] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);

  // Real-time slug availability check
  const [premiumCheck, setPremiumCheck] = useState<any>(null);
  const [listingCheck, setListingCheck] = useState<any>(null);
  const [regCheck, setRegCheck] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  // Sell
  const [sellSiteId, setSellSiteId] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  // Cart — stores REAL prices
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    supabase.from('premium_slugs').select('*').eq('active',true).eq('sold',false).order('price',{ascending:false}).then(({data})=>setPremiumSlugs(data||[]));
    supabase.from('slug_listings').select('*, mini_sites(slug,site_name,avatar_url)').eq('status','active').order('created_at',{ascending:false}).then(({data})=>setUserListings(data||[]));
    supabase.from('slug_auctions').select('*').eq('status','active').order('ends_at',{ascending:true}).then(({data})=>setAuctions(data||[]));
    if (user) {
      supabase.from('mini_sites').select('id,slug,site_name').eq('user_id',user.id).then(({data})=>setMySites(data||[]));
      supabase.from('slug_registrations').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).then(({data})=>setMyRegistrations(data||[]));
      supabase.from('slug_listings').select('*, mini_sites(slug,site_name)').eq('seller_id',user.id).then(({data})=>setMyListings(data||[]));
    }
  }, [user]);

  // Debounced live availability check
  useEffect(() => {
    const clean = normalizeSlug(registerSlug);
    if (!clean) { setPremiumCheck(null); setListingCheck(null); setRegCheck(null); return; }
    setChecking(true);
    const timer = setTimeout(async () => {
      const [prem, listing, reg] = await Promise.all([
        supabase.from('premium_slugs').select('id,slug,price,sold').eq('slug',clean).eq('active',true).maybeSingle(),
        supabase.from('slug_listings').select('id,slug,price,seller_id,mini_sites(slug,site_name,avatar_url)').eq('slug',clean).eq('status','active').maybeSingle(),
        supabase.from('slug_registrations').select('id,slug').eq('slug',clean).eq('status','active').maybeSingle(),
      ]);
      setPremiumCheck(prem.data);
      setListingCheck(listing.data);
      setRegCheck(reg.data);
      setChecking(false);
    }, 380);
    return () => clearTimeout(timer);
  }, [registerSlug]);

  const clean = normalizeSlug(registerSlug);
  const isPremium = premiumCheck && !premiumCheck.sold;
  const isUserListed = !!listingCheck;
  const alreadyTaken = premiumCheck?.sold || !!regCheck;
  const hasMiniSite = mySites.length > 0;

  // ─── THE KEY FIX: compute real price based on slug type ───────────────────
  const getRealPrice = (): number => {
    if (isPremium) return Number(premiumCheck.price);           // real premium price
    if (isUserListed) return Number(listingCheck.price);        // real user listing price
    return getDefaultPrice(clean);                              // default by length (1L=$2000, etc.)
  };

  const getStatusText = () => {
    if (!clean) return '';
    if (checking) return t.checking;
    if (alreadyTaken) return t.alreadyTaken;
    if (isPremium) return `${t.premium_label} — $${Number(premiumCheck.price).toLocaleString()} USDC`;
    if (isUserListed) return `${t.forSale} — $${Number(listingCheck.price).toLocaleString()} USDC`;
    const price = getDefaultPrice(clean);
    return `${t.available} — $${price.toLocaleString()}${clean.length > 4 ? '/yr' : ' USDC'}`;
  };

  const getStatusColor = () => {
    if (!clean || checking) return '#6b7280';
    if (alreadyTaken) return '#dc2626';
    if (isPremium) return '#b45309';
    if (isUserListed) return '#0369a1';
    return '#059669';
  };

  const addToCart = () => {
    if (!clean || alreadyTaken || checking) return;
    if (cart.find(i => i.slug === clean)) { showToast('Already in cart'); return; }
    const realPrice = getRealPrice();
    const item: CartItem = {
      slug: clean,
      price: realPrice,  // ← REAL price, not always $12
      type: isPremium ? 'premium' : isUserListed ? 'user_listing' : 'standard',
      listingId: isUserListed ? listingCheck?.id : undefined,
    };
    setCart(p => [...p, item]);
    showToast(`/${clean} added · $${realPrice.toLocaleString()} USDC`);
    setRegisterSlug('');
  };

  const handleRegister = async (overrideItem?: CartItem) => {
    const target = overrideItem || (clean ? {
      slug: clean, price: getRealPrice(),
      type: isPremium ? 'premium' : isUserListed ? 'user_listing' : 'standard',
      listingId: isUserListed ? listingCheck?.id : undefined,
    } : null) as CartItem | null;
    if (!target || !user || !hasMiniSite) return;
    setLoading(true);
    try {
      const exp = new Date(); exp.setFullYear(exp.getFullYear()+1);
      if (target.type === 'premium' && premiumCheck) {
        await supabase.from('premium_slugs').update({ sold:true, buyer_id:user.id, sold_at:new Date().toISOString() } as any).eq('id', premiumCheck.id);
      }
      const { data: reg, error } = await supabase.from('slug_registrations').insert({
        user_id: user.id, slug: target.slug, registration_fee: target.price,
        renewal_fee: 12, slug_type: target.type==='premium'?'premium':isFullName(target.slug)?'personal_name':'standard',
        expires_at: exp.toISOString(),
      } as any).select().single();
      if (error) throw error;
      if (mySites[0]) await supabase.from('mini_sites').update({ slug:target.slug, slug_registration_id:reg.id, slug_expires_at:exp.toISOString() } as any).eq('id', mySites[0].id);
      showToast(`✓ /${target.slug} registered!`);
      setRegisterSlug('');
      setMyRegistrations(p => [reg, ...p]);
    } catch(e: any) { showToast(e.message || 'Error', false); }
    setLoading(false);
  };

  const handleCheckout = async () => {
    if (!cart.length || !user) return;
    setCheckoutLoading(true);
    let done = 0;
    for (const item of cart) {
      try {
        await handleRegister(item);
        done++;
      } catch {}
    }
    setCart([]);
    showToast(`✓ ${done} slug(s) registered!`);
    setCheckoutLoading(false);
  };

  const handleSell = async () => {
    if (!user || !sellSiteId || !sellPrice) return;
    setLoading(true);
    try {
      const site = mySites.find(s => s.id === sellSiteId);
      if (!site) throw new Error('Site not found');
      if (isFullName(site.slug)) throw new Error('Full names cannot be sold');
      const { error } = await supabase.from('slug_listings').insert({ seller_id:user.id, site_id:sellSiteId, slug:site.slug, price:parseFloat(sellPrice) });
      if (error) throw error;
      showToast(`✓ /${site.slug} listed for $${sellPrice}`);
      setSellSiteId(''); setSellPrice('');
    } catch(e: any) { showToast(e.message || 'Error', false); }
    setLoading(false);
  };

  const fs = (s: string) => !search.trim() || s.toLowerCase().includes(search.toLowerCase());
  const card: any = { background:'white', border:'1px solid #e5e7eb', borderRadius:16, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', overflow:'hidden' };
  const tabStyle = (active: boolean): any => ({
    padding:'9px 16px', borderRadius:10, border:`1.5px solid ${active?A:'#e5e7eb'}`,
    background:active?A:'white', color:active?'white':'#374151',
    fontSize:14, fontWeight:active?700:500, cursor:'pointer', fontFamily:'inherit',
    transition:'all 0.2s', whiteSpace:'nowrap',
  });

  const TABS = [
    { id:'search',   label: t.searchRegister },
    { id:'premium',  label: t.premium },
    { id:'auctions', label: t.auctions },
    { id:'users',    label: t.fromUsers },
    ...(user ? [{ id:'sell', label: t.sell }, { id:'my', label: t.mySlugs }] : []),
  ];

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',color:'#111827',fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      {toast && (
        <div style={{position:'fixed',top:16,right:16,zIndex:300,padding:'12px 20px',borderRadius:14,background:toast.ok?'#f0fdf4':'#fef2f2',border:`1px solid ${toast.ok?'#86efac':'#fca5a5'}`,color:toast.ok?'#15803d':'#dc2626',fontSize:14,fontWeight:600,boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
          {toast.msg}
        </div>
      )}

      {/* Navbar with cart integration */}
      <Navbar
        cart={cart}
        onRemoveFromCart={slug => setCart(p => p.filter(i => i.slug !== slug))}
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
      />

      {/* Hot slug ticker */}
      <div style={{background:'#f5f3ff',borderBottom:'1px solid #ede9fe',overflow:'hidden',padding:'8px 0'}}>
        <div style={{display:'flex',alignItems:'center'}}>
          <div style={{flexShrink:0,padding:'0 16px',fontSize:11,fontWeight:700,color:A,textTransform:'uppercase',letterSpacing:'0.1em',borderRight:'1px solid #ede9fe',marginRight:16,whiteSpace:'nowrap'}}>
            {t.hotSlugs}
          </div>
          <div style={{display:'flex',animation:'ticker 35s linear infinite',whiteSpace:'nowrap'}}>
            {[...HOT_SLUGS,...HOT_SLUGS].map((s,i) => (
              <button key={i} onClick={()=>{setRegisterSlug(s.s);setTab('search');}}
                style={{display:'inline-flex',alignItems:'center',gap:6,marginRight:28,cursor:'pointer',background:'none',border:'none',padding:0,fontFamily:'inherit'}}>
                <span style={{fontFamily:'monospace',fontSize:13,fontWeight:800,color:A}}>/{s.s}</span>
                <span style={{fontSize:13,fontWeight:700,color:s.hot?'#b45309':'#374151'}}>${s.p.toLocaleString()}</span>
                {s.hot && <span>🔥</span>}
                <span style={{color:'#e5e7eb',marginLeft:6}}>·</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'32px 20px'}}>
        {/* Header */}
        <div style={{marginBottom:24,display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{fontSize:32,fontWeight:800,color:'#111827',marginBottom:6,letterSpacing:'-0.02em'}}>{t.slugMarketplace}</h1>
            <p style={{fontSize:15,color:'#6b7280'}}>{t.slugSubtitle}</p>
          </div>
          <div style={{display:'flex',gap:14}}>
            {[{l:'Premium',v:premiumSlugs.length,c:'#b45309',bg:'#fef3c7'},{l:t.auctions,v:auctions.length,c:A,bg:'#ede9fe'},{l:t.fromUsers,v:userListings.length,c:'#0369a1',bg:'#e0f2fe'}].map(s=>(
              <div key={s.l} style={{textAlign:'center',padding:'10px 16px',borderRadius:12,background:s.bg,border:`1px solid ${s.c}30`}}>
                <p style={{fontSize:22,fontWeight:800,color:s.c,margin:0}}>{s.v}</p>
                <p style={{fontSize:12,color:s.c,fontWeight:600,margin:0}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:8,overflowX:'auto',marginBottom:24,paddingBottom:4}} className="no-scrollbar">
          {TABS.map(tab2 => (
            <button key={tab2.id} onClick={()=>setTab(tab2.id)} style={tabStyle(tab===tab2.id)}>
              {tab2.label}
              {tab2.id==='auctions'&&auctions.length>0&&<span style={{marginLeft:6,background:tab===tab2.id?'rgba(255,255,255,0.25)':'#ede9fe',color:tab===tab2.id?'white':A,borderRadius:20,padding:'1px 7px',fontSize:11,fontWeight:800}}>{auctions.length}</span>}
            </button>
          ))}
        </div>

        {/* ── SEARCH TAB ── */}
        {tab==='search' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={{...card,padding:28}}>
              <h2 style={{fontSize:20,fontWeight:800,color:'#111827',marginBottom:6}}>{t.searchTitle}</h2>
              <p style={{fontSize:14,color:'#6b7280',marginBottom:22}}>{t.searchSubtitle}</p>

              {/* Price table */}
              <div style={{background:'#f9fafb',borderRadius:12,padding:'12px 16px',marginBottom:20,border:'1px solid #f3f4f6'}}>
                <p style={{fontSize:11,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>{t.defaultPrices}</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:6}}>
                  {[[1,'$2K','#b45309'],[2,'$1.5K',A],[3,'$1K','#0369a1'],[4,'$500','#047857'],[5,'$250','#374151'],[6,'$100','#374151']].map(([len,p,c])=>(
                    <div key={len} style={{textAlign:'center',padding:'6px 0',borderRadius:8,background:'white',border:'1px solid #e5e7eb'}}>
                      <p style={{fontSize:11,fontWeight:700,color:'#6b7280',margin:0}}>{len}L</p>
                      <p style={{fontSize:12,fontWeight:800,color:c as string,fontFamily:'monospace',margin:0}}>{p as string}</p>
                    </div>
                  ))}
                </div>
                <p style={{fontSize:11,color:'#9ca3af',margin:'8px 0 0'}}>{t.renewalNote}</p>
              </div>

              {/* Input */}
              <label style={{display:'block',fontSize:14,fontWeight:600,color:'#374151',marginBottom:8}}>{t.yourSlug}</label>
              <div style={{display:'flex',alignItems:'center',borderRadius:12,border:`2px solid ${clean&&!checking?(alreadyTaken?'#ef4444':isPremium?'#f59e0b':isUserListed?'#3b82f6':'#10b981'):'#e5e7eb'}`,overflow:'hidden',background:'white',marginBottom:12,transition:'border-color 0.3s'}}>
                <div style={{padding:'0 14px',background:'#f9fafb',borderRight:'1px solid #e5e7eb',fontSize:14,color:'#6b7280',whiteSpace:'nowrap',lineHeight:'50px',fontFamily:'monospace',fontWeight:600}}>
                  jobinlink.com/@
                </div>
                <input value={registerSlug} onChange={e=>setRegisterSlug(normalizeSlug(e.target.value))} placeholder="your-slug" autoFocus
                  style={{flex:1,padding:'14px 16px',fontSize:16,fontFamily:'monospace',fontWeight:700,color:'#111827',border:'none',outline:'none',background:'transparent'}}/>
                {checking && <Loader2 style={{width:18,height:18,color:'#9ca3af',marginRight:12,animation:'spin 1s linear infinite',flexShrink:0}}/>}
              </div>

              {/* Status result card */}
              {clean && (
                <div style={{padding:'16px 18px',borderRadius:14,border:`1.5px solid ${getStatusColor()}25`,background:`${getStatusColor()}06`,marginBottom:16,animation:'fadeIn 0.2s ease'}}>
                  {checking ? (
                    <div style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'#6b7280'}}>
                      <Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}}/> Checking <strong>/{clean}</strong>...
                    </div>
                  ) : (
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                        <Globe style={{width:18,height:18,color:getStatusColor(),flexShrink:0}}/>
                        <span style={{fontSize:16,fontFamily:'monospace',fontWeight:800,color:'#111827'}}>jobinlink.com/@{clean}</span>
                        <SlugTier slug={clean}/>
                      </div>
                      <p style={{fontSize:15,fontWeight:700,color:getStatusColor(),margin:'0 0 6px'}}>{getStatusText()}</p>
                      {!alreadyTaken && (
                        <div style={{fontSize:13,color:'#6b7280'}}>
                          {isPremium && <p style={{margin:0}}>{t.annualReg}{isFullName(clean)&&' ℹ Full names cannot be sold.'}</p>}
                          {isUserListed && !isPremium && (
                            <div>
                              <p style={{margin:'0 0 4px'}}>Seller receives ${(Number(listingCheck.price)*0.95).toFixed(0)} (5% fee)</p>
                              {(listingCheck.mini_sites as any)?.site_name && <p style={{margin:0,color:'#9ca3af'}}>Owner: {(listingCheck.mini_sites as any).site_name}</p>}
                            </div>
                          )}
                          {!isPremium && !isUserListed && <p style={{margin:0}}>{t.annualReg}</p>}
                        </div>
                      )}
                      {alreadyTaken && <p style={{fontSize:13,color:'#9ca3af',margin:0}}>Try a different slug.</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              {clean && !alreadyTaken && !checking && (
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:8}}>
                  <button onClick={addToCart}
                    style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'13px',borderRadius:12,border:`2px solid ${A}`,background:'white',color:A,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s'}}>
                    <ShoppingCart style={{width:15,height:15}}/> {t.addToCart}
                  </button>
                  <button onClick={()=>handleRegister()} disabled={loading||!user||!hasMiniSite}
                    style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'13px',borderRadius:12,border:'none',background:(!user||!hasMiniSite)?'#e5e7eb':A,color:(!user||!hasMiniSite)?'#9ca3af':'white',fontSize:14,fontWeight:700,cursor:(!user||!hasMiniSite)?'default':'pointer',fontFamily:'inherit',transition:'all 0.2s'}}>
                    {loading?<Loader2 style={{width:15,height:15,animation:'spin 1s linear infinite'}}/>:<FileKey style={{width:15,height:15}}/>}
                    {!user?t.login:!hasMiniSite?'Need mini-site':loading?'Registering...':t.registerNow}
                  </button>
                </div>
              )}
              {!user && clean && !alreadyTaken && (
                <p style={{textAlign:'center',fontSize:13,color:'#9ca3af'}}>
                  <Link href="/login" style={{color:A,fontWeight:700,textDecoration:'none'}}>{t.createAccount}</Link>
                </p>
              )}
            </div>

            {/* Right: suggestions + rules */}
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {clean && clean.length >= 2 && (
                <div style={{...card,padding:20}}>
                  <p style={{fontSize:14,fontWeight:700,color:'#374151',marginBottom:14}}>{t.relatedSuggestions}</p>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {[clean, `${clean}-pro`, `${clean}-hq`, `get${clean}`, `my${clean}`].slice(0,4).map(sug => {
                      const inCart = cart.find(i=>i.slug===sug);
                      const sugPrice = getDefaultPrice(sug);
                      return (
                        <div key={sug} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderRadius:12,border:'1px solid #f3f4f6',background:'#fafafa'}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={{fontSize:14,fontFamily:'monospace',fontWeight:700,color:'#111827'}}>/@{sug}</span>
                            <SlugTier slug={sug}/>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <span style={{fontSize:13,fontWeight:700,color:A}}>${sugPrice.toLocaleString()}</span>
                            <button onClick={()=>{
                              if(inCart)return;
                              setCart(p=>[...p,{slug:sug,price:sugPrice,type:'standard'}]);
                              showToast(`/${sug} added · $${sugPrice.toLocaleString()}`);
                            }} style={{width:28,height:28,borderRadius:'50%',border:`1.5px solid ${inCart?'#10b981':A}`,background:inCart?'#f0fdf4':'white',color:inCart?'#10b981':A,display:'flex',alignItems:'center',justifyContent:'center',cursor:inCart?'default':'pointer',flexShrink:0}}>
                              {inCart?<Check style={{width:13,height:13}}/>:<Plus style={{width:13,height:13}}/>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{...card,padding:20}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                  <Shield style={{width:16,height:16,color:A}}/>
                  <p style={{fontSize:14,fontWeight:700,color:'#374151',margin:0}}>{t.marketplaceRules}</p>
                </div>
                {(t.rules as string[]).map((r,i)=>(
                  <p key={i} style={{fontSize:13,color:'#6b7280',margin:'0 0 5px',lineHeight:1.4}}>{r}</p>
                ))}
              </div>

              {!hasMiniSite && user && (
                <div style={{padding:'14px 18px',borderRadius:14,background:'#fef2f2',border:'1px solid #fca5a5',display:'flex',alignItems:'center',gap:10}}>
                  <AlertTriangle style={{width:18,height:18,color:'#dc2626',flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:14,fontWeight:700,color:'#dc2626',margin:0}}>Mini-site required</p>
                    <p style={{fontSize:12,color:'#ef4444',margin:0}}>Create one to register slugs</p>
                  </div>
                  <Link href="/dashboard" style={{padding:'7px 14px',borderRadius:10,background:'#dc2626',color:'white',fontSize:12,fontWeight:700,textDecoration:'none',flexShrink:0}}>Create →</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PREMIUM TAB ── */}
        {tab==='premium' && (
          <div>
            <div style={{position:'relative',marginBottom:20}}>
              <Search style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:18,height:18,color:'#9ca3af'}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search premium slugs..."
                style={{width:'100%',padding:'13px 16px 13px 44px',borderRadius:14,border:'1.5px solid #e5e7eb',background:'white',fontSize:15,outline:'none',fontFamily:'inherit',boxSizing:'border-box' as const,transition:'border-color 0.2s'}}
                onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:14}}>
              {premiumSlugs.filter(s=>fs(s.slug)).map(slug=>{
                const inCart = cart.find(i=>i.slug===slug.slug);
                const realPrice = Number(slug.price);
                return (
                  <div key={slug.id} style={{...card,padding:20,transition:'box-shadow 0.2s'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.boxShadow='0 6px 24px rgba(109,40,217,0.12)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.boxShadow='0 1px 4px rgba(0,0,0,0.06)'}>
                    <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:8}}>
                      <Crown style={{width:15,height:15,color:'#b45309'}}/>
                      <span style={{fontSize:18,fontWeight:800,color:'#111827',fontFamily:'monospace'}}>/{slug.slug}</span>
                    </div>
                    <SlugTier slug={slug.slug}/>
                    <p style={{fontSize:11,color:'#9ca3af',margin:'6px 0 4px',fontFamily:'monospace'}}>jobinlink.com/@{slug.slug}</p>
                    {/* Show REAL premium price */}
                    <p style={{fontSize:26,fontWeight:800,color:A,margin:'0 0 2px'}}>${realPrice.toLocaleString()}</p>
                    <p style={{fontSize:12,color:'#9ca3af',margin:'0 0 14px'}}>+ $12/yr renewal</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      <button onClick={()=>{
                        if(inCart)return;
                        setCart(p=>[...p,{slug:slug.slug,price:realPrice,type:'premium'}]);
                        showToast(`/${slug.slug} added · $${realPrice.toLocaleString()}`);
                      }} style={{padding:'9px',borderRadius:10,border:`1.5px solid ${inCart?'#10b981':A}`,background:inCart?'#f0fdf4':'white',color:inCart?'#10b981':A,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                        {inCart?`✓ ${t.added}`:t.addToCart}
                      </button>
                      <button onClick={()=>{setRegisterSlug(slug.slug);setTab('search');}}
                        style={{padding:'9px',borderRadius:10,border:'none',background:A,color:'white',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                        Buy
                      </button>
                    </div>
                  </div>
                );
              })}
              {premiumSlugs.filter(s=>fs(s.slug)).length===0 && (
                <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px 0',color:'#9ca3af'}}>
                  <Crown style={{width:40,height:40,margin:'0 auto 12px',opacity:0.3}}/>
                  <p style={{fontSize:15}}>No premium slugs available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── AUCTIONS TAB ── */}
        {tab==='auctions' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
            {auctions.length===0 && <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px 0',color:'#9ca3af'}}><Gavel style={{width:40,height:40,margin:'0 auto 12px',opacity:0.3}}/><p>No active auctions</p></div>}
            {auctions.map(auc=>{
              const cur = auc.current_bid || auc.starting_price;
              const minNext = cur + auc.min_increment;
              const expired = new Date(auc.ends_at) < new Date();
              return (
                <div key={auc.id} style={card}>
                  <div style={{padding:'14px 18px',background:'#f5f3ff',borderBottom:'1px solid #ede9fe',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <Gavel style={{width:15,height:15,color:A}}/>
                      <span style={{fontSize:17,fontWeight:800,color:'#111827',fontFamily:'monospace'}}>/{auc.slug||auc.keyword}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      <Timer style={{width:13,height:13,color:'#6b7280'}}/>
                      {expired?<span style={{color:'#dc2626',fontSize:12,fontWeight:700}}>Ended</span>:<CD expiresAt={auc.ends_at}/>}
                    </div>
                  </div>
                  <div style={{padding:'16px 18px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                      <div><p style={{fontSize:12,color:'#9ca3af',margin:0}}>Current bid</p><p style={{fontSize:26,fontWeight:800,color:A,margin:0}}>${cur.toLocaleString()}</p></div>
                      <div style={{textAlign:'right'}}><p style={{fontSize:12,color:'#9ca3af',margin:0}}>Min next</p><p style={{fontSize:15,fontWeight:700,color:'#374151',fontFamily:'monospace',margin:0}}>${minNext.toLocaleString()}</p></div>
                    </div>
                    {auc.current_bidder_id===user?.id && <p style={{fontSize:13,color:'#10b981',fontWeight:700,marginBottom:8}}>🏆 You are leading!</p>}
                    <p style={{fontSize:12,color:'#9ca3af',margin:'0 0 12px'}}>5% fee on final amount</p>
                    {!expired&&user&&hasMiniSite?(
                      <button onClick={()=>{setRegisterSlug(auc.slug||auc.keyword);setTab('search');}}
                        style={{width:'100%',padding:'11px',borderRadius:12,border:'none',background:A,color:'white',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                        Place Bid
                      </button>
                    ):!user?<Link href="/login" style={{display:'block',padding:'10px',borderRadius:10,background:'#f3f4f6',color:'#374151',fontSize:13,fontWeight:600,textDecoration:'none',textAlign:'center'}}>Log in to bid</Link>:null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab==='users' && (
          <div>
            <div style={{position:'relative',marginBottom:20}}>
              <Search style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:18,height:18,color:'#9ca3af'}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search user listings..."
                style={{width:'100%',padding:'13px 16px 13px 44px',borderRadius:14,border:'1.5px solid #e5e7eb',background:'white',fontSize:15,outline:'none',fontFamily:'inherit',boxSizing:'border-box' as const,transition:'border-color 0.2s'}}
                onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
              {userListings.filter(l=>fs(l.slug)).map(l=>{
                const inCart=cart.find(i=>i.slug===l.slug);
                const site=l.mini_sites as any;
                const realPrice = Number(l.price);
                return (
                  <div key={l.id} style={{...card,padding:20}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                      {site?.avatar_url?<img src={site.avatar_url} alt="" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover'}}/>
                        :<div style={{width:36,height:36,borderRadius:'50%',background:'#ede9fe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:A}}>{(site?.site_name||'?').charAt(0)}</div>}
                      <div>
                        <p style={{fontSize:15,fontWeight:800,color:'#111827',fontFamily:'monospace',margin:0}}>/{l.slug}</p>
                        <p style={{fontSize:12,color:'#9ca3af',margin:0}}>{site?.site_name}</p>
                      </div>
                    </div>
                    <SlugTier slug={l.slug}/>
                    {/* Show REAL user listing price */}
                    <p style={{fontSize:24,fontWeight:800,color:'#0369a1',margin:'8px 0 2px'}}>${realPrice.toLocaleString()}</p>
                    <p style={{fontSize:12,color:'#9ca3af',margin:'0 0 14px'}}>Seller gets ${(realPrice*0.95).toFixed(0)} · 5% fee</p>
                    {user&&hasMiniSite&&l.seller_id!==user.id?(
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                        <button onClick={()=>{if(inCart)return;setCart(p=>[...p,{slug:l.slug,price:realPrice,type:'user_listing',listingId:l.id}]);showToast(`/${l.slug} added · $${realPrice.toLocaleString()}`);}}
                          style={{padding:'9px',borderRadius:10,border:`1.5px solid ${inCart?'#10b981':'#0369a1'}`,background:inCart?'#f0fdf4':'white',color:inCart?'#10b981':'#0369a1',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                          {inCart?`✓ ${t.added}`:t.addToCart}
                        </button>
                        <button onClick={()=>{setRegisterSlug(l.slug);setTab('search');}}
                          style={{padding:'9px',borderRadius:10,border:'none',background:'#0369a1',color:'white',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                          Buy
                        </button>
                      </div>
                    ):l.seller_id===user?.id?<p style={{textAlign:'center',fontSize:12,color:'#9ca3af',fontWeight:600}}>Your listing</p>
                    :<Link href="/login" style={{display:'block',padding:'10px',borderRadius:10,background:'#f3f4f6',color:'#374151',fontSize:13,fontWeight:600,textDecoration:'none',textAlign:'center'}}>Log in to buy</Link>}
                  </div>
                );
              })}
              {userListings.filter(l=>fs(l.slug)).length===0 && <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px 0',color:'#9ca3af'}}><Tag style={{width:40,height:40,margin:'0 auto 12px',opacity:0.3}}/><p>No user listings available</p></div>}
            </div>
          </div>
        )}

        {/* ── SELL TAB ── */}
        {tab==='sell' && user && (
          <div style={{maxWidth:460,margin:'0 auto'}}>
            <div style={{...card,padding:28}}>
              <h2 style={{fontSize:20,fontWeight:800,color:'#111827',marginBottom:20}}>💰 {t.sell}</h2>
              <div style={{marginBottom:16}}>
                <label style={{display:'block',fontSize:14,fontWeight:600,color:'#374151',marginBottom:8}}>Your mini-site</label>
                <select value={sellSiteId} onChange={e=>setSellSiteId(e.target.value)}
                  style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid #e5e7eb',background:'white',color:'#111827',fontSize:14,fontFamily:'inherit',outline:'none',appearance:'none' as const}}>
                  <option value="">-- Select --</option>
                  {mySites.map(s=><option key={s.id} value={s.id}>/{s.slug} — {s.site_name}</option>)}
                </select>
              </div>
              <div style={{marginBottom:20}}>
                <label style={{display:'block',fontSize:14,fontWeight:600,color:'#374151',marginBottom:8}}>Sale price (USDC)</label>
                <div style={{display:'flex',alignItems:'center',borderRadius:12,border:'1.5px solid #e5e7eb',overflow:'hidden',background:'white'}}>
                  <span style={{padding:'0 14px',background:'#f9fafb',borderRight:'1px solid #e5e7eb',fontSize:16,fontWeight:700,color:'#6b7280',lineHeight:'50px'}}>$</span>
                  <input type="number" value={sellPrice} onChange={e=>setSellPrice(e.target.value)} placeholder="500"
                    style={{flex:1,padding:'13px 16px',fontSize:16,fontWeight:700,color:'#111827',border:'none',outline:'none',fontFamily:'monospace'}}/>
                </div>
                {sellPrice && <p style={{fontSize:13,color:'#6b7280',marginTop:6}}>You receive: <strong>${(parseFloat(sellPrice)*0.95||0).toFixed(2)}</strong> · 5% fee</p>}
              </div>
              <button onClick={handleSell} disabled={!sellSiteId||!sellPrice||loading}
                style={{width:'100%',padding:'13px',borderRadius:12,border:'none',background:!sellSiteId||!sellPrice?'#e5e7eb':A,color:!sellSiteId||!sellPrice?'#9ca3af':'white',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                {loading?<Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}}/>:<Tag style={{width:16,height:16}}/>}
                List for sale
              </button>
            </div>
          </div>
        )}

        {/* ── MY SLUGS TAB ── */}
        {tab==='my' && user && (
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {myRegistrations.length===0 && (
              <div style={{textAlign:'center',padding:'60px 0',color:'#9ca3af'}}>
                <FileKey style={{width:40,height:40,margin:'0 auto 12px',opacity:0.3}}/>
                <p style={{fontSize:15}}>No slugs registered yet</p>
                <button onClick={()=>setTab('search')} style={{marginTop:12,padding:'10px 24px',borderRadius:12,border:'none',background:A,color:'white',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Register your first slug</button>
              </div>
            )}
            {myRegistrations.map((r: any) => {
              const exp = new Date(r.expires_at);
              const daysLeft = Math.ceil((exp.getTime()-Date.now())/864e5);
              return (
                <div key={r.id} style={{...card,padding:'16px 20px'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <Globe style={{width:20,height:20,color:A}}/>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontSize:18,fontWeight:800,color:'#111827',fontFamily:'monospace'}}>/{r.slug}</span>
                          <span style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:'#f0fdf4',color:'#15803d',border:'1px solid #86efac',fontWeight:700}}>Active</span>
                          <SlugTier slug={r.slug}/>
                        </div>
                        <p style={{fontSize:12,color:'#9ca3af',margin:0,fontFamily:'monospace'}}>jobinlink.com/@{r.slug}</p>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:16,fontSize:13}}>
                      <div style={{textAlign:'right'}}>
                        <p style={{margin:0,fontSize:11,color:'#9ca3af'}}>Expires</p>
                        <p style={{margin:0,fontWeight:700,color:daysLeft<30?'#dc2626':'#374151'}}>{daysLeft<30?`⚠ ${daysLeft}d`:exp.toLocaleDateString('en-US')}</p>
                      </div>
                      <a href={`https://jobinlink.com/@${r.slug}`} target="_blank" rel="noopener noreferrer"
                        style={{display:'flex',alignItems:'center',gap:4,color:A,textDecoration:'none',fontSize:13,fontWeight:600}}>
                        <ExternalLink style={{width:14,height:14}}/> View
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>
    </div>
  );
}
