import { useFamily } from './useFamily';
import { useCookbooks } from './useCookbooks';
import type { FamilyRole } from '../types/family';

export function usePermissions() {
  const { currentFamily } = useFamily();
  const { currentCookbook } = useCookbooks();
  
  const getCurrentUserRole = (): FamilyRole | null => {
    if (!currentFamily) return null;
    // In a real app, you'd get the current user's email from auth
    const currentUserEmail = 'current@user.email';
    const member = currentFamily.members.find(m => m.email === currentUserEmail);
    return member?.role || null;
  };

  const canManageFamily = (): boolean => {
    const role = getCurrentUserRole();
    return role === 'head';
  };

  const canAccessCookbook = (cookbookId: string): boolean => {
    if (!currentFamily) return false;
    
    // In a real app, you'd get the current user's email from auth
    const currentUserEmail = 'current@user.email';
    const member = currentFamily.members.find(m => m.email === currentUserEmail);
    
    if (!member) return false;
    if (member.role === 'head') return true;
    
    return member.cookbookAccess.includes(cookbookId);
  };

  const canEditRecipes = (): boolean => {
    const role = getCurrentUserRole();
    if (!role || !currentCookbook) return false;
    
    if (role === 'head') return true;
    return canAccessCookbook(currentCookbook.settings.id);
  };

  const canManageCookbooks = (): boolean => {
    return canManageFamily();
  };

  return {
    canManageFamily,
    canAccessCookbook,
    canEditRecipes,
    canManageCookbooks,
    getCurrentUserRole,
  };
}