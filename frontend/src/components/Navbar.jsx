import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { FiMenu, FiX, FiSun, FiMoon, FiGlobe, FiUser, FiLogOut, FiPhone } from 'react-icons/fi';
import { CONTACT_PHONE_PRIMARY_DISPLAY } from '../config/contact';
import { BRAND_LOGO_SRC, BRAND_NAME, BRAND_TAGLINE_AR, BRAND_TAGLINE_EN } from '../config/brand';

const Navbar = ({ wishlistCount }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-black/10 dark:border-white/10 glass shadow-sm">
      <div className="hidden lg:block bg-[#241E1B] dark:bg-[#0B0B0E] text-white">
        <div className="max-w-7xl mx-auto px-6 h-8 flex items-center justify-between text-[11px] font-semibold">
          <span className="text-gold-200">{lang === 'en' ? BRAND_TAGLINE_EN : BRAND_TAGLINE_AR}</span>
          <a href={`tel:${CONTACT_PHONE_PRIMARY_DISPLAY.replace(/\s/g, '')}`} className="flex items-center gap-2 text-white/85 hover:text-gold-200 transition">
            <FiPhone className="w-3.5 h-3.5" />
            <span dir="ltr">{CONTACT_PHONE_PRIMARY_DISPLAY}</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-[72px]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3 text-[#241E1B] dark:text-white">
              <img
                src={BRAND_LOGO_SRC}
                alt={`${BRAND_NAME} logo`}
                className="w-11 h-11 rounded-full object-cover border border-gold-400/40 shadow-sm"
              />
              <span className="leading-none">
                <span className="block text-lg sm:text-xl font-serif font-bold">{BRAND_NAME}</span>
                <span className="block text-[10px] font-bold text-gold-600 dark:text-gold-300 tracking-widest">FASHION ATELIER</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 font-semibold text-xs tracking-wider uppercase">
            <Link to="/" className="px-4 py-2 rounded-full hover:bg-gold-50 dark:hover:bg-white/5 hover:text-gold-600 transition-colors">{t('navHome')}</Link>
            <Link to="/about" className="px-4 py-2 rounded-full hover:bg-gold-50 dark:hover:bg-white/5 hover:text-gold-600 transition-colors">{t('navAbout')}</Link>
            <Link to="/contact" className="px-4 py-2 rounded-full hover:bg-gold-50 dark:hover:bg-white/5 hover:text-gold-600 transition-colors">{t('navContact')}</Link>
            {token && (
              <Link to="/admin" className="px-4 py-2 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-200 hover:bg-gold-200 transition-colors">
                {t('navDashboard')}
              </Link>
            )}
          </div>

          {/* Toolbar Controls */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Wishlist Link */}
            {wishlistCount > 0 && (
              <div className="relative p-2 text-rose-500 hover:scale-115 transition cursor-pointer">
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold font-sans">
                  {wishlistCount}
                </span>
                <span className="text-sm">❤️</span>
              </div>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="h-10 px-3 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1.5"
              title="Change Language"
            >
              <FiGlobe className="w-5 h-5 text-[#111111] dark:text-white" />
              <span className="text-xs font-semibold font-sans">{lang === 'ar' ? 'EN' : 'العربية'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-[#241E1B] dark:text-white flex items-center justify-center"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* User Access */}
            {token ? (
              <button
                onClick={handleLogout}
                className="h-10 w-10 rounded-full hover:bg-red-500/10 text-red-500 transition-all flex items-center justify-center"
                title={t('navLogout')}
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/login"
                className="h-10 w-10 rounded-full bg-[#241E1B] dark:bg-gold-400 text-white dark:text-black hover:bg-gold-600 transition-all flex items-center justify-center"
                title={t('navLogin')}
              >
                <FiUser className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Wishlist Link for mobile */}
            {wishlistCount > 0 && (
              <div className="relative p-2 text-rose-500">
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold font-sans">
                  {wishlistCount}
                </span>
                <span className="text-sm">❤️</span>
              </div>
            )}

            <button
              onClick={toggleLanguage}
              className="p-1 rounded-full text-[#111111] dark:text-white text-xs flex items-center gap-0.5"
            >
              <FiGlobe className="w-4 h-4" />
              <span className="font-sans font-bold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1 rounded-full text-[#111111] dark:text-white"
            >
              {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#111111] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-black/5 dark:border-white/5 transition-all duration-300">
          <div className="px-2 pt-2 pb-6 space-y-2 sm:px-3 text-center flex flex-col font-medium tracking-wide uppercase">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-base"
            >
              {t('navHome')}
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-base"
            >
              {t('navAbout')}
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-base"
            >
              {t('navContact')}
            </Link>

            {token ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-md text-gold-500 hover:bg-black/5 dark:hover:bg-white/5 text-base font-semibold"
                >
                  {t('navDashboard')}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center block px-3 py-3 rounded-md text-red-500 hover:bg-red-500/10 text-base"
                >
                  {t('navLogout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-base"
              >
                {t('navLogin')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
