import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  } | null;
  setCurrentUser: (user: AppState["currentUser"]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
