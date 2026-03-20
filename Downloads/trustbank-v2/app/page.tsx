'use client';
import { ArrowRight, Shield, Star, Lock, Hash, Zap, Check, Award, BadgeCheck } from 'lucide-react';

const TICKER_SLUGS = [
  { s:'lawyer', p:'$30,000', hot:true }, { s:'doctor', p:'$25,000', hot:true },
  { s:'ceo', p:'$18,000', hot:true }, { s:'attorney', p:'$15,000', hot:false },
  { s:'physician', p:'$20,000', hot:false }, { s:'judge', p:'$22,000', hot:false },
  { s:'surgeon', p:'$28,000', hot:true }, { s:'partner', p:'$12,000', hot:false },
  { s:'founder', p:'$8,000', hot:false }, { s:'director', p:'$5,000', hot:false },
  { s:'professor', p:'$4,400', hot:false }, { s:'consultant', p:'$3,200', hot:false },
  { s:'advisor', p:'$2,900', hot:false }, { s:'analyst', p:'$1,500', hot:false },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif font-bold text-gray-900 text-lg">TrustBank</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="/directory" className="hover:text-gray-900 transition-colors">Directory</a>
            <a href="/slugs" className="hover:text-gray-900 transition-colors">Slugs</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-gray-500 hover:text-gray-900 px-3">Sign in</a>
            <a href="/signup" className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-all">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Slug Ticker */}
      <div className="bg-gray-900 overflow-hidden">
        <div className="flex items-center py-2.5">
          <div className="flex-shrink-0 px-4 text-[10px] font-bold text-yellow-400 uppercase tracking-widest border-r border-gray-700 mr-4 whitespace-nowrap">
            🔥 Premium Slugs
          </div>
          <div className="flex gap-6 animate-ticker whitespace-nowrap">
            {[...TICKER_SLUGS, ...TICKER_SLUGS].map((s, i) => (
              <a key={i} href="/slugs" className="flex items-center gap-2 group">
                <span className="font-mono text-xs font-bold text-yellow-400 group-hover:text-yellow-300">trustbank.xyz/{s.s}</span>
                <span className="text-xs font-semibold text-white">{s.p}</span>
                {s.hot && <span className="text-[10px]">🔥</span>}
                <span className="text-gray-600 mx-1">·</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-medium text-yellow-800 mb-8">
          <Shield className="h-3.5 w-3.5" /> Premium professional identity platform
        </div>
        <h1 className="text-5xl sm:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6">
          Your name.<br />
          <span className="gold-text">Your authority.</span><br />
          Your link.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Premium mini-sites for lawyers, doctors, executives and high-value professionals.
          <span className="text-gray-900 font-semibold"> trustbank.xyz/lawyer</span> — be found first.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <a href="/signup" className="flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-all">
            Create your profile <ArrowRight className="h-5 w-5" />
          </a>
          <a href="/slugs" className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-base font-medium text-gray-600 hover:border-yellow-400 hover:text-yellow-700 transition-all">
            <Hash className="h-5 w-5" /> Browse premium slugs
          </a>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {[
            { label:'Verified professionals', value:'2,400+' },
            { label:'Countries', value:'48' },
            { label:'Slug marketplace value', value:'$2.1M' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">Everything you need to be found first</h2>
            <p className="text-gray-500">40 templates · 10 pages · paywall · CV lock · video · classifieds · slugs</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon:Hash, title:'Premium slug', desc:'trustbank.xyz/lawyer — own your category. Sell it. Auction it. Worth $30,000+.', color:'bg-yellow-50 text-yellow-700' },
              { icon:BadgeCheck, title:'Blue & Gold badge', desc:'Identity verification for individuals. Business verification for companies.', color:'bg-blue-50 text-blue-700' },
              { icon:Lock, title:'CV contact lock', desc:'Experience and education visible. Contact locked — companies pay $20 to unlock. You get $10.', color:'bg-green-50 text-green-700' },
              { icon:Zap, title:'Video paywall', desc:'Embed YouTube videos. Set your price. Minimum 24h access. 80% goes to you.', color:'bg-purple-50 text-purple-700' },
              { icon:Star, title:'40 templates', desc:'Clean white, gold premium, dark, colorful, retro, professional. 1, 2 or 3 columns.', color:'bg-orange-50 text-orange-700' },
              { icon:Shield, title:'Polygon payments', desc:'All payments in USDC. Direct to your wallet. Zero middleman. Instant settlement.', color:'bg-indigo-50 text-indigo-700' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-yellow-200 transition-all">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slug showcase */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">Own your category</h2>
          <p className="text-gray-500 mb-12">Premium slugs — one word, infinite authority</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { slug:'lawyer', price:'$30,000', category:'Legal' },
              { slug:'doctor', price:'$25,000', category:'Health' },
              { slug:'ceo', price:'$18,000', category:'Business' },
              { slug:'surgeon', price:'$28,000', category:'Medical' },
              { slug:'judge', price:'$22,000', category:'Legal' },
              { slug:'partner', price:'$12,000', category:'Business' },
              { slug:'physician', price:'$20,000', category:'Medical' },
              { slug:'founder', price:'$8,000', category:'Business' },
            ].map(s => (
              <div key={s.slug} className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-yellow-300 hover:shadow-sm transition-all group cursor-pointer">
                <p className="text-[10px] text-gray-400 mb-1">{s.category}</p>
                <p className="font-mono font-bold text-gray-900 text-sm group-hover:text-yellow-700 transition-colors">/{s.slug}</p>
                <p className="text-xs font-semibold text-yellow-700 mt-1">{s.price}</p>
              </div>
            ))}
          </div>
          <a href="/slugs" className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            View all slugs <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">Simple pricing</h2>
          <p className="text-gray-500 mb-12">Pay in USDC · Cancel anytime</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name:'Starter', price:'$15.90', period:'/mo', features:['3 pages','All 40 templates','Feed 7 days','Paywall','Analytics'], btn:'bg-gray-900 text-white hover:bg-gray-800' },
              { name:'Professional', price:'$29.90', period:'/mo', features:['10 pages','AI Resume','Video paywall','CV lock','Slug auctions','Priority support'], btn:'bg-yellow-500 text-white hover:bg-yellow-600', popular:true },
              { name:'Elite', price:'$59.90', period:'/mo', features:['Everything','Custom domain','White label','API access','Dedicated support'], btn:'bg-gray-900 text-white hover:bg-gray-800' },
            ].map(plan => (
              <div key={plan.name} className={`relative rounded-2xl bg-white border p-6 text-left ${(plan as any).popular ? 'border-yellow-400 shadow-lg shadow-yellow-100' : 'border-gray-100'}`}>
                {(plan as any).popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-500 px-3 py-1 text-[11px] font-bold text-white">Most popular</div>
                )}
                <p className="font-bold text-gray-900 mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</p>
                <p className="text-xs text-gray-400 mb-5">{plan.period}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <a href="/signup" className={`block w-full rounded-xl py-2.5 text-sm font-semibold text-center transition-all ${plan.btn}`}>
                  Get {plan.name}
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">TrustBank Elite starts at $59.90/mo — most expensive because status demands it.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
              <Shield className="h-3 w-3 text-white" />
            </div>
            <span className="font-serif font-bold text-gray-900">TrustBank</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            {['Privacy', 'Terms', 'Security', 'Contact'].map(l => (
              <a key={l} href="#" className="hover:text-gray-600 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-gray-400">© 2026 TrustBank. Powered by Polygon.</p>
        </div>
      </footer>
    </div>
  );
}
