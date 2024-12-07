import { useState, useEffect, useCallback } from 'react';
import { Family, FamilyMember, FamilyRole, FamilyInvite } from '../types/family';
import {
  getFamilies,
  saveFamilies,
  getCurrentFamily,
  setCurrentFamily,
  getInvites,
  saveInvites,
} from '../utils/familyStorage';

export function useFamily() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [currentFamily, setCurrentFamilyState] = useState<Family | null>(getCurrentFamily());
  const [invites, setInvites] = useState<FamilyInvite[]>(getInvites());

  const refreshData = useCallback(() => {
    setFamilies(getFamilies());
    setCurrentFamilyState(getCurrentFamily());
    setInvites(getInvites());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const createFamily = useCallback((name: string, creatorEmail: string): Family => {
    const newFamily: Family = {
      id: crypto.randomUUID(),
      name,
      members: [{
        id: crypto.randomUUID(),
        name: 'Family Head',
        email: creatorEmail,
        role: 'head' as FamilyRole,
        cookbookAccess: [],
      }],
      cookbooks: [],
      createdAt: new Date().toISOString(),
    };

    const updatedFamilies = [...families, newFamily];
    saveFamilies(updatedFamilies);
    setCurrentFamily(newFamily);
    refreshData();
    return newFamily;
  }, [families]);

  const updateFamily = useCallback((familyId: string, updates: Partial<Family>) => {
    const updatedFamilies = families.map(family =>
      family.id === familyId ? { ...family, ...updates } : family
    );
    saveFamilies(updatedFamilies);
    refreshData();
  }, [families]);

  const addMember = useCallback((
    familyId: string,
    member: Omit<FamilyMember, 'id'>
  ) => {
    const family = families.find(f => f.id === familyId);
    if (!family) return;

    const newMember: FamilyMember = {
      ...member,
      id: crypto.randomUUID(),
    };

    const updatedFamily = {
      ...family,
      members: [...family.members, newMember],
    };

    updateFamily(familyId, updatedFamily);
  }, [families, updateFamily]);

  const updateMember = useCallback((
    familyId: string,
    memberId: string,
    updates: Partial<FamilyMember>
  ) => {
    const family = families.find(f => f.id === familyId);
    if (!family) return;

    const updatedMembers = family.members.map(member =>
      member.id === memberId ? { ...member, ...updates } : member
    );

    updateFamily(familyId, { ...family, members: updatedMembers });
  }, [families, updateFamily]);

  const removeMember = useCallback((familyId: string, memberId: string) => {
    const family = families.find(f => f.id === familyId);
    if (!family) return;

    const updatedMembers = family.members.filter(member => member.id !== memberId);
    updateFamily(familyId, { ...family, members: updatedMembers });
  }, [families, updateFamily]);

  const createInvite = useCallback((
    familyId: string,
    email: string,
    role: FamilyRole
  ): FamilyInvite => {
    const invite: FamilyInvite = {
      id: crypto.randomUUID(),
      familyId,
      email,
      role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    const updatedInvites = [...invites, invite];
    saveInvites(updatedInvites);
    refreshData();
    return invite;
  }, [invites]);

  const acceptInvite = useCallback((inviteId: string, memberName: string) => {
    const invite = invites.find(i => i.id === inviteId);
    if (!invite) return;

    const family = families.find(f => f.id === invite.familyId);
    if (!family) return;

    addMember(family.id, {
      name: memberName,
      email: invite.email,
      role: invite.role,
      cookbookAccess: [],
    });

    const updatedInvites = invites.filter(i => i.id !== inviteId);
    saveInvites(updatedInvites);
    refreshData();
  }, [invites, families, addMember]);

  return {
    families,
    currentFamily,
    invites,
    createFamily,
    updateFamily,
    addMember,
    updateMember,
    removeMember,
    createInvite,
    acceptInvite,
    refreshData,
  };
}