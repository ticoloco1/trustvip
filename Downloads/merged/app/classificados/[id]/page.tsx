import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ClassifiedDetailClient from './ClassifiedDetailClient';

async function getClassified(id: string) {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await sb.from('classified_listings').select('*').eq('id', id).eq('status','active').maybeSingle();
    return data;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params:{ id:string } }) {
  const c = await getClassified(params.id);
  return { title: c ? `${c.title} | JobinLink Classificados` : 'Classificado' };
}

export default async function Page({ params }: { params:{ id:string } }) {
  const classified = await getClassified(params.id);
  if (!classified) notFound();
  return <ClassifiedDetailClient classified={classified}/>;
}
