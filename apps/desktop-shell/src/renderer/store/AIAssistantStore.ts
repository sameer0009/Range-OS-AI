import { create } from 'zustand';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: any[];
  timestamp: string;
}

interface AIAssistantState {
  activeMissionId: string | null;
  activePersonaId: string;
  messages: AIMessage[];
  isThinking: boolean;
  setMission: (id: string | null) => void;
  setPersona: (id: string) => void;
  addMessage: (msg: AIMessage) => void;
  setThinking: (val: boolean) => void;
  clearHistory: () => void;
}

export const useAIAssistantStore = create<AIAssistantState>((set) => ({
  activeMissionId: null,
  activePersonaId: 'analyst',
  messages: [
    { 
      id: 'init', 
      role: 'assistant', 
      content: 'Neural Link established. I am ready to analyze system telemetry or assist with mission strategy.', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ],
  isThinking: false,
  setMission: (id) => set({ activeMissionId: id }),
  setPersona: (id) => set({ activePersonaId: id }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setThinking: (val) => set({ isThinking: val }),
  clearHistory: () => set({ messages: [] }),
}));
