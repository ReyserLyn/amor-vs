import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useClicksStore } from '@/stores/clicksStore';

export function useSimpleRealtime(currentUsername: string) {
  const { loadClicks } = useClicksStore();

  useEffect(() => {
    loadClicks();

    if (!currentUsername) {
      return;
    }

    // Configurar realtime
    const channel = supabase
      .channel('amor-realtime', {
        config: {
          broadcast: { self: false },
          presence: { key: currentUsername }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clicks'
        },
        () => {
          setTimeout(() => {
            loadClicks();
          }, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUsername, loadClicks]);
} 