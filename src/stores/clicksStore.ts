import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type ClickCounts = { [key: string]: number };

interface ClicksState {
  clicks: ClickCounts;
  isSubmitting: boolean;
  lastUpdated: number;
  
  // Actions
  setClicks: (clicks: ClickCounts) => void;
  incrementClick: (username: string) => void;
  decrementClick: (username: string) => void;
  setSubmitting: (submitting: boolean) => void;
  loadClicks: () => Promise<void>;
  addClick: (username: string) => Promise<void>;
}

export const useClicksStore = create<ClicksState>((set, get) => ({
  clicks: { Reyser: 0, Marilyn: 0 },
  isSubmitting: false,
  lastUpdated: 0,
  
  setClicks: (clicks) => {
    set({ clicks, lastUpdated: Date.now() });
  },
  
  incrementClick: (username) => {
    const current = get().clicks;
    const newClicks = { ...current, [username]: current[username] + 1 };
    set({ clicks: newClicks, lastUpdated: Date.now() });
  },
  
  decrementClick: (username) => {
    const current = get().clicks;
    const newClicks = { ...current, [username]: Math.max(0, current[username] - 1) };
    set({ clicks: newClicks, lastUpdated: Date.now() });
  },
  
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  
  loadClicks: async () => {
    try {
      const { data, error } = await supabase
        .from('clicks')
        .select('username');
      
      if (error) {
        console.error('Error loading clicks:', error);
        return;
      }
      
      // Contar manualmente para evitar problemas con count()
      const counts = { Reyser: 0, Marilyn: 0 };
      data?.forEach(click => {
        if (click.username === 'Reyser') {
          counts.Reyser++;
        } else if (click.username === 'Marilyn') {
          counts.Marilyn++;
        }
      });
      
      get().setClicks(counts);
    } catch (error) {
      console.error('Error loading clicks:', error);
    }
  },
  
  addClick: async (username) => {
    const { incrementClick, decrementClick, setSubmitting } = get();
    
    if (!username) return;
    
    setSubmitting(true);
    
    // Actualización optimista inmediata
    incrementClick(username);
    
    try {
      const { error } = await supabase
        .from('clicks')
        .insert({ username });
        
      if (error) {
        // Revertir si hay error
        decrementClick(username);
        throw error;
      }
    } catch (error) {
      console.error('Error adding click:', error);
    } finally {
      setSubmitting(false);
    }
  }
})); 