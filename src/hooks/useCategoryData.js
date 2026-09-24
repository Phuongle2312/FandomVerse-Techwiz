import { useMemo } from 'react';
import { dataService } from '../services/dataService.js';
import { CATEGORY_LIST } from '../constants.js';

export function useCategoryData(categoryId) {
  const categoryInfo = useMemo(() => {
    return CATEGORY_LIST.find((c) => c.id === categoryId) || null;
  }, [categoryId]);

  const contents = useMemo(() => {
    if (!categoryId) return [];
    return dataService.getContentsByCategory(categoryId);
  }, [categoryId]);

  const characters = useMemo(() => {
    if (!categoryId) return [];
    return dataService.getCharactersByCategory(categoryId);
  }, [categoryId]);

  const events = useMemo(() => {
    if (!categoryId) return [];
    return dataService.getEventsByCategory(categoryId);
  }, [categoryId]);

  const franchises = useMemo(() => {
    if (!categoryId) return [];
    return dataService.getFranchisesByCategory(categoryId);
  }, [categoryId]);

  return {
    categoryInfo,
    contents,
    characters,
    events,
    franchises,
    isValidCategory: !!categoryInfo,
  };
}
