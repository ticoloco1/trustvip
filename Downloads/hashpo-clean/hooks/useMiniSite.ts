'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function usePublicSite(slug: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    if(!slug) return;
    const clean = slug.replace(/^@/,'');
    supabase.from('mini_sites').select('*').eq('slug',clean).eq('published',true).maybeSingle()
      .then(({data})=>{ setData(data); setLoading(false); });
  },[slug]);
  return { data, loading };
}

export function useMySite(user: User|null) {
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async()=>{
    if(!user){ setLoading(false); return; }
    const {data,error} = await supabase.from('mini_sites').select('*').eq('user_id',user.id).maybeSingle();
    if(!data && !error){
      const slug = user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g,'')||`user${Date.now()}`;
      const {data:newSite} = await supabase.from('mini_sites')
        .insert({user_id:user.id,slug,site_name:user.user_metadata?.name||slug,platform:'hashpo',published:false})
        .select().single();
      setSite(newSite);
    } else { setSite(data); }
    setLoading(false);
  },[user]);

  useEffect(()=>{ fetch(); },[fetch]);

  const update = async(updates:any)=>{
    if(!site) return;
    const {data} = await supabase.from('mini_sites').update({...updates,updated_at:new Date().toISOString()}).eq('id',site.id).select().single();
    if(data) setSite(data);
  };

  const uploadPhoto = async(file:File, type:'avatar'|'banner')=>{
    if(!site) return null;
    try {
      const ext = file.name.split('.').pop()||'jpg';
      const path = `${site.user_id}/${type}_${Date.now()}.${ext}`;
      const bucket = type==='avatar'?'avatars':'banners';
      const {error} = await supabase.storage.from(bucket).upload(path,file,{upsert:true,contentType:file.type});
      if(!error){
        const {data:{publicUrl}} = supabase.storage.from(bucket).getPublicUrl(path);
        await update(type==='avatar'?{avatar_url:publicUrl}:{banner_url:publicUrl});
        return publicUrl;
      }
    } catch {}
    // Fallback: base64
    try {
      const reader = new FileReader();
      const b64 = await new Promise<string>(r=>{ reader.onload=()=>r(reader.result as string); reader.readAsDataURL(file); });
      const img = new Image();
      await new Promise<void>(r=>{ img.onload=()=>r(); img.src=b64; });
      const maxW = type==='avatar'?400:1200;
      const scale = Math.min(1,maxW/img.width);
      const canvas = document.createElement('canvas');
      canvas.width=img.width*scale; canvas.height=img.height*scale;
      canvas.getContext('2d')?.drawImage(img,0,0,canvas.width,canvas.height);
      const compressed = canvas.toDataURL('image/jpeg',0.8);
      await update(type==='avatar'?{avatar_url:compressed}:{banner_url:compressed});
      return compressed;
    } catch { return null; }
  };

  return { site, loading, update, uploadPhoto, refetch:fetch };
}

export function useSiteLinks(siteId:string|undefined) {
  const [links, setLinks] = useState<any[]>([]);
  useEffect(()=>{
    if(!siteId) return;
    supabase.from('mini_site_links').select('*').eq('site_id',siteId).order('sort_order').then(({data})=>setLinks(data||[]));
  },[siteId]);
  const add = async(link:any)=>{
    const {data} = await supabase.from('mini_site_links').insert({...link,site_id:siteId,sort_order:links.length}).select().single();
    if(data) setLinks(p=>[...p,data]);
  };
  const del = async(id:string)=>{
    await supabase.from('mini_site_links').delete().eq('id',id);
    setLinks(p=>p.filter(l=>l.id!==id));
  };
  return { links, addLink:add, deleteLink:del };
}

export function useSiteVideos(siteId:string|undefined) {
  const [videos, setVideos] = useState<any[]>([]);
  useEffect(()=>{
    if(!siteId) return;
    supabase.from('mini_site_videos').select('*').eq('site_id',siteId).order('sort_order').then(({data})=>setVideos(data||[]));
  },[siteId]);
  const add = async(v:any)=>{
    const {data} = await supabase.from('mini_site_videos').insert({...v,site_id:siteId}).select().single();
    if(data) setVideos(p=>[...p,data]);
  };
  const del = async(id:string)=>{
    await supabase.from('mini_site_videos').delete().eq('id',id);
    setVideos(p=>p.filter(v=>v.id!==id));
  };
  return { videos, addVideo:add, deleteVideo:del };
}

export function useFeedPosts(siteId:string|undefined) {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(()=>{
    if(!siteId) return;
    supabase.from('feed_posts').select('*').eq('profile_id',siteId).order('created_at',{ascending:false}).limit(20).then(({data})=>setPosts(data||[]));
  },[siteId]);
  const add = async(post:any)=>{
    const {data} = await supabase.from('feed_posts').insert({...post,profile_id:siteId}).select().single();
    if(data) setPosts(p=>[data,...p]);
  };
  return { posts, addPost:add };
}
