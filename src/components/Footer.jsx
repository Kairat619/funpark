import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import FunParkLogo from '@/components/FunParkLogo.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import Honeypot, { honeypotValue } from '@/components/Honeypot.jsx';
import { sendLead } from '@/lib/sendLead.js';

const Footer = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);

  const showSendError = () => {
    toast({ variant: 'destructive', title: t('common.sendError') });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSendingContact(true);

    try {
      await sendLead('contact', contactForm, { website: honeypotValue(e) });
    } catch {
      showSendError();
      setIsSendingContact(false);
      return;
    }
    
    const submissions = JSON.parse(localStorage.getItem('vitaplay-contact-submissions') || '[]');
    submissions.push({
      ...contactForm,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('vitaplay-contact-submissions', JSON.stringify(submissions));
    
    toast({
      title: t('footer.messageSent'),
      description: t('footer.messageSentDesc')
    });
    
    setContactForm({ name: '', email: '', message: '' });
    setIsSendingContact(false);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    const subscribers = JSON.parse(localStorage.getItem('vitaplay-newsletter-subscribers') || '[]');
    if (!subscribers.includes(newsletterEmail)) {
      setIsSendingNewsletter(true);
      try {
        await sendLead('newsletter', { email: newsletterEmail }, { website: honeypotValue(e) });
      } catch {
        showSendError();
        setIsSendingNewsletter(false);
        return;
      }
      setIsSendingNewsletter(false);

      subscribers.push(newsletterEmail);
      localStorage.setItem('vitaplay-newsletter-subscribers', JSON.stringify(subscribers));
      
      toast({
        title: t('footer.subscribed'),
        description: t('footer.subscribedDesc')
      });
    } else {
      toast({
        title: t('footer.alreadySubscribed'),
        description: t('footer.alreadySubscribedDesc')
      });
    }
    
    setNewsletterEmail('');
  };

  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground">
      {/* Inquiry call to action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="bg-background text-foreground rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance text-center">{t('footer.getInTouch')}</h2>
            <form onSubmit={handleContactSubmit} className="relative space-y-4">
              <Honeypot />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder={t('footer.namePlaceholder')}
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="bg-background text-foreground"
                />
                <Input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Textarea
                  placeholder={t('footer.messagePlaceholder')}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={4}
                  className="bg-background text-foreground resize-none"
                />
              </div>
              <Button type="submit" disabled={isSendingContact} className="w-full gap-2">
                <Send className="h-4 w-4" />
                {isSendingContact ? t('common.sending') : t('common.sendMessage')}
              </Button>
            </form>
        </div>
      </div>

      {/* Footer links & newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-border pt-12 mb-12">
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="#products" className="hover:underline transition-all duration-200">{t('nav.products')}</a>
              <a href="#academy" className="hover:underline transition-all duration-200">{t('nav.academy')}</a>
              <a href="#shop" className="hover:underline transition-all duration-200">{t('nav.shop')}</a>
              <a href="#contact" className="hover:underline transition-all duration-200">{t('nav.contact')}</a>
              <a href="#" className="hover:underline transition-all duration-200">{t('footer.privacyPolicy')}</a>
              <a href="#" className="hover:underline transition-all duration-200">{t('footer.termsOfService')}</a>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 text-balance">{t('footer.stayUpdated')}</h2>
            <p className="mb-6 leading-relaxed">
              {t('footer.newsletterDesc')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative flex gap-2">
              <Honeypot />
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="bg-background text-foreground min-w-0"
              />
              <Button type="submit" disabled={isSendingNewsletter} className="gap-2 shrink-0">
                <Mail className="h-4 w-4" />
                {isSendingNewsletter ? t('common.sending') : t('common.subscribe')}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FunParkLogo className="h-8 sm:h-10 w-auto" />
            </div>
            <p className="text-sm opacity-80 text-center md:text-right">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;