export const ACCENT = "#a855f7";
export const THEMES: Record<string,any> = {
  dark:              { bg:"bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900", text:"text-white", sub:"text-white/60", card:"bg-white/10 border-white/10" },
  midnight:          { bg:"bg-gray-950", text:"text-white", sub:"text-white/60", card:"bg-white/8 border-white/10" },
  white:             { bg:"bg-white", text:"text-gray-900", sub:"text-gray-500", card:"bg-gray-50 border-gray-200" },
  beige:             { bg:"bg-amber-50", text:"text-amber-900", sub:"text-amber-700", card:"bg-amber-100/50 border-amber-200" },
  "pastel-blue":     { bg:"bg-sky-50", text:"text-sky-900", sub:"text-sky-600", card:"bg-sky-100/50 border-sky-200" },
  "pastel-pink":     { bg:"bg-pink-50", text:"text-pink-900", sub:"text-pink-600", card:"bg-pink-100/50 border-pink-200" },
  "pastel-lavender": { bg:"bg-violet-50", text:"text-violet-900", sub:"text-violet-600", card:"bg-violet-100/50 border-violet-200" },
  "light-gray":      { bg:"bg-gray-100", text:"text-gray-800", sub:"text-gray-500", card:"bg-white border-gray-200" },
};
export const GRADIENTS: Record<string,string> = {
  cosmic:"linear-gradient(135deg,#4c1d95,#7c3aed)",
  ocean:"linear-gradient(135deg,#0c4a6e,#06b6d4)",
  forest:"linear-gradient(135deg,#14532d,#10b981)",
  sunset:"linear-gradient(135deg,#7c2d12,#f59e0b)",
  midnight:"linear-gradient(135deg,#0f172a,#334155)",
  rose:"linear-gradient(135deg,#831843,#f43f5e)",
};
export function normalizeSlug(v:string){return v.toLowerCase().replace(/[^a-z0-9-]/g,"").slice(0,40);}
export const SLUG_PRICES:Record<number,number>={1:2000,2:1500,3:1000,4:500,5:250,6:100};
export function slugPrice(s:string){return SLUG_PRICES[Math.min(s.length,6)]??50;}
