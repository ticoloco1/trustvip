import { MetadataRoute } from 'next';

// In production this would query Supabase for all published profiles and content
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://jobinlink.com';
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/directory`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/directory-cv`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/directory-journalism`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/directory-photography`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/directory-video`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/directory-companies`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/directory-articles`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/directory-classified`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/jobs`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${base}/slugs`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
  ];

  // Dynamic profile pages — in production query Supabase:
  // const profiles = await supabase.from('profiles').select('slug,user_type,updated_at').eq('is_published',true)
  const mockProfiles = [
    { slug: 'sarah-chen', type: 'seeker', updated: '2025-03-01' },
    { slug: 'techcorp', type: 'company', updated: '2025-03-10' },
    { slug: 'legalpro', type: 'company', updated: '2025-03-15' },
    { slug: 'lawyer', type: 'seeker', updated: '2025-03-19' },
  ];

  const profilePages: MetadataRoute.Sitemap = mockProfiles.map(p => ({
    url: `${base}/${p.type === 'company' ? 'c' : 'u'}/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...profilePages];
}
