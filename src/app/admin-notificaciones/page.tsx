'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function AdminNotificaciones() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string>('');
  const { username, isAuthenticated } = useAuth();

  if (!isAuthenticated || username !== 'Reyser') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso denegado</h1>
          <p className="text-gray-600">Solo Reyser puede acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const sendTestNotification = async () => {
    setSending(true);
    setResult('Enviando...');
    
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manual: true }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const resultsCount = data.results ? data.results.length : 0;
        const successCount = data.results ? data.results.filter((r: any) => r.success).length : 0;
        
        setResult(`✅ Notificación enviada: "${data.body}"\n\nResultados: ${successCount}/${resultsCount} suscripciones exitosas`);
      } else {
        setResult(`❌ Error: ${data.error || 'Error desconocido'}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🔔 Admin Notificaciones
        </h1>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Envía notificaciones de prueba a todos los dispositivos suscritos
            </p>
            
            <Button
              onClick={sendTestNotification}
              disabled={sending}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg"
            >
              {sending ? '📤 Enviando...' : '🚀 Enviar Notificación de Prueba'}
            </Button>
          </div>
          
          {result && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Resultado:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
            </div>
          )}
          
          <div className="text-center">
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="rounded-full"
            >
              ← Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 