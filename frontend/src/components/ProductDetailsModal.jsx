import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from '../hooks/useLanguage';
import { formatPrice } from '../utils/helpers';
import BookingForm from './BookingForm';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const t = useTranslation();

  if (!product) return null;

  const allImages = [product.frontImage, product.backImage, ...product.gallery];
  const discountedPrice = product.originalPrice * (1 - product.discountPercentage / 100);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-2xl font-bold">{product.nameEn}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Image Gallery */}
              <div>
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 h-96">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={allImages[currentImageIndex]}
                    alt={`${product.nameEn} ${currentImageIndex}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Buttons */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <FiChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <FiChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {allImages.map((img, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        whileHover={{ scale: 1.05 }}
                        className={`w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden border-2 transition-colors ${
                          idx === currentImageIndex ? 'border-pink-600' : 'border-gray-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{product.descriptionEn}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl font-bold text-pink-600">
                      {formatPrice(discountedPrice)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{product.discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className={`text-sm ${
                    product.availabilityStatus === 'in stock'
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}>
                    {product.availabilityStatus === 'in stock' ? t.inStock : t.outOfStock}
                  </p>
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">{t.colors}</label>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-colors ${
                          selectedColor === color
                            ? 'border-gray-900 dark:border-white'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">{t.sizes}</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedSize === size
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-pink-600'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBookingForm(true)}
                  disabled={product.availabilityStatus !== 'in stock'}
                  className="w-full py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {t.bookNow}
                </motion.button>

                <button
                  onClick={onClose}
                  className="w-full py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {t.cancel || 'Cancel'}
                </button>
              </div>
            </div>

            {/* Booking Form Modal */}
            {showBookingForm && (
              <BookingForm
                product={product}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onClose={() => setShowBookingForm(false)}
                onClose={() => {
                  setShowBookingForm(false);
                  onClose();
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;
