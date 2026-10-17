import React, { createContext, useContext, useState } from 'react';
import type { Language, Translation } from '../i18n';
import { getTranslation } from '../i18n';

interface I18nContextType {
  lang: Language;
  t: Translation;
  setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(
    (localStorage.getItem('surfur_lang') as Language) ||
    (localStorage.getItem('amponcebu_lang') as Language) ||
    'en'
  );

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('surfur_lang', newLang);
  };

  return (
    <I18nContext.Provider value={{ lang, t: getTranslation(lang), setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
