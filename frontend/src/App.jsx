import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn' } },
};

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Bracelet from './pages/Bracelet.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import PortalPage from './pages/PortalPage.jsx';
import About from './pages/About.jsx';
import FAQ from './pages/FAQ.jsx';
import Contact from './pages/Contact.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Activate from './pages/Activate.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';
import Blog from './pages/Blog.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';

import Privacy from './pages/legal/Privacy.jsx';
import Terms from './pages/legal/Terms.jsx';
import Returns from './pages/legal/Returns.jsx';
import Shipping from './pages/legal/Shipping.jsx';
import Cookies from './pages/legal/Cookies.jsx';
import Disclaimer from './pages/legal/Disclaimer.jsx';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <LanguageProvider>
    <div className="min-h-screen bg-[#F5F1ED]">
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/abundance-code-sphere" element={<PageWrapper><Product /></PageWrapper>} />
          <Route path="/bracelet" element={<PageWrapper><Bracelet /></PageWrapper>} />
          <Route path="/how-it-works" element={<PageWrapper><HowItWorks /></PageWrapper>} />
          <Route path="/portal" element={<PageWrapper><PortalPage /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
          <Route path="/order-confirmation" element={<PageWrapper><OrderConfirmation /></PageWrapper>} />
          <Route path="/activate" element={<PageWrapper><Activate /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
          <Route path="/blog/:slug" element={<PageWrapper><BlogPostPage /></PageWrapper>} />

          {/* Legal */}
          <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
          <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
          <Route path="/returns" element={<PageWrapper><Returns /></PageWrapper>} />
          <Route path="/shipping" element={<PageWrapper><Shipping /></PageWrapper>} />
          <Route path="/cookies" element={<PageWrapper><Cookies /></PageWrapper>} />
          <Route path="/disclaimer" element={<PageWrapper><Disclaimer /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </div>
    </LanguageProvider>
  );
}
