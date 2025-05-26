import { create } from 'zustand';

interface AppState {
  status: any;
  setStatus: (by: any) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  status: {},
  setStatus: (status) => set(() => ({ status })),
}));
