'use client';
import { useState, useEffect } from 'react';
import { Hash, Mail, Check, Wallet, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Suspense } from 'react';

const A = '#6d28d9';

function LoginForm() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(params?.get('error') || params?.get('message') || '');

  // If already logged in, redirect
  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const handleGoogle = async () => {
    setLoading(true); setError('');
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://jobinlink.com/auth/callback?next=/dashboard' }
    });
    if (e) { setError(e.message); setLoading(false); }
  };

  const handleMagic = async () => {
    if (!email.trim()) { setError('Digite seu email'); return; }
    setLoading(true); setError('');
    const { error: e } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://jobinlink.com/auth/callback?next=/dashboard' }
    });
    setLoading(false);
    if (e) setError(e.message);
    else setSent(true);
  };

  // Wallet connect via MetaMask — signs a message, creates/links account
  const handleWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask não detectado. Instale a extensão MetaMask para usar esta opção.');
      return;
    }
    setWalletLoading(true); setError('');
    try {
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const address = accounts[0]?.toLowerCase();
      if (!address) throw new Error('Nenhuma conta encontrada');

      // Sign message to prove ownership
      const message = `JobinLink login\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      }) as string;

      // Use wallet address as email (deterministic)
      const walletEmail = `${address}@wallet.jobinlink.com`;

      // Try magic link OTP with wallet email — creates account automatically
      const { error: e } = await supabase.auth.signInWithOtp({
        email: walletEmail,
        options: {
          emailRedirectTo: 'https://jobinlink.com/auth/callback?next=/dashboard',
          data: { wallet_address: address, wallet_signature: signature }
        }
      });

      if (e) throw e;

      // Store wallet info locally for UX
      localStorage.setItem('wallet_address', address);
      setSent(true);
      setEmail(walletEmail);
    } catch (e: any) {
      if (e.code === 4001) setError('Conexão cancelada pelo usuário.');
      else setError(e.message || 'Erro ao conectar carteira');
    }
    setWalletLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', display:'flex', alignItems:'center', justifyContent:'center', padding:16, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <div style={{ width:'100%', maxWidth:420 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:24 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:A, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Hash style={{ width:24, height:24, color:'white' }}/>
            </div>
            <span style={{ fontSize:24, fontWeight:800, color:A }}>jobinlink</span>
          </Link>
          <h1 style={{ fontSize:28, fontWeight:800, color:'#111827', marginBottom:6 }}>Entrar</h1>
          <p style={{ fontSize:15, color:'#6b7280' }}>Sem senha — escolha como entrar</p>
        </div>

        <div style={{ background:'white', borderRadius:20, border:'1px solid #e5e7eb', padding:28, boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>

          {/* Error */}
          {error && (
            <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'12px 14px', borderRadius:12, background:'#fef2f2', border:'1px solid #fca5a5', marginBottom:20 }}>
              <AlertCircle style={{ width:18, height:18, color:'#dc2626', flexShrink:0, marginTop:1 }}/>
              <p style={{ fontSize:14, color:'#dc2626', margin:0, lineHeight:1.4 }}>{error}</p>
            </div>
          )}

          {sent ? (
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div style={{ width:64, height:64, borderRadius:20, background:'#f0fdf4', border:'1px solid #86efac', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <Check style={{ width:32, height:32, color:'#16a34a' }}/>
              </div>
              <h2 style={{ fontSize:20, fontWeight:700, color:'#111827', marginBottom:8 }}>
                {email.includes('@wallet.') ? 'Carteira conectada!' : 'Verifique seu email'}
              </h2>
              <p style={{ fontSize:15, color:'#6b7280', marginBottom:6 }}>
                {email.includes('@wallet.') 
                  ? 'Enviamos um link de confirmação para finalizar a conexão da carteira.'
                  : <>Link enviado para <strong style={{ color:'#111827' }}>{email}</strong></>
                }
              </p>
              <p style={{ fontSize:14, color:'#9ca3af', marginBottom:20 }}>Verifique sua caixa de entrada e spam</p>
              <button onClick={()=>{ setSent(false); setEmail(''); setError(''); }}
                style={{ fontSize:14, color:A, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', textDecoration:'underline' }}>
                Usar outro email
              </button>
            </div>
          ) : (
            <>
              {/* Google */}
              <button onClick={handleGoogle} disabled={loading}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12, padding:'13px', borderRadius:14, border:'1.5px solid #e5e7eb', background:'white', color:'#374151', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit', marginBottom:12, transition:'all 0.15s' }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor='#d1d5db')}
                onMouseLeave={e=>(e.currentTarget.style.borderColor='#e5e7eb')}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </button>

              {/* Wallet */}
              <button onClick={handleWallet} disabled={walletLoading}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12, padding:'13px', borderRadius:14, border:'1.5px solid #e5e7eb', background:'#fafafa', color:'#374151', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit', marginBottom:20, transition:'all 0.15s', position:'relative' as const }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor='#f59e0b'; (e.currentTarget as HTMLElement).style.background='#fffbeb'; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor='#e5e7eb'; (e.currentTarget as HTMLElement).style.background='#fafafa'; }}>
                {walletLoading ? (
                  <div style={{ width:20, height:20, border:'2px solid #f59e0b', borderTop:'2px solid transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                ) : (
                  <span style={{ fontSize:20 }}>🦊</span>
                )}
                <span>{walletLoading ? 'Conectando carteira...' : 'Entrar com MetaMask'}</span>
                <span style={{ marginLeft:'auto', fontSize:11, padding:'2px 8px', borderRadius:20, background:'#fef3c7', color:'#92400e', fontWeight:700 }}>Web3</span>
              </button>

              {/* Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <div style={{ flex:1, height:1, background:'#f3f4f6' }}/>
                <span style={{ fontSize:13, color:'#9ca3af', fontWeight:500 }}>ou entre com email</span>
                <div style={{ flex:1, height:1, background:'#f3f4f6' }}/>
              </div>

              {/* Email */}
              <div style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:14, fontWeight:600, color:'#374151', marginBottom:8 }}>
                  Email — link mágico, sem senha
                </label>
                <div style={{ position:'relative' }}>
                  <Mail style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:18, height:18, color:'#9ca3af' }}/>
                  <input
                    type="email" value={email}
                    onChange={e=>setEmail(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&handleMagic()}
                    placeholder="seu@email.com"
                    style={{ width:'100%', padding:'13px 14px 13px 44px', borderRadius:12, border:'1.5px solid #e5e7eb', background:'white', fontSize:15, color:'#111827', outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const, transition:'border-color 0.2s' }}
                    onFocus={e=>e.target.style.borderColor=A}
                    onBlur={e=>e.target.style.borderColor='#e5e7eb'}
                  />
                </div>
              </div>

              <button onClick={handleMagic} disabled={loading||!email.trim()}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px', borderRadius:14, border:'none', background:loading||!email.trim()?'#e5e7eb':A, color:loading||!email.trim()?'#9ca3af':'white', fontSize:15, fontWeight:700, cursor:loading||!email.trim()?'default':'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
                {loading ? (
                  <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.4)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                ) : (
                  <Mail style={{ width:18, height:18 }}/>
                )}
                {loading ? 'Enviando...' : 'Enviar link mágico'}
              </button>

              <p style={{ textAlign:'center', fontSize:13, color:'#9ca3af', marginTop:14 }}>
                Sem conta? Criada automaticamente no primeiro login.
              </p>
            </>
          )}
        </div>

        {/* Footer links */}
        <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:24, fontSize:13, color:'#9ca3af' }}>
          <Link href="/" style={{ color:'#9ca3af', textDecoration:'none' }}>← Voltar</Link>
          <Link href="/dashboard" style={{ color:A, textDecoration:'none', fontWeight:600 }}>Dashboard →</Link>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:32,height:32,border:'3px solid #e5e7eb',borderTop:'3px solid #6d28d9',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/></div>}>
      <LoginForm/>
    </Suspense>
  );
}
