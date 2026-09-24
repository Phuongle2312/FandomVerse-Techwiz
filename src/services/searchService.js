import { dataService } from './dataService.js';

export const searchService = {
  search(keyword = '', { category = 'all', type = 'all' } = {}) {
    const q = keyword.toLowerCase().trim();
    if (!q) return [];

    let results = [];

    // 1. Scan Contents (Articles, Galleries, Videos, Audios)
    if (type === 'all' || ['article', 'gallery', 'video', 'audio'].includes(type)) {
      const contents = dataService.getAllContents();
      contents.forEach((item) => {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.shortDescription?.toLowerCase().includes(q);
        const matchTags = item.subTags?.some((tag) => tag.toLowerCase().includes(q));

        if (matchTitle || matchDesc || matchTags) {
          results.push({
            id: item.id,
            category: item.category,
            title: item.title,
            description: item.shortDescription,
            thumbnail: item.thumbnail,
            resultType: item.type, // 'article' | 'gallery' | 'video' | 'audio'
            targetUrl: `#/category/${item.category}/article/${item.id}`,
            date: item.dateAdded,
          });
        }
      });
    }

    // 2. Scan Characters
    if (type === 'all' || type === 'character') {
      const characters = dataService.getAllCharacters();
      characters.forEach((c) => {
        const matchName = c.name.toLowerCase().includes(q);
        const matchBio = c.biography.toLowerCase().includes(q);
        const matchFranchise = c.franchise.toLowerCase().includes(q);
        const matchTraits = c.traits.some((t) => t.toLowerCase().includes(q));

        if (matchName || matchBio || matchFranchise || matchTraits) {
          results.push({
            id: c.id,
            category: c.category,
            title: c.name,
            description: `${c.franchise} — ${c.biography}`,
            thumbnail: c.image,
            resultType: 'character',
            targetUrl: `#/category/${c.category}`,
          });
        }
      });
    }

    // 3. Scan Events
    if (type === 'all' || type === 'event') {
      const events = dataService.getAllEvents();
      events.forEach((e) => {
        const matchTitle = e.title.toLowerCase().includes(q);
        const matchDesc = e.description.toLowerCase().includes(q);
        const matchLoc = e.location.toLowerCase().includes(q);

        if (matchTitle || matchDesc || matchLoc) {
          results.push({
            id: e.id,
            category: e.category,
            title: e.title,
            description: `${e.date} | ${e.location} — ${e.description}`,
            thumbnail: null,
            resultType: 'event',
            targetUrl: `#/category/${e.category}`,
            date: e.date,
          });
        }
      });
    }

    // 4. Scan Trailers
    if (type === 'all' || type === 'trailer') {
      const trailers = dataService.getAllTrailers();
      trailers.forEach((t) => {
        if (t.title.toLowerCase().includes(q)) {
          results.push({
            id: t.id,
            category: t.category,
            title: t.title,
            description: `Trạng thái: ${t.status === 'upcoming' ? 'Sắp chiếu' : 'Đã phát hành'} (Ngày: ${t.releaseDate})`,
            thumbnail: t.thumbnail,
            resultType: 'trailer',
            targetUrl: `#/trailers`,
            date: t.releaseDate,
          });
        }
      });
    }

    // 5. Scan Merchandise
    if (type === 'all' || type === 'merchandise') {
      const merchandise = dataService.getAllMerchandise();
      merchandise.forEach((m) => {
        const matchName = m.name.toLowerCase().includes(q);
        const matchDesc = m.shortDescription.toLowerCase().includes(q);

        if (matchName || matchDesc) {
          results.push({
            id: m.id,
            category: m.category,
            title: m.name,
            description: `$${m.price}${m.priceMax ? ` - $${m.priceMax}` : ''} | ${m.shortDescription}`,
            thumbnail: m.image,
            resultType: 'merchandise',
            targetUrl: `#/merchandise`,
          });
        }
      });
    }

    // Filter by Category if selected
    if (category && category !== 'all') {
      results = results.filter((r) => r.category === category);
    }

    return results;
  },
};
