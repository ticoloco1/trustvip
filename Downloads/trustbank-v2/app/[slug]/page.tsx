import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TrustMiniSite from '@/components/minisite/TrustMiniSite';

// In production: fetch from Supabase
async function getProfile(slug: string) {
  // Skip reserved routes
  const reserved = ['dashboard','login','signup','directory','slugs','admin','api'];
  if (reserved.includes(slug)) return null;

  // Mock data — in production: query Supabase
  const mock: Record<string, any> = {
    'lawyer': {
      slug:'lawyer', name:'James R. Porter', title:'Corporate & IP Attorney',
      bio:'Specialized in corporate law, intellectual property and blockchain legal frameworks. 15+ years across US, UK and EU jurisdictions. Harvard Law, 2009.',
      location:'New York, NY', skills:['Corporate Law','IP Law','Blockchain','M&A','Litigation','International'],
      user_type:'seeker', badge:'gold', is_published:true,
      contact_email:'james@porter.law', contact_linkedin:'linkedin.com/in/jrporter',
      paywall_enabled:false,
      template_id:'trustbank-gold',
      stickers:['verified','lawyer'],
      cv:[
        { id:'c1', type:'experience', title:'Senior Partner', company:'Porter & Associates LLP', period:'2015–Present', description:'Led 200+ corporate transactions across 3 continents. Specializing in blockchain law.', current:true },
        { id:'c2', type:'experience', title:'Associate', company:'Sullivan & Cromwell LLP', period:'2010–2015' },
        { id:'c3', type:'education', title:'JD, Law', company:'Harvard Law School', period:'2007–2010' },
        { id:'c4', type:'education', title:'BA Economics', company:'Princeton University', period:'2003–2007' },
      ],
      feed_posts:[
        { id:'f1', text:'Just closed a landmark blockchain IP case — precedent-setting for digital asset ownership in the US. Details next week.', images:[], created_at:new Date().toISOString(), expires_at:new Date(Date.now()+6*864e5).toISOString(), likes:48 },
        { id:'f2', text:'Speaking at LegalTech NYC on smart contract enforceability. DM if you want to connect at the event.', images:[], created_at:new Date().toISOString(), expires_at:new Date(Date.now()+4*864e5).toISOString(), likes:32 },
      ],
      site_customization:{ pages:[{ id:'p1', title:'About', slug:'about', icon:'⚖️', modules:['feed','bio','cv','contact','social'], layout:1 }] },
    },
  };
  return mock[slug] || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProfile(params.slug);
  if (!p) return { title: 'TrustBank' };
  const isLawyer = p.title?.toLowerCase().includes('attorney') || p.title?.toLowerCase().includes('lawyer');
  const title = `${p.name} — ${p.title} | TrustBank`;
  const desc = `${p.bio?.slice(0,155) || `${p.name} on TrustBank`}`;
  const url = `https://trustbank.xyz/${p.slug}`;
  return {
    title, description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, siteName:'TrustBank', type:'profile' },
    twitter: { card:'summary_large_image', title, description: desc },
    ...(isLawyer && { other: { 'og:type':'profile', 'profile:username': p.slug } }),
  };
}

function JsonLd({ p }: { p: any }) {
  const isLawyer = p.title?.toLowerCase().includes('attorney') || p.title?.toLowerCase().includes('lawyer');
  const isDoctor = p.title?.toLowerCase().includes('doctor') || p.title?.toLowerCase().includes('physician') || p.title?.toLowerCase().includes('surgeon');
  const schema: any = {
    '@context':'https://schema.org',
    '@type': isLawyer ? 'Attorney' : isDoctor ? 'Physician' : p.user_type==='company' ? 'Organization' : 'Person',
    '@id':`https://trustbank.xyz/${p.slug}`,
    name: p.name, jobTitle: p.title, description: p.bio,
    url: `https://trustbank.xyz/${p.slug}`,
    ...(p.location && { address:{ '@type':'PostalAddress', addressLocality:p.location } }),
    ...(p.skills?.length && { knowsAbout: p.skills }),
    ...(p.contact_linkedin && { sameAs:[`https://${p.contact_linkedin}`] }),
    ...(isLawyer && { areaServed: p.location, hasCredential:{ '@type':'EducationalOccupationalCredential', credentialCategory:'Attorney at Law' } }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  const profile = await getProfile(params.slug);
  if (!profile) notFound();
  return (
    <>
      <JsonLd p={profile} />
      <TrustMiniSite profile={profile} />
    </>
  );
}
