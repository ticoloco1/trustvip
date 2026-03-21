'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Hash, Mail, AlertCircle } from 'lucide-react';

function AuthForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const error = params.get('error');

  const handleGoogle = async()=>{
    await supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo:`${location.origin}/auth/callback?next=/dashboard` }});
  };
  const handleMagic = async()=>{
    if(!email.trim()) return;
    setLoading(true);
    await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo:`${location.origin}/auth/callback?next=/dashboard` }});
    setLoading(false); setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
              <Hash className="w-6 h-6 text-white"/>
            </div>
            <span className="text-2xl font-black text-white">HASHPO</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Sign in</h1>
          <p className="text-white/60">No password needed</p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0"/>
              <p className="text-red-300 text-sm">Invalid or expired link. Please try again.</p>
            </div>
          )}

          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-400"/>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-white/60 text-sm">Magic link sent to <strong className="text-white">{email}</strong></p>
              <button onClick={()=>{setSent(false);setEmail('');}} className="mt-4 text-purple-400 text-sm hover:text-purple-300">Use a different email</button>
            </div>
          ) : (
            <>
              <button onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-3 rounded-xl mb-4 hover:bg-gray-100 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/20"/>
                <span className="text-white/40 text-xs">or email</span>
                <div className="flex-1 h-px bg-white/20"/>
              </div>

              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleMagic()}
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 mb-3 outline-none focus:border-purple-400 transition-colors"/>
              <button onClick={handleMagic} disabled={loading||!email.trim()}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Mail className="w-4 h-4"/>}
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
              <p className="text-center text-white/40 text-xs mt-3">No account? Created automatically on first sign in.</p>
            </>
          )}
        </div>
        <p className="text-center mt-4"><Link href="/" className="text-white/40 text-sm hover:text-white/60">← Back to home</Link></p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return <Suspense fallback={<div className="min-h-screen bg-slate-900"/>}><AuthForm/></Suspense>;
}
