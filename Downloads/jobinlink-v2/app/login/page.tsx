'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Hash, Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error(error.message); setLoading(false); return; }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
              <Hash className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">JobinLink</span>
          </a>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-[#71717a] mt-2">Sign in to your professional dashboard</p>
        </div>
        <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#a1a1aa]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full rounded-xl border border-[#27272a] bg-[#18181b] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                  placeholder="email@exemplo.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#a1a1aa]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full rounded-xl border border-[#27272a] bg-[#18181b] pl-9 pr-10 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa]">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-all">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Sign in</span><ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
          <p className="text-center text-xs text-[#71717a] mt-4">
            No account?{' '}
            <a href="/signup" className="text-violet-400 hover:text-violet-300 font-medium">Create free account</a>
          </p>
        </div>
      </div>
    </div>
  );
}
