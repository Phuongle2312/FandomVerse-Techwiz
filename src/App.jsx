import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { BookmarkProvider } from './context/BookmarkContext.jsx';

import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import Breadcrumb from './components/common/Breadcrumb.jsx';
import CartDrawer from './components/interactive/CartDrawer.jsx';
import ChatbotWidget from './components/interactive/ChatbotWidget.jsx';

import Home from './pages/Home.jsx';
import CategoryHub from './pages/CategoryHub.jsx';
import ContentDetail from './pages/ContentDetail.jsx';
import TrailersHub from './pages/TrailersHub.jsx';
import Merchandise from './pages/Merchandise.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <CartProvider>
          <BookmarkProvider>
            <div className="app-layout">
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
                <Route path="/bookmarks" element={<Bookmarks />} />
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

            {/* Footer */}
            <Footer />
          </div>
        </BookmarkProvider>
      </CartProvider>
    </ThemeProvider>
  </HashRouter>
);
}
