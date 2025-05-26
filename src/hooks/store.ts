import { create } from "zustand";

export type Status = "initiate" | "download" | "progress" | "done" | "ready";
export type StatusEvent = {
  status: Status;
  total?: number;
  loaded?: number;
  progress?: number;
};
interface AppState {
  status: StatusEvent;
  setStatus: (status: StatusEvent) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  status: {} as StatusEvent,
  setStatus: (status) => set(() => ({ status })),
}));
