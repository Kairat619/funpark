import React from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { formatPrice } from '@/lib/currency.js';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, onQuickView, isInWishlist }) => {
  const { t } = useLanguage();

  return (
    <div className="group bg-card text-card-foreground rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          onClick={() => onQuickView(product)}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => onToggleWishlist(product)}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 active:scale-95 ${
              isInWishlist
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
            aria-label={isInWishlist ? t('common.remove') : t('common.save')}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onQuickView(product)}
            className="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white backdrop-blur-sm transition-all duration-200 active:scale-95"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
        {product.badgeText && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {product.badgeText}
          </Badge>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-snug text-balance">{product.title}</h3>
          {product.safetyRating && (
            <div className="flex items-center gap-1 text-sm font-medium shrink-0">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-variant-tabular">{product.safetyRating}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4 text-sm">
          {product.ageRange && (
            <Badge variant="secondary" className="text-xs">
              {t('common.ages')} {product.ageRange}
            </Badge>
          )}
          {product.skillFocus && (
            <Badge variant="outline" className="text-xs">
              {product.skillFocus}
            </Badge>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold font-variant-tabular">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through font-variant-tabular">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full gap-2 transition-all duration-200"
          >
            <ShoppingCart className="h-4 w-4" />
            {t('common.addToCart')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;