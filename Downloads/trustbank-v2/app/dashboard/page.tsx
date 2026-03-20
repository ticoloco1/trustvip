import { Suspense } from 'react';
import TrustDashboard from '@/components/dashboard/TrustDashboard';
export const metadata = { title:'Dashboard | TrustBank', robots:'noindex' };
export default function Page() {
  return <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"/></div>}><TrustDashboard /></Suspense>;
}
