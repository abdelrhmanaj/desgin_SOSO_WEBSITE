import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { WHATSAPP_NUMBER } from '../config/contact';

const FloatingWhatsApp = () => {
  const whatsappNumber = WHATSAPP_NUMBER;
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-[80] group">
      <div className="absolute right-0 bottom-full mb-2 bg-[#25D366] text-white text-[10px] font-bold py-1 px-2.5 rounded-full shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none transition whitespace-nowrap">
        WhatsApp
      </div>
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center ring-4 ring-white/70 dark:ring-black/40"
        title="WhatsApp"
        aria-label="Open WhatsApp"
      >
        <FaWhatsapp size={30} />
      </motion.a>
    </div>
  );
};

export default FloatingWhatsApp;
