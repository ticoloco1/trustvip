import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MiniSiteClient from '@/components/minisite/MiniSiteClient';
import { createClient } from '@supabase/supabase-js';

const RESERVED = ['dashboard','login','signup','directory','slugs','ads','admin','api'];

async function getProfile(username: string) {
  // Strip @ prefix — /@slug and /slug both work
  const clean = username.startsWith('@') ? username.slice(1) : username;
  if (RESERVED.includes(clean)) return null;
  username = clean;

  // Try Supabase
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: site } = await sb.from('mini_sites')
      .select('*').eq('slug', username).eq('published', true).maybeSingle();
    if (site) {
      const [{ data: videos }, { data: links }, { data: posts }] = await Promise.all([
        sb.from('mini_site_videos').select('*').eq('site_id', site.id).order('sort_order'),
        sb.from('mini_site_links').select('*').eq('site_id', site.id).order('sort_order'),
        sb.from('feed_posts').select('*').eq('profile_id', site.id)
          .gte('expires_at', new Date().toISOString()).order('created_at', { ascending:false }).limit(10),
      ]);
      return { ...site, videos:videos||[], links:links||[], feedPosts:posts||[] };
    }
  } catch {}

  // Demo fallback
  if (username === 'demo') {
    return {
      slug:'demo', site_name:'Alex Johnson', tagline:'Full-Stack Engineer & Web3 Builder',
      bio:'Building the future of the web, one commit at a time. 8+ years shipping products at scale. Open to consulting.',
      avatar_url:null, banner_url:null, badge:'blue', platform:'jobinlink',
      accent_color:'#8b5cf6', bg_style:'dark', columns:1, gradient:'cosmic',
      show_cv:true, contact_price:20, contact_lock:'paid',
      cv_headline:'Senior Full-Stack Engineer', cv_location:'San Francisco, CA',
      cv_skills:'React,Node.js,Solidity,TypeScript,AWS',
      feedPosts:[
        { id:'f1', text:'Just shipped a new feature that reduced our API latency by 40%. Crazy what a well-placed cache can do. 🚀', images:[], created_at:new Date().toISOString(), expires_at:new Date(Date.now()+5*864e5).toISOString(), pinned:true, likes:89 },
        { id:'f2', text:'Speaking at Web3 Summit next week on smart contract security. DM me for discount codes.', images:[], created_at:new Date(Date.now()-864e5).toISOString(), expires_at:new Date(Date.now()+4*864e5).toISOString(), pinned:false, likes:34 },
      ],
      videos:[
        { id:'v1', title:'Building a DEX in 60 minutes', description:'Live coding session — ERC20 swap from scratch', youtube_id:'dQw4w9WgXcQ', paywall_enabled:true, paywall_price:5, nft_enabled:false, sort_order:0 },
      ],
      links:[
        { id:'l1', title:'My Portfolio', url:'https://alex.dev', type:'link', locked:false, sort_order:0 },
        { id:'l2', title:'Premium Course — Web3 Security', url:'https://course.alex.dev', type:'link', locked:true, lockPrice:49, sort_order:1 },
      ],
      cv:{
        headline:'Senior Full-Stack Engineer',
        experiences:[
          { id:'e1', role:'Staff Engineer', company:'Protocol Labs', start:'2022', end:'', current:true, description:'Leading cross-chain bridging infrastructure. Team of 8.', lockLevel:'public' },
          { id:'e2', role:'Senior Engineer', company:'Stripe', start:'2019', end:'2022', current:false, description:'Payments API — processed $40B+ annually.', lockLevel:'public' },
          { id:'e3', role:'Engineer', company:'Airbnb', start:'2017', end:'2019', current:false, description:'Search infrastructure & ranking.', lockLevel:'paid' },
        ],
        education:[
          { id:'ed1', degree:'BS Computer Science', institution:'Stanford University', start:'2013', end:'2017', current:false, lockLevel:'public' },
        ],
        courses:[], languages:[], publications:[], awards:'',
        contact:{ email:'alex@example.com', phone:'+1 415 000 0000', whatsapp:'', linkedin:'linkedin.com/in/alex', address:'' },
        contactLock:'paid', contactPrice:20, cvGlobalLock:'public', cvGlobalPrice:0,
        skills:{ technical:'React, Node.js, Solidity, TypeScript, Rust', tools:'AWS, Vercel, Hardhat, Postgres', soft:'Leadership, Architecture, Mentoring' },
      },
    };
  }
  return null;
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const p = await getProfile(params.username);
  if (!p) return { title:'JobinLink' };
  const title = `${p.site_name} — ${p.tagline || p.cv?.headline || ''} | JobinLink`;
  const desc = p.bio?.slice(0,155) || `${p.site_name} on JobinLink`;
  const url = `https://jobinlink.com/${p.slug}`;
  return {
    title, description: desc,
    alternates: { canonical: url },
    openGraph: { title, description:desc, url, siteName:'JobinLink', type:'profile' },
    twitter: { card:'summary_large_image', title, description:desc },
  };
}

function JsonLd({ p }: { p: any }) {
  const schema = {
    '@context':'https://schema.org', '@type':'Person',
    '@id':`https://jobinlink.com/${p.slug}`,
    name:p.site_name, jobTitle:p.tagline||p.cv?.headline,
    description:p.bio, url:`https://jobinlink.com/${p.slug}`,
    ...(p.cv_location && { address:{ '@type':'PostalAddress', addressLocality:p.cv_location } }),
    ...(p.cv_skills && { knowsAbout:p.cv_skills.split(',').map((s:string)=>s.trim()) }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html:JSON.stringify(schema) }}/>;
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  if (!profile) notFound();
  return (
    <>
      <JsonLd p={profile}/>
      <MiniSiteClient profile={profile}/>
    </>
  );
}
