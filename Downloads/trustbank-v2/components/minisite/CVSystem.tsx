'use client';
import { useState } from 'react';
import { Briefcase, GraduationCap, Award, Lock, Unlock, Mail, Phone, Linkedin, ExternalLink, Check, X, Loader2, BadgeCheck, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CVEntry {
  id: string;
  type: 'experience' | 'education' | 'award' | 'certification';
  title: string;
  company?: string;
  period?: string;
  description?: string;
  current?: boolean;
}

interface CVProps {
  entries: CVEntry[];
  contact: { email?:string; phone?:string; linkedin?:string; website?:string };
  name: string;
  badge?: string;
  contactLocked?: boolean;
  contactPrice?: number;
  profileId?: string;
  accent: string; cardBg: string; border: string; text: string; muted: string;
}

const ICONS = {
  experience:    { Icon: Briefcase,      label: 'Experience' },
  education:     { Icon: GraduationCap,  label: 'Education' },
  award:         { Icon: Award,          label: 'Award' },
  certification: { Icon: Star,           label: 'Certification' },
};

export function CVModule({ entries, contact, name, badge, contactLocked=true, contactPrice=20, profileId, accent, cardBg, border, text, muted }: CVProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [unlockModal, setUnlockModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payMethod, setPayMethod] = useState<'usdc'|'stripe'>('usdc');

  const groups = ['experience','education','award','certification'].map(type => ({
    type, items: entries.filter(e => e.type === type)
  })).filter(g => g.items.length > 0);

  const handleUnlock = async () => {
    setLoading(true); setError('');
    try {
      if (payMethod === 'usdc') {
        // Polygon USDC payment — in production connect to smart contract
        // For now simulate success
        await new Promise(r => setTimeout(r, 1500));
        if (profileId) {
          await supabase.from('unlocks').insert({
            target_id: profileId, type: 'cv_contact',
            amount_usdc: contactPrice, platform: 'trustbank'
          });
        }
        setUnlocked(true);
        setUnlockModal(false);
      } else {
        // Stripe — redirect to checkout
        window.location.href = `/checkout/cv-unlock?profile=${profileId}&amount=${contactPrice}`;
      }
    } catch (e: any) {
      setError(e.message || 'Payment failed');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">

      {/* CV Entries */}
      {groups.map(({ type, items }) => {
        const { Icon, label } = ICONS[type as keyof typeof ICONS];
        return (
          <div key={type} className="rounded-2xl overflow-hidden"
            style={{ background:cardBg, border:`1px solid ${border}` }}>
            <div className="flex items-center gap-2.5 px-4 py-3"
              style={{ borderBottom:`1px solid ${border}`, background:`${accent}08` }}>
              <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                style={{ background:`${accent}15` }}>
                <Icon className="h-3.5 w-3.5" style={{ color:accent }}/>
              </div>
              <p className="text-sm font-semibold" style={{ color:text }}>{label}</p>
            </div>
            <div className="divide-y" style={{ borderColor:border }}>
              {items.map(entry => (
                <div key={entry.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold" style={{ color:text }}>{entry.title}</p>
                        {entry.current && (
                          <span className="text-[10px] rounded-full px-2 py-0.5 font-medium"
                            style={{ background:`${accent}15`, color:accent }}>Current</span>
                        )}
                      </div>
                      {entry.company && (
                        <p className="text-xs font-medium mb-0.5" style={{ color:accent }}>{entry.company}</p>
                      )}
                      {entry.period && (
                        <p className="text-xs mb-1" style={{ color:muted }}>{entry.period}</p>
                      )}
                      {entry.description && (
                        <p className="text-xs leading-relaxed" style={{ color:muted }}>{entry.description}</p>
                      )}
                    </div>
                    {/* Timeline dot */}
                    <div className="h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: entry.current ? accent : `${accent}40` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Contact — locked or unlocked */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background:cardBg, border:`1px solid ${border}` }}>
        <div className="flex items-center gap-2.5 px-4 py-3"
          style={{ borderBottom:`1px solid ${border}`, background:`${accent}08` }}>
          <div className="h-7 w-7 rounded-lg flex items-center justify-center"
            style={{ background:`${accent}15` }}>
            {unlocked || !contactLocked
              ? <Unlock className="h-3.5 w-3.5" style={{ color:accent }}/>
              : <Lock className="h-3.5 w-3.5" style={{ color:accent }}/>
            }
          </div>
          <p className="text-sm font-semibold" style={{ color:text }}>
            Contact {badge === 'blue' && <BadgeCheck className="h-4 w-4 inline ml-1 text-blue-500"/>}
          </p>
        </div>

        {unlocked || !contactLocked ? (
          <div className="px-4 py-4 space-y-2">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-sm transition-all hover:opacity-70"
                style={{ color:accent }}>
                <Mail className="h-4 w-4 flex-shrink-0"/>
                <span>{contact.email}</span>
              </a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 text-sm"
                style={{ color:muted }}>
                <Phone className="h-4 w-4 flex-shrink-0"/>
                <span>{contact.phone}</span>
              </a>
            )}
            {contact.linkedin && (
              <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm transition-all hover:opacity-70"
                style={{ color:accent }}>
                <Linkedin className="h-4 w-4 flex-shrink-0"/>
                <span>{contact.linkedin}</span>
                <ExternalLink className="h-3 w-3 opacity-50"/>
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm transition-all hover:opacity-70"
                style={{ color:accent }}>
                <ExternalLink className="h-4 w-4 flex-shrink-0"/>
                <span>{contact.website}</span>
              </a>
            )}
          </div>
        ) : (
          <div className="px-4 py-5 text-center">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background:`${accent}10`, border:`1px solid ${accent}20` }}>
              <Lock className="h-6 w-6" style={{ color:accent }}/>
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color:text }}>Contact details locked</p>
            <p className="text-xs mb-1" style={{ color:muted }}>
              One-time unlock — <strong style={{ color:text }}>{name}</strong> receives 50%
            </p>
            <p className="text-xs mb-4" style={{ color:muted }}>Used by recruiters, partners and clients</p>
            <button onClick={() => setUnlockModal(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background:accent }}>
              <Unlock className="h-4 w-4"/>
              Unlock for ${contactPrice} USDC
            </button>
          </div>
        )}
      </div>

      {/* Unlock Modal */}
      {unlockModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-white border border-gray-100 shadow-2xl">
            <button onClick={() => setUnlockModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5"/>
            </button>

            <div className="text-center mb-5">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background:`${accent}10`, border:`1px solid ${accent}20` }}>
                <Lock className="h-8 w-8" style={{ color:accent }}/>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Unlock {name}'s contact</h3>
              <p className="text-sm text-gray-500">One-time payment · Instant access</p>
            </div>

            {/* Split info */}
            <div className="rounded-2xl p-4 mb-4 bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">You pay</span>
                <span className="text-lg font-bold text-gray-900">${contactPrice} USDC</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex-1 rounded-full bg-gray-200 h-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:'50%', background:accent }}/>
                </div>
                <span>{name} gets ${contactPrice/2}</span>
                <span>·</span>
                <span>Platform gets ${contactPrice/2}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { id:'usdc', label:'USDC', sub:'Polygon wallet', icon:'🔷' },
                { id:'stripe', label:'Card', sub:'Visa / Mastercard', icon:'💳' },
              ].map(m => (
                <button key={m.id} onClick={() => setPayMethod(m.id as any)}
                  className="rounded-xl p-3 text-left transition-all border"
                  style={{
                    border: `1.5px solid ${payMethod===m.id ? accent : '#e5e7eb'}`,
                    background: payMethod===m.id ? `${accent}08` : '#fafafa'
                  }}>
                  <span className="text-lg block mb-0.5">{m.icon}</span>
                  <p className="text-xs font-semibold text-gray-900">{m.label}</p>
                  <p className="text-[10px] text-gray-400">{m.sub}</p>
                </button>
              ))}
            </div>

            {error && <p className="text-xs text-red-500 mb-3 text-center">{error}</p>}

            <button onClick={handleUnlock} disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background:accent }}>
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin"/>Processing...</>
                : <><Unlock className="h-4 w-4"/>Pay ${contactPrice} · Unlock now</>
              }
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3">
              Secure · Instant · {payMethod === 'usdc' ? 'Polygon USDC' : 'Stripe encrypted'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CV Editor (dashboard) ────────────────────────────────
export function CVEditor({ entries, onChange, accent, cardBg, border, text, muted }: any) {
  const [localEntries, setLocalEntries] = useState<CVEntry[]>(entries || []);
  const [addingType, setAddingType] = useState<string|null>(null);
  const [form, setForm] = useState({ title:'', company:'', period:'', description:'', current:false });

  const addEntry = () => {
    if (!form.title || !addingType) return;
    const newEntry: CVEntry = {
      id: Date.now().toString(),
      type: addingType as any,
      ...form
    };
    const updated = [...localEntries, newEntry];
    setLocalEntries(updated);
    onChange?.(updated);
    setForm({ title:'', company:'', period:'', description:'', current:false });
    setAddingType(null);
  };

  const removeEntry = (id: string) => {
    const updated = localEntries.filter(e => e.id !== id);
    setLocalEntries(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4">
      {/* Add buttons */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(ICONS).map(([type, { Icon, label }]) => (
          <button key={type} onClick={() => setAddingType(type)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all"
            style={{ background:`${accent}10`, color:accent, border:`1px solid ${accent}25` }}>
            <Icon className="h-3.5 w-3.5"/> + {label}
          </button>
        ))}
      </div>

      {/* Add form */}
      {addingType && (
        <div className="rounded-2xl p-4 space-y-3"
          style={{ background:cardBg, border:`1.5px solid ${accent}40` }}>
          <p className="text-xs font-semibold capitalize" style={{ color:accent }}>
            Add {addingType}
          </p>
          {[
            { k:'title', p:addingType==='experience'?'Job title':addingType==='education'?'Degree/Course':'Name' },
            { k:'company', p:addingType==='experience'?'Company':'Institution' },
            { k:'period', p:'2020 – Present' },
            { k:'description', p:'Brief description (optional)' },
          ].map(f => (
            <input key={f.k} value={(form as any)[f.k]} onChange={e => setForm(prev => ({ ...prev, [f.k]:e.target.value }))}
              placeholder={f.p} className="w-full rounded-xl px-3 py-2 text-sm outline-none transition-all"
              style={{ background:`${accent}05`, border:`1px solid ${border}`, color:text }}/>
          ))}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="current" checked={form.current}
              onChange={e => setForm(prev => ({ ...prev, current:e.target.checked }))}/>
            <label htmlFor="current" className="text-xs" style={{ color:muted }}>Current position</label>
          </div>
          <div className="flex gap-2">
            <button onClick={addEntry}
              className="flex-1 rounded-xl py-2 text-sm font-semibold text-white transition-all"
              style={{ background:accent }}>Add</button>
            <button onClick={() => setAddingType(null)}
              className="flex-1 rounded-xl py-2 text-sm transition-all"
              style={{ border:`1px solid ${border}`, color:muted }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Existing entries */}
      {localEntries.length > 0 && (
        <div className="space-y-2">
          {localEntries.map(entry => {
            const { Icon } = ICONS[entry.type];
            return (
              <div key={entry.id} className="flex items-start gap-3 rounded-xl p-3 transition-all"
                style={{ background:cardBg, border:`1px solid ${border}` }}>
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color:accent }}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color:text }}>{entry.title}</p>
                  {entry.company && <p className="text-xs" style={{ color:accent }}>{entry.company}</p>}
                  {entry.period && <p className="text-xs" style={{ color:muted }}>{entry.period}</p>}
                </div>
                <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                  <X className="h-4 w-4"/>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
