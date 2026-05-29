const adminUsers = [
  {
    username: 'admin',
    email: 'admin@wardrobe.com',
    password: 'AdminPassword123',
    role: 'admin',
  },
  {
    username: 'abdelrhman',
    email: 'abdelrhmanaja@gail.com',
    password: 'AdminPassword123',
    role: 'admin',
  },
];

const categories = [
  {
    key: 'kids',
    nameEn: 'Kids Wear',
    nameAr: 'أطفالي',
    descriptionEn: 'Elegant dresses and occasion wear for girls, with soft fabrics and polished finishing.',
    descriptionAr: 'ملابس أطفال راقية للمناسبات والخروجات، بخامات ناعمة وتشطيب أنيق يناسب البنات الصغيرات.',
    slug: 'kids-wear',
    image: '/uploads/kids_wear.jpg',
  },
  {
    key: 'casual',
    nameEn: 'Casual Wear',
    nameAr: 'كاجوال',
    descriptionEn: 'Premium daily looks that balance comfort, modesty, and a clean boutique feel.',
    descriptionAr: 'إطلالات يومية مريحة وشيك بتفاصيل بسيطة وخامات عملية تناسب الاستخدام اليومي.',
    slug: 'casual-wear',
    image: '/uploads/casual_wear.jpg',
  },
  {
    key: 'modest',
    nameEn: 'Modest Islamic Wear',
    nameAr: 'زي شرعي',
    descriptionEn: 'Modest abayas, sets, and long silhouettes designed with graceful coverage.',
    descriptionAr: 'عبايات وأطقم وفساتين طويلة محتشمة تجمع بين الوقار والأناقة والخامة المريحة.',
    slug: 'modest-wear',
    image: '/uploads/modest_wear.jpg',
  },
  {
    key: 'evening',
    nameEn: 'Evening Dresses',
    nameAr: 'سواريه',
    descriptionEn: 'Statement evening gowns for engagements, celebrations, and elegant nights.',
    descriptionAr: 'فساتين سهرة وسواريه للمناسبات والخطوبة بتطريز راق وقصات تلفت النظر.',
    slug: 'evening-dresses',
    image: '/uploads/evening_dresses.jpg',
  },
  {
    key: 'wedding',
    nameEn: 'Wedding Dresses',
    nameAr: 'فساتين أفراح',
    descriptionEn: 'Bridal gowns with ivory tulle, lace, beadwork, and dramatic wedding silhouettes.',
    descriptionAr: 'فساتين زفاف بتفاصيل ملكية من التل والدانتيل والتطريز لليلة العمر.',
    slug: 'wedding-dresses',
    image: '/uploads/wedding_dresses.jpg',
  },
];

