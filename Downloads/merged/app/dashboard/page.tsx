import { Suspense } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
export const metadata = { title:'Dashboard | JobinLink', robots:'noindex' };
export default function Page() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',color:'#8b5cf6',fontSize:14}}>Loading...</div>}>
      <Dashboard/>
    </Suspense>
  );
}
