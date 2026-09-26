import contentsData from '../data/contents.json';
import charactersData from '../data/characters.json';
import eventsData from '../data/events.json';
import trailersData from '../data/trailers.json';
import merchandiseData from '../data/merchandise.json';
import i18n from '../i18n/index.js';
import { toBcp47 } from '../i18n/localeMap.js';

// Field lists for locale resolution per dataset
const CONTENT_LOCALE_FIELDS = ['title', 'shortDescription', 'body', 'subTags'];
const CHARACTER_LOCALE_FIELDS = ['name', 'biography', 'traits'];
const EVENT_LOCALE_FIELDS = ['title', 'description', 'location'];
const TRAILER_LOCALE_FIELDS = ['title'];
const MERCHANDISE_LOCALE_FIELDS = ['name', 'shortDescription'];

const STORAGE_KEYS = {
  CONTENTS: 'fv_admin_contents_v3',
  CHARACTERS: 'fv_admin_characters_v3',
  EVENTS: 'fv_admin_events_v3',
  TRAILERS: 'fv_admin_trailers_v3',
  MERCHANDISE: 'fv_admin_merchandise_v3',
};

function loadDataset(key, defaultData) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn(`[dataService] Error loading ${key} from storage:`, error);
  }
  return [...defaultData];
}

function persistDataset(key, dataset) {
  try {
    localStorage.setItem(key, JSON.stringify(dataset));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fv_data_change', { detail: { key } }));
    }
  } catch (error) {
    console.warn(`[dataService] Error saving ${key} to storage:`, error);
  }
}

// In-memory active stores loaded from storage or fallback defaults
let activeContents = loadDataset(STORAGE_KEYS.CONTENTS, contentsData);
let activeCharacters = loadDataset(STORAGE_KEYS.CHARACTERS, charactersData);
let activeEvents = loadDataset(STORAGE_KEYS.EVENTS, eventsData);
let activeTrailers = loadDataset(STORAGE_KEYS.TRAILERS, trailersData);
let activeMerchandise = loadDataset(STORAGE_KEYS.MERCHANDISE, merchandiseData);

// Picks the value for the active language from a { vi, en, hi } locale object,
// falling back to vi, then to whatever value is available.
export function pick(field, lang) {
  if (field && typeof field === 'object' && !Array.isArray(field)) {
    return field[lang] ?? field.vi ?? Object.values(field)[0];
  }
  return field;
}

// Returns a shallow copy of `item` with each field in `fields` resolved to a
// plain string (or array of plain strings) for the given/current language.
export function resolveLocale(item, fields, lang = i18n.language) {
  if (!item) return item;
  const resolved = { ...item };
  fields.forEach((f) => {
    if (Array.isArray(item[f])) {
      resolved[f] = item[f].map((entry) => pick(entry, lang));
    } else if (f in item) {
      resolved[f] = pick(item[f], lang);
    }
  });
  return resolved;
}

