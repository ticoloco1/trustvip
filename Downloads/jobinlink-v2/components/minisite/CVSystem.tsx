'use client';
import { useState } from 'react';
import {
  Briefcase, GraduationCap, Lock, Unlock, Check, X,
  Star, Award, ChevronRight, DollarSign, AlertCircle,
  Building2, Calendar, MapPin, ExternalLink, BadgeCheck
} from 'lucide-react';

export interface CVEntry {
  id: string;
  type: 'experience' | 'education' | 'certification' | 'skill';
  title: string;
  company: string;
  period: string;
  description?: string;
  location?: string;
  url?: string;
  skills?: string[];
  current?: boolean;
}

export interface CVContact {
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
}

// ── CV Unlock Modal ($20, 50/50 split) ───────────────────────
function CVUnlockModal({
  name, price = 20, onConfirm, onClose, accent, cardBg, border, text, muted,
}: {
  name: string; price?: number; onConfirm: () => void; onClose: () => void;
  accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl p-6 relative" style={{ background: cardBg || '#111', border: `1px solid ${border || '#27272a'}` }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-5">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: `${accent || '#8b5cf6'}15`, border: `1px solid ${accent || '#8b5cf6'}30` }}>
            <Unlock className="h-7 w-7" style={{ color: accent || '#8b5cf6' }} />
          </div>
          <h3 className="text-base font-bold mb-1" style={{ color: text || '#fff' }}>
            Unlock {name}'s contact
          </h3>
          <p className="text-xs" style={{ color: muted || '#71717a' }}>
            Get direct access to email, phone and LinkedIn
          </p>
        </div>

        {/* Pricing breakdown */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: `${accent || '#8b5cf6'}08`, border: `1px solid ${accent || '#8b5cf6'}20` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: muted }}>Unlock fee</span>
            <span className="text-xl font-bold" style={{ color: accent || '#8b5cf6' }}>${price.toFixed(2)} USDC</span>
          </div>
          <div className="space-y-1.5 pt-3 border-t" style={{ borderColor: `${accent || '#8b5cf6'}20` }}>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: accent || '#8b5cf6' }} />
                <span style={{ color: text }}>Platform (50%)</span>
              </div>
              <span style={{ color: muted }}>${(price * 0.5).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span style={{ color: text }}>{name} (50%)</span>
              </div>
              <span className="text-emerald-400 font-semibold">${(price * 0.5).toFixed(2)} → wallet</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl p-3 mb-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
          <span className="text-[10px] text-emerald-300">
            ${(price * 0.5).toFixed(2)} is sent directly to {name}'s wallet the moment you pay — via Polygon smart contract.
          </span>
        </div>

        <button onClick={() => { onConfirm(); onClose(); }}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all hover:opacity-80"
          style={{ background: accent || '#8b5cf6', color: '#fff' }}>
          <Unlock className="h-4 w-4" />
          Pay ${price.toFixed(2)} USDC — Unlock Contact
        </button>

        <p className="text-center text-[10px] mt-3" style={{ color: muted }}>
          One-time payment · Instant access · Powered by Polygon
        </p>
      </div>
    </div>
  );
}

