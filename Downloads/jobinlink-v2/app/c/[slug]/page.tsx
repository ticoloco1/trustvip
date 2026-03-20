'use client';
import { useParams } from 'next/navigation';
import { Hash, MapPin, Building2 } from 'lucide-react';

export default function CompanyProfile() {
  const params = useParams();
  const slug = params?.slug as string;
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="h-48 bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-violet-900/60" />
      <div className="mx-auto max-w-3xl px-4 -mt-16 pb-16">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-[#09090b] mb-4">
          {slug?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <h1 className="text-2xl font-bold text-white">{slug?.replace(/-/g, ' ')}</h1>
        <div className="flex items-center gap-1.5 text-xs text-[#52525b] mt-2 mb-6">
          <Building2 className="h-3 w-3" /> Empresa • JobinLink
        </div>
        <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-6 text-center py-16">
          <p className="text-[#71717a] text-sm">Perfil da empresa em construção.</p>
        </div>
      </div>
    </div>
  );
}
