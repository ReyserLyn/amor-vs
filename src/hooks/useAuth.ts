import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [username, setUsername] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener usuario actual
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const email = data?.user?.email ?? '';
      setUserEmail(email);
      if (email.includes('marilyn')) setUsername('Marilyn');
      if (email.includes('reyser')) setUsername('Reyser');
    });
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    setLoading(false);
    
    if (error) {
      setError('Credenciales incorrectas');
      return false;
    } else {
      supabase.auth.getUser().then(({ data }) => {
        const email = data?.user?.email ?? '';
        setUserEmail(email);
        if (email.includes('marilyn')) setUsername('Marilyn');
        if (email.includes('reyser')) setUsername('Reyser');
      });
      return true;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUsername('');
    setUserEmail('');
  };

  return {
    username,
    userEmail,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!username
  };
} 