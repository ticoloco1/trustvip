import { Suspense } from 'react';
import DirectoryClient from './DirectoryClient';
export const metadata = { title:'Diretório | JobinLink' };
export default function Page() {
  return <Suspense fallback={<div style={{minHeight:'100vh',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',color:'#8b5cf6'}}>Carregando...</div>}><DirectoryClient/></Suspense>;
}
