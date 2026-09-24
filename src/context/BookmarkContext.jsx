import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService.js';
import { dataService } from '../services/dataService.js';

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => storageService.loadBookmarks());
  const [notes, setNotes] = useState(() => storageService.loadNotes());

  // Sync Bookmarks to LocalStorage
  useEffect(() => {
    storageService.saveBookmarks(bookmarks);
  }, [bookmarks]);

  const isBookmarked = (itemId) => {
    return bookmarks.some((b) => b.itemId === itemId);
  };

  const toggleBookmark = (item) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.itemId === item.id);
      if (exists) {
        return prev.filter((b) => b.itemId !== item.id);
      }
      return [
        ...prev,
        {
          itemId: item.id,
          itemType: item.type || item.productType || 'content',
          category: item.category,
          title: item.title || item.name,
          thumbnail: item.thumbnail || item.image,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const removeBookmark = (itemId) => {
    setBookmarks((prev) => prev.filter((b) => b.itemId !== itemId));
    // Also remove associated session note if any
    deleteNote(itemId);
  };

  const saveNote = (itemId, noteText) => {
    storageService.saveNote(itemId, noteText);
    setNotes((prev) => {
      if (!noteText || noteText.trim() === '') {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: noteText.trim() };
    });
  };

  const deleteNote = (itemId) => {
    storageService.deleteNote(itemId);
    setNotes((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const exportBookmarksAsText = () => {
    if (bookmarks.length === 0) return false;

    const lines = [
      '=====================================================',
      '       FANDOMVERSE — DANH SÁCH NỘI DUNG YÊU THÍCH     ',
      '=====================================================',
      `Thời gian xuất: ${new Date().toLocaleString('vi-VN')}`,
      `Tổng số mục đã lưu: ${bookmarks.length}`,
      '-----------------------------------------------------\n',
    ];

    bookmarks.forEach((b, index) => {
      lines.push(`${index + 1}. [${b.category?.toUpperCase() || 'GENERAL'}] ${b.title}`);
      lines.push(`   - Mã nội dung: ${b.itemId}`);
      lines.push(`   - Loại: ${b.itemType}`);
      lines.push(`   - Ngày lưu: ${new Date(b.addedAt).toLocaleDateString('vi-VN')}`);
      if (notes[b.itemId]) {
        lines.push(`   - Ghi chú cá nhân: "${notes[b.itemId]}"`);
      }
      lines.push('');
    });

    lines.push('=====================================================');
    lines.push('Cảm ơn bạn đã đồng hành cùng FandomVerse Universe!');
    lines.push('© FandomVerse — Web Innovation Unleashed');

    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fandomverse-bookmarks-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        bookmarkCount: bookmarks.length,
        notes,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        saveNote,
        deleteNote,
        exportBookmarksAsText,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks phải được sử dụng bên trong BookmarkProvider');
  }
  return context;
}
