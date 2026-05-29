import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  const [wishlist, setWishlist] = useState([]);

  const handleToggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-transparent text-[var(--text-main)] transition-colors duration-300">
              <Navbar wishlistCount={wishlist.length} />
              <main className="page-enter pt-24 lg:pt-28">
                <Routes>
                  <Route
                    path="/"
                    element={<Home wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />}
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<AdminLogin />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <FloatingWhatsApp />
            </div>
          </Router>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
