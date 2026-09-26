import { useMemo } from 'react';
import { dataService } from '../services/dataService.js';
import { CATEGORY_LIST } from '../constants.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useTranslation } from 'react-i18next';

export function useCategoryData(categoryId) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const categoryInfo = useMemo(() => {
    const cat = CATEGORY_LIST.find((c) => c.id === categoryId);
    if (!cat) return null;
    return {
      ...cat,
      label: t(`categories.${cat.id}.label`) || cat.label,
      description: t(`categories.${cat.id}.description`) || cat.description,
    };
  }, [categoryId, language, t]);

  const contents = useMemo(() => {
    if (!categoryId) return [];
    return dataService.getContentsByCategory(categoryId);
  }, [categoryId, language]);

  const characters = useMemo(() => {
    if (!categoryId) return [];
    return dataService.getCharactersByCategory(categoryId);
  }, [categoryId, language]);

  const events = useMemo(() => {
    if (!categoryId) return [];
    return dataService.getEventsByCategory(categoryId);
  }, [categoryId, language]);

  const franchises = useMemo(() => {
    if (!categoryId) return [];
    return dataService.getFranchisesByCategory(categoryId);
  }, [categoryId, language]);

  return {
    categoryInfo,
    contents,
    characters,
    events,
    franchises,
    isValidCategory: !!categoryInfo,
  };
}
