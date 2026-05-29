import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  FiPackage, FiGrid, FiCalendar, FiMessageSquare,
  FiPlus, FiEdit2, FiTrash2, FiDownload, FiX, FiCheck, FiEye, FiEyeOff
} from 'react-icons/fi';
import api from '../utils/api';
import { BRAND_NAME } from '../config/brand';
import { API_ORIGIN, assetUrl } from '../config/api';

const AdminDashboard = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Check auth
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) navigate('/login');
  }, [navigate, token]);

  // State
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productImages, setProductImages] = useState({ frontImage: null, backImage: null, gallery: [] });

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryImage, setCategoryImage] = useState(null);

  const productForm = useForm();
  const categoryForm = useForm();

  // Fetch all data
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, bookRes, msgRes, opinionRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/bookings'),
        api.get('/contact'),
        api.get('/opinions/admin'),
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (bookRes.data.success) setBookings(bookRes.data.data);
      if (msgRes.data.success) setMessages(msgRes.data.data);
      if (opinionRes.data.success) setOpinions(opinionRes.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAll();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchAll]);

  // ── PRODUCT HANDLERS ──────────────────────────────
  const openAddProduct = () => {
    setEditingProduct(null);
    productForm.reset({
      nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '',
      category: '', sizes: '', colors: '', originalPrice: '',
      discountPercentage: '0', availabilityStatus: 'in stock', isFeatured: false,
    });
    setProductImages({ frontImage: null, backImage: null, gallery: [] });
    setShowProductForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    productForm.reset({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      category: product.category?._id || product.category,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      availabilityStatus: product.availabilityStatus,
      isFeatured: product.isFeatured,
    });
    setProductImages({ frontImage: null, backImage: null, gallery: [] });
    setShowProductForm(true);
  };

  const onProductSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'sizes' || key === 'colors') {
          // Convert comma-separated to JSON array
          const arr = data[key].split(',').map(s => s.trim()).filter(Boolean);
          formData.append(key, JSON.stringify(arr));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (productImages.frontImage) formData.append('frontImage', productImages.frontImage);
      if (productImages.backImage) formData.append('backImage', productImages.backImage);
      if (productImages.gallery.length > 0) {
        productImages.gallery.forEach(f => formData.append('gallery', f));
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowProductForm(false);
      fetchAll();
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm(lang === 'en' ? 'Delete this product?' : 'حذف هذا المنتج؟')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchAll();
    } catch {
      alert('Failed to delete product');
    }
  };

  // ── CATEGORY HANDLERS ─────────────────────────────
  const onCategorySubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (categoryImage) formData.append('image', categoryImage);

      await api.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowCategoryForm(false);
      categoryForm.reset();
      setCategoryImage(null);
      fetchAll();
    } catch (err) {
      alert('Failed to save category: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm(lang === 'en' ? 'Delete this category?' : 'حذف هذا القسم؟')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchAll();
    } catch {
      alert('Failed to delete category');
    }
  };

  // ── BOOKING HANDLERS ──────────────────────────────
  const updateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      fetchAll();
    } catch {
      alert('Failed to update booking status');
    }
  };

  const exportBookings = () => {
    const link = document.createElement('a');
    link.href = `${API_ORIGIN}/api/bookings/export`;
    link.setAttribute('Authorization', `Bearer ${token}`);
    // Use fetch to get with auth header
    fetch(`${API_ORIGIN}/api/bookings/export`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings.csv';
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  const toggleOpinionVisibility = async (id, isVisible) => {
    try {
      await api.put(`/opinions/${id}`, { isVisible });
      fetchAll();
    } catch {
      alert(lang === 'en' ? 'Failed to update opinion visibility' : 'فشل تحديث ظهور الرأي');
    }
  };

  const deleteOpinion = async (id) => {
    if (!window.confirm(lang === 'en' ? 'Delete this opinion?' : 'حذف هذا الرأي؟')) return;

    try {
      await api.delete(`/opinions/${id}`);
      fetchAll();
    } catch {
      alert(lang === 'en' ? 'Failed to delete opinion' : 'فشل حذف الرأي');
    }
  };

  // ── STATS ─────────────────────────────────────────
  const stats = [
    { label: t('statsTotalProducts'), value: products.length, icon: <FiPackage />, color: 'text-blue-500' },
    { label: t('statsTotalCategories'), value: categories.length, icon: <FiGrid />, color: 'text-purple-500' },
    { label: t('statsTotalBookings'), value: bookings.length, icon: <FiCalendar />, color: 'text-gold-500' },
    { label: t('statsTotalMessages'), value: messages.length, icon: <FiMessageSquare />, color: 'text-green-500' },
    { label: lang === 'en' ? 'Customer Opinions' : 'آراء العملاء', value: opinions.length, icon: <FiMessageSquare />, color: 'text-rose-500' },
  ];

  const tabs = [
    { id: 'products', label: t('tabProducts'), icon: <FiPackage /> },
    { id: 'categories', label: t('tabCategories'), icon: <FiGrid /> },
    { id: 'bookings', label: t('tabBookings'), icon: <FiCalendar /> },
    { id: 'messages', label: t('tabMessages'), icon: <FiMessageSquare /> },
    { id: 'opinions', label: lang === 'en' ? 'Opinions' : 'الآراء', icon: <FiMessageSquare /> },
  ];

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    Contacted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    Completed: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  };

  const formatBookingDate = (value) => (
    value ? new Date(value).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : '—'
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-white">{t('dashTitle')}</h1>
            <p className="text-xs text-stone-400 mt-1">{BRAND_NAME} — Admin Control Center</p>
          </div>
          <div className="text-xs text-stone-400 bg-white dark:bg-[#121212] px-4 py-2 rounded-lg border border-black/5 dark:border-white/5">
            {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white dark:bg-[#121212] rounded-xl p-5 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-4"
            >
              <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold font-serif text-[#111111] dark:text-white">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-stone-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white dark:bg-[#121212] p-1.5 rounded-xl border border-black/5 dark:border-white/5 shadow-sm overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow'
                  : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ───────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-serif font-bold text-[#111111] dark:text-white">{t('tabProducts')} ({products.length})</h2>
              <button
                onClick={openAddProduct}
                className="flex items-center gap-2 px-4 py-2 bg-gold-400 hover:bg-gold-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition"
              >
                <FiPlus /> {t('addProduct')}
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-stone-400">{t('loading')}</div>
            ) : (
              <div className="bg-white dark:bg-[#121212] rounded-xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans">
                    <thead className="bg-stone-50 dark:bg-stone-900/50 border-b border-black/5 dark:border-white/5">
                      <tr>
                        <th className="text-left rtl:text-right py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{lang === 'en' ? 'Product' : 'المنتج'}</th>
                        <th className="text-left rtl:text-right py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{lang === 'en' ? 'Category' : 'القسم'}</th>
                        <th className="text-left rtl:text-right py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{lang === 'en' ? 'Price' : 'السعر'}</th>
                        <th className="text-left rtl:text-right py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{lang === 'en' ? 'Status' : 'الحالة'}</th>
                        <th className="text-center py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {products.map((prod) => (
                        <tr key={prod._id} className="hover:bg-stone-50 dark:hover:bg-stone-900/30 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 rounded overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                                <img
                                  src={assetUrl(prod.frontImage)}
                                  alt={prod.nameEn}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-[#111111] dark:text-white">{lang === 'en' ? prod.nameEn : prod.nameAr}</p>
                                {prod.isFeatured && <span className="text-[9px] bg-gold-400/10 text-gold-600 font-bold px-1.5 py-0.5 rounded">{lang === 'en' ? 'FEATURED' : 'مميز'}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-stone-500">
                            {prod.category ? (lang === 'en' ? prod.category.nameEn : prod.category.nameAr) : '—'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              {prod.discountPercentage > 0 && (
                                <span className="block text-stone-400 line-through">{prod.originalPrice} {t('currency')}</span>
                              )}
                              <span className="font-bold text-[#111111] dark:text-white">{prod.priceAfterDiscount} {t('currency')}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                              prod.availabilityStatus === 'in stock'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {prod.availabilityStatus === 'in stock' ? t('inStock') : t('outOfStock')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditProduct(prod)}
                                className="p-1.5 rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                                title={t('edit')}
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(prod._id)}
                                className="p-1.5 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                title={t('delete')}
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {products.length === 0 && (
                  <div className="text-center py-12 text-stone-400 text-sm">{lang === 'en' ? 'No products yet.' : 'لا توجد منتجات بعد.'}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── CATEGORIES TAB ─────────────────────────────── */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-serif font-bold text-[#111111] dark:text-white">{t('tabCategories')} ({categories.length})</h2>
              <button
                onClick={() => { setShowCategoryForm(true); categoryForm.reset(); setCategoryImage(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-gold-400 hover:bg-gold-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition"
              >
                <FiPlus /> {t('addCategory')}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-white dark:bg-[#121212] rounded-xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden flex">
                  <div className="w-24 h-24 flex-shrink-0 bg-stone-100 dark:bg-stone-800">
                    <img
                      src={assetUrl(cat.image)}
                      alt={cat.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-sm text-[#111111] dark:text-white">{cat.nameEn}</p>
                      <p className="text-xs text-stone-500">{cat.nameAr}</p>
                      <p className="text-[10px] text-stone-400 mt-1 font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded inline-block">/{cat.slug}</p>
                    </div>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="p-1.5 rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex-shrink-0"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ───────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-serif font-bold text-[#111111] dark:text-white">{t('tabBookings')} ({bookings.length})</h2>
              <button
                onClick={exportBookings}
                className="flex items-center gap-2 px-4 py-2 border border-black/10 dark:border-white/10 text-[#111111] dark:text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <FiDownload /> {t('bookingsExport')}
              </button>
            </div>

            <div className="bg-white dark:bg-[#121212] rounded-xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-stone-50 dark:bg-stone-900/50 border-b border-black/5 dark:border-white/5">
                    <tr>
                      <th className="text-left rtl:text-right py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{lang === 'en' ? 'Customer' : 'العميل'}</th>
                      <th className="text-left rtl:text-right py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{lang === 'en' ? 'Product' : 'المنتج'}</th>
                      <th className="text-left rtl:text-right py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{lang === 'en' ? 'Size / Color' : 'المقاس / اللون'}</th>
                      <th className="text-left rtl:text-right py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{lang === 'en' ? 'Date' : 'التاريخ'}</th>
                      <th className="text-center py-3 px-4 font-bold uppercase tracking-wider text-stone-500">{lang === 'en' ? 'Status' : 'الحالة'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-stone-50 dark:hover:bg-stone-900/30 transition">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-[#111111] dark:text-white">{booking.customerName}</p>
                          <p className="text-stone-400 font-sans" dir="ltr">{booking.customerPhone}</p>
                          <p className="text-stone-400 font-sans truncate max-w-[140px]">{booking.customerEmail}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-[#111111] dark:text-white">{booking.productName}</p>
                          <p className="text-stone-400">{booking.productCategory}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-stone-600 dark:text-stone-300">{booking.selectedSize}</p>
                          <p className="text-stone-400">{booking.selectedColor}</p>
                          {booking.notes && <p className="text-stone-400 italic truncate max-w-[120px]">{booking.notes}</p>}
                        </td>
                        <td className="py-3 px-4 text-stone-400">
                          <p>
                            <span className="text-stone-500 dark:text-stone-300">{lang === 'en' ? 'Booked:' : 'الحجز:'}</span>{' '}
                            {formatBookingDate(booking.bookingDate || booking.createdAt)}
                          </p>
                          <p>
                            <span className="text-stone-500 dark:text-stone-300">{lang === 'en' ? 'Needed:' : 'المطلوب:'}</span>{' '}
                            {formatBookingDate(booking.neededDate)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                            className={`text-[10px] font-bold rounded px-2 py-1 border-0 cursor-pointer ${statusColors[booking.status]}`}
                          >
                            <option value="Pending">{t('bookStatusPending')}</option>
                            <option value="Contacted">{t('bookStatusContacted')}</option>
                            <option value="Completed">{t('bookStatusCompleted')}</option>
                            <option value="Cancelled">{t('bookStatusCancelled')}</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {bookings.length === 0 && (
                <div className="text-center py-12 text-stone-400 text-sm">{lang === 'en' ? 'No bookings yet.' : 'لا توجد حجوزات بعد.'}</div>
              )}
            </div>
          </div>
        )}

        {/* ── MESSAGES TAB ───────────────────────────────── */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-base font-serif font-bold text-[#111111] dark:text-white">{t('tabMessages')} ({messages.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map((msg) => (
                <div key={msg._id} className="bg-white dark:bg-[#121212] rounded-xl border border-black/5 dark:border-white/5 shadow-sm p-5 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-sm text-[#111111] dark:text-white">{msg.name}</p>
                      <p className="text-xs text-stone-400 font-sans">{msg.email}</p>
                      {msg.phone && <p className="text-xs text-stone-400 font-sans" dir="ltr">{msg.phone}</p>}
                    </div>
                    <span className="text-[10px] text-stone-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-black/5 dark:border-white/5 pt-3">
                    {msg.message}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-[10px] font-bold text-blue-500 hover:underline"
                    >
                      {lang === 'en' ? 'Reply via Email' : 'الرد بالبريد'}
                    </a>
                    {msg.phone && (
                      <>
                        <span className="text-stone-300">·</span>
                        <a
                          href={`https://wa.me/${msg.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-green-500 hover:underline"
                        >
                          WhatsApp
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="col-span-2 text-center py-12 text-stone-400 text-sm">{lang === 'en' ? 'No messages yet.' : 'لا توجد رسائل بعد.'}</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'opinions' && (
          <div className="space-y-4">
            <h2 className="text-base font-serif font-bold text-[#111111] dark:text-white">
              {lang === 'en' ? 'Customer Opinions' : 'آراء العملاء'} ({opinions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opinions.map((opinion) => (
                <div key={opinion._id} className="bg-white dark:bg-[#121212] rounded-xl border border-black/5 dark:border-white/5 shadow-sm p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-[#111111] dark:text-white">{opinion.name}</p>
                      <p className="text-[10px] text-stone-400">{new Date(opinion.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                      opinion.isVisible
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                    }`}>
                      {opinion.isVisible ? (lang === 'en' ? 'Visible' : 'ظاهر') : (lang === 'en' ? 'Hidden' : 'مخفي')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-black/5 dark:border-white/5 pt-3">
                    {opinion.comment}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleOpinionVisibility(opinion._id, !opinion.isVisible)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition ${
                        opinion.isVisible
                          ? 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300'
                      }`}
                    >
                      {opinion.isVisible ? <FiEyeOff /> : <FiEye />}
                      {opinion.isVisible ? (lang === 'en' ? 'Make Hidden' : 'إخفاء') : (lang === 'en' ? 'Make Visible' : 'إظهار')}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteOpinion(opinion._id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-300 transition"
                    >
                      <FiTrash2 />
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
              {opinions.length === 0 && (
                <div className="col-span-2 text-center py-12 text-stone-400 text-sm">
                  {lang === 'en' ? 'No customer opinions yet.' : 'لا توجد آراء عملاء بعد.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── PRODUCT FORM MODAL ──────────────────────────── */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div onClick={() => setShowProductForm(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] rounded-xl shadow-2xl border border-black/10 dark:border-white/10 z-10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
              <h2 className="font-serif font-bold text-lg text-[#111111] dark:text-white">
                {editingProduct ? t('editProduct') : t('addProduct')}
              </h2>
              <button onClick={() => setShowProductForm(false)} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-stone-500">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormNameEn')} *</label>
                  <input className="w-full text-sm" {...productForm.register('nameEn', { required: true })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormNameAr')} *</label>
                  <input className="w-full text-sm" dir="rtl" {...productForm.register('nameAr', { required: true })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormDescEn')} *</label>
                  <textarea rows={3} className="w-full text-sm" {...productForm.register('descriptionEn', { required: true })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormDescAr')} *</label>
                  <textarea rows={3} className="w-full text-sm" dir="rtl" {...productForm.register('descriptionAr', { required: true })} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormCategory')} *</label>
                <select className="w-full text-sm bg-white dark:bg-black" {...productForm.register('category', { required: true })}>
                  <option value="">{lang === 'en' ? 'Select category...' : 'اختر القسم...'}</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{lang === 'en' ? c.nameEn : c.nameAr}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormSizes')}</label>
                  <input className="w-full text-sm font-sans" placeholder="S,M,L,XL" {...productForm.register('sizes')} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormColors')}</label>
                  <input className="w-full text-sm font-sans" placeholder="Black,White,Gold" {...productForm.register('colors')} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormPrice')} *</label>
                  <input type="number" className="w-full text-sm font-sans" {...productForm.register('originalPrice', { required: true })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormDiscount')}</label>
                  <input type="number" min="0" max="100" className="w-full text-sm font-sans" defaultValue="0" {...productForm.register('discountPercentage')} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{lang === 'en' ? 'Availability' : 'الحالة'}</label>
                  <select className="w-full text-sm bg-white dark:bg-black" {...productForm.register('availabilityStatus')}>
                    <option value="in stock">{t('inStock')}</option>
                    <option value="out of stock">{t('outOfStock')}</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFeatured" className="w-4 h-4 accent-gold-400" {...productForm.register('isFeatured')} />
                <label htmlFor="isFeatured" className="text-xs font-semibold text-stone-600 dark:text-stone-300">{t('prodFormFeatured')}</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-black/5 dark:border-white/5 pt-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormFrontImage')} {!editingProduct && '*'}</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs font-sans"
                    onChange={(e) => setProductImages(p => ({ ...p, frontImage: e.target.files[0] }))}
                    required={!editingProduct}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormBackImage')} {!editingProduct && '*'}</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs font-sans"
                    onChange={(e) => setProductImages(p => ({ ...p, backImage: e.target.files[0] }))}
                    required={!editingProduct}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('prodFormGallery')}</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full text-xs font-sans"
                  onChange={(e) => setProductImages(p => ({ ...p, gallery: Array.from(e.target.files) }))}
                />
              </div>
              <div className="flex gap-3 pt-2 border-t border-black/5 dark:border-white/5">
                <button type="button" onClick={() => setShowProductForm(false)} className="flex-1 py-2.5 text-xs font-bold border border-black/10 dark:border-white/10 rounded-lg text-stone-500 hover:bg-black/5 dark:hover:bg-white/5 transition">
                  {t('cancel')}
                </button>
                <button type="submit" className="flex-[2] py-2.5 text-xs font-bold bg-gold-400 hover:bg-gold-500 text-black rounded-lg flex items-center justify-center gap-1.5 transition">
                  <FiCheck /> {t('prodFormSave')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CATEGORY FORM MODAL ─────────────────────────── */}
      {showCategoryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => setShowCategoryForm(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] rounded-xl shadow-2xl border border-black/10 dark:border-white/10 z-10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
              <h2 className="font-serif font-bold text-lg text-[#111111] dark:text-white">{t('addCategory')}</h2>
              <button onClick={() => setShowCategoryForm(false)} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-stone-500">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('catFormNameEn')} *</label>
                  <input className="w-full text-sm" {...categoryForm.register('nameEn', { required: true })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('catFormNameAr')} *</label>
                  <input className="w-full text-sm" dir="rtl" {...categoryForm.register('nameAr', { required: true })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('catFormDescEn')}</label>
                  <textarea rows={2} className="w-full text-sm" {...categoryForm.register('descriptionEn')} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('catFormDescAr')}</label>
                  <textarea rows={2} className="w-full text-sm" dir="rtl" {...categoryForm.register('descriptionAr')} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('catFormSlug')} *</label>
                <input className="w-full text-sm font-mono" placeholder="e.g., kids-wear" {...categoryForm.register('slug', { required: true })} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{t('catFormImage')} *</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs"
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCategoryForm(false)} className="flex-1 py-2.5 text-xs font-bold border border-black/10 dark:border-white/10 rounded-lg text-stone-500 hover:bg-black/5 dark:hover:bg-white/5 transition">
                  {t('cancel')}
                </button>
                <button type="submit" className="flex-[2] py-2.5 text-xs font-bold bg-gold-400 hover:bg-gold-500 text-black rounded-lg flex items-center justify-center gap-1.5 transition">
                  <FiCheck /> {t('catFormSave')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
