import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../utils/api';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_PRIMARY_DISPLAY,
  CONTACT_PHONE_SECONDARY_DISPLAY,
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_URL,
  WHATSAPP_NUMBER,
} from '../config/contact';
import { BRAND_NAME } from '../config/brand';

const Contact = () => {
  const { t, lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/contact', data);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 6000);
    } catch {
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#111111] dark:text-white"
          >
            {t('contactTitle')}
          </motion.h1>
          <div className="h-0.5 w-24 bg-gold-400 mx-auto" />
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
            {t('contactSubtitle')}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'en' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-gold-500 w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">{t('contactPhone')}</p>
                  <p className="text-sm font-semibold text-[#111111] dark:text-white font-sans" dir="ltr">{CONTACT_PHONE_PRIMARY_DISPLAY}</p>
                  <p className="text-sm font-semibold text-[#111111] dark:text-white font-sans" dir="ltr">{CONTACT_PHONE_SECONDARY_DISPLAY}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-gold-500 w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">{t('contactEmail')}</p>
                  <p className="text-sm font-semibold text-[#111111] dark:text-white">{CONTACT_EMAIL}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-gold-500 w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">{t('contactAddress')}</p>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#111111] dark:text-white leading-relaxed hover:text-gold-500 transition"
                  >
                    {t('boutiqueAddressText')}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{t('socialMedia')}</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:border-gold-400 hover:text-gold-500 transition">
                  <FiInstagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:border-gold-400 hover:text-gold-500 transition">
                  <FiFacebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:border-green-400 hover:text-green-500 transition"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="rounded-xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm">
              <iframe
                title={`${BRAND_NAME} Location`}
                src={GOOGLE_MAPS_EMBED_URL}
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'en' ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 p-8 sm:p-10 bg-white dark:bg-[#121212] rounded-xl border border-black/5 dark:border-white/5 shadow-sm"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <span className="text-5xl">✅</span>
                <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-white">{lang === 'en' ? 'Message Sent!' : 'تم إرسال رسالتك!'}</h3>
                <p className="text-sm text-stone-500">{t('contactSuccess')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                      {t('contactFormName')} *
                    </label>
                    <input
                      type="text"
                      className="w-full"
                      placeholder={lang === 'en' ? 'Your full name' : 'اسمك الكامل'}
                      {...register('name', { required: true })}
                    />
                    {errors.name && <span className="text-[10px] text-red-500">Required</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                      {t('contactFormPhone')}
                    </label>
                    <input
                      type="text"
                      className="w-full font-sans"
                      placeholder="+20 1xx xxx xxxx"
                      {...register('phone')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    {t('contactFormEmail')} *
                  </label>
                  <input
                    type="email"
                    className="w-full font-sans"
                    placeholder="your@email.com"
                    {...register('email', { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                  />
                  {errors.email && <span className="text-[10px] text-red-500">Valid email required</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    {t('contactFormMessage')} *
                  </label>
                  <textarea
                    rows={5}
                    className="w-full"
                    placeholder={lang === 'en' ? 'Tell us about your requirements...' : 'أخبرينا عن متطلباتك...'}
                    {...register('message', { required: true })}
                  />
                  {errors.message && <span className="text-[10px] text-red-500">Message required</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gold-400 hover:bg-gold-500 text-black text-xs font-bold tracking-widest uppercase rounded-lg flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
                >
                  <FiSend className="w-4 h-4" />
                  {isSubmitting ? t('loading') : t('contactFormSubmit')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
