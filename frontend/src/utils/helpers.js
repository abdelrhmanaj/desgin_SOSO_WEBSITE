// WhatsApp integration helper
export const generateWhatsAppLink = (data, phoneNumber) => {
  const {
    fullName,
    email,
    phone,
    product,
    category,
    selectedSize,
    selectedColor,
    bookingDate,
    neededDate,
    notes
  } = data;

  const message = `Hello! I would like to book this product:

Customer Name: ${fullName}
Email: ${email}
Phone: ${phone}
Product: ${product}
Category: ${category}
Size: ${selectedSize}
Color: ${selectedColor}
Booked Date: ${bookingDate || new Date().toLocaleDateString()}
Needed Date: ${neededDate}
Notes: ${notes || 'No additional notes'}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

// Format price
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Get discount amount
export const getDiscountAmount = (price, discountPercentage) => {
  return (price * discountPercentage) / 100;
};
