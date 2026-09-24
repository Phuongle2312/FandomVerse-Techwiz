import faqData from '../data/chatbot_faq.json';

export const chatbotService = {
  getQuickReplies() {
    return faqData
      .filter((item) => item.keywords && item.keywords.length > 0)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        question: item.question,
      }));
  },

  matchAnswer(inputText = '') {
    const query = inputText.toLowerCase().trim();
    if (!query) {
      return this.getFallback();
    }

    // Direct match with questions or keywords
    const matched = faqData.find((item) => {
      if (!item.keywords || item.keywords.length === 0) return false;
      return item.keywords.some((keyword) => query.includes(keyword.toLowerCase()));
    });

    if (matched) {
      return {
        id: matched.id,
        question: matched.question,
        answer: matched.answer,
        link: matched.link,
      };
    }

    return this.getFallback();
  },

  getFallback() {
    const fallback = faqData.find((item) => item.id === 'faq-fallback') || {
      id: 'faq-fallback',
      question: 'Tôi cần hỗ trợ thêm thông tin',
      answer:
        'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Hãy thử hỏi về các danh mục Anime, Gaming, Merchandise, Trailers hoặc cách lưu Bookmark nhé!',
      link: null,
    };

    return fallback;
  },
};
