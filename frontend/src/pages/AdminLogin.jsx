import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../hooks/useLanguage';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { BRAND_LOGO_SRC, BRAND_NAME } from '../config/brand';

const AdminLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoginError('');
      const res = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        navigate('/admin');
      }
    } catch {
      setLoginError(t('adminLoginError'));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-xl border border-black/5 dark:border-white/5 overflow-hidden">
          <div className="bg-gradient-to-r from-[#111111] to-stone-800 p-8 text-center space-y-2">
            <img
              src={BRAND_LOGO_SRC}
              alt={`${BRAND_NAME} logo`}
              className="w-16 h-16 rounded-full object-cover mx-auto border border-gold-400/40"
            />
            <p className="text-gold-400 text-xs font-bold tracking-widest uppercase font-sans">{BRAND_NAME}</p>
            <h1 className="text-2xl font-serif font-bold text-white">{t('adminLoginTitle')}</h1>
            <p className="text-xs text-stone-300 font-sans">{t('adminLoginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-300 mb-1.5">
                {t('adminEmail')}
              </label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-3 rtl:left-auto rtl:right-3 text-stone-400 w-4 h-4 pointer-events-none" />
                <input
                  type="email"
                  className="w-full pl-10 rtl:pl-3 rtl:pr-10 font-sans"
                  placeholder="admin@wardrobe.com"
                  {...register('email', { required: true })}
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-500">Email required</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-300 mb-1.5">
                {t('adminPassword')}
              </label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3 rtl:left-auto rtl:right-3 text-stone-400 w-4 h-4 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 rtl:pl-10 rtl:pr-10 font-sans"
                  placeholder="**********"
                  {...register('password', { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 rtl:right-auto rtl:left-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="text-[10px] text-red-500">Password required</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gold-400 hover:bg-gold-500 text-black text-xs font-bold tracking-widest uppercase rounded-lg transition active:scale-98 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? t('loading') : t('adminLoginBtn')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
