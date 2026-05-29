import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { FiX, FiInfo } from 'react-icons/fi';
import { assetUrl } from '../config/api';

const ProductModal = ({ product, isOpen, onClose, onBookNow }) => {
  if (!isOpen || !product) return null;

  return (
    <ProductModalContent
      key={product._id || product.frontImage}
      product={product}
      onClose={onClose}
      onBookNow={onBookNow}
    />
  );
};

const ProductModalContent = ({ product, onClose, onBookNow }) => {
  const { t, lang } = useLanguage();
  const [activeImage, setActiveImage] = useState(product.frontImage);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');

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
    gallery,
  } = product;

  const displayName = lang === 'en' ? nameEn : nameAr;
  const displayDesc = lang === 'en' ? descriptionEn : descriptionAr;

  // Make sure gallery has at least front and back image if empty
  const allImages = gallery && gallery.length > 0 ? gallery : [product.frontImage, product.backImage];

  const isOutOfStock = availabilityStatus === 'out of stock';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121212] rounded-xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 z-10 animate-fade-in flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 rounded-full bg-black/10 dark:bg-white/10 text-stone-700 dark:text-stone-300 hover:bg-black/20 dark:hover:bg-white/20 transition-all"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Left column: Image Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 overflow-y-auto">
          {/* Main Large Image */}
          <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 mb-4">
            <img
              src={assetUrl(activeImage)}
              alt={displayName}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails row */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-16 h-20 rounded border-2 overflow-hidden transition ${
                    activeImage === img ? 'border-gold-400' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={assetUrl(img)}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Product Info & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category Name */}
            <span className="text-[10px] tracking-widest text-gold-500 font-bold uppercase mb-2 block">
              {product.category ? (lang === 'en' ? product.category.nameEn : product.category.nameAr) : ''}
            </span>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#111111] dark:text-white mb-3">
              {displayName}
            </h2>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 mb-4">
              {discountPercentage > 0 ? (
                <>
                  <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                    {priceAfterDiscount} {t('currency')}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    {originalPrice} {t('currency')}
                  </span>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded">
                    -{discountPercentage}% {t('discount').toUpperCase()}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-[#111111] dark:text-white">
                  {originalPrice} {t('currency')}
                </span>
              )}
            </div>

            {/* Availability status */}
            <div className="mb-6 flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className={isOutOfStock ? 'text-red-500' : 'text-green-500 font-medium'}>
                {isOutOfStock ? t('outOfStock') : t('inStock')}
              </span>
            </div>

            {/* Full description */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2 flex items-center gap-1">
                <FiInfo className="w-3.5 h-3.5" />
                {t('description')}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans max-h-48 overflow-y-auto">
                {displayDesc}
              </p>
            </div>

            {/* Selection Options (Colors) */}
            {colors && colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
                  {t('selectColor')}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs font-medium px-3 py-1.5 rounded border transition-all ${
                        selectedColor === color
                          ? 'border-gold-400 bg-gold-50 dark:bg-gold-950/15 text-gold-600 dark:text-gold-300 font-semibold'
                          : 'border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Options (Sizes) */}
            {sizes && sizes.length > 0 && (
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
                  {t('selectSize')}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs font-medium px-3 py-1.5 rounded border transition-all ${
                        selectedSize === size
                          ? 'border-gold-400 bg-gold-50 dark:bg-gold-950/15 text-gold-600 dark:text-gold-300 font-semibold'
                          : 'border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Book Now Action Button */}
          <button
            onClick={() => {
              onClose();
              onBookNow(product, selectedSize, selectedColor);
            }}
            disabled={isOutOfStock}
            className={`w-full py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wider text-center transition-all ${
              isOutOfStock
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                : 'bg-gold-400 hover:bg-gold-500 text-black shadow-lg font-bold'
            }`}
          >
            {t('bookNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
