import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'kk', name: 'Қазақша', short: 'KK', flag: '🇰🇿' },
    { code: 'ru', name: 'Русский', short: 'RU', flag: '🇷🇺' },
    { code: 'zh', name: '中文', short: 'ZH', flag: '🇨🇳' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center ${
          isOpen ? 'bg-muted text-primary' : 'hover:bg-muted text-foreground'
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-xl shadow-lg border border-border overflow-hidden z-50"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-muted transition-colors duration-150 ${
                    language === lang.code ? 'bg-muted/50 font-medium' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <span>{lang.name}</span>
                    <span className="text-xs text-muted-foreground ml-1">({lang.short})</span>
                  </div>
                  {language === lang.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;