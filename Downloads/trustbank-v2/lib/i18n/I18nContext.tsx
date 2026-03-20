'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, getT, detectLang, LANGUAGE_NAMES, LANGUAGE_FLAGS, type Lang, type TranslationKey } from './translations';

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  languages: typeof LANGUAGE_NAMES;
  flags: typeof LANGUAGE_FLAGS;
}

const Ctx = createContext<I18nCtx>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
  languages: LANGUAGE_NAMES,
  flags: LANGUAGE_FLAGS,
});

export function I18nProvider({ children, defaultLang }: { children: ReactNode; defaultLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(defaultLang || 'en');

  useEffect(() => {
    // Try localStorage first, then browser detection
    const stored = localStorage.getItem('lang') as Lang;
    const supported: Lang[] = ['en', 'pt', 'es', 'fr', 'de', 'ja'];
    if (stored && supported.includes(stored)) {
      setLangState(stored);
    } else {
      setLangState(detectLang());
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const t = getT(lang);

  return (
    <Ctx.Provider value={{ lang, setLang, t, languages: LANGUAGE_NAMES, flags: LANGUAGE_FLAGS }}>
      {children}
    </Ctx.Provider>
  );
}

export const useI18n = () => useContext(Ctx);

// ── Language Switcher Component ───────────────────────────────
export function LanguageSwitcher({
  variant = 'dropdown',
  className = '',
}: {
  variant?: 'dropdown' | 'pills' | 'compact';
  className?: string;
}) {
  const { lang, setLang, languages, flags } = useI18n();
  const [open, setOpen] = useState(false);
  const langs = Object.entries(languages) as [Lang, string][];

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-1.5 ${className}`}>
        {langs.map(([code, name]) => (
          <button key={code} onClick={() => setLang(code)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all border ${
              lang === code
                ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600'
            }`}>
            <span>{flags[code]}</span>
            <span className="hidden sm:block">{name}</span>
            <span className="sm:hidden">{code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:border-zinc-600 transition-all">
          <span>{flags[lang]}</span>
          <span>{lang.toUpperCase()}</span>
          <span className="text-zinc-500">▾</span>
        </button>
        {open && (
          <div className="absolute top-full right-0 mt-1 z-50 rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden min-w-[140px]">
            {langs.map(([code, name]) => (
              <button key={code} onClick={() => { setLang(code); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left hover:bg-zinc-800 transition-all ${lang === code ? 'text-violet-400' : 'text-zinc-300'}`}>
                <span>{flags[code]}</span>
                <span>{name}</span>
                {lang === code && <span className="ml-auto text-violet-400">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: dropdown
  return (
    <div className={`relative ${className}`}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all">
        <span>{flags[lang]}</span>
        <span>{languages[lang]}</span>
        <span className="text-zinc-500 text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 z-50 rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden w-44">
          {langs.map(([code, name]) => (
            <button key={code} onClick={() => { setLang(code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-zinc-800 transition-all ${lang === code ? 'text-violet-400 bg-violet-500/5' : 'text-zinc-300'}`}>
              <span className="text-base">{flags[code]}</span>
              <span>{name}</span>
              {lang === code && <span className="ml-auto text-violet-400 text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
