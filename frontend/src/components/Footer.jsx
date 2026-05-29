import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { FiFacebook, FiInstagram, FiTwitter, FiSend } from 'react-icons/fi';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_PRIMARY_DISPLAY,
  GOOGLE_MAPS_URL,
} from '../config/contact';
import { BRAND_LOGO_SRC, BRAND_NAME } from '../config/brand';

const Footer = () => {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categoryLinks = [
    { slug: 'kids-wear', en: 'Kids Wear', ar: 'أطفالي' },
    { slug: 'casual-wear', en: 'Casual Wear', ar: 'كاجوال' },
    { slug: 'modest-wear', en: 'Modest Islamic Wear', ar: 'زي شرعي' },
    { slug: 'evening-dresses', en: 'Evening Dresses', ar: 'سواريه' },
    { slug: 'wedding-dresses', en: 'Wedding Dresses', ar: 'فساتين أفراح' },
  ];

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#111111] text-stone-400 border-t border-gold-900/10 dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={BRAND_LOGO_SRC}
                alt={`${BRAND_NAME} logo`}
                className="w-12 h-12 rounded-full object-cover border border-gold-400/30"
              />
              <h3 className="text-xl font-serif text-white tracking-widest font-bold">{BRAND_NAME}</h3>
            </div>
            <p className="text-sm leading-relaxed text-stone-500">
              {lang === 'en'
                ? 'Curating bespoke luxury fashion statements for women who appreciate timeless grace and absolute quality.'
                : 'نقدم أزياء فاخرة وراقية للمرأة التي تقدر الأناقة والجودة والتفاصيل المصممة بعناية.'}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse text-white">
              <a href="#" className="hover:text-gold-400 transition-colors p-2 bg-white/5 rounded-full"><FiFacebook /></a>
              <a href="#" className="hover:text-gold-400 transition-colors p-2 bg-white/5 rounded-full"><FiInstagram /></a>
              <a href="#" className="hover:text-gold-400 transition-colors p-2 bg-white/5 rounded-full"><FiTwitter /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-6">
              {lang === 'en' ? 'Boutique Collection' : 'مجموعات الأتيليه'}
            </h4>
            <ul className="space-y-3 text-sm">
              {categoryLinks.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/?category=${category.slug}`}
                    className="hover:text-gold-400 transition-colors"
                  >
                    {lang === 'en' ? category.en : category.ar}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-6">{t('navContact')}</h4>
            <ul className="space-y-3 text-sm text-stone-500">
              <li>
                <span className="text-white block text-xs">{t('contactAddress')}</span>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors"
                >
                  {t('boutiqueAddressText')}
                </a>
              </li>
              <li>
                <span className="text-white block text-xs">{t('contactPhone')}</span>
                {CONTACT_PHONE_PRIMARY_DISPLAY}
              </li>
              <li>
                <span className="text-white block text-xs">{t('contactEmail')}</span>
                {CONTACT_EMAIL}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-6">{t('newsletterTitle')}</h4>
            <p className="text-sm text-stone-500 mb-4">{t('newsletterSubtitle')}</p>

            <form onSubmit={handleSubscribe} className="flex relative">
              <input
                type="email"
                required
                placeholder={t('newsletterPlaceholder')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-md py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-gold-400 focus:ring-0"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-gold-400 hover:bg-gold-500 text-black rounded-md flex items-center justify-center transition"
              >
                <FiSend />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-gold-400 mt-2 font-medium">{t('newsletterSuccess')}</p>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All Rights Reserved.</p>
          <div className="space-x-6 rtl:space-x-reverse">
            <Link to="/about" className="hover:text-stone-400 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-stone-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
