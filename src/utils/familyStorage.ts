import { Family, FamilyMember, FamilyInvite } from '../types/family';

const STORAGE_KEYS = {
  CURRENT_FAMILY: 'familyCookbook_currentFamily',
  FAMILIES: 'familyCookbook_families',
  INVITES: 'familyCookbook_invites',
};

export const getFamilies = (): Family[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAMILIES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading families:', error);
    return [];
  }
};

export const saveFamilies = (families: Family[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAMILIES, JSON.stringify(families));
  } catch (error) {
    console.error('Error saving families:', error);
  }
};

export const getCurrentFamily = (): Family | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_FAMILY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading current family:', error);
    return null;
  }
};

export const setCurrentFamily = (family: Family | null): void => {
  try {
    if (family) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_FAMILY, JSON.stringify(family));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_FAMILY);
    }
  } catch (error) {
    console.error('Error setting current family:', error);
  }
};

export const getInvites = (): FamilyInvite[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.INVITES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading invites:', error);
    return [];
  }
};

export const saveInvites = (invites: FamilyInvite[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INVITES, JSON.stringify(invites));
  } catch (error) {
    console.error('Error saving invites:', error);
  }
};