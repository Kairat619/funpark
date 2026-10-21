
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Shield, Users, Award, ChevronRight, Play, 
  CheckCircle2, Star, ArrowRight, Sparkles, Target,
  Brain, Heart as HeartIcon, Activity, Eye, TrendingUp,
  ChevronLeft, Layers, Lock, ShoppingCart, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import ProductCard from '@/components/ProductCard.jsx';
import PriceListForm from '@/components/PriceListForm.jsx';
import { sendLead } from '@/lib/sendLead.js';
import ModalDialog from '@/components/ModalDialog.jsx';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { formatPrice } from '@/lib/currency.js';

// Demo video for the showcase section — replace with the real FunPark YouTube video ID
// Paste any YouTube link (youtu.be/..., youtube.com/watch?v=..., /shorts/...) or a bare video ID
const SHOWCASE_VIDEO_URL = 'https://www.youtube.com/watch?v=XZtLKQ1R-4U';
const SHOWCASE_VIDEO_ID =
  SHOWCASE_VIDEO_URL.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? SHOWCASE_VIDEO_URL;
// Start time in seconds from a "t=5s" / "t=5" / "start=5" parameter, if the link has one
const SHOWCASE_VIDEO_START = SHOWCASE_VIDEO_URL.match(/[?&](?:t|start)=(\d+)s?(?:&|$)/)?.[1];

