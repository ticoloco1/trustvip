'use client';
import { useState } from 'react';
import { Shield, Check, Lock, CreditCard, Loader2, X, ArrowRight, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price_monthly: 15.90,
    price_yearly: 149.00,
    features: [
      '3 pages on your mini-site',
      'All 40 templates',
      'Feed 7 days',
      'CV contact lock',
      'Analytics',
    ],
    color: '#1e3a8a',
  },
  {
    id: 'professional',
    name: 'Professional',
    price_monthly: 29.90,
    price_yearly: 299.00,
    popular: true,
    features: [
      '10 pages',
      'Video paywall',
      'Mini-site paywall (OnlyFans)',
      'AI Resume generator',
      'Slug auctions',
      'Priority support',
    ],
    color: '#c9a84c',
  },
  {
    id: 'elite',
    name: 'Elite',
    price_monthly: 59.90,
    price_yearly: 599.00,
    features: [
      'Everything in Professional',
      'Custom domain',
      'White label',
      'API access',
      'Dedicated manager',
    ],
    color: '#111111',
  },
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(PLANS[1]);
  const [interval, setInterval] = useState<'monthly'|'yearly'>('monthly');
  const [payMethod, setPayMethod] = useState<'stripe'|'usdc'>('stripe');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const price = interval === 'monthly' ? plan.price_monthly : plan.price_yearly;
  const savings = Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100);

  const handlePay = async () => {
    if (!user) { window.location.href = '/login'; return; }
    setLoading(true); setError('');

    try {
      if (payMethod === 'stripe') {
        // Create Stripe checkout session
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: plan.id, interval, price,
            user_id: user.id, platform: 'trustbank'
          })
        });
        const { url } = await res.json();
        if (url) window.location.href = url;
      } else {
        // USDC payment via Polygon
        // In production: connect MetaMask, send USDC to platform wallet
        await new Promise(r => setTimeout(r, 2000));

        // Update subscription in Supabase
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + (interval === 'yearly' ? 12 : 1));

        await supabase.from('subscriptions').upsert({
          user_id: user.id,
          plan: plan.id,
          interval,
          price_usdc: price,
          platform: 'trustbank',
          status: 'active',
          active_until: expiresAt.toISOString(),
        });

        await supabase.from('profiles').update({
          subscription_status: 'active',
          subscription_expires_at: expiresAt.toISOString(),
          minisite_plan: plan.id,
          is_published: true,
        }).eq('user_id', user.id);

        setSuccess(true);
        setTimeout(() => window.location.href = '/dashboard', 2500);
      }
    } catch (e: any) {
      setError(e.message || 'Payment failed. Try again.');
    }
    setLoading(false);
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center animate-fade-up">
        <div className="h-20 w-20 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto mb-4">
          <Check className="h-10 w-10 text-green-500"/>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your mini-site is live!</h1>
        <p className="text-gray-500">Redirecting to dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 flex h-14 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-white"/>
            </div>
            <span className="font-serif font-bold text-gray-900">TrustBank</span>
          </a>
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-gray-400"/>
            <span className="text-xs text-gray-400">Secure checkout</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose your plan</h1>
          <p className="text-gray-500">Your mini-site goes live immediately after payment</p>
        </div>

        {/* Interval toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {(['monthly','yearly'] as const).map(i => (
            <button key={i} onClick={() => setInterval(i)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                interval===i ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-500 hover:text-gray-900'
              }`}>
              {i.charAt(0).toUpperCase()+i.slice(1)}
              {i==='yearly' && <span className="ml-2 text-xs text-yellow-600">Save {savings}%</span>}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {PLANS.map(p => (
            <button key={p.id} onClick={() => setPlan(p)}
              className={`relative text-left rounded-2xl border p-5 transition-all ${
                plan.id===p.id ? 'shadow-lg' : 'hover:border-gray-300'
              }`}
              style={{ borderColor: plan.id===p.id ? p.color : '#e5e7eb', borderWidth: plan.id===p.id ? '2px' : '1px', background:'white' }}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-bold text-white"
                  style={{ background:p.color }}>Most popular</div>
              )}
              <p className="font-bold text-gray-900 mb-1">{p.name}</p>
              <p className="text-2xl font-black text-gray-900 mb-1">
                ${interval==='monthly' ? p.price_monthly : p.price_yearly}
                <span className="text-xs font-normal text-gray-400">/{interval==='monthly'?'mo':'yr'}</span>
              </p>
              {interval==='yearly' && (
                <p className="text-xs text-green-600 mb-3">Save {savings}% vs monthly</p>
              )}
              <ul className="space-y-1.5">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                    <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5"/>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.id===p.id && (
                <div className="absolute top-4 right-4 h-5 w-5 rounded-full flex items-center justify-center"
                  style={{ background:p.color }}>
                  <Check className="h-3 w-3 text-white"/>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Payment */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-semibold text-gray-900 mb-4">Pay with</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { id:'stripe', label:'Credit card', sub:'Visa · Mastercard · Amex', icon:'💳' },
                { id:'usdc', label:'USDC', sub:'Polygon wallet', icon:'🔷' },
              ].map(m => (
                <button key={m.id} onClick={() => setPayMethod(m.id as any)}
                  className="rounded-xl p-3 text-left transition-all border"
                  style={{ border:`1.5px solid ${payMethod===m.id ? plan.color : '#e5e7eb'}`, background:payMethod===m.id ? `${plan.color}08` : '#fafafa' }}>
                  <span className="text-xl block mb-1">{m.icon}</span>
                  <p className="text-xs font-semibold text-gray-900">{m.label}</p>
                  <p className="text-[10px] text-gray-400">{m.sub}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl mb-4 bg-gray-50 border border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-900">{plan.name} · {interval}</p>
                <p className="text-xs text-gray-400">TrustBank · Auto-renews</p>
              </div>
              <p className="text-xl font-black text-gray-900">${price}</p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600 mb-4">
                {error}
              </div>
            )}

            <button onClick={handlePay} disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-50 transition-all hover:opacity-90"
              style={{ background:plan.color }}>
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin"/>Processing...</>
                : <><Zap className="h-4 w-4"/>Activate for ${price}<ArrowRight className="h-4 w-4"/></>
              }
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Cancel anytime · Secure payment · Mini-site goes live instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
