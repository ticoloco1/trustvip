import { Suspense } from 'react';
import ClassificadosClient from './ClassificadosClient';
export const metadata = { title:'Classificados | JobinLink' };
export default function Page() {
  return <Suspense fallback={<div style={{minHeight:'100vh',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',color:'#8b5cf6'}}>Carregando...</div>}><ClassificadosClient/></Suspense>;
}
