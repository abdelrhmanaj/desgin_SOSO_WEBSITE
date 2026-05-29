import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';
import { useTranslation } from '../hooks/useLanguage';
import { generateWhatsAppLink } from '../utils/helpers';
import { bookingService } from '../services/api';
import { WHATSAPP_NUMBER } from '../config/contact';

const BookingForm = ({ product, selectedSize, selectedColor, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const t = useTranslation();

  const whatsappNumber = WHATSAPP_NUMBER;
  const minNeededDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toISOString().split('T')[0];
  })();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const bookingData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        productName: product.nameEn,
        category: product.category,
        selectedSize,
        selectedColor,
        bookingDate: new Date().toLocaleDateString(),
        neededDate: data.neededDate,
        notes: data.notes,
      };

      // Save booking to backend
      await bookingService.create(bookingData);

      // Generate WhatsApp link
      const whatsappLink = generateWhatsAppLink(bookingData, whatsappNumber);

      // Show success message
      setSuccessMessage(true);
      reset();

      // Redirect to WhatsApp after 2 seconds
      setTimeout(() => {
        window.open(whatsappLink, '_blank');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error submitting booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FiCheck size={32} className="text-white" />
          </motion.div>
          <h3 className="text-xl font-bold mb-2">{t.success}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t.redirectingWhatsApp || 'Redirecting to WhatsApp...'}</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">{t.booking}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">{t.fullName}</label>
            <input
              {...register('fullName', { required: 'Name is required' })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="Your name"
            />
            {errors.fullName && <span className="text-red-600 text-sm">{errors.fullName.message}</span>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">{t.email}</label>
            <input
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="your@email.com"
            />
            {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2">{t.phone}</label>
            <input
              {...register('phone', { required: 'Phone is required' })}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="+201020187889"
            />
            {errors.phone && <span className="text-red-600 text-sm">{errors.phone.message}</span>}
          </div>

          {/* Product Info (Read-only) */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm"><strong>{t.product}:</strong> {product.nameEn}</p>
            {selectedSize && <p className="text-sm"><strong>{t.sizes}:</strong> {selectedSize}</p>}
            {selectedColor && <p className="text-sm"><strong>{t.colors}:</strong> {selectedColor}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date you need the dress</label>
            <input
              {...register('neededDate', {
                required: 'Needed date is required',
                validate: (value) => value >= minNeededDate || 'Choose a date at least 5 days from today',
              })}
              type="date"
              min={minNeededDate}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
            {errors.neededDate && <span className="text-red-600 text-sm">{errors.neededDate.message}</span>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">{t.notes}</label>
            <textarea
              {...register('notes')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="Any special requests?"
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-semibold"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : t.submit}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BookingForm;
