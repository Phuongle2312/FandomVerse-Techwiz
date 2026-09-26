import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { BookmarkProvider } from './context/BookmarkContext.jsx';

import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import Breadcrumb from './components/common/Breadcrumb.jsx';
import RequireAuth from './components/common/RequireAuth.jsx';
import CartDrawer from './components/interactive/CartDrawer.jsx';
import ChatbotWidget from './components/interactive/ChatbotWidget.jsx';
import MobileBottomNav from './components/common/MobileBottomNav.jsx';

import Home from './pages/Home.jsx';
import CategoryHub from './pages/CategoryHub.jsx';
import ContentDetail from './pages/ContentDetail.jsx';
import TrailersHub from './pages/TrailersHub.jsx';
import Merchandise from './pages/Merchandise.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import Profile from './pages/Profile.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Scroll restoration on route changes */}
      <ScrollToTop />

      {/* Header Navigation */}
      <Navbar />

      {/* Main Application Container */}
      <main className="main-content">
        <Breadcrumb />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<CategoryHub />} />
          <Route path="/category/:categoryId/article/:contentId" element={<ContentDetail />} />
          <Route path="/trailers" element={<TrailersHub />} />
          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="/bookmarks" element={<RequireAuth><Bookmarks /></RequireAuth>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Persistent Global Interactive Overlays */}
      <CartDrawer />
      <ChatbotWidget />
      <MobileBottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <BookmarkProvider>
                <AppContent />
              </BookmarkProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </HashRouter>
  );
}
