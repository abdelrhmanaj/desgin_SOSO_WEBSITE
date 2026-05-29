import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="text-[120px] leading-none font-serif font-bold text-gold-400/20 select-none">
          404
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-white">
            {t('notFoundTitle')}
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            {t('notFoundDesc')}
          </p>
        </div>
        <Link
          to="/"
          className="inline-block px-8 py-3.5 bg-gold-400 hover:bg-gold-500 text-black text-xs font-bold tracking-widest uppercase rounded-lg transition active:scale-95 shadow-lg"
        >
          {t('backToHome')}
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
