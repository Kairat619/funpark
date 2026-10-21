import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { formatPrice } from '@/lib/currency.js';

const Cart = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = () => {
      const saved = localStorage.getItem('vitaplay-cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    };

    loadCart();
    window.addEventListener('storage', loadCart);
    window.addEventListener('cart-updated', loadCart);
    
    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cart-updated', loadCart);
    };
  }, []);

  const updateQuantity = (productId, change) => {
    const updated = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updated);
    localStorage.setItem('vitaplay-cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (productId) => {
    const updated = cartItems.filter(item => item.id !== productId);
    setCartItems(updated);
    localStorage.setItem('vitaplay-cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleProceedToTalk = () => {
    window.open('https://wa.me/77024883117', '_blank');
    onClose();
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
                <ShoppingBag className="h-6 w-6" />
                {t('cart.title')}
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
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">{t('cart.emptyTitle')}</p>
                  <p className="text-sm text-muted-foreground">{t('cart.emptyDesc')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-card text-card-foreground rounded-xl p-4 shadow-sm">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg bg-muted"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 truncate">{item.title}</h3>
                          <p className="text-lg font-bold font-variant-tabular mb-2">{formatPrice(item.price)}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 rounded hover:bg-muted transition-all duration-200 active:scale-95"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium font-variant-tabular">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 rounded hover:bg-muted transition-all duration-200 active:scale-95"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto p-1 rounded hover:bg-destructive/10 text-destructive transition-all duration-200 active:scale-95"
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

            {cartItems.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="font-variant-tabular">{formatPrice(total)}</span>
                </div>
                <Button
                  onClick={handleProceedToTalk}
                  className="w-full"
                  size="lg"
                >
                  {t('common.proceedToTalk')}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;