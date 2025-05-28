import * as Comlink from 'comlink';
import { create } from 'zustand';

export type Status = 'initiate' | 'download' | 'progress' | 'done' | 'ready';
export type StatusEvent = {
  status: Status;
  total?: number;
  loaded?: number;
  progress?: number;
};

interface FileState {
  files: File[];
  addFiles: (newFiles: File[]) => void;
  clearFiles: () => void;
  removeFile: (fileToRemove: File) => void; // Added for completeness
}

interface AppState {
  status: StatusEvent;
  setStatus: (status: StatusEvent) => void;
}

export const useAppStore = create<AppState & FileState>()((set) => ({
  status: {} as StatusEvent,
  setStatus: (status) => set(() => ({ status })),
  // files states
  files: [],
  addFiles: (newFiles) =>
    set((state) => ({
      files: [...newFiles, ...state.files], // Add new files to the beginning
    })),
  clearFiles: () => set({ files: [] }),
  removeFile: (fileToRemove) =>
    set((state) => ({
      // Filter out the file. You might need a more robust way to identify files
      // if File objects aren't strictly referentially unique (e.g., by name + size)
      files: state.files.filter((f) => f !== fileToRemove),
    })),
}));

Comlink.expose(useAppStore);