// ── CV Module (public mini-site) ─────────────────────────────
export function CVModule({
  entries, contact, name, contactLocked = true, contactPrice = 20, badge,
  accent, cardBg, border, text, muted,
}: {
  entries: CVEntry[];
  contact?: CVContact;
  name: string;
  contactLocked?: boolean;
  contactPrice?: number;
  badge?: 'blue' | 'gold' | null;
  accent?: string; cardBg?: string; border?: string; text?: string; muted?: string;
}) {
  const [unlocked, setUnlocked] = useState(!contactLocked);
  const [showModal, setShowModal] = useState(false);

  const a = accent || '#8b5cf6';
  const cb = cardBg || '#111113';
  const b = border || '#27272a';
  const t = text || '#fafafa';
  const m = muted || '#71717a';

  const experience = entries.filter(e => e.type === 'experience');
  const education  = entries.filter(e => e.type === 'education');
  const certs      = entries.filter(e => e.type === 'certification');

  const Section = ({ title, icon: Icon, items }: { title: string; icon: any; items: CVEntry[] }) => (
    <div className="rounded-2xl p-5" style={{ background: cb, border: `1px solid ${b}` }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4" style={{ color: a }} />
        <h4 className="text-sm font-semibold" style={{ color: t }}>{title}</h4>
      </div>
      <div className="space-y-4">
        {items.map((entry, i) => (
          <div key={entry.id} className="relative pl-5" style={{ borderLeft: `2px solid ${a}20` }}>
            <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full" style={{ background: entry.current ? a : `${a}50` }} />
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: t }}>{entry.title}</p>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span className="text-xs" style={{ color: m }}>{entry.company}</span>
                  {entry.location && (
                    <span className="text-xs flex items-center gap-0.5" style={{ color: m }}>
                      <MapPin className="h-2.5 w-2.5" /> {entry.location}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: `${m}aa` }}>{entry.period}</p>
                {entry.description && <p className="text-xs mt-1.5 leading-relaxed" style={{ color: m }}>{entry.description}</p>}
                {entry.skills && entry.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.skills.map(s => (
                      <span key={s} className="text-[10px] rounded-full px-2 py-0.5" style={{ background: `${a}12`, color: a, border: `1px solid ${a}25` }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
              {entry.current && (
                <span className="text-[10px] rounded-full px-2 py-0.5 flex-shrink-0" style={{ background: `${a}15`, color: a, border: `1px solid ${a}30` }}>Current</span>
              )}
              {entry.url && (
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0" style={{ color: m }}>
                  <ExternalLink className="h-3.5 w-3.5 hover:text-white transition-colors" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" style={{ color: a }} />
          <h3 className="text-sm font-semibold" style={{ color: t }}>Resume / CV</h3>
          {badge === 'blue' && <BadgeCheck className="h-4 w-4 text-blue-400" title="Verified" />}
          {badge === 'gold' && <Award className="h-4 w-4 text-amber-400" title="Verified Business" />}
        </div>
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: m }}>
          <Lock className="h-3 w-3" />
          <span>Contact locked</span>
        </div>
      </div>

      {/* Experience — always visible */}
      {experience.length > 0 && <Section title="Experience" icon={Briefcase} items={experience} />}

      {/* Education — always visible */}
      {education.length > 0 && <Section title="Education" icon={GraduationCap} items={education} />}

      {/* Certifications — always visible */}
      {certs.length > 0 && <Section title="Certifications" icon={Star} items={certs} />}

      {/* Contact — locked, pay to unlock */}
      <div className="rounded-2xl p-5" style={{ background: cb, border: `1px solid ${b}` }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold" style={{ color: t }}>Contact Details</h4>
          {!unlocked && (
            <span className="text-[10px] rounded-full px-2 py-0.5 flex items-center gap-1" style={{ background: `${a}10`, color: a, border: `1px solid ${a}25` }}>
              <Lock className="h-2.5 w-2.5" /> Locked
            </span>
          )}
        </div>

        {unlocked && contact ? (
          <div className="space-y-2">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: a }}>
                <span className="text-base">📧</span> {contact.email}
              </a>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm" style={{ color: t }}>
                <span className="text-base">📱</span> {contact.phone}
              </div>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: '#0a66c2' }}>
                <span className="text-base">💼</span> LinkedIn Profile
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: a }}>
                <span className="text-base">🌐</span> {contact.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-400">
              <Check className="h-3 w-3" /> Contact unlocked · ${contactPrice} paid
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: `${a}10` }}>
              <Lock className="h-6 w-6" style={{ color: a }} />
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: t }}>Contact details are locked</p>
            <p className="text-xs mb-1" style={{ color: m }}>
              Pay ${contactPrice} to access email, phone and LinkedIn
            </p>
            <p className="text-xs mb-4" style={{ color: `${m}80` }}>
              50% goes directly to {name} · 50% to platform
            </p>
            <button onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 mx-auto rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: a, color: '#fff' }}>
              <Unlock className="h-4 w-4" /> Unlock for ${contactPrice}
            </button>
            <p className="text-[10px] mt-2" style={{ color: `${m}60` }}>
              One-time · USDC on Polygon · Instant payment to {name}
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <CVUnlockModal
          name={name}
          price={contactPrice}
          onConfirm={() => setUnlocked(true)}
          onClose={() => setShowModal(false)}
          accent={a} cardBg={cb} border={b} text={t} muted={m}
        />
      )}
    </div>
  );
}
