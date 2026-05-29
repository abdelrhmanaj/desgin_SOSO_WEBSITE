import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../hooks/useLanguage';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import api from '../utils/api';
import { WHATSAPP_NUMBER } from '../config/contact';
import { BRAND_NAME } from '../config/brand';

const formatDateInputValue = (date) => date.toISOString().split('T')[0];

const getMinimumNeededDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return formatDateInputValue(date);
};

const formatDisplayDate = (value, lang) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BookingModal = ({ product, selectedSize, selectedColor, isOpen, onClose }) => {
  const { t, lang } = useLanguage();
  const minNeededDate = getMinimumNeededDate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  useEffect(() => {
    if (product) {
      setValue('productName', lang === 'en' ? product.nameEn : product.nameAr);
      setValue('productCategory', product.category ? (lang === 'en' ? product.category.nameEn : product.category.nameAr) : 'Luxury Wear');
      setValue('selectedSize', selectedSize || (product.sizes && product.sizes[0]) || '');
      setValue('selectedColor', selectedColor || (product.colors && product.colors[0]) || '');
      setValue('neededDate', getMinimumNeededDate());
    }
  }, [product, selectedSize, selectedColor, setValue, lang]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const onSubmit = async (data) => {
    try {
      const bookingDate = new Date();
      const bookingData = {
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        productId: product._id,
        selectedSize: data.selectedSize,
        selectedColor: data.selectedColor,
        neededDate: data.neededDate,
        notes: data.notes || '',
      };

      await api.post('/bookings', bookingData);

      const message = `✨ *${lang === 'en' ? 'NEW BOOKING REQUEST' : 'طلب حجز جديد'}* ✨
-----------------------------
👤 *${t('bookingFormName')}:* ${data.fullName}
📧 *${t('bookingFormEmail')}:* ${data.email}
📞 *${t('bookingFormPhone')}:* ${data.phone}
👗 *${lang === 'en' ? 'Product' : 'المنتج'}:* ${data.productName}
🏷️ *${lang === 'en' ? 'Category' : 'القسم'}:* ${data.productCategory}
📏 *${t('bookingFormSize')}:* ${data.selectedSize}
🎨 *${t('bookingFormColor')}:* ${data.selectedColor}
📅 *${lang === 'en' ? 'Booked Date' : 'تاريخ الحجز'}:* ${formatDisplayDate(bookingDate, lang)}
🗓️ *${lang === 'en' ? 'Needed Date' : 'تاريخ احتياج الفستان'}:* ${formatDisplayDate(data.neededDate, lang)}
📝 *${t('bookingFormNotes')}:* ${data.notes || '-'}
-----------------------------
_Generated automatically from ${BRAND_NAME}_`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

      reset();
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
      alert(error.response?.data?.message || 'Something went wrong. Please check your network and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-3 sm:p-4 text-[#241E1B] dark:text-[#F3EEE7]">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative z-10 flex w-full max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex-col bg-[#fff8f1] dark:bg-[#17131a] rounded-xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 animate-fade-in">
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#241E1B] dark:text-white flex items-center gap-1.5">
              {t('bookingTitle')}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">{t('bookingSubtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-stone-600 dark:text-stone-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1.5">
              {t('bookingFormName')} *
            </label>
            <input
              type="text"
              className="w-full text-[#241E1B] dark:text-[#F3EEE7] placeholder:text-stone-500 dark:placeholder:text-stone-400"
              placeholder="e.g., Sarah Ahmed"
              {...register('fullName', { required: true })}
            />
            {errors.fullName && <span className="text-[10px] text-red-500">Name is required</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1.5">
                {t('bookingFormEmail')} *
              </label>
              <input
                type="email"
                className="w-full font-sans text-[#241E1B] dark:text-[#F3EEE7] placeholder:text-stone-500 dark:placeholder:text-stone-400"
                placeholder="e.g., sarah@gmail.com"
                {...register('email', {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
              />
              {errors.email && <span className="text-[10px] text-red-500">Valid email is required</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1.5">
                {t('bookingFormPhone')} *
              </label>
              <input
                type="text"
                className="w-full font-sans text-[#241E1B] dark:text-[#F3EEE7] placeholder:text-stone-500 dark:placeholder:text-stone-400"
                placeholder="e.g., 01012345678"
                {...register('phone', { required: true })}
              />
              {errors.phone && <span className="text-[10px] text-red-500">Phone number is required</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/70 dark:bg-black/25 p-3 rounded-lg border border-black/10 dark:border-white/10">
            <div>
              <label className="block text-[10px] font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Product' : 'المنتج'}
              </label>
              <input
                type="text"
                disabled
                className="w-full bg-transparent border-none py-0 px-0 text-xs font-semibold text-[#241E1B] dark:text-white"
                {...register('productName')}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Category' : 'القسم'}
              </label>
              <input
                type="text"
                disabled
                className="w-full bg-transparent border-none py-0 px-0 text-xs font-semibold text-[#241E1B] dark:text-white"
                {...register('productCategory')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1.5">
                {t('bookingFormSize')} *
              </label>
              <select className="w-full bg-white dark:bg-black text-[#241E1B] dark:text-[#F3EEE7]" {...register('selectedSize', { required: true })}>
                {product.sizes && product.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1.5">
                {t('bookingFormColor')} *
              </label>
              <select className="w-full bg-white dark:bg-black text-[#241E1B] dark:text-[#F3EEE7]" {...register('selectedColor', { required: true })}>
                {product.colors && product.colors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1.5">
              {lang === 'en' ? 'Date you need the dress' : 'تاريخ احتياج الفستان'} *
            </label>
            <input
              type="date"
              min={minNeededDate}
              className="w-full font-sans text-[#241E1B] dark:text-[#F3EEE7] placeholder:text-stone-500 dark:placeholder:text-stone-400"
              {...register('neededDate', {
                required: true,
                validate: (value) => value >= getMinimumNeededDate(),
              })}
            />
            <p className="mt-1 text-[10px] text-stone-500 dark:text-stone-400">
              {lang === 'en'
                ? `Earliest available date: ${formatDisplayDate(minNeededDate, lang)}`
                : `أقرب تاريخ متاح: ${formatDisplayDate(minNeededDate, lang)}`}
            </p>
            {errors.neededDate && (
              <span className="text-[10px] text-red-500">
                {lang === 'en' ? 'Please choose a date at least 5 days from today' : 'اختاري تاريخ بعد 5 أيام على الأقل من اليوم'}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1.5">
              {t('bookingFormNotes')}
            </label>
            <textarea
              className="w-full min-h-[80px] text-[#241E1B] dark:text-[#F3EEE7] placeholder:text-stone-500 dark:placeholder:text-stone-400"
              placeholder={lang === 'en' ? 'e.g., Shorten the length by 2cm, sleeve modifications...' : 'مثال: تقصير الطول بمقدار 2 سم، تعديل الأكمام...'}
              {...register('notes')}
            />
          </div>

          <div className="pt-2 border-t border-black/5 dark:border-white/5 flex gap-3 rtl:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-semibold border border-black/10 dark:border-white/10 text-stone-700 dark:text-stone-100 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] py-3 text-xs font-semibold bg-gold-400 hover:bg-gold-500 text-black rounded-md flex items-center justify-center gap-1.5 transition active:scale-98 disabled:opacity-50"
            >
              <FiCheckCircle className="w-4 h-4" />
              {t('bookingSubmit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
