'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase, isConfigured } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────
export interface Profile {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  title?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  user_type: string;
  photo_url?: string;
  banner_url?: string;
  is_published: boolean;
  credits: number;
  wallet_address?: string;
  smart_wallet?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_linkedin?: string;
  contact_instagram?: string;
  contact_twitter?: string;
  contact_youtube?: string;
  paywall_enabled: boolean;
  paywall_mode: string;
  paywall_interval: string;
  paywall_price_cents: number;
  minisite_plan: string;
  site_customization: any;
  origin_platform: string;
  created_at: string;
}

export interface SlugItem {
  id: string;
  slug: string;
  status: string;
  price_usdc?: number;
  min_bid?: number;
  category?: string;
  active_on?: string[];
  created_at: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount_usdc: number;
  description?: string;
  tx_hash?: string;
  status: string;
  platform: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  target_id: string;
  plan: string;
  interval: string;
  price_usdc: number;
  active_until: string;
  platform: string;
}

// ─── useProfile ───────────────────────────────────────────────
export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user || !isConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist yet — create it
      const slug = user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') || `user${Date.now()}`;
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, slug, name: user.user_metadata?.name || slug, origin_platform: 'jobinlink' })
        .select()
        .single();
      setProfile(newProfile);
    } else if (error) {
      setError(error.message);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = async (updates: Partial<Profile>) => {
    if (!profile) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
      .select()
      .single();
    if (!error && data) setProfile(data);
    return { data, error };
  };

  const uploadPhoto = async (file: File, type: 'avatar' | 'banner' = 'avatar') => {
    if (!profile) return null;
    const ext = file.name.split('.').pop();
    const path = `${profile.id}/${type}.${ext}`;
    const bucket = type === 'avatar' ? 'avatars' : 'banners';
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (uploadError) return null;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
    const field = type === 'avatar' ? 'photo_url' : 'banner_url';
    await update({ [field]: publicUrl });
    return publicUrl;
  };

  return { profile, loading, error, update, uploadPhoto, refetch: fetch };
}

// ─── useSlugs ─────────────────────────────────────────────────
export function useSlugs(profileId: string | undefined) {
  const [slugs, setSlugs] = useState<SlugItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId || !isConfigured) { setLoading(false); return; }
    supabase
      .from('slugs')
      .select('*')
      .eq('owner_id', profileId)
      .then(({ data }) => { setSlugs(data || []); setLoading(false); });
  }, [profileId]);

  const updateSlug = async (id: string, updates: Partial<SlugItem>) => {
    const { data } = await supabase.from('slugs').update(updates).eq('id', id).select().single();
    if (data) setSlugs(prev => prev.map(s => s.id === id ? data : s));
  };

  return { slugs, loading, updateSlug };
}

// ─── useTransactions ──────────────────────────────────────────
export function useTransactions(profileId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId || !isConfigured) { setLoading(false); return; }
    supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', profileId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => { setTransactions(data || []); setLoading(false); });
  }, [profileId]);

  const totalIn = transactions.filter(t => t.type === 'in').reduce((s, t) => s + t.amount_usdc, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((s, t) => s + t.amount_usdc, 0);
  const balance = totalIn - totalOut;

  return { transactions, loading, totalIn, totalOut, balance };
}

// ─── useSubscription ──────────────────────────────────────────
export function useSubscription(profileId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId || !isConfigured) { setLoading(false); return; }
    supabase
      .from('subscriptions')
      .select('*')
      .eq('subscriber_id', profileId)
      .eq('platform', 'jobinlink')
      .gte('active_until', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => { setSubscription(data); setLoading(false); });
  }, [profileId]);

  return { subscription, loading };
}

// ─── useStats ─────────────────────────────────────────────────
export function useStats(profileId: string | undefined) {
  const [stats, setStats] = useState({ views: 0, unlocks: 0, slug_count: 0, revenue: 0 });

  useEffect(() => {
    if (!profileId || !isConfigured) return;
    // Slug count
    supabase.from('slugs').select('id', { count: 'exact' }).eq('owner_id', profileId)
      .then(({ count }) => setStats(s => ({ ...s, slug_count: count || 0 })));
    // Revenue from transactions
    supabase.from('wallet_transactions').select('amount_usdc').eq('user_id', profileId).eq('type', 'in')
      .then(({ data }) => {
        const rev = (data || []).reduce((s, t) => s + (t.amount_usdc || 0), 0);
        setStats(s => ({ ...s, revenue: rev }));
      });
    // Unlocks received
    supabase.from('unlocks').select('id', { count: 'exact' }).eq('target_id', profileId)
      .then(({ count }) => setStats(s => ({ ...s, unlocks: count || 0 })));
  }, [profileId]);

  return stats;
}
