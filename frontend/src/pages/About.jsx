import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { assetUrl } from '../config/api';

const About = () => {
  const { t, lang } = useLanguage();

  return (
    <div className="py-16 space-y-20 font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#111111] dark:text-white"
        >
          {t('aboutTitle')}
        </motion.h1>
        <div className="h-0.5 w-24 bg-gold-400 mx-auto" />
        <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
          {t('aboutSubtitle')}
        </p>
      </div>

      {/* Brand Story (Image + Text) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: lang === 'en' ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-black/5 dark:border-white/5 bg-stone-100"
        >
          <img
            src={assetUrl('/uploads/casual_wear.jpg')}
            alt="luxury dress crafting"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: lang === 'en' ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-white">
            {t('storyTitle')}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
            {t('storyText')}
          </p>
          <div className="pt-4 grid grid-cols-3 gap-6 text-center border-t border-black/5 dark:border-white/5">
            <div>
              <span className="block text-xl sm:text-2xl font-serif font-bold text-gold-500">8+</span>
              <span className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-widest">{lang === 'en' ? 'Years Styling' : 'سنوات خبرة'}</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-serif font-bold text-gold-500">10k+</span>
              <span className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-widest">{lang === 'en' ? 'Happy Clients' : 'عميلة سعيدة'}</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-serif font-bold text-gold-500">100%</span>
              <span className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-widest">{lang === 'en' ? 'Bespoke Fit' : 'تفصيل دقيق'}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 rounded-xl bg-white dark:bg-[#121212] border border-black/5 dark:border-white/5 shadow-sm space-y-4"
        >
          <span className="text-3xl">👁️‍🗨️</span>
          <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-white">{t('visionTitle')}</h3>
          <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">{t('visionText')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8 sm:p-10 rounded-xl bg-white dark:bg-[#121212] border border-black/5 dark:border-white/5 shadow-sm space-y-4"
        >
          <span className="text-3xl">🎯</span>
          <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-white">{t('missionTitle')}</h3>
          <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">{t('missionText')}</p>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="py-12 border-t border-b border-black/5 dark:border-white/5 space-y-12">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-serif font-bold text-[#111111] dark:text-white">{t('valuesTitle')}</h3>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-4">
            <span className="text-4xl block">✨</span>
            <h4 className="text-base font-serif font-bold text-[#111111] dark:text-white">{t('value1Title')}</h4>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">{t('value1Desc')}</p>
          </div>
          <div className="text-center space-y-3 p-4">
            <span className="text-4xl block">🤍</span>
            <h4 className="text-base font-serif font-bold text-[#111111] dark:text-white">{t('value2Title')}</h4>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">{t('value2Desc')}</p>
          </div>
          <div className="text-center space-y-3 p-4">
            <span className="text-4xl block">👑</span>
            <h4 className="text-base font-serif font-bold text-[#111111] dark:text-white">{t('value3Title')}</h4>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">{t('value3Desc')}</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6 order-2 lg:order-1"
        >
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-white">
            {t('whyChooseUs')}
          </h3>
          <ul className="space-y-4 text-sm sm:text-base text-stone-600 dark:text-stone-300">
            <li className="flex items-start gap-3">
              <span className="text-gold-400 mt-1">✔</span>
              <span>{t('why1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold-400 mt-1">✔</span>
              <span>{t('why2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold-400 mt-1">✔</span>
              <span>{t('why3')}</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-black/5 dark:border-white/5 bg-stone-100 order-1 lg:order-2"
        >
          <img
            src={assetUrl('/uploads/wedding_dresses.jpg')}
            alt="wedding gown designer atelier"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>
    </div>
  );
};

export default About;
