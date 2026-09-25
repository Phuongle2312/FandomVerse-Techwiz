import { STORAGE_KEYS } from '../constants.js';

export const storageService = {
  // Cart (LocalStorage)
  loadCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn('Không thể đọc dữ liệu giỏ hàng từ LocalStorage:', error);
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (error) {
      console.warn('Không thể lưu giỏ hàng vào LocalStorage:', error);
    }
  },

  // Bookmarks (LocalStorage)
  loadBookmarks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn('Không thể đọc bookmark từ LocalStorage:', error);
      return [];
    }
  },

  saveBookmarks(bookmarks) {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (error) {
      console.warn('Không thể lưu bookmark vào LocalStorage:', error);
    }
  },

  // Notes (SessionStorage - session-only)
  loadNotes() {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn('Không thể đọc ghi chú từ SessionStorage:', error);
      return {};
    }
  },

  saveNote(itemId, noteText) {
    try {
      const notes = this.loadNotes();
      if (!noteText || noteText.trim() === '') {
        delete notes[itemId];
      } else {
        notes[itemId] = noteText.trim();
      }
      sessionStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (error) {
      console.warn('Không thể lưu ghi chú vào SessionStorage:', error);
    }
  },

  deleteNote(itemId) {
    try {
      const notes = this.loadNotes();
      delete notes[itemId];
      sessionStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (error) {
      console.warn('Không thể xóa ghi chú khỏi SessionStorage:', error);
    }
  },

  // Visitor Counter (LocalStorage)
  getVisitorCount() {
    try {
      const count = localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT);
      return count ? parseInt(count, 10) : 1248; // Base seed count
    } catch (error) {
      return 1248;
    }
  },

  incrementVisitorCount() {
    try {
      const current = this.getVisitorCount();
      const updated = current + 1;
      localStorage.setItem(STORAGE_KEYS.VISITOR_COUNT, updated.toString());
      return updated;
    } catch (error) {
      return 1248;
    }
  },

  // Users / Auth (LocalStorage)
  loadUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn('Không thể đọc dữ liệu tài khoản từ LocalStorage:', error);
      return [];
    }
  },

  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.warn('Không thể lưu dữ liệu tài khoản vào LocalStorage:', error);
    }
  },

  loadCurrentUser() {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || null;
    } catch (error) {
      console.warn('Không thể đọc phiên đăng nhập từ LocalStorage:', error);
      return null;
    }
  },

  saveCurrentUser(email) {
    try {
      if (!email) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      } else {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
      }
    } catch (error) {
      console.warn('Không thể lưu phiên đăng nhập vào LocalStorage:', error);
    }
  },
};
