import { supabase } from './supabase';
import { getOfflineClicks, clearOfflineClicks } from './db';

export async function syncClicks() {
  const clicks = await getOfflineClicks();
  if (clicks.length === 0) return;

  const { error } = await supabase.from('clicks').insert(clicks.map(click => ({ username: click.username, timestamp: click.timestamp })));
  if (!error) await clearOfflineClicks();
}
