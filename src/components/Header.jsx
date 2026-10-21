import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ThemeSwitcher from '@/components/ThemeSwitcher.jsx';
import LanguageSwitcher from '@/components/LanguageSwitcher.jsx';
import FunParkLogo from '@/components/FunParkLogo.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const Header = ({ cartCount, wishlistCount, onCartOpen, onWishlistOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: t('nav.home'), id: 'hero' },
    { label: t('nav.products'), id: 'products' },
    { label: t('nav.shop'), id: 'shop' },
    { label: t('nav.academy'), id: 'academy' },
    { label: t('nav.builder'), id: 'builder' },
    { label: t('nav.contact'), id: 'contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <FunParkLogo className="h-10 sm:h-12 w-auto transition-transform duration-200 group-hover:scale-105" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-all duration-200 active:scale-95"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="hidden sm:block">
              <ThemeSwitcher />
            </div>
            
            <button
              onClick={onWishlistOpen}
              className="relative p-2 rounded-lg hover:bg-muted transition-all duration-200 active:scale-95"
              aria-label={t('wishlist.title')}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                  {wishlistCount}
                </Badge>
              )}
            </button>

            <button
              onClick={onCartOpen}
              className="relative p-2 rounded-lg hover:bg-muted transition-all duration-200 active:scale-95"
              aria-label={t('cart.title')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                  {cartCount}
                </Badge>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-all duration-200 active:scale-95"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            <div className="flex sm:hidden mb-2 px-4">
              <ThemeSwitcher />
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-4 py-3 rounded-lg text-left font-medium hover:bg-muted transition-all duration-200 active:scale-95"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;