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
  // Contents (Articles, Galleries, Videos, Audios)
  getAllContents() {
    return contentsData.map((item) => resolveLocale(item, CONTENT_LOCALE_FIELDS));
  },

  getFeaturedContents() {
    return contentsData
      .filter((item) => item.featured)
      .map((item) => resolveLocale(item, CONTENT_LOCALE_FIELDS));
  },

  getContentById(id) {
    const item = contentsData.find((item) => item.id === id) || null;
    return resolveLocale(item, CONTENT_LOCALE_FIELDS);
  },

  getContentsByCategory(categoryId, { type = 'all', subTag = 'all', sort = 'newest' } = {}) {
    let result = contentsData.filter((item) => item.category === categoryId);

    if (type && type !== 'all') {
      result = result.filter((item) => item.type === type);
    }

    if (subTag && subTag !== 'all') {
      result = result.filter((item) => item.subTags && item.subTags.includes(subTag));
    }

    result = result.map((item) => resolveLocale(item, CONTENT_LOCALE_FIELDS));

    if (sort === 'alphabetical') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, toBcp47(i18n.language)));
    } else if (sort === 'featured') {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      // Default: newest
      result = [...result].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }

    return result;
  },

  getRelatedContents(categoryId, currentId, limit = 3) {
    return contentsData
      .filter((item) => item.category === categoryId && item.id !== currentId)
      .slice(0, limit)
      .map((item) => resolveLocale(item, CONTENT_LOCALE_FIELDS));
  },

  // Characters
  getAllCharacters() {
    return charactersData.map((c) => resolveLocale(c, CHARACTER_LOCALE_FIELDS));
  },

  getCharacterById(id) {
    const c = charactersData.find((c) => c.id === id) || null;
    return resolveLocale(c, CHARACTER_LOCALE_FIELDS);
  },

  getCharactersByCategory(categoryId, { franchise = 'all' } = {}) {
    let result = charactersData.filter((c) => c.category === categoryId);
    if (franchise && franchise !== 'all') {
      result = result.filter((c) => c.franchise === franchise);
    }
    return result.map((c) => resolveLocale(c, CHARACTER_LOCALE_FIELDS));
  },

  getFranchisesByCategory(categoryId) {
    const chars = charactersData.filter((c) => c.category === categoryId);
    const set = new Set(chars.map((c) => c.franchise));
    return Array.from(set);
  },

  // Events
  getAllEvents() {
    return eventsData.map((e) => resolveLocale(e, EVENT_LOCALE_FIELDS));
  },

  getEventById(id) {
    const e = eventsData.find((e) => e.id === id) || null;
    return resolveLocale(e, EVENT_LOCALE_FIELDS);
  },

  getEventsByCategory(categoryId, { status = 'all' } = {}) {
    let result = eventsData.filter((e) => e.category === categoryId);
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

  // Trailers
  getAllTrailers() {
    return trailersData.map((t) => resolveLocale(t, TRAILER_LOCALE_FIELDS));
  },

  getTrailerById(id) {
    const t = trailersData.find((t) => t.id === id) || null;
    return resolveLocale(t, TRAILER_LOCALE_FIELDS);
  },

  getTrailersByCategory(categoryId, { status = 'all' } = {}) {
    let result = trailersData;
    if (categoryId && categoryId !== 'all') {
      result = result.filter((t) => t.category === categoryId);
    }
    if (status && status !== 'all') {
      result = result.filter((t) => t.status === status);
    }
    return result
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .map((t) => resolveLocale(t, TRAILER_LOCALE_FIELDS));
  },

  // Merchandise
  getAllMerchandise() {
    return merchandiseData.map((m) => resolveLocale(m, MERCHANDISE_LOCALE_FIELDS));
  },

  getMerchandiseById(id) {
    const m = merchandiseData.find((m) => m.id === id) || null;
    return resolveLocale(m, MERCHANDISE_LOCALE_FIELDS);
  },

  getMerchandiseByCategory(categoryId, { productType = 'all' } = {}) {
    let result = merchandiseData;
    if (categoryId && categoryId !== 'all') {
      result = result.filter((m) => m.category === categoryId);
    }
    if (productType && productType !== 'all') {
      result = result.filter((m) => m.productType === productType);
    }
    return result.map((m) => resolveLocale(m, MERCHANDISE_LOCALE_FIELDS));
  },
};
