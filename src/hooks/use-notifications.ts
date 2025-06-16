import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar si las notificaciones están soportadas
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;
    
    const permission = await Notification.requestPermission();
    setPermission(permission);
    return permission === 'granted';
  };

  const subscribeToPush = async (userEmail: string) => {
    if (!isSupported || permission !== 'granted') return null;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      });
      
      const subscriptionData = subscription.toJSON();
      
      // Guardar la suscripción usando la API
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscriptionData.endpoint,
          p256dh: subscriptionData.keys?.p256dh,
          auth: subscriptionData.keys?.auth,
          username: userEmail.includes('marilyn') ? 'Marilyn' : 'Reyser',
          userAgent: navigator.userAgent
        })
      });
      
      setSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  };

  const unsubscribeFromPush = async (userEmail: string) => {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        
        const username = userEmail.includes('marilyn') ? 'Marilyn' : 'Reyser';
        
        // Eliminar la suscripción de Supabase
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('username', username);
        
        setSubscription(null);
      } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
      }
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, options);
    }
  };

  return {
    permission,
    subscription,
    isSupported,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    showNotification
  };
}

// Utility function para convertir VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} 