const catalog = {
  kids: {
    assetKey: 'kids',
    sizes: ['2-3 Years', '4-5 Years', '6-7 Years', '8-9 Years'],
    colors: ['Ivory', 'Blush Pink', 'Gold', 'Cream'],
    basePrice: 1100,
    names: [
      ['Golden Floral Lace Dress', 'فستان دانتيل ذهبي منقوش'],
      ['Pearl Tulle Party Dress', 'فستان تل لؤلؤي للأطفال'],
      ['Mini Couture Cape Set', 'طقم كاب كوتور للأطفال'],
      ['Rose Bow Birthday Dress', 'فستان عيد ميلاد بفيونكة روز'],
      ['Ivory Princess Kids Dress', 'فستان أطفال برنسيسة عاجي'],
      ['Butterfly Organza Dress', 'فستان أورجانزا فراشات'],
      ['Velvet Winter Occasion Dress', 'فستان قطيفة شتوي للمناسبات'],
      ['Crystal Waist Flower Dress', 'فستان ورد بحزام كريستال'],
      ['Soft Satin Junior Dress', 'فستان ساتان ناعم للبنات'],
      ['Lilac Layered Tulle Dress', 'فستان تل طبقات موف'],
    ],
  },
  casual: {
    assetKey: 'casual',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Beige', 'Sage', 'Navy', 'Mocha'],
    basePrice: 1500,
    names: [
      ['Satin Luxury Trench Coat', 'معطف ساتان كاجوال فاخر'],
      ['Soft Knit Lounge Set', 'طقم كاجوال تريكو ناعم'],
      ['Everyday Linen Shirt Dress', 'فستان قميص كتان يومي'],
      ['Relaxed Wide-Leg Set', 'طقم كاجوال بنطلون واسع'],
      ['Premium Cotton Tunic', 'تونيك قطن فاخر'],
      ['Buttoned Denim Dress', 'فستان جينز بأزرار'],
      ['Chic Travel Co-ord', 'طقم سفر شيك ومريح'],
      ['Oversized Satin Shirt', 'قميص ساتان واسع'],
      ['Minimal Ribbed Dress', 'فستان ريب بسيط'],
      ['Weekend Blazer Set', 'طقم بليزر كاجوال للويك إند'],
    ],
  },
  modest: {
    assetKey: 'modest',
    sizes: ['52', '54', '56', '58', 'Free Size', 'Plus Size'],
    colors: ['Midnight Black', 'Deep Navy', 'Taupe', 'Dusty Rose', 'Cream'],
    basePrice: 2100,
    names: [
      ['Embroidered Silk Abaya', 'عباءة حريرية مطرزة باليد'],
      ['Pleated Modest Maxi Dress', 'فستان شرعي بليسيه طويل'],
      ['Layered Chiffon Prayer Set', 'طقم شيفون شرعي طبقات'],
      ['Nida Classic Abaya', 'عباءة ندى كلاسيك'],
      ['Crepe Wrap Modest Dress', 'فستان كريب شرعي لف'],
      ['Soft Khimar Two-Piece', 'طقم خمار قطعتين ناعم'],
      ['Lace Trim Abaya Set', 'طقم عباءة بدانتيل رقيق'],
      ['Flowy Jilbab Dress', 'فستان جلباب واسع'],
      ['Everyday Modest Co-ord', 'طقم شرعي يومي مريح'],
      ['Royal Sleeve Abaya', 'عباءة بأكمام ملكية'],
    ],
  },
  evening: {
    assetKey: 'evening',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Royal Blue', 'Ruby Red', 'Emerald Green', 'Black', 'Champagne'],
    basePrice: 5200,
    names: [
      ['Velvet Mermaid Evening Gown', 'فستان سواريه قطيفة حورية البحر'],
      ['Crystal Shoulder Gown', 'فستان كتف كريستال'],
      ['Champagne Satin Soiree Dress', 'فستان سواريه ساتان شامبين'],
      ['Ruby Draped Evening Dress', 'فستان سهرة روبي بدراپيه'],
      ['Emerald Beaded Gown', 'فستان زمرد مطرز خرز'],
      ['Black Sequin Column Dress', 'فستان ترتر أسود مستقيم'],
      ['Royal Blue Cape Gown', 'فستان كاب أزرق ملكي'],
      ['Rose Gold Pleated Dress', 'فستان بليسيه روز جولد'],
      ['Silver Lace Gala Dress', 'فستان حفلات دانتيل فضي'],
      ['Burgundy Satin Occasion Gown', 'فستان ساتان نبيتي للمناسبات'],
    ],
  },
  wedding: {
    assetKey: 'wedding',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivory', 'Pure White', 'Off White', 'Champagne'],
    basePrice: 19000,
    names: [
      ['Royal Ivory Wedding Gown', 'فستان زفاف عاجي ملكي'],
      ['Pearl Veil Bridal Dress', 'فستان عروس بطرحة لؤلؤ'],
      ['Lace Princess Bridal Gown', 'فستان زفاف برنسيسة دانتيل'],
      ['Cathedral Train Bridal Gown', 'فستان زفاف بذيل كاتدرائية'],
      ['Soft Tulle A-Line Dress', 'فستان عروس تل بقصة A'],
      ['Crystal Corset Wedding Dress', 'فستان زفاف كورسيه كريستال'],
      ['Off-Shoulder Bridal Gown', 'فستان عروس أوف شولدر'],
      ['Pearl Sleeve Bridal Dress', 'فستان زفاف بأكمام لؤلؤ'],
      ['Minimal Satin Wedding Gown', 'فستان زفاف ساتان بسيط'],
      ['Luxury Lace Mermaid Gown', 'فستان زفاف حورية دانتيل فاخر'],
    ],
  },
};

const descriptions = {
  kids: [
    'A soft occasion dress for birthdays, parties, and family celebrations.',
    'فستان ناعم للمناسبات وأعياد الميلاد والخروجات العائلية بتشطيب مريح.',
  ],
  casual: [
    'A polished everyday piece with easy movement and premium fabric.',
    'قطعة يومية أنيقة بحركة مريحة وخامة راقية للاستخدام العملي.',
  ],
  modest: [
    'A modest silhouette with graceful coverage, soft drape, and boutique finishing.',
    'تصميم محتشم بتغطية أنيقة وانسيابية ناعمة وتشطيب أتيليه راق.',
  ],
  evening: [
    'A standout evening look for engagements, celebrations, and formal nights.',
    'إطلالة سهرة لافتة للخطوبة والمناسبات والليالي الرسمية.',
  ],
  wedding: [
    'A bridal statement dress with elegant structure and romantic finishing.',
    'فستان عروس مميز بقصة فخمة وتشطيب رومانسي يناسب ليلة العمر.',
  ],
};

const discountCycle = [0, 5, 8, 10, 12, 15, 18, 20, 25, 0];

const products = Object.entries(catalog).flatMap(([categoryKey, category]) =>
  category.names.map(([nameEn, nameAr], index) => ({
    categoryKey,
    nameEn,
    nameAr,
    descriptionEn: descriptions[categoryKey][0],
    descriptionAr: descriptions[categoryKey][1],
    sizes: category.sizes,
    colors: category.colors,
    originalPrice: category.basePrice + index * (categoryKey === 'wedding' ? 1750 : 250),
    discountPercentage: discountCycle[index],
    frontImage: `/uploads/${category.assetKey}_item${String(index + 1).padStart(2, '0')}_front.jpg`,
    backImage: `/uploads/${category.assetKey}_item${String(index + 1).padStart(2, '0')}_back.jpg`,
    isFeatured: index < 3,
  }))
);

module.exports = {
  adminUsers,
  categories,
  products,
};
