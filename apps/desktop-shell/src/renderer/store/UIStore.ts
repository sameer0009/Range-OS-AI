import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  activeTabs: string[];
  currentTabIndex: number;
  
  toggleSidebar: () => void;
  toggleCommandPalette: (open?: boolean) => void;
  addTab: (route: string) => void;
  removeTab: (index: number) => void;
  setActiveTab: (index: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isCommandPaletteOpen: false,
  activeTabs: ['/shell/dashboard'],
  currentTabIndex: 0,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleCommandPalette: (open) => set((state) => ({ 
    isCommandPaletteOpen: open !== undefined ? open : !state.isCommandPaletteOpen 
  })),
  addTab: (route) => set((state) => ({ 
    activeTabs: [...state.activeTabs, route],
    currentTabIndex: state.activeTabs.length
  })),
  removeTab: (index) => set((state) => ({
    activeTabs: state.activeTabs.filter((_, i) => i !== index),
    currentTabIndex: Math.max(0, state.currentTabIndex - 1)
  })),
  setActiveTab: (index) => set({ currentTabIndex: index }),
}));
