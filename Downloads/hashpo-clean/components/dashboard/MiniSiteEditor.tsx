'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';

export default function MiniSiteEditor() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace('/auth');
  }, [user, loading, router]);
  // Redirect to dashboard profile section
  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);
  return <Dashboard/>;
}
