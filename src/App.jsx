import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Cart from './components/Cart.jsx';
import Wishlist from './components/Wishlist.jsx';
import HomePage from './pages/HomePage.jsx';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem('vitaplay-cart') || '[]');
      const wishlist = JSON.parse(localStorage.getItem('vitaplay-wishlist') || '[]');
      
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      setWishlistCount(wishlist.length);
    };

    updateCounts();
    
    window.addEventListener('cart-updated', updateCounts);
    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('storage', updateCounts);
    
    return () => {
      window.removeEventListener('cart-updated', updateCounts);
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Header
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              onCartOpen={() => setIsCartOpen(true)}
              onWishlistOpen={() => setIsWishlistOpen(true)}
            />
            <main className="flex-1 pt-20">
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
          <Toaster />
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;