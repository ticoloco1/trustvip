'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Hash, Mail, Lock, Loader2, User, ArrowRight } from 'lucide-react';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) { toast.error(error.message); setLoading(false); return; }
    toast.success('Account created! Check your email.');
    router.push('/dashboard');
  };

  const fields = [
    { label: 'Full name', icon: User, value: name, onChange: setName, type: 'text', placeholder: 'Your name' },
    { label: 'Email', icon: Mail, value: email, onChange: setEmail, type: 'email', placeholder: 'email@exemplo.com' },
    { label: 'Password', icon: Lock, value: password, onChange: setPassword, type: 'password', placeholder: '••••••••' },
  ];

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
          <h1 className="text-2xl font-bold text-white">Create free account</h1>
          <p className="text-sm text-[#71717a] mt-2">Your professional mini-site in minutes</p>
        </div>
        <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-6">
          <form onSubmit={handleSignup} className="space-y-4">
            {fields.map(({ label, icon: Icon, value, onChange, type, placeholder }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-sm font-medium text-[#a1a1aa]">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
                  <input type={type} value={value} onChange={e => onChange(e.target.value)} required
                    className="w-full rounded-xl border border-[#27272a] bg-[#18181b] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder={placeholder} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-all">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Create account</span><ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
          <p className="text-center text-xs text-[#71717a] mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
