import { ArrowRight, Hash, Star, Globe, Lock, Zap, Sparkles, Check } from 'lucide-react';
export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <nav className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
              <Hash className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">JobinLink</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Sign in</a>
            <a href="/signup" className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-all">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </nav>
      <section className="mx-auto max-w-4xl px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300 mb-8">
          <Sparkles className="h-3.5 w-3.5" /> New: AI-powered Resume + 50/50 Unlock Revenue
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
          Your professional<br />
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">identity</span><br />
          one link away
        </h1>
        <p className="text-lg text-[#71717a] max-w-2xl mx-auto mb-10 leading-relaxed">
          Professional mini-site with CV, portfolio, paywall, slugs, auctions, AI assistant and more.
          No tech skills required.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/signup" className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-8 py-4 text-base font-semibold text-white hover:bg-violet-500 transition-all">
            Get started free <ArrowRight className="h-5 w-5" />
          </a>
          <a href="/directory" className="flex items-center justify-center gap-2 rounded-2xl border border-[#27272a] bg-[#111113] px-8 py-4 text-base font-medium text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white transition-all">
            Browse directory
          </a>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: 'Up to 10 pages', desc: 'Rich editor with text, photos, videos and per-page paywall.', color: 'text-violet-400 bg-violet-500/10' },
            { icon: Lock, title: 'Paywall & Exclusive Content', desc: 'Charge for access to your content. Monthly subscription or per-access payment.', color: 'text-pink-400 bg-pink-500/10' },
            { icon: Sparkles, title: 'AI Resume (DeepSeek)', desc: 'AI builds your resume. Contact stays locked — companies pay 50% to unlock it.', color: 'text-amber-400 bg-amber-500/10' },
            { icon: Hash, title: 'Slugs & Marketplace', desc: 'Buy, sell and auction premium slugs with a real-time ticker.', color: 'text-blue-400 bg-blue-500/10' },
            { icon: Star, title: 'Content Auctions', desc: 'Auction exclusive articles to media outlets. Journalism monetized in a new way.', color: 'text-emerald-400 bg-emerald-500/10' },
            { icon: Zap, title: 'Analytics & Chat', desc: 'Real-time visit tracking, notifications and chat with visitors.', color: 'text-red-400 bg-red-500/10' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="rounded-2xl border border-[#27272a] bg-[#111113] p-6 hover:border-[#3f3f46] transition-all">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${color}`}><Icon className="h-5 w-5" /></div>
              <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
              <p className="text-xs text-[#71717a] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 pb-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Simple, transparent pricing</h2>
        <p className="text-[#71717a] mb-10">From $4.99/mo to $29.99/mo — no surprises.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name:'Starter', price:'4.99', color:'bg-emerald-600 hover:bg-emerald-500', border:'border-[#27272a]', features:['1 page','5 modules','Basic analytics'] },
            { name:'Pro', price:'14.99', color:'bg-violet-600 hover:bg-violet-500', border:'border-violet-500/50', popular:true, features:['5 pages','Paywall','AI assistant','Auctions'] },
            { name:'Elite', price:'29.99', color:'bg-amber-600 hover:bg-amber-500', border:'border-[#27272a]', features:['10 pages','AI Resume','Custom domain','VIP support'] },
          ].map(plan => (
            <div key={plan.name} className={`relative rounded-2xl border bg-[#111113] p-6 ${plan.border}`}>
              {(plan as any).popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold text-white">Most popular</div>}
              <p className="font-bold text-white mb-2">{plan.name}</p>
              <p className="text-3xl font-bold text-white mb-1">${plan.price}</p>
              <p className="text-xs text-[#52525b] mb-4">/month</p>
              <ul className="space-y-2 mb-6 text-left">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#a1a1aa]"><Check className="h-3.5 w-3.5 text-emerald-400" />{f}</li>
                ))}
              </ul>
              <a href="/signup" className={`block w-full rounded-xl py-2.5 text-sm font-semibold text-white text-center transition-all ${plan.color}`}>
                Get {plan.name}
              </a>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-[#27272a] py-8 text-center">
        <p className="text-xs text-[#52525b]">© 2026 JobinLink. All rights reserved.</p>
      </footer>
    </div>
  );
}