export const dataService = {
  // ==========================================
  // CONTENTS (Articles, Galleries, Videos, Audios)
  // ==========================================
  getAllContents() {
    return activeContents.map((item) => resolveLocale(item, CONTENT_LOCALE_FIELDS));
  },

  getRawContents() {
    return [...activeContents];
  },

  getFeaturedContents() {
    return activeContents
      .filter((item) => item.featured)
      .map((item) => resolveLocale(item, CONTENT_LOCALE_FIELDS));
  },

  getContentById(id) {
    const item = activeContents.find((item) => item.id === id) || null;
    return resolveLocale(item, CONTENT_LOCALE_FIELDS);
  },

  getRawContentById(id) {
    return activeContents.find((item) => item.id === id) || null;
  },

  getContentsByCategory(categoryId, { type = 'all', subTag = 'all', sort = 'newest' } = {}) {
    let result = activeContents.filter((item) => item.category === categoryId);

    if (type && type !== 'all') {
      result = result.filter((item) => item.type === type);
    }

    if (subTag && subTag !== 'all') {
      result = result.filter((item) => item.subTags && (
        Array.isArray(item.subTags) 
          ? item.subTags.some(t => typeof t === 'object' ? Object.values(t).includes(subTag) : t === subTag)
          : false
      ));
    }

    result = result.map((item) => resolveLocale(item, CONTENT_LOCALE_FIELDS));

    if (sort === 'alphabetical') {
      result = [...result].sort((a, b) => (a.title || '').localeCompare(b.title || '', toBcp47(i18n.language)));
    } else if (sort === 'featured') {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      result = [...result].sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
    }

    return result;
  },

  getRelatedContents(categoryId, currentId, limit = 3) {
    return activeContents
      .filter((item) => item.category === categoryId && item.id !== currentId)
      .slice(0, limit)
      .map((item) => resolveLocale(item, CONTENT_LOCALE_FIELDS));
  },

  saveContent(item) {
    const index = activeContents.findIndex((c) => c.id === item.id);
    if (index >= 0) {
      activeContents[index] = { ...activeContents[index], ...item };
    } else {
      activeContents.unshift(item);
    }
    persistDataset(STORAGE_KEYS.CONTENTS, activeContents);
    return item;
  },

  deleteContent(id) {
    activeContents = activeContents.filter((c) => c.id !== id);
    persistDataset(STORAGE_KEYS.CONTENTS, activeContents);
    return true;
  },

  // ==========================================
  // CHARACTERS
  // ==========================================
  getAllCharacters() {
    return activeCharacters.map((c) => resolveLocale(c, CHARACTER_LOCALE_FIELDS));
  },

  getRawCharacters() {
    return [...activeCharacters];
  },

  getCharacterById(id) {
    const c = activeCharacters.find((c) => c.id === id) || null;
    return resolveLocale(c, CHARACTER_LOCALE_FIELDS);
  },

  getRawCharacterById(id) {
    return activeCharacters.find((c) => c.id === id) || null;
  },

  getCharactersByCategory(categoryId, { franchise = 'all' } = {}) {
    let result = activeCharacters.filter((c) => c.category === categoryId);
    if (franchise && franchise !== 'all') {
      result = result.filter((c) => c.franchise === franchise);
    }
    return result.map((c) => resolveLocale(c, CHARACTER_LOCALE_FIELDS));
  },

  getFranchisesByCategory(categoryId) {
    const chars = activeCharacters.filter((c) => c.category === categoryId);
    const set = new Set(chars.map((c) => c.franchise).filter(Boolean));
    return Array.from(set);
  },

  saveCharacter(item) {
    const index = activeCharacters.findIndex((c) => c.id === item.id);
    if (index >= 0) {
      activeCharacters[index] = { ...activeCharacters[index], ...item };
    } else {
      activeCharacters.unshift(item);
    }
    persistDataset(STORAGE_KEYS.CHARACTERS, activeCharacters);
    return item;
  },

  deleteCharacter(id) {
    activeCharacters = activeCharacters.filter((c) => c.id !== id);
    persistDataset(STORAGE_KEYS.CHARACTERS, activeCharacters);
    return true;
  },

  // ==========================================
  // EVENTS
  // ==========================================
  getAllEvents() {
    return activeEvents.map((e) => resolveLocale(e, EVENT_LOCALE_FIELDS));
  },

  getRawEvents() {
    return [...activeEvents];
  },

  getEventById(id) {
    const e = activeEvents.find((e) => e.id === id) || null;
    return resolveLocale(e, EVENT_LOCALE_FIELDS);
  },

  getRawEventById(id) {
    return activeEvents.find((e) => e.id === id) || null;
  },

  getEventsByCategory(categoryId, { status = 'all' } = {}) {
    let result = activeEvents.filter((e) => e.category === categoryId);
    const today = new Date().toISOString().split('T')[0];

    if (status === 'upcoming') {
      result = result.filter((e) => e.date >= today);
    } else if (status === 'past') {
      result = result.filter((e) => e.date < today);
    }

    return result
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((e) => resolveLocale(e, EVENT_LOCALE_FIELDS));
  },

  saveEvent(item) {
    const index = activeEvents.findIndex((e) => e.id === item.id);
    if (index >= 0) {
      activeEvents[index] = { ...activeEvents[index], ...item };
    } else {
      activeEvents.unshift(item);
    }
    persistDataset(STORAGE_KEYS.EVENTS, activeEvents);
    return item;
  },

  deleteEvent(id) {
    activeEvents = activeEvents.filter((e) => e.id !== id);
    persistDataset(STORAGE_KEYS.EVENTS, activeEvents);
    return true;
  },

  // ==========================================
  // TRAILERS
  // ==========================================
  getAllTrailers() {
    return activeTrailers.map((t) => resolveLocale(t, TRAILER_LOCALE_FIELDS));
  },

  getRawTrailers() {
    return [...activeTrailers];
  },

  getTrailerById(id) {
    const t = activeTrailers.find((t) => t.id === id) || null;
    return resolveLocale(t, TRAILER_LOCALE_FIELDS);
  },

  getRawTrailerById(id) {
    return activeTrailers.find((t) => t.id === id) || null;
  },

  getTrailersByCategory(categoryId, { status = 'all' } = {}) {
    let result = activeTrailers;
    if (categoryId && categoryId !== 'all') {
      result = result.filter((t) => t.category === categoryId);
    }
    if (status && status !== 'all') {
      result = result.filter((t) => t.status === status);
    }
    return result
      .sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0))
      .map((t) => resolveLocale(t, TRAILER_LOCALE_FIELDS));
  },

  saveTrailer(item) {
    const index = activeTrailers.findIndex((t) => t.id === item.id);
    if (index >= 0) {
      activeTrailers[index] = { ...activeTrailers[index], ...item };
    } else {
      activeTrailers.unshift(item);
    }
    persistDataset(STORAGE_KEYS.TRAILERS, activeTrailers);
    return item;
  },

  deleteTrailer(id) {
    activeTrailers = activeTrailers.filter((t) => t.id !== id);
    persistDataset(STORAGE_KEYS.TRAILERS, activeTrailers);
    return true;
  },

  // ==========================================
  // MERCHANDISE
  // ==========================================
  getAllMerchandise() {
    return activeMerchandise.map((m) => resolveLocale(m, MERCHANDISE_LOCALE_FIELDS));
  },

  getRawMerchandise() {
    return [...activeMerchandise];
  },

  getMerchandiseById(id) {
    const m = activeMerchandise.find((m) => m.id === id) || null;
    return resolveLocale(m, MERCHANDISE_LOCALE_FIELDS);
  },

  getRawMerchandiseById(id) {
    return activeMerchandise.find((m) => m.id === id) || null;
  },

  getMerchandiseByCategory(categoryId, { productType = 'all', sort = 'featured' } = {}) {
    let result = activeMerchandise;
    if (categoryId && categoryId !== 'all') {
      result = result.filter((m) => m.category === categoryId);
    }
    if (productType && productType !== 'all') {
      result = result.filter((m) => m.productType === productType);
    }

    const localized = result.map((m) => resolveLocale(m, MERCHANDISE_LOCALE_FIELDS));

    if (sort === 'price-asc') {
      return localized.sort((a, b) => a.price - b.price);
    }
    if (sort === 'price-desc') {
      return localized.sort((a, b) => b.price - a.price);
    }
    if (sort === 'rating') {
      return localized.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return localized;
  },

  saveMerchandise(item) {
    const index = activeMerchandise.findIndex((m) => m.id === item.id);
    if (index >= 0) {
      activeMerchandise[index] = { ...activeMerchandise[index], ...item };
    } else {
      activeMerchandise.unshift(item);
    }
    persistDataset(STORAGE_KEYS.MERCHANDISE, activeMerchandise);
    return item;
  },

  deleteMerchandise(id) {
    activeMerchandise = activeMerchandise.filter((m) => m.id !== id);
    persistDataset(STORAGE_KEYS.MERCHANDISE, activeMerchandise);
    return true;
  },

  // ==========================================
  // OVERALL STATS & ADMIN HELPERS
  // ==========================================
  getStats() {
    const categories = ['anime', 'gaming', 'movies', 'tvshows', 'kpop', 'comics', 'manga'];
    
    const countByCategory = {};
    categories.forEach(cat => {
      countByCategory[cat] = {
        contents: activeContents.filter(c => c.category === cat).length,
        events: activeEvents.filter(e => e.category === cat).length,
        trailers: activeTrailers.filter(t => t.category === cat).length,
        characters: activeCharacters.filter(c => c.category === cat).length,
        merchandise: activeMerchandise.filter(m => m.category === cat).length,
      };
      countByCategory[cat].total = 
        countByCategory[cat].contents +
        countByCategory[cat].events +
        countByCategory[cat].trailers +
        countByCategory[cat].characters +
        countByCategory[cat].merchandise;
    });

    return {
      totalContents: activeContents.length,
      totalEvents: activeEvents.length,
      totalTrailers: activeTrailers.length,
      totalCharacters: activeCharacters.length,
      totalMerchandise: activeMerchandise.length,
      grandTotal: activeContents.length + activeEvents.length + activeTrailers.length + activeCharacters.length + activeMerchandise.length,
      byCategory: countByCategory
    };
  },

  resetAllToDefaults() {
    activeContents = [...contentsData];
    activeCharacters = [...charactersData];
    activeEvents = [...eventsData];
    activeTrailers = [...trailersData];
    activeMerchandise = [...merchandiseData];

    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fv_data_change', { detail: { action: 'reset' } }));
    }
    return true;
  },

  exportBackup() {
    return {
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
      data: {
        contents: activeContents,
        characters: activeCharacters,
        events: activeEvents,
        trailers: activeTrailers,
        merchandise: activeMerchandise,
      }
    };
  },

  importBackup(backupData) {
    if (!backupData || !backupData.data) {
      throw new Error('Định dạng tệp sao lưu không hợp lệ.');
    }
    const { contents, characters, events, trailers, merchandise } = backupData.data;

    if (Array.isArray(contents)) {
      activeContents = contents;
      persistDataset(STORAGE_KEYS.CONTENTS, activeContents);
    }
    if (Array.isArray(characters)) {
      activeCharacters = characters;
      persistDataset(STORAGE_KEYS.CHARACTERS, activeCharacters);
    }
    if (Array.isArray(events)) {
      activeEvents = events;
      persistDataset(STORAGE_KEYS.EVENTS, activeEvents);
    }
    if (Array.isArray(trailers)) {
      activeTrailers = trailers;
      persistDataset(STORAGE_KEYS.TRAILERS, activeTrailers);
    }
    if (Array.isArray(merchandise)) {
      activeMerchandise = merchandise;
      persistDataset(STORAGE_KEYS.MERCHANDISE, activeMerchandise);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fv_data_change', { detail: { action: 'import' } }));
    }
    return true;
  }
};
