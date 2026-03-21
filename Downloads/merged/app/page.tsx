'use client';
import { useState } from 'react';
import { ArrowRight, Hash, Lock, Play, Star, Shield, Zap, Users, TrendingUp, Check, BadgeCheck, Award } from 'lucide-react';

const ACCENT = '#8b5cf6';
const ACCENT2 = '#06b6d4';

const TICKER_SLUGS = [
  { s:'lawyer', p:'$30,000', hot:true, plt:'trustbank' },
  { s:'doctor', p:'$25,000', hot:true, plt:'trustbank' },
  { s:'dev', p:'$2,900', hot:true, plt:'jobinlink' },
  { s:'ai', p:'$4,400', hot:true, plt:'hashpo' },
  { s:'ceo', p:'$18,000', hot:false, plt:'trustbank' },
  { s:'designer', p:'$400', hot:false, plt:'mybik' },
  { s:'crypto', p:'$3,200', hot:false, plt:'hashpo' },
  { s:'founder', p:'$800', hot:false, plt:'jobinlink' },
  { s:'photo', p:'$300', hot:false, plt:'mybik' },
  { s:'coach', p:'$500', hot:false, plt:'jobinlink' },
  { s:'x', p:'$5,900', hot:true, plt:'all' },
  { s:'surgeon', p:'$28,000', hot:true, plt:'trustbank' },
];

const FEATURES = [
  { icon:'🪟', title:'Apple Glass morphism', desc:'Every profile uses real backdrop-blur + glass cards. Looks like a native iOS app, runs in any browser.' },
  { icon:'💰', title:'CV unlock — you get 50%', desc:'Companies pay $20 to see your contact details. $10 goes instantly to your wallet in USDC.' },
  { icon:'📱', title:'7-day feed with countdown', desc:'Stories that expire in 7 days. Live countdown in seconds. Pin for 1 year for $10.' },
  { icon:'🎬', title:'Video paywall', desc:'You set the price. Minimum 24h access. Platform takes 30%. Your YouTube keeps monetizing.' },
  { icon:'#️⃣', title:'Slug marketplace', desc:'Own jobinlink.com/yourname. Sell it. Auction it. Same slug can sell 4x across all platforms.' },
  { icon:'🚀', title:'Directory boost', desc:'$1.50 per position up. $1,000 goes to #1 for 7 days. $50/day to hold your position.' },
];

const PLANS = [
  { name:'Starter', price:'$14.99', period:'/mo', features:['3 pages','40 templates','Feed + CV lock','Analytics'], accent:'#6366f1' },
  { name:'Pro', price:'$29.90', period:'/mo', features:['10 pages','Video paywall','Mini-site paywall','Slug auctions','AI resume'], accent:ACCENT, popular:true },
  { name:'Elite', price:'$49.90', period:'/mo', features:['Everything','Custom domain','White label','API access'], accent:'#111' },
];

