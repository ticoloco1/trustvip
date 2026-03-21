'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthCtx { user: User|null; loading: boolean; signOut: ()=>Promise<void>; }
const Ctx = createContext<AuthCtx>({ user:null, loading:true, signOut:async()=>{} });

export function AuthProvider({ children }:{ children:ReactNode }) {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ setUser(data.session?.user??null); setLoading(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,s)=>{ setUser(s?.user??null); setLoading(false); });
    return ()=>subscription.unsubscribe();
  },[]);
  return <Ctx.Provider value={{ user, loading, signOut:()=>supabase.auth.signOut() }}>{children}</Ctx.Provider>;
}
export const useAuth = ()=>useContext(Ctx);
