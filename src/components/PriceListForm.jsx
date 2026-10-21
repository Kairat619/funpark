import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
// Flag SVGs from country-flag-icons (MIT)
import flagKZ from '@/assets/flags/KZ.svg';
import flagRU from '@/assets/flags/RU.svg';
import flagBY from '@/assets/flags/BY.svg';
import flagKG from '@/assets/flags/KG.svg';
import flagUZ from '@/assets/flags/UZ.svg';
import flagTJ from '@/assets/flags/TJ.svg';
import flagTM from '@/assets/flags/TM.svg';
import flagAM from '@/assets/flags/AM.svg';
import flagAZ from '@/assets/flags/AZ.svg';
import flagMD from '@/assets/flags/MD.svg';

// WhatsApp number that receives price list requests (digits only, with country code)
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '77076085488';

// Kazakhstan first, then Russia and the other CIS countries.
// In each mask, every 0 is one digit of the national number.
const countries = [
  { code: 'KZ', dial: '7', mask: '(000) 000-00-00', flag: flagKZ },
  { code: 'RU', dial: '7', mask: '(000) 000-00-00', flag: flagRU },
  { code: 'BY', dial: '375', mask: '(00) 000-00-00', flag: flagBY },
  { code: 'KG', dial: '996', mask: '(000) 000-000', flag: flagKG },
  { code: 'UZ', dial: '998', mask: '(00) 000-00-00', flag: flagUZ },
  { code: 'TJ', dial: '992', mask: '(00) 000-00-00', flag: flagTJ },
  { code: 'TM', dial: '993', mask: '(00) 00-00-00', flag: flagTM },
  { code: 'AM', dial: '374', mask: '(00) 00-00-00', flag: flagAM },
  { code: 'AZ', dial: '994', mask: '(00) 000-00-00', flag: flagAZ },
  { code: 'MD', dial: '373', mask: '(00) 000-000', flag: flagMD }
];

const Flag = ({ src }) => (
  <img src={src} alt="" className="h-4 w-6 rounded-[2px] shadow-sm shrink-0 object-cover" />
);

const digitCount = (mask) => mask.split('').filter(ch => ch === '0').length;

const formatPhone = (digits, country) => {
  if (!digits) return '';
  let out = `+${country.dial} `;
  let i = 0;
  for (const ch of country.mask) {
    if (i >= digits.length) break;
    if (ch === '0') {
      out += digits[i++];
    } else {
      out += ch;
    }
  }
  return out;
};

const PriceListForm = () => {
  const { t, language } = useLanguage();
  const phoneRef = useRef(null);
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('KZ');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const country = countries.find(c => c.code === countryCode);
  const maxDigits = digitCount(country.mask);
  const formattedPhone = formatPhone(phoneDigits, country);

  const countryNames = useMemo(() => {
    try {
      const names = new Intl.DisplayNames([language, 'en'], { type: 'region' });
      return Object.fromEntries(countries.map(c => [c.code, names.of(c.code)]));
    } catch {
      return {};
    }
  }, [language]);

  useEffect(() => {
    phoneRef.current?.setCustomValidity(
      phoneDigits.length === maxDigits ? '' : t('hero.priceList.phoneInvalid')
    );
  }, [phoneDigits, maxDigits, t]);

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const prefix = `+${country.dial}`;
    let digits = (raw.startsWith(prefix) ? raw.slice(prefix.length) : raw).replace(/\D/g, '');

    // Pasted numbers may include the country code or a leading trunk 8
    if (!raw.startsWith(prefix) && digits.length > maxDigits) {
      if (digits.startsWith(country.dial)) {
        digits = digits.slice(country.dial.length);
      } else if (country.dial === '7' && digits.startsWith('8')) {
        digits = digits.slice(1);
      }
    }
    digits = digits.slice(0, maxDigits);

    // Deleting a separator character should remove the digit before it
    if (digits === phoneDigits && raw.length < formattedPhone.length) {
      digits = digits.slice(0, -1);
    }
    setPhoneDigits(digits);
  };

  const handleCountryChange = (code) => {
    const next = countries.find(c => c.code === code);
    setCountryCode(code);
    setPhoneDigits(prev => prev.slice(0, digitCount(next.mask)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = [
      t('hero.priceList.waGreeting'),
      `${t('hero.priceList.waName')}: ${name.trim()}`,
      `${t('hero.priceList.waPhone')}: ${formattedPhone}`
    ].join('\n');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const requests = JSON.parse(localStorage.getItem('vitaplay-pricelist-requests') || '[]');
    requests.push({
      name: name.trim(),
      phone: formattedPhone,
      country: countryCode,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('vitaplay-pricelist-requests', JSON.stringify(requests));

    // Opened synchronously from the submit so pop-up blockers allow it;
    // the link below covers the case where it was still blocked.
    window.open(url, '_blank', 'noopener,noreferrer');
    setWhatsappUrl(url);
    setName('');
    setPhoneDigits('');
  };

  return (
    <>
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-[1fr_1.25fr_auto] gap-3 w-full max-w-4xl mx-auto text-left"
    >
      <label htmlFor="pricelist-name" className="sr-only">{t('footer.namePlaceholder')}</label>
      <Input
        id="pricelist-name"
        type="text"
        autoComplete="name"
        placeholder={t('footer.namePlaceholder')}
        value={name}
        onChange={(e) => { setName(e.target.value); setWhatsappUrl(''); }}
        required
        className="h-12 text-base bg-background text-foreground border-none shadow-lg"
      />

      <div className="flex h-12 rounded-md bg-background text-foreground shadow-lg focus-within:ring-2 focus-within:ring-ring">
        <Select value={countryCode} onValueChange={handleCountryChange}>
          <SelectTrigger
            aria-label={t('hero.priceList.country')}
            className="h-12 w-auto gap-2 border-none rounded-r-none bg-transparent pl-3 pr-2 focus:ring-0 focus:ring-offset-0"
          >
            <Flag src={country.flag} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {countries.map(({ code, dial, flag }) => (
              <SelectItem key={code} value={code}>
                <span className="flex items-center gap-2">
                  <Flag src={flag} />
                  <span>{countryNames[code] || code}</span>
                  <span className="text-muted-foreground">+{dial}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label htmlFor="pricelist-phone" className="sr-only">{t('hero.priceList.phoneLabel')}</label>
        <input
          ref={phoneRef}
          id="pricelist-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={`+${country.dial} ${country.mask}`}
          value={formattedPhone}
          onChange={handlePhoneChange}
          required
          className="flex-1 min-w-0 h-12 rounded-r-md bg-transparent px-2 text-base font-variant-tabular placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 px-8 gap-2 text-base bg-primary text-primary-foreground hover:bg-primary/90 border-none shadow-lg"
      >
        <FileText className="h-5 w-5" />
        {t('hero.priceList.button')}
      </Button>
    </form>

    {whatsappUrl && (
      <p role="status" className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-white/90">
        <MessageCircle className="h-5 w-5 text-primary shrink-0" />
        <span>{t('hero.priceList.waPending')}</span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-4 hover:text-white"
        >
          {t('hero.priceList.waOpen')}
        </a>
      </p>
    )}
    </>
  );
};

export default PriceListForm;
