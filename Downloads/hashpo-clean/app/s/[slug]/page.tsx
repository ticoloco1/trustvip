import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import MiniSiteView from "@/components/minisite/MiniSiteView";

interface Props { params: { slug: string } }

async function getSite(slug: string) {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await sb.from("mini_sites").select("*, mini_site_links(*), mini_site_videos(*)").eq("slug", slug.replace(/^@/,"")).eq("published",true).maybeSingle();
    return data;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite(params.slug);
  if (!site) return { title: "HASHPO" };
  const slug = params.slug.replace(/^@/,"");
  return {
    title: site.site_name,
    description: site.bio || site.cv_headline || `${site.site_name}'s professional mini-site`,
    alternates: { canonical: `https://hashpo.com/@${slug}` },
    openGraph: {
      type: "profile", title: site.site_name,
      description: site.bio || "",
      url: `https://hashpo.com/@${slug}`,
      images: site.avatar_url ? [{ url: site.avatar_url }] : [],
    },
  };
}

export default async function MiniSitePage({ params }: Props) {
  const slug = params.slug.replace(/^@/,"");
  const site = await getSite(slug);
  const jsonLd = site ? {
    "@context":"https://schema.org","@type":"Person",
    "name":site.site_name,"description":site.bio||"",
    "image":site.avatar_url||"","url":`https://hashpo.com/@${slug}`,
  } : null;
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>}
      <MiniSiteView slug={slug} />
    </>
  );
}
