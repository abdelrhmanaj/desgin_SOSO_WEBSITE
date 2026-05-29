import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import BookingModal from '../components/BookingModal';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { WHATSAPP_NUMBER } from '../config/contact';
import { assetUrl } from '../config/api';

const Home = ({ onToggleWishlist = () => {}, wishlist = [] }) => {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State variables
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opinionForm, setOpinionForm] = useState({ name: '', comment: '' });
  const [opinionSubmitted, setOpinionSubmitted] = useState(false);
  const [opinionError, setOpinionError] = useState('');
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Category slug or id
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState(30000); // Max price slider limit
  const [sortBy, setSortBy] = useState('newest');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [bookingProduct, setBookingProduct] = useState(null);
  const [bookingSize, setBookingSize] = useState('');
  const [bookingColor, setBookingColor] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Hero Slider Index
  const [currentSlide, setCurrentSlide] = useState(0);

  // References
  const productSectionRef = useRef(null);

  // Hardcoded sizes and colors for standard filters
  const filterSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2-3 Years', '4-5 Years', '6-7 Years', '52', '54', '56', '58'];
  const filterColors = ['Black', 'White', 'Gold', 'Cream', 'Ivory', 'Green', 'Blue', 'Red', 'Beige', 'Pink', 'Navy', 'Champagne'];

  const categoryFromUrl = searchParams.get('category') || '';

  // Hero slides data (using our beautiful generated image paths)
  const slides = [
    {
      image: '/uploads/wedding_dresses.jpg',
      titleEn: 'Wedding Dreams',
      titleAr: 'أحلام الزفاف',
      subtitleEn: 'Royal Ivory Wedding Gowns custom stitched for your lifetime moment.',
      subtitleAr: 'فساتين زفاف ملكية بلون عاجي راقي مطرزة بالخرز والكريستال لليلة العمر.',
    },
    {
      image: '/uploads/evening_dresses.jpg',
      titleEn: 'Velvet Evening Gowns',
      titleAr: 'فساتين السهرة المخملية',
      subtitleEn: 'Stunning mermaid evening gowns designed for majestic red carpet events.',
      subtitleAr: 'فساتين سواريه مميزة من القطيفة الفاخرة تلائم مناسباتك السعيدة.',
    },
    {
      image: '/uploads/modest_wear.jpg',
      titleEn: 'Bespoke Modest Abayas',
      titleAr: 'عباءات الزي الشرعي',
      subtitleEn: 'A perfect blend of high fashion elegance and absolute modesty.',
      subtitleAr: 'عباءات ملكية من الحرير الطبيعي مطرزة يدوياً تعكس الوقار والأناقة الشرقية.',
    }
  ];

  // Auto rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes, opinionsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
          api.get('/opinions')
        ]);
        if (categoriesRes.data.success) setCategories(categoriesRes.data.data);
        if (productsRes.data.success) setProducts(productsRes.data.data);
        if (opinionsRes.data.success) setOpinions(opinionsRes.data.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch products with filters when inputs change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        let url = `/products?sort=${sortBy}`;
        if (search) url += `&search=${search}`;
        if (selectedCategory) url += `&category=${selectedCategory}`;
        if (selectedSize) url += `&size=${selectedSize}`;
        if (selectedColor) url += `&color=${selectedColor}`;
        if (priceRange) url += `&maxPrice=${priceRange}`;

        const res = await api.get(url);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      }
    };

    // Debounce search input to avoid hitting database on every keystroke
    const delayDebounce = setTimeout(() => {
      fetchFilteredProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory, selectedSize, selectedColor, priceRange, sortBy]);

  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      window.requestAnimationFrame(() => {
        setSelectedCategory(categoryFromUrl);
        productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [categoryFromUrl, selectedCategory]);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryClick = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setSearchParams(categorySlug ? { category: categorySlug } : {});
    scrollToProducts();
  };

  const handleOpenBookNow = (product, size = '', color = '') => {
    setBookingProduct(product);
    setBookingSize(size || (product.sizes && product.sizes[0]) || '');
    setBookingColor(color || (product.colors && product.colors[0]) || '');
    setIsBookingOpen(true);
  };

  const handleOpenQuickView = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange(30000);
    setSortBy('newest');
    setSearchParams({});
  };

  const handleOpinionSubmit = async (event) => {
    event.preventDefault();
    setOpinionError('');

    try {
      const res = await api.post('/opinions', opinionForm);
      if (res.data.success) {
        setOpinions((current) => [res.data.data, ...current].slice(0, 12));
        setOpinionForm({ name: '', comment: '' });
        setOpinionSubmitted(true);
        setTimeout(() => setOpinionSubmitted(false), 5000);
      }
    } catch (error) {
      setOpinionError(error.response?.data?.message || (lang === 'en' ? 'Could not save your opinion. Please try again.' : 'لم نتمكن من حفظ رأيك. حاولي مرة أخرى.'));
    }
  };

  // Testimonials
  const fallbackTestimonials = [
    {
      text: t('testimonial1Text'),
      author: t('testimonial1Author'),
      avatar: 'YA',
    },
    {
      text: t('testimonial2Text'),
      author: t('testimonial2Author'),
      avatar: 'FM',
    }
  ];
  const displayedOpinions = opinions.length > 0
    ? opinions.map((opinion) => ({
      text: opinion.comment,
      author: opinion.name,
      avatar: opinion.name.slice(0, 2).toUpperCase(),
    }))
    : fallbackTestimonials;

  const visibleCategories = categories.slice(0, 5);

  return (
    <div className="pb-16 font-sans">
      {/* 1. HERO SECTION (CAROUSEL BANNER) */}
      <div className="relative h-[70vh] sm:h-[85vh] w-full overflow-hidden bg-black">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
            <img
              src={assetUrl(slide.image)}
              alt={slide.titleEn}
              className="w-full h-full object-cover object-center scale-102 transition-all duration-[6000ms]"
            />
            {/* Content overlay container */}
            <div className="absolute inset-0 z-20 flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl text-white space-y-6">
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={idx === currentSlide ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block text-xs uppercase tracking-widest text-gold-400 font-bold"
                >
                  {lang === 'en' ? 'EXCLUSIVE COUTURE' : 'تصاميم كوتور حصرية'}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={idx === currentSlide ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-4xl sm:text-6xl font-serif font-bold tracking-tight leading-none"
                >
                  {lang === 'en' ? slide.titleEn : slide.titleAr}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={idx === currentSlide ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-sm sm:text-lg text-stone-300 font-light leading-relaxed font-serif"
                >
                  {lang === 'en' ? slide.subtitleEn : slide.subtitleAr}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={idx === currentSlide ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="pt-4 flex flex-wrap gap-4"
                >
                  <button
                    onClick={scrollToProducts}
                    className="px-6 py-3.5 bg-gold-400 hover:bg-gold-500 text-black text-xs font-bold tracking-widest uppercase rounded shadow-lg transition active:scale-95"
                  >
                    {t('heroCta')}
                  </button>
                  <button
                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                    className="px-6 py-3.5 border border-white/20 hover:border-white/50 backdrop-blur-sm text-white text-xs font-bold tracking-widest uppercase rounded transition active:scale-95"
                  >
                    {t('heroSecondCta')}
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-gold-400 w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. CATEGORIES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#111111] dark:text-white">
            {t('categoriesTitle')}
          </h2>
          <div className="h-0.5 w-24 bg-gold-400 mx-auto" />
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm max-w-md mx-auto">
            {t('categoriesSubtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-80 bg-stone-200 dark:bg-stone-800 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {visibleCategories.map((category, idx) => {
              const catName = lang === 'en' ? category.nameEn : category.nameAr;
              const catDesc = lang === 'en' ? category.descriptionEn : category.descriptionAr;
              const catImg = assetUrl(category.image);
              
              return (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="group relative h-96 rounded-xl overflow-hidden border border-black/5 dark:border-white/5 shadow-md flex flex-col justify-end p-6 cursor-pointer transform hover:-translate-y-1 transition duration-300 bg-black"
                >
                  <img
                    src={catImg}
                    alt={catName}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-50 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="relative z-10 text-white space-y-2">
                    <h3 className="text-lg font-serif font-bold tracking-wide">{catName}</h3>
                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed font-sans">{catDesc}</p>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCategoryClick(category.slug);
                      }}
                      className="text-[10px] uppercase font-bold tracking-widest text-gold-400 hover:text-gold-300 transition duration-200 pt-2 flex items-center gap-1.5"
                    >
                      {t('viewCollection')}
                      <span className="rtl:rotate-180">→</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. PRODUCTS FILTER & GRID SECTION */}
      <section ref={productSectionRef} className="py-12 bg-stone-50 dark:bg-[#0c0c0c] border-t border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#111111] dark:text-white">
              {t('featuredTitle')}
            </h2>
            <div className="h-0.5 w-24 bg-gold-400 mx-auto" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Filters Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: lang === 'en' ? -18 : 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="w-full lg:w-1/4 p-6 bg-white dark:bg-[#121212] rounded-xl border border-black/5 dark:border-white/5 shadow-sm space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-black/5 dark:border-white/5">
                <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white flex items-center gap-1.5">
                  <FiFilter className="text-gold-400" />
                  {lang === 'en' ? 'Filters' : 'تصفية النتائج'}
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-rose-500 transition duration-150"
                >
                  {lang === 'en' ? 'Clear All' : 'إعادة تعيين'}
                </button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  {lang === 'en' ? 'Search' : 'بحث'}
                </label>
                <div className="relative flex items-center">
                  <FiSearch className="absolute left-3 text-stone-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('filterSearchPlaceholder')}
                    className="w-full pl-9 rtl:pl-3 rtl:pr-9 font-sans text-xs py-2.5 rounded bg-transparent"
                  />
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  {lang === 'en' ? 'Category' : 'القسم'}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full font-sans text-xs bg-transparent"
                >
                  <option value="">{t('filterAll')}</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {lang === 'en' ? c.nameEn : c.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sizes Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  {t('filterSize')}
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {filterSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`text-[10px] font-semibold font-sans px-2.5 py-1.5 rounded border transition-all ${
                        selectedSize === size
                          ? 'border-gold-400 bg-gold-400 text-black font-bold'
                          : 'border-black/10 dark:border-white/10 hover:border-black/25 text-stone-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  {t('filterColor')}
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {filterColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                      className={`text-[10px] font-medium font-sans px-2.5 py-1.5 rounded border transition-all ${
                        selectedColor === color
                          ? 'border-gold-400 bg-gold-50 dark:bg-gold-950/15 text-gold-600 font-bold'
                          : 'border-black/10 dark:border-white/10 text-stone-500 hover:border-black/20'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  <span>{t('filterPrice')}</span>
                  <span className="text-gold-500 font-bold">
                    {priceRange} {t('currency')}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="30000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold-400 cursor-ew-resize bg-stone-200 dark:bg-stone-800 h-1 rounded-lg"
                />
              </div>

              {/* Sorting */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  {t('sortBy')}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full font-sans text-xs bg-transparent"
                >
                  <option value="newest">{t('sortNewest')}</option>
                  <option value="priceAsc">{t('sortPriceAsc')}</option>
                  <option value="priceDesc">{t('sortPriceDesc')}</option>
                </select>
              </div>
            </motion.aside>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="w-full lg:w-3/4"
            >
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, idx) => (
                    <div key={idx} className="flex flex-col space-y-3 rounded-lg overflow-hidden border border-black/5 p-4 animate-pulse">
                      <div className="aspect-[3/4] w-full bg-stone-200 dark:bg-stone-800 rounded" />
                      <div className="h-4 bg-stone-200 dark:bg-stone-800 w-3/4 rounded" />
                      <div className="h-3 bg-stone-200 dark:bg-stone-800 w-1/2 rounded" />
                      <div className="h-6 bg-stone-200 dark:bg-stone-800 w-full rounded" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#121212] rounded-xl border border-black/5 dark:border-white/5 space-y-4 shadow-sm">
                  <span className="text-4xl text-stone-300 block">🛍️</span>
                  <p className="text-stone-500 text-sm font-serif">{t('noProductsFound')}</p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold tracking-widest uppercase rounded hover:bg-gold-400 dark:hover:bg-gold-400 transition"
                  >
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onBookNow={() => handleOpenBookNow(product)}
                        onQuickView={handleOpenQuickView}
                        isWishlisted={wishlist.includes(product._id)}
                        onToggleWishlist={onToggleWishlist}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. CLIENT OPINIONS */}
      <section className="py-20 bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#111111] dark:text-white">
              {t('testimonialTitle')}
            </h2>
            <div className="h-0.5 w-24 bg-gold-400 mx-auto" />
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              {lang === 'en' ? 'Share your experience and see what our clients say.' : 'شاركي تجربتك وشاهدي آراء عميلاتنا.'}
            </p>
          </div>

          <form
            onSubmit={handleOpinionSubmit}
            className="max-w-2xl mx-auto bg-stone-50 dark:bg-stone-900 border border-black/5 dark:border-white/5 rounded-xl p-5 sm:p-6 text-left rtl:text-right shadow-sm space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-300 mb-1.5">
                  {lang === 'en' ? 'Your Name' : 'اسمك'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={opinionForm.name}
                  onChange={(event) => setOpinionForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder={lang === 'en' ? 'e.g., Sara Ahmed' : 'مثال: سارة أحمد'}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-300 mb-1.5">
                  {lang === 'en' ? 'Your Opinion' : 'رأيك'}
                </label>
                <textarea
                  required
                  maxLength={500}
                  rows={3}
                  value={opinionForm.comment}
                  onChange={(event) => setOpinionForm((current) => ({ ...current, comment: event.target.value }))}
                  placeholder={lang === 'en' ? 'Write your comment about your experience...' : 'اكتبي تعليقك عن تجربتك...'}
                  className="w-full text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                {opinionSubmitted && (
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    {lang === 'en' ? 'Thank you! Your opinion is now visible.' : 'شكراً لك! رأيك ظهر الآن.'}
                  </span>
                )}
                {opinionError && <span className="text-red-500 font-semibold">{opinionError}</span>}
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-gold-400 hover:bg-gold-500 text-black text-xs font-bold uppercase tracking-widest rounded-md transition active:scale-95"
              >
                {lang === 'en' ? 'Add Opinion' : 'إضافة الرأي'}
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedOpinions.map((test, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-xl bg-stone-50 dark:bg-stone-900 border border-black/5 dark:border-white/5 shadow-sm text-center relative"
              >
                <span className="text-gold-400 text-5xl font-serif leading-none absolute top-4 left-4 pointer-events-none opacity-20">“</span>
                <p className="text-sm text-stone-600 dark:text-stone-300 italic leading-relaxed mb-6 font-serif">
                  {test.text}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gold-400 text-black text-xs font-bold flex items-center justify-center font-sans">
                    {test.avatar}
                  </span>
                  <span className="text-xs font-semibold text-[#111111] dark:text-white uppercase tracking-wider font-sans">
                    {test.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INSTAGRAM LOOKBOOK GALLERY */}
      <section className="py-20 bg-stone-50 dark:bg-[#0c0c0c] border-t border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#111111] dark:text-white">
              {lang === 'en' ? 'Boutique Lookbook' : 'ألبوم أزيائنا الفاخرة'}
            </h2>
            <div className="h-0.5 w-24 bg-gold-400 mx-auto" />
            <p className="text-stone-500 text-xs sm:text-sm font-serif">@wardrobeluxury_official</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.slice(0, 5).map((category, idx) => {
              const catImg = assetUrl(category.image);
              return (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-black/5 dark:border-white/5">
                  <img
                    src={catImg}
                    alt="lookbook img"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                    <span className="text-white text-xs tracking-widest uppercase font-bold">♥ {120 + idx * 15}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FLOATING WHATSAPP BUTTON */}
      <div className="hidden">
        <div className="absolute right-0 bottom-full mb-2 bg-[#25D366] text-white text-[10px] font-bold py-1 px-2.5 rounded-full shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none transition duration-350 whitespace-nowrap">
          {t('floatingWhatsappTooltip')}
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition-all animate-bounce"
          title="WhatsApp Store Direct"
        >
          💬
        </a>
      </div>

      {/* MODALS */}
      <ProductModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onBookNow={handleOpenBookNow}
      />

      <BookingModal
        product={bookingProduct}
        selectedSize={bookingSize}
        selectedColor={bookingColor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

export default Home;
