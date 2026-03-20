import { Suspense } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
export const metadata = { title: 'Dashboard | JobinLink', robots: 'noindex' };
export default function Page() {
  return <Suspense fallback={null}><Dashboard /></Suspense>;
}
