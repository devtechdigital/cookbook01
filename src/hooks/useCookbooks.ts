import { useState, useEffect, useCallback } from 'react';
import { Cookbook } from '../types/cookbook';
import {
  getCookbooks,
  getCurrentCookbook,
  getCurrentCookbookId,
  setCurrentCookbookId,
  saveCookbook,
  deleteCookbook,
  duplicateCookbook,
  createNewCookbook,
} from '../utils/storage';

export function useCookbooks() {
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [currentCookbook, setCurrentCookbook] = useState<Cookbook>(getCurrentCookbook());
  const [isLoading, setIsLoading] = useState(true);

  const refreshCookbooks = useCallback(() => {
    const stored = getCookbooks();
    setCookbooks(stored);
    setCurrentCookbook(getCurrentCookbook());
  }, []);

  useEffect(() => {
    refreshCookbooks();
    setIsLoading(false);
  }, [refreshCookbooks]);

  const switchCookbook = useCallback((id: string) => {
    setCurrentCookbookId(id);
    setCurrentCookbook(getCurrentCookbook());
  }, []);

  const createCookbook = useCallback(() => {
    const newCookbook = createNewCookbook();
    saveCookbook(newCookbook);
    refreshCookbooks();
    return newCookbook;
  }, [refreshCookbooks]);

  const updateCookbook = useCallback((cookbook: Cookbook) => {
    saveCookbook(cookbook);
    refreshCookbooks();
  }, [refreshCookbooks]);

  const removeCookbook = useCallback((id: string) => {
    deleteCookbook(id);
    refreshCookbooks();
  }, [refreshCookbooks]);

  const duplicateCurrentCookbook = useCallback((newName: string) => {
    const newCookbook = duplicateCookbook(currentCookbook.settings.id, newName);
    refreshCookbooks();
    return newCookbook;
  }, [currentCookbook.settings.id, refreshCookbooks]);

  return {
    cookbooks,
    currentCookbook,
    isLoading,
    switchCookbook,
    createCookbook,
    updateCookbook,
    removeCookbook,
    duplicateCurrentCookbook,
    refreshCookbooks,
  };
}