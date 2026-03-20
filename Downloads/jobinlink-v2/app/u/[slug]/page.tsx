import type { Metadata } from 'next';
import MiniSite from '@/components/minisite/MiniSite';

async function getProfile(slug: string) {
  // In production: fetch from Supabase
  // await supabase.from('profiles').select('*').eq('slug', slug).eq('is_published', true).single()
  const mock: Record<string, any> = {
    'lawyer': {
      slug:'lawyer', name:'James R. Porter', title:'Corporate & IP Attorney',
      bio:'Specialized in corporate law, intellectual property and blockchain legal frameworks. 15+ years across US, UK and EU.',
      location:'New York, NY', skills:['Corporate Law','IP Law','Blockchain','M&A','Litigation'],
      user_type:'seeker', badge:'gold', is_published:true,
      contact_email:'james@porter.law', contact_linkedin:'linkedin.com/in/jrporter',
      paywall_enabled:true, paywall_price:29.99, paywall_interval:'mo',
      pages:[{ id:'p1', title:'Home', modules:['bio','video','cv','links','contact','social'] }],
      template:{ colors:{ bg:'#05080f', card:'#0f1524', text:'#f0f4ff', muted:'#8892b0', accent:'#c9a84c', accentFg:'#05080f', border:'#1a2340' }, style:{ photoShape:'rounded', photoSize:'lg', headerAlign:'left', hasGlow:true, hasScanlines:false } },
      cv:[
        { id:'c1', type:'experience', title:'Senior Partner', company:'Porter & Associates LLP', period:'2015–Present', description:'Led 200+ corporate transactions' },
        { id:'c2', type:'experience', title:'Associate', company:'Sullivan & Cromwell', period:'2010–2015' },
        { id:'c3', type:'education', title:'JD, Law', company:'Harvard Law School', period:'2007–2010' },
      ],
    },
  };
  return mock[slug] || { slug, name: slug.replace(/-/g,' '), title:'Professional', bio:'', location:'', skills:[], user_type:'seeker', is_published:true, badge:null, pages:[{ id:'p1', title:'Home', modules:['bio','links','social','contact'] }] };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProfile(params.slug);
  const title = `${p.name} — ${p.title || 'Professional'} | JobinLink`;
  const desc = p.bio?.slice(0,160) || `${p.name} on JobinLink`;
  const url = `https://jobinlink.com/u/${p.slug}`;
  return {
    title, description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, siteName:'JobinLink', type:'profile' },
    twitter: { card:'summary_large_image', title, description: desc },
  };
}

function JsonLd({ p }: { p: any }) {
  const isLawyer = p.title?.toLowerCase().includes('attorney') || p.title?.toLowerCase().includes('lawyer');
  const isDoctor = p.title?.toLowerCase().includes('doctor') || p.title?.toLowerCase().includes('physician');
  const schema: any = {
    '@context':'https://schema.org',
    '@type': isLawyer ? 'Attorney' : isDoctor ? 'Physician' : p.user_type==='company' ? 'Organization' : 'Person',
    '@id':`https://jobinlink.com/u/${p.slug}`,
    name:p.name, jobTitle:p.title, description:p.bio,
    url:`https://jobinlink.com/u/${p.slug}`,
    ...(p.location && { address:{ '@type':'PostalAddress', addressLocality:p.location } }),
    ...(p.skills?.length && { knowsAbout:p.skills }),
    ...(p.contact_linkedin && { sameAs:[`https://${p.contact_linkedin}`] }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function UserProfilePage({ params }: { params: { slug: string } }) {
  const profile = await getProfile(params.slug);
  return (
    <>
      <JsonLd p={profile} />
      <MiniSite profile={profile} />
    </>
  );
}
