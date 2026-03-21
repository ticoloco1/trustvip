'use client';
import Link from 'next/link';
import Navbar from './Navbar';
import { Globe, Link2, Video, FileText, Lock, Zap, DollarSign, Image, ArrowRight, Star } from 'lucide-react';

const FEATURES = [
  { icon:Globe, title:"Custom Slug", desc:"Get your own hashpo.com/@yourname page." },
  { icon:Link2, title:"Social Links", desc:"All your profiles and portfolio in one place." },
  { icon:Video, title:"Paywall Videos", desc:"Set a price. Viewers pay to watch your content." },
  { icon:FileText, title:"Professional CV", desc:"Companies pay $20 to unlock your contact." },
  { icon:Image, title:"Photo Gallery", desc:"Showcase your work and visual portfolio." },
  { icon:Lock, title:"CV Paywall", desc:"Your CV stays locked. You earn 50% per unlock." },
  { icon:Zap, title:"Boost to Featured", desc:"Appear at the top of the directory." },
  { icon:DollarSign, title:"Earn Revenue", desc:"Monetize your presence from one page." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6" style={{ background:"linear-gradient(135deg,hsl(220 60% 14%),hsl(260 55% 25%),hsl(43 90% 25%))" }}>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full mb-6 text-sm font-bold text-white/90">
            <Star className="w-4 h-4 text-yellow-400"/> Your professional presence starts here
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-5 text-white">
            Create Your{' '}
            <span className="text-yellow-400">Mini Site</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Links, paywall videos, professional CV and photo gallery — all in one page.
            Companies pay to unlock your CV. You earn <strong className="text-white">50% of every unlock.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity" style={{ background:"hsl(43 90% 50%)", color:"hsl(220 60% 12%)" }}>
              Create Your Mini Site <ArrowRight className="w-5 h-5"/>
            </Link>
            <Link href="/directory" className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-colors">
              Browse Directory
            </Link>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background:"hsl(43 90% 50%)" }}/>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-10" style={{ background:"#a855f7" }}/>
      </section>

      {/* Stats */}
      <section className="py-10 bg-purple-50 border-y border-purple-100">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center px-6">
          {[['50%','CV unlock earnings'],['$12/yr','Slug registration'],['5%','Marketplace fee']].map(([v,l])=>(
            <div key={l}>
              <p className="text-3xl font-black text-purple-700">{v}</p>
              <p className="text-sm text-gray-600 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-3 text-gray-900">Everything in One Page</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">Your mini site is your digital business card, portfolio, and revenue engine.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f=>(
              <div key={f.title} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-purple-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-purple-600"/>
                </div>
                <h3 className="font-black text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background:"linear-gradient(135deg,#1e1b4b,#312e81)" }}>
        <h2 className="text-4xl font-black text-white mb-4">Ready to start earning?</h2>
        <p className="text-white/70 mb-8 text-lg">Create your mini site in 2 minutes. No credit card needed.</p>
        <Link href="/auth" className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-yellow-300 transition-colors">
          Get Started Free <ArrowRight className="w-5 h-5"/>
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6 px-6 text-center text-xs">
        <p>HASHPO is a tech platform. Content is creator responsibility. © 2026 HASHPO</p>
      </footer>
    </div>
  );
}
