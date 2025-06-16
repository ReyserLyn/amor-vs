'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/LoginModal';
import { LoveCounter } from '@/components/LoveCounter';
import { useAuth } from '@/hooks/useAuth';
import { useClicksStore } from '@/stores/clicksStore';
import { useSimpleRealtime } from '@/hooks/useSimpleRealtime';
import { useNotifications } from '@/hooks/use-notifications';
import InstallButton from '@/components/install-button';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const { username, loading, error, login, logout, isAuthenticated } = useAuth();
  
  // Usar Zustand store
  const { clicks, isSubmitting, addClick } = useClicksStore();
  const { requestPermission, subscribeToPush, isSupported, permission } = useNotifications();
  
  // Sincronización en tiempo real SOLO cuando está autenticado
  useSimpleRealtime(isAuthenticated ? username : '');

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      setShowModal(false);
    }
  };

  const handleEnableNotifications = async () => {
    if (isSupported && isAuthenticated) {
      const granted = await requestPermission();
      if (granted) {
        // Determinar el email basado en el username
        const email = username === 'Marilyn' ? 'marilyn@amor.com' : 'reyser@amor.com';
        await subscribeToPush(email);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-rose-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <InstallButton />
        
        {isAuthenticated ? (
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg">
            <span className="text-sm font-medium text-gray-700">{username}</span>
            <Button 
              onClick={logout} 
              size="sm" 
              variant="outline"
              className="rounded-full"
            >
              Salir
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setShowModal(true)} 
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full px-6 shadow-lg"
          >
            Iniciar sesión
          </Button>
        )}
      </div>

      {/* Título principal */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-red-600 to-rose-600 bg-clip-text text-transparent">
          ¿Quién ama más?
        </h1>
        <p className="text-gray-600 text-lg">
          Expresa tu amor con cada toque
        </p>
      </div>
      
      {/* Contadores de amor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <LoveCounter
          name="Marilyn"
          count={clicks.Marilyn || 0}
          isCurrentUser={username === 'Marilyn'}
          isSubmitting={isSubmitting}
          onHeartClick={() => addClick('Marilyn')}
        />
        
        <LoveCounter
          name="Reyser"
          count={clicks.Reyser || 0}
          isCurrentUser={username === 'Reyser'}
          isSubmitting={isSubmitting}
          onHeartClick={() => addClick('Reyser')}
        />
      </div>

      {/* Mensaje motivacional y botón de notificaciones */}
      {isAuthenticated && (
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600 text-sm">
            Cada toque cuenta una historia de amor 💕
          </p>
          
          {/* Botón de notificaciones si no están habilitadas */}
          {isSupported && permission !== 'granted' && (
            <Button 
              onClick={handleEnableNotifications}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              🔔 Habilitar notificaciones de amor
            </Button>
          )}
          
          {permission === 'granted' && (
            <p className="text-xs text-green-600">
              ✅ Notificaciones habilitadas
            </p>
          )}
        </div>
      )}

      {/* Modal de login */}
      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogin={handleLogin}
        loading={loading}
        error={error}
      />
    </main>
  );
}
