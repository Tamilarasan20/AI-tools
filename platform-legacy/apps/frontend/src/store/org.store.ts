'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Org {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  role: string;
}

interface OrgStore {
  currentOrg: Org | null;
  setCurrentOrg: (org: Org | null) => void;
}

export const useOrgStore = create<OrgStore>()(
  persist(
    (set) => ({
      currentOrg: null,
      setCurrentOrg: (currentOrg) => set({ currentOrg }),
    }),
    { name: 'loraloop-org' },
  ),
);