export default function Home() {
  const [billingYear, setBillingYear] = useState(false);

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', color:'#111827', fontFamily:"-apple-system, 'Plus Jakarta Sans', sans-serif", overflowX:'hidden' }}>

      {/* Ambient glow */}
      <div style={{ position:'fixed', top:-300, left:'50%', transform:'translateX(-50%)', width:800, height:800, borderRadius:'50%', background:`${ACCENT}10`, filter:'blur(120px)', pointerEvents:'none', zIndex:0 }}/>

      {/* Nav */}
      <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 48px', borderBottom:'1px solid #e5e7eb', position:'sticky', top:0, background:'rgba(255,255,255,0.95)', backdropFilter:'none', zIndex:100 }}>
        <div style={{ fontSize:20, fontWeight:800, color:ACCENT, letterSpacing:'-0.02em', display:'flex', alignItems:'center', gap:8 }}>
          <Hash className="h-5 w-5"/> jobinlink
        </div>
        <div style={{ display:'flex', gap:28, fontSize:14, color:'#6b7280' }}>
          {['Features','Pricing','Directory','Slugs'].map(l => (
            <a key={l} href={`/${l.toLowerCase()}`} style={{ color:'inherit', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e=>(e.currentTarget.style.color='#e2e8f0')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(55,65,81,0.5)')}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <a href="/login" style={{ padding:'10px 20px', borderRadius:14, border:'1px solid #e5e7eb', background:'none', color:'#6b7280', fontSize:14, textDecoration:'none', display:'flex', alignItems:'center' }}>
            Sign in
          </a>
          <a href="/signup" style={{ padding:'10px 22px', borderRadius:14, border:'none', background:ACCENT, color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:`0 0 20px ${ACCENT}44`, display:'flex', alignItems:'center', gap:6 }}>
            Get started <ArrowRight className="h-4 w-4"/>
          </a>
        </div>
      </nav>

      {/* Slug Ticker */}
      <div style={{ background:'white', borderBottom:'1px solid #e5e7eb', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', padding:'10px 0' }}>
          <div style={{ flexShrink:0, padding:'0 20px', fontSize:10, fontWeight:700, color:ACCENT, textTransform:'uppercase', letterSpacing:'0.1em', borderRight:'0.5px solid rgba(255,255,255,0.08)', marginRight:20, whiteSpace:'nowrap' }}>
            🔥 Hot Slugs
          </div>
          <div style={{ display:'flex', animation:'ticker 35s linear infinite', whiteSpace:'nowrap' }}>
            {[...TICKER_SLUGS, ...TICKER_SLUGS].map((s, i) => (
              <a key={i} href="/slugs" style={{ display:'flex', alignItems:'center', gap:8, marginRight:32, textDecoration:'none' }}>
                <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:700, color:ACCENT }}>{s.plt}/{s.s}</span>
                <span style={{ fontSize:12, fontWeight:600, color:'#111827' }}>{s.p}</span>
                {s.hot && <span style={{ fontSize:10 }}>🔥</span>}
                <span style={{ color:'rgba(255,255,255,0.1)', marginLeft:8 }}>·</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign:'center', padding:'90px 24px 70px', maxWidth:860, margin:'0 auto', position:'relative', zIndex:1 }}>
        <div style={{ display:'inline-block', fontSize:12, fontWeight:600, padding:'5px 16px', borderRadius:20, background:`${ACCENT}18`, color:ACCENT, border:`0.5px solid ${ACCENT}44`, marginBottom:28 }}>
          🚀 Professional mini-sites with real monetization
        </div>
        <h1 style={{ fontSize:58, fontWeight:800, lineHeight:1.08, color:'#111827', marginBottom:22, letterSpacing:'-0.03em' }}>
          Your professional identity.<br/>
          <span style={{ background:`linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Companies pay you.
          </span>
        </h1>
        <p style={{ fontSize:19, color:'#6b7280', lineHeight:1.65, maxWidth:580, margin:'0 auto 40px' }}>
          The only platform that pays you when a company unlocks your CV. Glass morphism mini-site with feed, paywall, slugs and video monetization.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap', marginBottom:50 }}>
          <a href="/signup" style={{ padding:'15px 34px', borderRadius:14, border:'none', background:ACCENT, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:`0 0 30px ${ACCENT}55`, display:'flex', alignItems:'center', gap:8 }}>
            Create my profile <ArrowRight className="h-5 w-5"/>
          </a>
          <a href="/directory" style={{ padding:'14px 28px', borderRadius:14, border:'1px solid #e5e7eb', background:'none', color:'#6b7280', fontSize:15, textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
            <Users className="h-5 w-5"/> Browse directory
          </a>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap' }}>
          {[
            { val:'50%', label:'CV unlock goes to you' },
            { val:'7d', label:'Feed posts live timer' },
            { val:'4×', label:'Slug revenue multiplied' },
            { val:'$0', label:'To create your profile' },
          ].map(s => (
            <div key={s.val} style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:800, color:ACCENT }}>{s.val}</div>
              <div style={{ fontSize:12, color:'rgba(55,65,81,0.35)', marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Glass preview card */}
      <div style={{ maxWidth:420, margin:'0 auto 80px', padding:'0 24px', position:'relative', zIndex:1 }}>
        <div style={{ background:'white', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:24, backdropFilter:'none', padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
            <div style={{ width:56, height:56, borderRadius:16, background:`linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'#fff' }}>J</div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'#111827', display:'flex', alignItems:'center', gap:8 }}>
                James Porter <BadgeCheck className="h-5 w-5 text-blue-400"/>
              </div>
              <div style={{ fontSize:13, color:'#6b7280' }}>Corporate Attorney · New York</div>
              <div style={{ fontSize:11, fontFamily:'monospace', color:ACCENT, marginTop:2 }}>jobinlink.com/lawyer</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
            {['Corporate Law','M&A','Web3 Law','IP'].map(sk => (
              <span key={sk} style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:`${ACCENT}15`, color:ACCENT, border:`0.5px solid ${ACCENT}30` }}>{sk}</span>
            ))}
          </div>
          <div style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:14, padding:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:13, color:'rgba(241,245,249,0.7)' }}>📄 Contact & Full CV</span>
              <span style={{ fontSize:12, padding:'3px 12px', borderRadius:20, background:`${ACCENT}20`, color:ACCENT, border:`0.5px solid ${ACCENT}44` }}>🔒 $20 USDC</span>
            </div>
            <div style={{ fontSize:11, color:'#9ca3af' }}>You receive $10 · Platform $10 · Instant settlement</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth:1000, margin:'0 auto 100px', padding:'0 24px', position:'relative', zIndex:1 }}>
        <h2 style={{ textAlign:'center', fontSize:38, fontWeight:800, color:'#111827', marginBottom:12, letterSpacing:'-0.02em' }}>
          Everything in one link
        </h2>
        <p style={{ textAlign:'center', fontSize:16, color:'rgba(55,65,81,0.4)', marginBottom:52 }}>
          Feed · CV · Portfolio · Paywall · Slugs · Classifieds · Articles · Videos
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background:'white', border:'1px solid #e5e7eb)', borderRadius:20, padding:24, transition:'all 0.2s', cursor:'default' }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.07)';(e.currentTarget as HTMLElement).style.borderColor='rgba(139,92,246,0.3)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'}}>
              <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
              <div style={{ fontSize:15, fontWeight:600, color:'#111827', marginBottom:8 }}>{f.title}</div>
              <div style={{ fontSize:13, color:'rgba(55,65,81,0.4)', lineHeight:1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ maxWidth:900, margin:'0 auto 100px', padding:'0 24px', position:'relative', zIndex:1 }}>
        <h2 style={{ textAlign:'center', fontSize:38, fontWeight:800, color:'#111827', marginBottom:12, letterSpacing:'-0.02em' }}>
          Simple pricing" id="pricing
        </h2>
        <p style={{ textAlign:'center', fontSize:16, color:'rgba(55,65,81,0.4)', marginBottom:52 }}>
          Pay in USDC · Cancel anytime · No free plan (we're serious)
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:16 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              background: plan.popular ? `${ACCENT}10` : 'rgba(255,255,255,0.04)',
              border: `0.5px solid ${plan.popular ? ACCENT+'50' : 'rgba(255,255,255,0.08)'}`,
              borderRadius:24, padding:28, position:'relative',
              boxShadow: plan.popular ? `0 0 60px ${ACCENT}20` : 'none',
            }}>
              {plan.popular && (
                <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:ACCENT, color:'#fff', fontSize:11, fontWeight:700, padding:'4px 16px', borderRadius:20, whiteSpace:'nowrap' }}>
                  Most popular
                </div>
              )}
              <div style={{ fontSize:15, fontWeight:700, color:'rgba(241,245,249,0.7)', marginBottom:8 }}>{plan.name}</div>
              <div style={{ fontSize:38, fontWeight:800, color:'#111827', lineHeight:1 }}>
                {plan.price}<span style={{ fontSize:14, fontWeight:400, color:'#9ca3af' }}>{plan.period}</span>
              </div>
              <div style={{ height:1, background:'white', margin:'20px 0' }}/>
              <ul style={{ listStyle:'none', marginBottom:24 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'rgba(55,65,81,0.65)', marginBottom:10 }}>
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0"/> {f}
                  </li>
                ))}
              </ul>
              <a href="/checkout" style={{ display:'block', padding:'12px 0', textAlign:'center', borderRadius:14, background:plan.popular ? ACCENT : 'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:600, textDecoration:'none', border:`0.5px solid ${plan.popular ? ACCENT : 'rgba(255,255,255,0.12)'}`, boxShadow:plan.popular ? `0 0 20px ${ACCENT}44` : 'none', transition:'all 0.2s' }}>
                Get {plan.name}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign:'center', padding:'40px 24px', borderTop:'0.5px solid rgba(255,255,255,0.06)', color:'rgba(55,65,81,0.25)', fontSize:13 }}>
        <div style={{ display:'flex', justifyContent:'center', gap:6, alignItems:'center', marginBottom:12 }}>
          <Hash className="h-4 w-4" style={{ color:ACCENT }}/>
          <span style={{ fontWeight:800, color:ACCENT }}>jobinlink</span>
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:24, marginBottom:16, flexWrap:'wrap' }}>
          {['Privacy','Terms','Security','Contact','/ads'].map(l => (
            <a key={l} href={`/${l.toLowerCase()}`} style={{ color:'inherit', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
        <p>© 2026 JobinLink. Powered by Polygon. No free plans — quality over quantity.</p>
      </footer>

      <style>{`
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
    </div>
  );
}
