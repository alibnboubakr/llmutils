import { create } from "zustand";

export interface ToolOutput {
  tool: string;
  input: string;
  output: string;
  timestamp: number;
}

interface ToolStore {
  history: ToolOutput[];
  addToHistory: (item: ToolOutput) => void;
  clearHistory: () => void;
  pipelineOutput: string | null;
  setPipelineOutput: (output: string | null) => void;
}

// Simple store without persist middleware to avoid SSR issues
export const useToolStore = create<ToolStore>()(
  (set) => ({
    history: [],
    addToHistory: (item) =>
      set((state) => ({
        history: [item, ...state.history].slice(0, 50), // Keep last 50
      })),
    clearHistory: () => set({ history: [] }),
    pipelineOutput: null,
    setPipelineOutput: (output) => set({ pipelineOutput: output }),
  })
);
