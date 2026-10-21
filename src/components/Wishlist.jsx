import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { formatPrice } from '@/lib/currency.js';

const Wishlist = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const loadWishlist = () => {
      const saved = localStorage.getItem('vitaplay-wishlist');
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    };

    loadWishlist();
    window.addEventListener('storage', loadWishlist);
    window.addEventListener('wishlist-updated', loadWishlist);
    
    return () => {
      window.removeEventListener('storage', loadWishlist);
      window.removeEventListener('wishlist-updated', loadWishlist);
    };
  }, []);

  const removeItem = (productId) => {
    const updated = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updated);
    localStorage.setItem('vitaplay-wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('vitaplay-cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('vitaplay-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    
    toast({
      title: t('common.addedToCart'),
      description: `${product.title} has been added.`
    });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-background text-foreground shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6" />
                {t('wishlist.title')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-all duration-200 active:scale-95"
                aria-label={t('common.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">{t('wishlist.emptyTitle')}</p>
                  <p className="text-sm text-muted-foreground">{t('wishlist.emptyDesc')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="bg-card text-card-foreground rounded-xl p-4 shadow-sm">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg bg-muted"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 truncate">{item.title}</h3>
                          <p className="text-lg font-bold font-variant-tabular mb-3">{formatPrice(item.price)}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="flex-1 gap-1"
                            >
                              <ShoppingCart className="h-3 w-3" />
                              {t('common.addToCart')}
                            </Button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 rounded hover:bg-destructive/10 text-destructive transition-all duration-200 active:scale-95"
                              aria-label={t('common.remove')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Wishlist;