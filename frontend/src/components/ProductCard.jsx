import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { assetUrl } from '../config/api';

const ProductCard = ({ product, onBookNow, onQuickView, isWishlisted, onToggleWishlist }) => {
  const { t, lang } = useLanguage();
  const [hovered, setHovered] = useState(false);

  const {
    nameEn,
    nameAr,
    descriptionEn,
    descriptionAr,
    sizes,
    colors,
    originalPrice,
    discountPercentage,
    priceAfterDiscount,
    availabilityStatus,
    frontImage,
    backImage,
  } = product;

  const frontImgUrl = assetUrl(frontImage);
  const backImgUrl = assetUrl(backImage);

  const displayName = lang === 'en' ? nameEn : nameAr;
  const displayDesc = lang === 'en' ? descriptionEn : descriptionAr;

  // Function to map color string to CSS color class/value
  const getColorHex = (colorName) => {
    const name = colorName.toLowerCase().trim();
    if (name.includes('black')) return '#1A1A1A';
    if (name.includes('white')) return '#FFFFFF';
    if (name.includes('gold')) return '#D4AF37';
    if (name.includes('cream') || name.includes('ivory')) return '#FDF6E2';
    if (name.includes('green') || name.includes('emerald')) return '#0F5132';
    if (name.includes('blue') || name.includes('royal')) return '#0A58CA';
    if (name.includes('red') || name.includes('ruby')) return '#B02A37';
    if (name.includes('beige')) return '#F5F5DC';
    if (name.includes('pink')) return '#FFC0CB';
    if (name.includes('navy')) return '#0B1C3F';
    if (name.includes('champagne')) return '#E8D6C0';
    return '#808080'; // fallback gray
  };

  const isOutOfStock = availabilityStatus === 'out of stock';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col bg-white dark:bg-[#121212] rounded-lg overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image Section */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer bg-stone-100 dark:bg-stone-900"
      >
        {/* Front Image */}
        <img
          src={frontImgUrl}
          alt={displayName}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

        {/* Back Image (Shown on Hover) */}
        <img
          src={backImgUrl}
          alt={`${displayName} alternate`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            hovered ? 'opacity-100 scale-102' : 'opacity-0 scale-95'
          }`}
        />

        {/* Badges: Discount percentage & stock availability */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          {/* Discount Badge */}
          {discountPercentage > 0 ? (
            <span className="bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded">
              {discountPercentage}% {t('discount').toUpperCase()}
            </span>
          ) : (
            <span />
          )}

          {/* Out of stock badge */}
          {isOutOfStock && (
            <span className="bg-black/85 text-white text-[9px] font-medium tracking-wider uppercase px-2 py-1 rounded">
              {t('outOfStock')}
            </span>
          )}
        </div>

        {/* Floating Quick View button on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/90 dark:bg-black/90 text-xs tracking-widest font-semibold uppercase px-4 py-2.5 rounded shadow-sm scale-95 group-hover:scale-100 transition-all duration-300">
            {lang === 'en' ? 'Quick View' : 'عرض سريع'}
          </span>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            {/* Product Title */}
            <h3 
              onClick={() => onQuickView(product)}
              className="text-sm font-serif font-semibold text-[#111111] dark:text-white hover:text-gold-400 dark:hover:text-gold-300 transition duration-150 cursor-pointer line-clamp-1 flex-grow"
            >
              {displayName}
            </h3>

            {/* Favorite Wishlist Icon Button */}
            <button
              onClick={() => onToggleWishlist(product._id)}
              className="text-stone-400 hover:text-rose-500 transition-colors p-1"
              title="Add to Wishlist"
            >
              {isWishlisted ? (
                <FaHeart className="w-4 h-4 text-rose-500 scale-110 transition" />
              ) : (
                <FaRegHeart className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Description Snippet */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
            {displayDesc}
          </p>

          {/* Colors display */}
          {colors && colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2.5">
              {colors.map((color, index) => (
                <span
                  key={index}
                  className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 block cursor-help"
                  style={{ backgroundColor: getColorHex(color) }}
                  title={color}
                />
              ))}
            </div>
          )}

          {/* Sizes display */}
          {sizes && sizes.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap mb-4">
              {sizes.map((size, index) => (
                <span
                  key={index}
                  className="text-[9px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 border border-stone-200/50 dark:border-white/5 px-1.5 py-0.5 rounded"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Booking Trigger */}
        <div className="border-t border-black/5 dark:border-white/5 pt-3 mt-auto">
          <div className="flex justify-between items-center gap-2">
            {/* Price section */}
            <div className="flex flex-col">
              {discountPercentage > 0 ? (
                <>
                  <span className="text-[10px] text-stone-400 line-through font-medium">
                    {originalPrice} {t('currency')}
                  </span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    {priceAfterDiscount} {t('currency')}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-[#111111] dark:text-white">
                  {originalPrice} {t('currency')}
                </span>
              )}
            </div>

            {/* Book Now Action Button */}
            <button
              onClick={() => !isOutOfStock && onBookNow(product)}
              disabled={isOutOfStock}
              className={`px-3 py-2 text-xs font-semibold rounded uppercase tracking-wider transition-all duration-300 ${
                isOutOfStock
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  : 'bg-gold-400 hover:bg-gold-500 text-black shadow-sm active:scale-95'
              }`}
            >
              {t('bookNow')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
