import { Suspense } from 'react';
import SlugClient from './SlugClient';
export const metadata = { title:'Slug Marketplace | JobinLink', description:'Compre, venda e dê lances em slugs premium no JobinLink.' };
export default function SlugsPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',color:'#8b5cf6',fontSize:14}}>Carregando...</div>}>
      <SlugClient/>
    </Suspense>
  );
}