const HomePage = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [testimonialApi, setTestimonialApi] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [builderStep, setBuilderStep] = useState(0);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [ageRange, setAgeRange] = useState(5);

  // Base product data (untranslated properties)
  const baseProducts = [
    { id: 1, price: 1666000, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/01caafec7c96ffd971a5154f4d0b96ec.png', categoryKey: 'playground', ageRange: '3-15', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/01caafec7c96ffd971a5154f4d0b96ec.png'] },
    { id: 2, price: 1710000, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/4b0313e60534848455bfb6fd37863b62.png', categoryKey: 'playground', ageRange: '3-15', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/4b0313e60534848455bfb6fd37863b62.png'] },
    { id: 3, price: 6550000, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/9dc8dac6e855b081bc7f1386e01b8106.png', categoryKey: 'playground', ageRange: '3-15', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/9dc8dac6e855b081bc7f1386e01b8106.png'] },
    { id: 4, price: 378000, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/07de77d998ae05fcb1a7f82fb664780b.png', categoryKey: 'fitness', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/07de77d998ae05fcb1a7f82fb664780b.png'] },
    { id: 5, price: 233000, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/3d58810c248d2b41e92dcbcad36975f2.png', categoryKey: 'fitness', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/3d58810c248d2b41e92dcbcad36975f2.png'] },
    { id: 6, price: 779000, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/7f8ee718d2295acaff0abeb7f3a5d375.png', categoryKey: 'fitness', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/7f8ee718d2295acaff0abeb7f3a5d375.png'] },
    { id: 7, price: 465000, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/340c57452d431e8192634b95c5ea3d48.png', categoryKey: 'interactive', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/340c57452d431e8192634b95c5ea3d48.png'] },
    { id: 8, price: 14250, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/23b76e2fbe85d2bce8a3db5069979425.png', categoryKey: 'interactive', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/23b76e2fbe85d2bce8a3db5069979425.png'] },
    { id: 9, price: 36600, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/8f45d0f4ccfdbdc24e2097f18cbde33c.png', categoryKey: 'interactive', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/8f45d0f4ccfdbdc24e2097f18cbde33c.png'] },
    { id: 10, price: 22000, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/5ffe6931e25e5804ec1488bc882468ba.png', categoryKey: 'others', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/5ffe6931e25e5804ec1488bc882468ba.png'] },
    { id: 11, price: 28000, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/436d5b1733fa06ab811bd6ef0af1d583.png', categoryKey: 'others', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/436d5b1733fa06ab811bd6ef0af1d583.png'] },
    { id: 12, price: 16700, image: 'https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/79e2f8a853431db850e37a217eefd76a.png', categoryKey: 'others', images: ['https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/79e2f8a853431db850e37a217eefd76a.png'] }
  ];

  // Map translations to products
  const products = useMemo(() => {
    return baseProducts.map(p => ({
      ...p,
      title: t(`products.${p.id}.title`),
      description: t(`products.${p.id}.description`),
      badgeText: t(`products.${p.id}.badge`),
      features: t(`products.${p.id}.features`) || [],
      benefits: t(`products.${p.id}.benefits`) || [],
      skillFocus: t(`products.${p.id}.skillFocus`)
    }));
  }, [t]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    category: 'all',
    ageRange: 'all',
    skillFocus: 'all'
  });

  // Keep testimonial dots in sync and auto-advance every 6s
  useEffect(() => {
    if (!testimonialApi) return;
    const onSelect = () => setTestimonialIndex(testimonialApi.selectedScrollSnap());
    onSelect();
    testimonialApi.on('select', onSelect);
    const timer = setInterval(() => testimonialApi.scrollNext(), 6000);
    return () => {
      clearInterval(timer);
      testimonialApi.off('select', onSelect);
    };
  }, [testimonialApi]);

  useEffect(() => {
    let filtered = products;

    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.categoryKey === filters.category);
    }

    if (filters.ageRange !== 'all') {
      filtered = filtered.filter(p => {
        // Products without a catalog age range don't match a specific age filter
        if (!p.ageRange) return false;
        const [min, max] = p.ageRange.split('-').map(Number);
        const [filterMin, filterMax] = filters.ageRange.split('-').map(Number);
        return min <= filterMax && max >= filterMin;
      });
    }

    if (filters.skillFocus !== 'all') {
      filtered = filtered.filter(p => p.skillFocus?.toLowerCase() === filters.skillFocus.toLowerCase());
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  // Product type options are translated names, so a selection from the
  // previous language would match nothing after switching
  useEffect(() => {
    setFilters(prev => (prev.skillFocus === 'all' ? prev : { ...prev, skillFocus: 'all' }));
  }, [language]);

  const handleAddToCart = (product) => {
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
      description: product.title
    });
  };

  const handleToggleWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem('vitaplay-wishlist') || '[]');
    const existingIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      wishlist.splice(existingIndex, 1);
      toast({
        title: t('common.remove'),
        description: product.title
      });
    } else {
      wishlist.push(product);
      toast({
        title: t('common.saved'),
        description: product.title
      });
    }
    
    localStorage.setItem('vitaplay-wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const isInWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem('vitaplay-wishlist') || '[]');
    return wishlist.some(item => item.id === productId);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setIsProductModalOpen(true);
  };

  const nextImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  const pillarIcons = [Shield, TrendingUp, Users, Award];
  const pillars = t('why.pillars') || [];
  
  const [expandedPillar, setExpandedPillar] = useState(null);

  const guideAges = ['2-4', '5-7', '8-10', '11-14'];
  const ageGuides = t('academy.guides') || [];

  const faqItems = [
    { id: 'safety', answer: [t('builder.safetyNote1'), pillars[0]?.description] },
    { id: 'installation', answer: [t('builder.disclaimer'), t('builder.safetyNote2')] },
    { id: 'warranty', answer: [pillars[3]?.details?.[3], pillars[3]?.description] },
    {
      id: 'ages',
      answer: [pillars[1]?.description],
      list: ageGuides.map((guide, i) => `${guide.title} — ${t('common.ages')} ${guideAges[i]}`)
    },
    { id: 'accessibility', answer: [pillars[2]?.description], list: pillars[2]?.details },
    { id: 'quote', answer: [t('builder.subtitle')] }
  ];

  const builderEquipment = {
    playground: products.filter(p => p.categoryKey === 'playground').slice(0, 3),
    fitness: products.filter(p => p.categoryKey === 'fitness').slice(0, 3),
    interactive: products.filter(p => p.categoryKey === 'interactive').slice(0, 3)
  };

  const handleEquipmentToggle = (item) => {
    const exists = selectedEquipment.find(e => e.id === item.id);
    if (exists) {
      setSelectedEquipment(selectedEquipment.filter(e => e.id !== item.id));
    } else {
      setSelectedEquipment([...selectedEquipment, item]);
    }
  };

  const [isSendingQuote, setIsSendingQuote] = useState(false);

  const handleQuoteRequest = async () => {
    setIsSendingQuote(true);
    try {
      await sendLead('quote', {
        items: selectedEquipment.map(item => `${item.title} — ${formatPrice(item.price)}`),
        total: formatPrice(selectedEquipment.reduce((sum, item) => sum + item.price, 0))
      });
    } catch {
      toast({ variant: 'destructive', title: t('common.sendError') });
      setIsSendingQuote(false);
      return;
    }

    toast({
      title: t('common.saved'),
      description: t('footer.messageSentDesc')
    });
    setIsSendingQuote(false);
    setBuilderStep(0);
    setSelectedEquipment([]);
  };

  const calculateBenefits = () => {
    const benefits = {
      strength: 0,
      balance: 0,
      coordination: 0,
      cognitive: 0,
      social: 0
    };

    selectedEquipment.forEach(item => {
      benefits.strength += 20;
      benefits.balance += 15;
      benefits.coordination += 15;
      benefits.cognitive += 10;
      benefits.social += 10;
    });

    return benefits;
  };

  const categoryUrls = {
    playground: 'https://drive.google.com/file/d/1T9muvuzLqzkYxMDFw4Jw9dTqVa79wPzX/view?usp=sharing',
    fitness: 'https://drive.google.com/file/d/1yb3J6oQrCr7xzWCIfL8q-IFA1ZH9qS0E/view',
    interactive: 'https://drive.google.com/file/d/1h2WLYvnDg6kU9zh67gtOJvISdAX6wBMw/view',
    others: 'https://drive.google.com/file/d/1EwEVxU6HGl62At2nHkTsrVRkN1PncfjE/view'
  };

  const categoryKeys = ['playground', 'fitness', 'interactive', 'others'];
  const [activeCategory, setActiveCategory] = useState('playground');

  const handleCategorySelect = (categoryKey) => {
    setActiveCategory(categoryKey);
    const element = document.getElementById('products');
    if (element) {
      const offset = 80;
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth'
      });
    }
  };

  const shopAllProductsUrl ='https://drive.google.com/file/d/1KBf4JgclzlyFwmaYig9APJxCya5rASQu/view';

  return (
    <>
      <Helmet>
        <title>{`FunPark.kz - ${t('hero.subtitle')}`}</title>
        <meta name="description" content={t('hero.description')} />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section — intro banner with price list request */}
        <section id="hero" className="relative flex items-center overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url("https://horizons-cdn.hostinger.com/41a808d8-5cd8-4a14-a2cc-2de948293724/ed43a89c14e13c6f1d72e34469c9bcbe.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/60 z-0" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 text-sm px-4 py-2 bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-2 inline" />
                {t('hero.badge')}
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-balance drop-shadow-lg" style={{ letterSpacing: '-0.02em' }}>
                {t('hero.title')}
              </h1>
              
              <p className="text-2xl md:text-3xl font-semibold mb-4 text-white/90 drop-shadow-md">
                {t('hero.subtitle')}
              </p>
              
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow">
                {t('hero.description')}
              </p>

              <PriceListForm />
            </motion.div>
          </div>
        </section>

        {/* Category Navigation */}
        <nav aria-label={t('categories.title')} className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {categoryKeys.map(categoryKey => {
                const cover = products.find(p => p.categoryKey === categoryKey);
                const isActive = activeCategory === categoryKey;
                return (
                  <button
                    key={categoryKey}
                    onClick={() => handleCategorySelect(categoryKey)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-3 rounded-xl p-2 pr-3 text-left border-2 transition-all duration-200 active:scale-95 ${
                      isActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={cover?.image}
                      alt=""
                      className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover bg-muted shrink-0"
                    />
                    <span className="text-sm md:text-base font-semibold leading-snug min-w-0">
                      {t(`categories.${categoryKey}.tab`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Product Showcase */}
        <section id="products" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                {t('categories.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('categories.subtitle')}
              </p>
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-2 md:grid-cols-4 mb-12 h-auto">
                <TabsTrigger value="playground" className="py-2">{t('categories.playground.tab')}</TabsTrigger>
                <TabsTrigger value="fitness" className="py-2">{t('categories.fitness.tab')}</TabsTrigger>
                <TabsTrigger value="interactive" className="py-2">{t('categories.interactive.tab')}</TabsTrigger>
                <TabsTrigger value="others" className="py-2">{t('categories.others.tab')}</TabsTrigger>
              </TabsList>

              {categoryKeys.map(categoryKey => (
                <TabsContent key={categoryKey} value={categoryKey} className="space-y-8">
                  <div className="bg-muted rounded-2xl p-8 mb-8">
                    <h3 className="text-2xl font-bold mb-3">{t(`categories.${categoryKey}.title`)}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {t(`categories.${categoryKey}.description`)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {t(`categories.${categoryKey}.tags`)?.map((tag, i) => (
                        <Badge key={i}>{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.filter(p => p.categoryKey === categoryKey).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        onQuickView={handleQuickView}
                        isInWishlist={isInWishlist(product.id)}
                      />
                    ))}
                  </div>
                  
                  {categoryUrls[categoryKey] && (
                    <div className="mt-12 flex justify-center">
                      <Button
                        size="lg"
                        variant="outline"
                        className="gap-2 px-8 py-6 text-lg"
                        onClick={() => window.open(categoryUrls[categoryKey], '_blank', 'noopener,noreferrer')}
                      >
                        {t('common.viewAllProducts')}
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Product Catalog / Shop */}
        <section id="shop" className="py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                {t('shop.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('shop.subtitle')}
              </p>
            </div>

            <div className="bg-background rounded-2xl p-6 mb-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('shop.category')}</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="all">{t('shop.allCategories')}</option>
                    <option value="playground">{t('categories.playground.tab')}</option>
                    <option value="fitness">{t('categories.fitness.tab')}</option>
                    <option value="interactive">{t('categories.interactive.tab')}</option>
                    <option value="others">{t('categories.others.tab')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('shop.ageRange')}</label>
                  <select
                    value={filters.ageRange}
                    onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="all">{t('shop.allAges')}</option>
                    <option value="2-4">2-4 {t('academy.years')}</option>
                    <option value="5-7">5-7 {t('academy.years')}</option>
                    <option value="8-10">8-10 {t('academy.years')}</option>
                    <option value="11-14">11-14 {t('academy.years')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('shop.skillFocus')}</label>
                  <select
                    value={filters.skillFocus}
                    onChange={(e) => setFilters({ ...filters, skillFocus: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="all">{t('shop.allSkills')}</option>
                    {[...new Set(products.map(p => p.skillFocus))].filter(Boolean).map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={handleQuickView}
                  isInWishlist={isInWishlist(product.id)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Layers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('shop.noProducts')}</h3>
                <p className="text-muted-foreground">{t('shop.adjustFilters')}</p>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8 py-6 text-lg"
                onClick={() => window.open(shopAllProductsUrl, '_blank', 'noopener,noreferrer')}
              >
                {t('common.viewAllProducts')}
                <ExternalLink className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Why FunPark Section */}
        <section id="why-vitaplay" className="py-24 bg-secondary text-secondary-foreground border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                {t('why.title')}
              </h2>
              <p className="text-xl text-secondary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                {t('why.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar, index) => {
                const Icon = pillarIcons[index % pillarIcons.length];
                const isExpanded = expandedPillar === index;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => setExpandedPillar(isExpanded ? null : index)}
                      className="w-full text-left bg-background text-foreground rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-balance">
                            {pillar.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-3">
                            {pillar.description}
                          </p>
                          
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-border"
                            >
                              <ul className="space-y-2">
                                {pillar.details.map((detail, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                          
                          <div className="mt-3 text-primary text-sm font-medium">
                            {isExpanded ? t('common.showLess') : t('common.learnMore')} →
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Safety & Development Academy */}
        <section id="academy" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                {t('academy.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('academy.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{t('academy.checklistTitle')}</h3>
                </div>
                
                <div className="space-y-3">
                  {t('academy.checklistItems')?.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{t('academy.benefitsTitle')}</h3>
                </div>
                
                <div className="space-y-4">
                  {t('academy.benefitsItems')?.map((benefit, index) => {
                    const iconList = [Activity, Target, HeartIcon, Eye];
                    const Icon = iconList[index % iconList.length];
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold mb-1">{benefit.title}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">{t('academy.guideTitle')}</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  {t('academy.selectAge')}: {ageRange} {t('academy.years')}
                </label>
                <input
                  type="range"
                  min="2"
                  max="14"
                  value={ageRange}
                  onChange={(e) => setAgeRange(Number(e.target.value))}
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>2 {t('academy.years')}</span>
                  <span>14 {t('academy.years')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {t('academy.guides')?.map((guide, index) => {
                  const ageMap = guideAges;
                  const [min, max] = ageMap[index].split('-').map(Number);
                  const isActive = ageRange >= min && ageRange <= max;
                  
                  return (
                    <div
                      key={index}
                      className={`p-6 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                          : 'bg-background text-foreground'
                      }`}
                    >
                      <h4 className="font-bold mb-2">{guide.title}</h4>
                      <p className={`text-sm mb-3 ${isActive ? 'opacity-90' : 'text-muted-foreground'}`}>
                        {t('common.ages')} {ageMap[index]}
                      </p>
                      <p className={`text-sm font-medium mb-3 ${isActive ? 'opacity-90' : ''}`}>
                        {guide.focus}
                      </p>
                      {isActive && (
                        <ul className="space-y-1 text-sm opacity-90">
                          {guide.activities.map((activity, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-current rounded-full" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                {t('testimonials.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('testimonials.subtitle')}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <Carousel opts={{ loop: true }} setApi={setTestimonialApi}>
                <CarouselContent>
                  {t('testimonials.items')?.map((testimonial, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-card text-card-foreground rounded-2xl p-8 md:p-10 shadow-lg text-center h-full">
                        <div className="flex justify-center gap-1 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-lg md:text-xl leading-relaxed mb-6">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:inline-flex -left-14 h-10 w-10" />
                <CarouselNext className="hidden md:inline-flex -right-14 h-10 w-10" />
              </Carousel>

              <div className="flex justify-center gap-2 mt-6">
                {t('testimonials.items')?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => testimonialApi?.scrollTo(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === testimonialIndex ? 'w-8 bg-primary' : 'w-2.5 bg-muted-foreground/30'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Product introduction video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-20 max-w-5xl mx-auto"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
                  {t('testimonials.videoTitle')}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('testimonials.videoSubtitle')}
                </p>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${SHOWCASE_VIDEO_ID}?rel=0${SHOWCASE_VIDEO_START ? `&start=${SHOWCASE_VIDEO_START}` : ''}`}
                  title={t('testimonials.videoLabel')}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy=""
                  allowFullScreen
                  loading="lazy"
                  // Lets YouTube load when the page is served with Cross-Origin-Embedder-Policy (see vite.config.js)
                  // eslint-disable-next-line react/no-unknown-property
                  credentialless=""
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Playground Builder */}
        <section id="builder" className="py-24 bg-accent text-accent-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                {t('builder.title')}
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                {t('builder.subtitle')}
              </p>
            </div>

            <div className="bg-background text-foreground rounded-2xl p-8 shadow-xl">
              {builderStep === 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">{t('builder.step1')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {builderEquipment.playground.map((item) => {
                      const isSelected = selectedEquipment.some(e => e.id === item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleEquipmentToggle(item)}
                          className={`text-left rounded-xl p-4 border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{formatPrice(item.price)}</p>
                          {isSelected && (
                            <Badge className="bg-primary text-primary-foreground">{t('common.selected')}</Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <Button onClick={() => setBuilderStep(1)} disabled={selectedEquipment.length === 0}>
                    {t('common.continue')}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {builderStep === 1 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">{t('builder.step2')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {builderEquipment.fitness.map((item) => {
                      const isSelected = selectedEquipment.some(e => e.id === item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleEquipmentToggle(item)}
                          className={`text-left rounded-xl p-4 border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{formatPrice(item.price)}</p>
                          {isSelected && (
                            <Badge className="bg-primary text-primary-foreground">{t('common.selected')}</Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setBuilderStep(0)}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button onClick={() => setBuilderStep(2)}>
                      {t('common.continue')}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {builderStep === 2 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">{t('builder.step3')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {builderEquipment.interactive.map((item) => {
                      const isSelected = selectedEquipment.some(e => e.id === item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleEquipmentToggle(item)}
                          className={`text-left rounded-xl p-4 border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{formatPrice(item.price)}</p>
                          {isSelected && (
                            <Badge className="bg-primary text-primary-foreground">{t('common.selected')}</Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setBuilderStep(1)}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button onClick={() => setBuilderStep(3)}>
                      {t('common.viewSummary')}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {builderStep === 3 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">{t('builder.step4')}</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-semibold mb-4">{t('builder.selectedItems')} ({selectedEquipment.length})</h4>
                      <div className="space-y-3">
                        {selectedEquipment.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-sm text-muted-foreground font-variant-tabular">{formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{t('builder.estimatedTotal')}</span>
                          <span className="text-2xl font-bold font-variant-tabular">
                            {formatPrice(selectedEquipment.reduce((sum, item) => sum + item.price, 0))}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('builder.disclaimer')}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">{t('builder.benefitsTitle')}</h4>
                      <div className="space-y-4">
                        {Object.entries(calculateBenefits()).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{t(`builder.benefitLabels.${key}`)}</span>
                              <span className="text-sm font-medium font-variant-tabular">{Math.min(value, 100)}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${Math.min(value, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm">{t('builder.safetyNote1')}</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm">{t('builder.safetyNote2')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setBuilderStep(2)}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button onClick={handleQuoteRequest} disabled={isSendingQuote}>
                      {isSendingQuote ? t('common.sending') : t('common.getQuote')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ — answers reuse existing site content */}
        <section id="faq" className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-balance">
              {t('faq.title')}
            </h2>

            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-border">
                  <AccordionTrigger className="text-lg font-semibold py-5 hover:no-underline hover:text-primary">
                    {t(`faq.questions.${item.id}`)}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-base text-muted-foreground leading-relaxed">
                    {item.answer.filter(Boolean).map((text, i) => (
                      <p key={i}>{text}</p>
                    ))}
                    {item.list && (
                      <ul className="space-y-2">
                        {item.list.map((entry, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span>{entry}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.id === 'quote' && (
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          className="gap-2"
                          onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          {t('common.buildPlaySpace')}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          {t('footer.getInTouch')}
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Product Modal */}
        <ModalDialog
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          title={selectedProduct?.title || ''}
          size="large"
        >
          {selectedProduct && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="relative aspect-square bg-muted rounded-xl overflow-hidden mb-4">
                    <img
                      src={selectedProduct.images[currentImageIndex]}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                    {selectedProduct.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-lg hover:bg-white transition-all duration-200 active:scale-95"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-lg hover:bg-white transition-all duration-200 active:scale-95"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-2">
                      {selectedProduct.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            currentImageIndex === index
                              ? 'border-primary'
                              : 'border-transparent hover:border-primary/50'
                          }`}
                        >
                          <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{selectedProduct.title}</h3>
                      <div className="flex items-center gap-3 mb-4">
                        {selectedProduct.safetyRating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold font-variant-tabular">{selectedProduct.safetyRating}</span>
                          </div>
                        )}
                        {selectedProduct.ageRange && (
                          <Badge variant="secondary">{t('common.ages')} {selectedProduct.ageRange}</Badge>
                        )}
                        {selectedProduct.skillFocus && (
                          <Badge variant="outline">{selectedProduct.skillFocus}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold font-variant-tabular">{formatPrice(selectedProduct.price)}</p>
                      {selectedProduct.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through font-variant-tabular">
                          {formatPrice(selectedProduct.originalPrice)}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  {selectedProduct.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">{t('productModal.safetyFeatures')}</h4>
                    <div className="space-y-2">
                      {selectedProduct.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}

                  {selectedProduct.benefits.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">{t('productModal.howItDevelops')}</h4>
                    <div className="space-y-2">
                      {selectedProduct.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setIsProductModalOpen(false);
                      }}
                      className="flex-1 gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {t('common.addToCart')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleToggleWishlist(selectedProduct)}
                      className="gap-2"
                    >
                      <HeartIcon className={`h-4 w-4 ${isInWishlist(selectedProduct.id) ? 'fill-current' : ''}`} />
                      {isInWishlist(selectedProduct.id) ? t('common.saved') : t('common.save')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalDialog>
      </div>
    </>
  );
};

export default HomePage;
