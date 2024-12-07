import { Cookbook } from './cookbook';

export type FamilyRole = 'head' | 'contributor';

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: FamilyRole;
  cookbookAccess: string[]; // Array of cookbook IDs
}

export interface Family {
  id: string;
  name: string;
  members: FamilyMember[];
  cookbooks: Cookbook[];
  createdAt: string;
}

export interface FamilyInvite {
  id: string;
  familyId: string;
  email: string;
  role: FamilyRole;
  expiresAt: string;
}