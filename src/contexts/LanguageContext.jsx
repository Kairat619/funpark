import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/i18n.js';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Every visit and refresh starts in Russian; the switcher changes the
  // language for the current page view only.
  const [language, setLanguage] = useState('ru');

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language];
    
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Fallback to English
        let fallback = translations['en'];
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path; // Return the key path if not found anywhere
          }
        }
        return fallback;
      }
    }
    return result;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};