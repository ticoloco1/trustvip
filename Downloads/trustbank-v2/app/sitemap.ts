import { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://trustbank.xyz'; const now = new Date();
  return [
    { url:base, lastModified:now, changeFrequency:'daily', priority:1.0 },
    { url:`${base}/directory`, lastModified:now, changeFrequency:'hourly', priority:0.9 },
    { url:`${base}/slugs`, lastModified:now, changeFrequency:'hourly', priority:0.9 },
    { url:`${base}/lawyer`, lastModified:now, changeFrequency:'weekly', priority:0.95 },
    { url:`${base}/doctor`, lastModified:now, changeFrequency:'weekly', priority:0.95 },
    { url:`${base}/ceo`, lastModified:now, changeFrequency:'weekly', priority:0.9 },
  ];
}
