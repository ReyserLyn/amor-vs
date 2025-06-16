import { useEffect, useState } from 'react';

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const set = () => setOnline(navigator.onLine);
    window.addEventListener('online', set);
    window.addEventListener('offline', set);
    set();
    return () => {
      window.removeEventListener('online', set);
      window.removeEventListener('offline', set);
    };
  }, []);
  return online;
}