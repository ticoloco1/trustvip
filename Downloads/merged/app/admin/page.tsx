import { Suspense } from 'react';
import AdminClient from './AdminClient';
export const metadata = { title:'Admin | JobinLink', robots:'noindex,nofollow' };
export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',color:'#8b5cf6',fontSize:14}}>Carregando painel...</div>}>
      <AdminClient/>
    </Suspense>
  );
}
