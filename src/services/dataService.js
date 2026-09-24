import contentsData from '../data/contents.json';
import charactersData from '../data/characters.json';
import eventsData from '../data/events.json';
import trailersData from '../data/trailers.json';
import merchandiseData from '../data/merchandise.json';

export const dataService = {
  // Contents (Articles, Galleries, Videos, Audios)
  getAllContents() {
    return contentsData;
  },

  getFeaturedContents() {
    return contentsData.filter((item) => item.featured);
  },

  getContentById(id) {
    return contentsData.find((item) => item.id === id) || null;
  },

  getContentsByCategory(categoryId, { type = 'all', subTag = 'all', sort = 'newest' } = {}) {
    let result = contentsData.filter((item) => item.category === categoryId);

    if (type && type !== 'all') {
      result = result.filter((item) => item.type === type);
    }

    if (subTag && subTag !== 'all') {
      result = result.filter((item) => item.subTags && item.subTags.includes(subTag));
    }

    if (sort === 'alphabetical') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
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
      .slice(0, limit);
  },

  // Characters
  getAllCharacters() {
    return charactersData;
  },

  getCharacterById(id) {
    return charactersData.find((c) => c.id === id) || null;
  },

  getCharactersByCategory(categoryId, { franchise = 'all' } = {}) {
    let result = charactersData.filter((c) => c.category === categoryId);
    if (franchise && franchise !== 'all') {
      result = result.filter((c) => c.franchise === franchise);
    }
    return result;
  },

  getFranchisesByCategory(categoryId) {
    const chars = charactersData.filter((c) => c.category === categoryId);
    const set = new Set(chars.map((c) => c.franchise));
    return Array.from(set);
  },

  // Events
  getAllEvents() {
    return eventsData;
  },

  getEventById(id) {
    return eventsData.find((e) => e.id === id) || null;
  },

  getEventsByCategory(categoryId, { status = 'all' } = {}) {
    let result = eventsData.filter((e) => e.category === categoryId);
    const today = new Date().toISOString().split('T')[0];

    if (status === 'upcoming') {
      result = result.filter((e) => e.date >= today);
    } else if (status === 'past') {
      result = result.filter((e) => e.date < today);
    }

    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Trailers
  getAllTrailers() {
    return trailersData;
  },

  getTrailerById(id) {
    return trailersData.find((t) => t.id === id) || null;
  },

  getTrailersByCategory(categoryId, { status = 'all' } = {}) {
    let result = trailersData;
    if (categoryId && categoryId !== 'all') {
      result = result.filter((t) => t.category === categoryId);
    }
    if (status && status !== 'all') {
      result = result.filter((t) => t.status === status);
    }
    return result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  },

  // Merchandise
  getAllMerchandise() {
    return merchandiseData;
  },

  getMerchandiseById(id) {
    return merchandiseData.find((m) => m.id === id) || null;
  },

  getMerchandiseByCategory(categoryId, { productType = 'all' } = {}) {
    let result = merchandiseData;
    if (categoryId && categoryId !== 'all') {
      result = result.filter((m) => m.category === categoryId);
    }
    if (productType && productType !== 'all') {
      result = result.filter((m) => m.productType === productType);
    }
    return result;
  },
};
