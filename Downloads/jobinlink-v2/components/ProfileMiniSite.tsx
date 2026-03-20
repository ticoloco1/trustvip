'use client';
import { BadgeCheck, Award, MapPin, Mail, Phone, Linkedin, Instagram, Twitter, Youtube, ExternalLink, Hash, Globe, Lock, Star } from 'lucide-react';

interface Profile {
  slug: string;
  name: string;
  title: string;
  bio?: string;
  location?: string;
  skills?: string[];
  user_type: string;
  photo_url?: string | null;
  banner_url?: string | null;
  badge?: 'blue' | 'gold' | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_linkedin?: string | null;
  contact_instagram?: string | null;
  contact_twitter?: string | null;
  contact_youtube?: string | null;
  paywall_enabled?: boolean;
  site_customization?: any;
}

export default function ProfileMiniSite({ profile }: { profile: Profile }) {
  const isCompany = profile.user_type === 'company';
  const hasPaywall = profile.paywall_enabled;

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Navbar */}
      <nav className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-4 flex h-12 items-center justify-between">
          <a href="/" className="flex items-center gap-1.5 text-xs text-[#52525b] hover:text-white transition-colors">
            <Hash className="h-3.5 w-3.5" /> JobinLink
          </a>
          <div className="flex items-center gap-2">
            <a href="/directory" className="text-xs text-[#52525b] hover:text-white transition-colors">Directory</a>
            <a href="/signup" className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500 transition-all">
              Create yours
            </a>
          </div>
        </div>
      </nav>

      {/* Banner */}
      <div className="h-40 sm:h-52 bg-gradient-to-r from-violet-900/60 via-indigo-900/40 to-pink-900/40 relative overflow-hidden">
        {profile.banner_url && (
          <img src={profile.banner_url} alt="banner" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        )}
      </div>

      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="-mt-16 mb-6">
          {/* Avatar */}
          <div className="mb-4">
            {profile.photo_url ? (
              <img src={profile.photo_url} alt={profile.name}
                className="h-24 w-24 rounded-3xl object-cover ring-4 ring-[#09090b] shadow-xl" />
            ) : (
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-[#09090b] shadow-xl">
                {profile.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                {profile.badge === 'blue' && (
                  <div title="Verified identity">
                    <BadgeCheck className="h-6 w-6 text-blue-400" />
                  </div>
                )}
                {profile.badge === 'gold' && (
                  <div title="Verified business">
                    <Award className="h-6 w-6 text-amber-400" />
                  </div>
                )}
              </div>
              <p className="text-[#71717a]">{profile.title}</p>
              {profile.location && (
                <div className="flex items-center gap-1.5 text-sm text-[#52525b] mt-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </div>
              )}
            </div>

            {/* Contact button */}
            {hasPaywall ? (
              <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-all flex-shrink-0">
                <Lock className="h-4 w-4" /> Subscribe to Contact
              </button>
            ) : (
              <a href={`mailto:${profile.contact_email || ''}`}
                className="flex items-center gap-2 rounded-xl border border-[#27272a] bg-[#111113] px-4 py-2.5 text-sm font-medium text-[#a1a1aa] hover:border-violet-500/40 hover:text-white transition-all flex-shrink-0">
                Contact
              </a>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-5 mb-4">
            <p className="text-sm text-[#a1a1aa] leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-5 mb-4">
            <p className="text-xs font-semibold text-[#52525b] uppercase tracking-wider mb-3">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(s => (
                <span key={s} className="rounded-xl border border-[#27272a] bg-[#18181b] px-3 py-1.5 text-sm text-[#a1a1aa]">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Social links */}
        {(profile.contact_linkedin || profile.contact_instagram || profile.contact_twitter || profile.contact_youtube) && (
          <div className="rounded-2xl border border-[#27272a] bg-[#111113] p-5 mb-4">
            <p className="text-xs font-semibold text-[#52525b] uppercase tracking-wider mb-3">Links</p>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'contact_linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400' },
                { key: 'contact_instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-400' },
                { key: 'contact_twitter', icon: Twitter, label: 'Twitter / X', color: 'text-[#a1a1aa]' },
                { key: 'contact_youtube', icon: Youtube, label: 'YouTube', color: 'text-red-400' },
              ].map(({ key, icon: Icon, label, color }) => {
                const val = (profile as any)[key];
                if (!val) return null;
                return (
                  <a key={key} href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 rounded-xl border border-[#27272a] bg-[#18181b] px-3 py-2 text-sm hover:border-violet-500/40 transition-all ${color}`}>
                    <Icon className="h-4 w-4" /> {label}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Paywall notice */}
        {hasPaywall && (
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 mb-4 text-center">
            <Lock className="h-8 w-8 text-violet-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white mb-1">This profile has exclusive content</p>
            <p className="text-xs text-[#71717a] mb-4">Subscribe to unlock full portfolio, contact details and exclusive content.</p>
            <button className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-all">
              Subscribe to unlock
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[#27272a] py-6 text-center mt-8">
          <p className="text-xs text-[#52525b]">
            Profile on{' '}
            <a href="/" className="text-violet-400 hover:text-violet-300">JobinLink</a>
            {' '}· '}
            <a href="/signup" className="text-violet-400 hover:text-violet-300">Create your free mini-site</a>
          </p>
        </div>
      </div>
    </div>
  );
}
