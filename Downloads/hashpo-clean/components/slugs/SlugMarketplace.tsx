'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { normalizeSlug, slugPrice } from '@/lib/utils';
import { Search, Crown, ShoppingCart, Tag, Gavel, Globe, Shield, AlertTriangle, Timer, Plus, Check, Loader2, X, Star, Zap } from 'lucide-react';
import Link from 'next/link';

const DEFAULT_PRICES = [{l:'1L',p:2000,c:'#b45309'},{l:'2L',p:1500,c:'#7c3aed'},{l:'3L',p:1000,c:'#0369a1'},{l:'4L',p:500,c:'#047857'},{l:'5L',p:250,c:'#374151'},{l:'6L',p:100,c:'#374151'},{l:'7L+',p:50,c:'#374151'}];
const HOT = [{s:'lawyer',p:30000},{s:'doctor',p:25000},{s:'ai',p:4400},{s:'ceo',p:18000},{s:'dev',p:2900},{s:'crypto',p:1800},{s:'founder',p:800},{s:'studio',p:1200}];

type Tab = 'search'|'premium'|'auctions'|'users'|'sell'|'my';
interface CartItem { slug:string; price:number; type:'standard'|'premium'|'user_listing'; }

function CD({ t }:{ t:string }) {
  const [s, setS] = useState('');
  useEffect(()=>{
    const u=()=>{
      const d=new Date(t).getTime()-Date.now();
      if(d<=0){setS('Ended');return;}
      const days=Math.floor(d/864e5),hrs=Math.floor((d%864e5)/36e5),min=Math.floor((d%36e5)/6e4),sec=Math.floor((d%6e4)/1e3);
      setS(`${days}d ${hrs}h ${min}m ${sec}s`);
    };
    u();const i=setInterval(u,1000);return()=>clearInterval(i);
  },[t]);
  return <span className="font-mono text-sm font-bold text-orange-600">{s}</span>;
}

export default function SlugMarketplace() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('search');
  const [query, setQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState('');
  const [premiums, setPremiums] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [myRegs, setMyRegs] = useState<any[]>([]);
  const [mySite, setMySite] = useState<any>(null);
  const [slugStatus, setSlugStatus] = useState<{available:boolean;premium:any;listing:any;taken:boolean}|null>(null);
  const [sellPrice, setSellPrice] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const showToast = (m:string)=>{ setToast(m); setTimeout(()=>setToast(''),3000); };

  useEffect(()=>{
    supabase.from('premium_slugs').select('*').eq('active',true).eq('sold',false).order('price',{ascending:false}).then(({data})=>setPremiums(data||[]));
    supabase.from('slug_auctions').select('*').eq('status','active').order('ends_at').then(({data})=>setAuctions(data||[]));
    supabase.from('slug_listings').select('*,mini_sites(slug,site_name,avatar_url)').eq('status','active').order('created_at',{ascending:false}).then(({data})=>setListings(data||[]));
    if(user){
      supabase.from('mini_sites').select('id,slug,site_name').eq('user_id',user.id).maybeSingle().then(({data})=>setMySite(data));
      supabase.from('slug_registrations').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).then(({data})=>setMyRegs(data||[]));
    }
  },[user]);

  // Live slug check
  useEffect(()=>{
    const clean = normalizeSlug(query);
    if(!clean){ setSlugStatus(null); return; }
    setChecking(true);
    const t=setTimeout(async()=>{
      const [p,l,r]=await Promise.all([
        supabase.from('premium_slugs').select('id,slug,price,sold').eq('slug',clean).eq('active',true).maybeSingle(),
        supabase.from('slug_listings').select('id,slug,price,seller_id').eq('slug',clean).eq('status','active').maybeSingle(),
        supabase.from('slug_registrations').select('id').eq('slug',clean).eq('status','active').maybeSingle(),
      ]);
      setSlugStatus({ available:!r.data&&!p.data?.sold, premium:p.data&&!p.data.sold?p.data:null, listing:l.data, taken:!!r.data||!!p.data?.sold });
      setChecking(false);
    },400);
    return()=>clearTimeout(t);
  },[query]);

  const clean = normalizeSlug(query);
  const realPrice = slugStatus?.premium?Number(slugStatus.premium.price):slugStatus?.listing?Number(slugStatus.listing.price):slugPrice(clean);

  const addToCart=(slug:string,price:number,type:CartItem['type'])=>{
    if(cart.find(i=>i.slug===slug)){ showToast('Already in cart'); return; }
    setCart(p=>[...p,{slug,price,type}]);
    showToast(`/${slug} added — $${price.toLocaleString()}`);
  };

  const handleRegister=async(item:CartItem)=>{
    if(!user||!mySite) return;
    const exp=new Date(); exp.setFullYear(exp.getFullYear()+1);
    if(item.type==='premium'&&slugStatus?.premium){
      await supabase.from('premium_slugs').update({sold:true,buyer_id:user.id,sold_at:new Date().toISOString()} as any).eq('id',slugStatus.premium.id);
    }
    const {error}=await supabase.from('slug_registrations').insert({user_id:user.id,slug:item.slug,registration_fee:item.price,renewal_fee:12,expires_at:exp.toISOString()} as any);
    if(!error){ await supabase.from('mini_sites').update({slug:item.slug} as any).eq('id',mySite.id); }
    return !error;
  };

  const handleCheckout=async()=>{
    if(!cart.length||!user||!mySite){ showToast(user?'Need a mini-site first':'Please sign in'); return; }
    setCheckoutLoading(true);
    let ok=0;
    for(const item of cart){ const r=await handleRegister(item); if(r) ok++; }
    setCart([]);
    showToast(`✓ ${ok} slug(s) registered!`);
    setCheckoutLoading(false);
    supabase.from('slug_registrations').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).then(({data})=>setMyRegs(data||[]));
  };

  const TABS:Array<{id:Tab;label:string}> = [
    {id:'search',label:'🔍 Search & Register'},
    {id:'premium',label:'👑 Premium'},
    {id:'auctions',label:'⚡ Auctions'},
    {id:'users',label:'🏷️ User Listings'},
    ...(user?[{id:'sell' as Tab,label:'💰 Sell'},{id:'my' as Tab,label:'📋 My Slugs'}]:[]),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <div className="fixed top-4 right-4 z-[300] bg-white border border-gray-200 rounded-xl shadow-xl px-5 py-3 text-sm font-bold text-gray-900">{toast}</div>}
      <Navbar cart={cart} onRemove={s=>setCart(p=>p.filter(i=>i.slug!==s))} onCheckout={handleCheckout}/>

      {/* Ticker */}
      <div className="bg-purple-50 border-b border-purple-100 overflow-hidden py-2">
        <div className="flex items-center">
          <span className="shrink-0 px-4 text-xs font-black text-purple-700 uppercase tracking-widest border-r border-purple-200 mr-4">🔥 Hot</span>
          <div className="flex animate-ticker whitespace-nowrap">
            {[...HOT,...HOT].map((h,i)=>(
              <button key={i} onClick={()=>{setQuery(h.s);setTab('search');}}
                className="inline-flex items-center gap-2 mr-8 cursor-pointer hover:opacity-70 transition-opacity">
                <span className="font-mono font-black text-purple-700">/{h.s}</span>
                <span className="font-bold text-gray-700">${h.p.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Slug Marketplace</h1>
            <p className="text-gray-500 mt-1">Buy · Sell · Bid · 5% fee · $12/year registration</p>
          </div>
          <div className="flex gap-3">
            {[{l:'Premium',v:premiums.length,c:'#b45309',bg:'#fef3c7'},{l:'Auctions',v:auctions.length,c:'#7c3aed',bg:'#ede9fe'},{l:'Listings',v:listings.length,c:'#0369a1',bg:'#e0f2fe'}].map(s=>(
              <div key={s.l} className="text-center px-4 py-2 rounded-xl border" style={{background:s.bg,borderColor:s.c+'30'}}>
                <p className="text-xl font-black" style={{color:s.c}}>{s.v}</p>
                <p className="text-xs font-bold" style={{color:s.c}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2 ${tab===t.id?'bg-purple-600 text-white border-purple-600':'bg-white text-gray-700 border-gray-200 hover:border-purple-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── SEARCH TAB ── */}
        {tab==='search' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-1">Search & Register</h2>
              <p className="text-sm text-gray-500 mb-5">Type any slug to check availability in real time</p>

              {/* Price table */}
              <div className="bg-gray-50 rounded-xl p-3 mb-5">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Default Prices</p>
                <div className="grid grid-cols-7 gap-1">
                  {DEFAULT_PRICES.map(p=>(
                    <div key={p.l} className="text-center bg-white rounded-lg py-1.5 border border-gray-100">
                      <p className="text-xs text-gray-400 font-bold">{p.l}</p>
                      <p className="text-xs font-black" style={{color:p.c}}>${p.p>=1000?p.p/1000+'K':p.p}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">+ $12/year renewal for standard slugs</p>
              </div>

              {/* Input */}
              <label className="block text-sm font-bold text-gray-700 mb-2">Your slug</label>
              <div className={`flex items-center rounded-xl border-2 overflow-hidden transition-colors ${clean&&!checking?(slugStatus?.taken?'border-red-400':slugStatus?.premium?'border-amber-400':slugStatus?.listing?'border-blue-400':'border-green-400'):'border-gray-200'}`}>
                <span className="px-3 py-3 bg-gray-50 border-r border-gray-200 text-sm text-gray-500 font-mono font-bold shrink-0">hashpo.com/@</span>
                <input value={query} onChange={e=>setQuery(normalizeSlug(e.target.value))} placeholder="your-slug" autoFocus
                  className="flex-1 px-3 py-3 text-base font-mono font-bold text-gray-900 outline-none bg-white"/>
                {checking && <Loader2 className="w-4 h-4 text-gray-400 mr-3 animate-spin shrink-0"/>}
              </div>

              {/* Status */}
              {clean && !checking && slugStatus && (
                <div className={`mt-3 p-4 rounded-xl border ${slugStatus.taken?'bg-red-50 border-red-200':slugStatus.premium?'bg-amber-50 border-amber-200':slugStatus.listing?'bg-blue-50 border-blue-200':'bg-green-50 border-green-200'}`}>
                  <p className="font-mono font-black text-gray-900 mb-1">hashpo.com/@{clean}</p>
                  <p className="font-bold text-sm mb-2" style={{color:slugStatus.taken?'#dc2626':slugStatus.premium?'#b45309':slugStatus.listing?'#0369a1':'#059669'}}>
                    {slugStatus.taken?'❌ Already registered':slugStatus.premium?`⭐ Premium — $${Number(slugStatus.premium.price).toLocaleString()} USDC`:slugStatus.listing?`🏷️ For sale — $${Number(slugStatus.listing.price).toLocaleString()} USDC`:`✅ Available — $${realPrice.toLocaleString()} USDC`}
                  </p>
                  {!slugStatus.taken && (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={()=>addToCart(clean,realPrice,slugStatus.premium?'premium':slugStatus.listing?'user_listing':'standard')}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 border-purple-600 text-purple-700 font-bold text-sm hover:bg-purple-50 transition-colors">
                        <ShoppingCart className="w-3.5 h-3.5"/> + Cart
                      </button>
                      <button onClick={async()=>{
                        if(!user){location.href='/auth';return;}
                        if(!mySite){showToast('You need a mini-site first');return;}
                        const ok=await handleRegister({slug:clean,price:realPrice,type:slugStatus.premium?'premium':slugStatus.listing?'user_listing':'standard'});
                        if(ok){showToast(`✓ /${clean} registered!`);setQuery('');}
                        else showToast('Registration failed');
                      }} className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors">
                        Register now
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!user && clean && <div className="mt-3 text-center"><Link href="/auth" className="text-purple-600 text-sm font-bold hover:underline">Sign in to register →</Link></div>}
              {user && !mySite && clean && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0"/>
                  <p className="text-sm text-orange-700">You need a <Link href="/site/edit" className="font-bold underline">mini-site</Link> to own slugs.</p>
                </div>
              )}
            </div>

            {/* Suggestions + Rules */}
            <div className="space-y-4">
              {clean.length>=2 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <p className="text-sm font-black text-gray-700 mb-3">💡 Related suggestions</p>
                  {[clean,`${clean}-pro`,`${clean}-hq`,`get${clean}`].map(sug=>{
                    const inCart=cart.find(i=>i.slug===sug);
                    const p=slugPrice(sug);
                    return (
                      <div key={sug} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <span className="font-mono font-bold text-gray-800">/@{sug}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-purple-700">${p.toLocaleString()}</span>
                          <button onClick={()=>{if(inCart)return;addToCart(sug,p,'standard');}}
                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${inCart?'border-green-400 bg-green-50':'border-purple-400 hover:bg-purple-50'}`}>
                            {inCart?<Check className="w-3.5 h-3.5 text-green-500"/>:<Plus className="w-3.5 h-3.5 text-purple-600"/>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-purple-600"/><p className="text-sm font-black text-gray-700">Marketplace Rules</p></div>
                {['✓ Active mini-site required to own slugs','✓ Registration $12/year · Renewal $12/year','✓ Subscribers: 1 free slug per plan','✓ Full names cannot be sold or auctioned','✓ 5% fee on sales and auctions','⚠ Cancel subscription = all slugs become invalid'].map(r=>(
                  <p key={r} className="text-xs text-gray-600 mb-1.5 leading-relaxed">{r}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PREMIUM TAB ── */}
        {tab==='premium' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {premiums.length===0 && <div className="col-span-full text-center py-16 text-gray-400"><Crown className="w-12 h-12 mx-auto mb-3 opacity-30"/><p>No premium slugs available</p></div>}
            {premiums.map(slug=>{
              const inCart=cart.find(i=>i.slug===slug.slug);
              return (
                <div key={slug.id} className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-200 transition-all">
                  <div className="flex items-center gap-2 mb-2"><Crown className="w-4 h-4 text-amber-600"/><span className="font-mono font-black text-gray-900">/{slug.slug}</span></div>
                  <p className="text-xs text-gray-400 font-mono mb-2">hashpo.com/@{slug.slug}</p>
                  <p className="text-2xl font-black text-purple-700 mb-1">${Number(slug.price).toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mb-3">+ $12/yr renewal</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={()=>{if(inCart)return;addToCart(slug.slug,Number(slug.price),'premium');}}
                      className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${inCart?'border-green-400 bg-green-50 text-green-700':'border-purple-400 text-purple-700 hover:bg-purple-50'}`}>
                      {inCart?'✓ Added':'+ Cart'}
                    </button>
                    <button onClick={()=>{setQuery(slug.slug);setTab('search');}}
                      className="py-2 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors">Buy</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── AUCTIONS TAB ── */}
        {tab==='auctions' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {auctions.length===0 && <div className="col-span-full text-center py-16 text-gray-400"><Gavel className="w-12 h-12 mx-auto mb-3 opacity-30"/><p>No active auctions</p></div>}
            {auctions.map(a=>{
              const cur=a.current_bid||a.starting_price;
              return (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-purple-50 border-b border-purple-100 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2"><Gavel className="w-4 h-4 text-purple-600"/><span className="font-mono font-black text-gray-900">/{a.slug||a.keyword}</span></div>
                    <div className="flex items-center gap-1 text-orange-600"><Timer className="w-3.5 h-3.5"/><CD t={a.ends_at}/></div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between mb-3">
                      <div><p className="text-xs text-gray-400">Current bid</p><p className="text-3xl font-black text-purple-700">${cur.toLocaleString()}</p></div>
                      <div className="text-right"><p className="text-xs text-gray-400">Min next</p><p className="font-bold text-gray-700 font-mono">${(cur+a.min_increment).toLocaleString()}</p></div>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">5% fee on final amount</p>
                    {user?<button onClick={()=>{setQuery(a.slug||a.keyword);setTab('search');}} className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-xl hover:bg-purple-700 transition-colors text-sm">Place Bid</button>
                    :<Link href="/auth" className="block w-full bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-center text-sm hover:bg-gray-200 transition-colors">Sign in to bid</Link>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── USER LISTINGS TAB ── */}
        {tab==='users' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.length===0 && <div className="col-span-full text-center py-16 text-gray-400"><Tag className="w-12 h-12 mx-auto mb-3 opacity-30"/><p>No user listings</p></div>}
            {listings.map(l=>{
              const site=(l.mini_sites as any)||{};
              const inCart=cart.find(i=>i.slug===l.slug);
              return (
                <div key={l.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    {site.avatar_url?<img src={site.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover"/>
                      :<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">{(site.site_name||'?')[0]}</div>}
                    <div><p className="font-mono font-black text-gray-900">/{l.slug}</p><p className="text-xs text-gray-400">{site.site_name}</p></div>
                  </div>
                  <p className="text-2xl font-black text-blue-700 mb-1">${Number(l.price).toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mb-3">Seller gets ${(Number(l.price)*0.95).toFixed(0)} · 5% fee</p>
                  {user&&l.seller_id!==user.id?(
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={()=>{if(inCart)return;addToCart(l.slug,Number(l.price),'user_listing');}}
                        className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${inCart?'border-green-400 bg-green-50 text-green-700':'border-blue-400 text-blue-700 hover:bg-blue-50'}`}>
                        {inCart?'✓ Added':'+ Cart'}
                      </button>
                      <button onClick={()=>{setQuery(l.slug);setTab('search');}} className="py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors">Buy</button>
                    </div>
                  ):l.seller_id===user?.id?<p className="text-xs text-gray-400 text-center font-bold">Your listing</p>
                  :<Link href="/auth" className="block text-center text-xs font-bold text-gray-500 hover:text-gray-700 py-2">Sign in to buy</Link>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── SELL TAB ── */}
        {tab==='sell' && user && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-5">💰 List a Slug for Sale</h2>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Your mini-site slug</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono font-bold text-gray-900">
                {mySite ? `/${mySite.slug}` : 'No mini-site found'}
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">Sale price (USDC)</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-purple-400 transition-colors">
                <span className="px-3 py-3 bg-gray-50 border-r border-gray-200 font-bold text-gray-500">$</span>
                <input type="number" value={sellPrice} onChange={e=>setSellPrice(e.target.value)} placeholder="500"
                  className="flex-1 px-3 py-3 text-base font-mono font-black outline-none"/>
              </div>
              {sellPrice && <p className="text-xs text-gray-500 mt-1.5">You receive: <strong>${(parseFloat(sellPrice)*0.95||0).toFixed(2)}</strong> · 5% platform fee</p>}
            </div>
            <button onClick={async()=>{
              if(!mySite||!sellPrice) return;
              const {error}=await supabase.from('slug_listings').insert({seller_id:user.id,site_id:mySite.id,slug:mySite.slug,price:parseFloat(sellPrice)});
              if(!error){ showToast(`/${mySite.slug} listed for $${sellPrice}`); setSellPrice(''); }
              else showToast('Error listing slug');
            }} disabled={!mySite||!sellPrice}
              className="w-full bg-purple-600 text-white font-black py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              <Tag className="w-4 h-4"/> List for Sale
            </button>
          </div>
        )}

        {/* ── MY SLUGS TAB ── */}
        {tab==='my' && user && (
          <div className="space-y-3">
            {myRegs.length===0 && (
              <div className="text-center py-16 text-gray-400">
                <Globe className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                <p className="font-bold mb-3">No slugs registered yet</p>
                <button onClick={()=>setTab('search')} className="bg-purple-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-colors">Register your first slug</button>
              </div>
            )}
            {myRegs.map((r:any)=>{
              const exp=new Date(r.expires_at);
              const days=Math.ceil((exp.getTime()-Date.now())/864e5);
              return (
                <div key={r.id} className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Globe className="w-5 h-5 text-purple-600"/></div>
                    <div>
                      <p className="font-mono font-black text-gray-900">/{r.slug}</p>
                      <p className="text-xs text-gray-400 font-mono">hashpo.com/@{r.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-green-100 text-green-700 font-bold text-xs px-3 py-1 rounded-full">Active</span>
                    <span className={`font-bold text-xs ${days<30?'text-red-500':'text-gray-500'}`}>
                      {days<30?`⚠ ${days}d left`:exp.toLocaleDateString()}
                    </span>
                    <a href={`https://hashpo.com/@${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 text-xs font-bold hover:underline">View →</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
