import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { supabase } from '@/lib/supabase';

webpush.setVapidDetails(
  'mailto:reyserlyn@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const messages = [
  '💕 ¡Alguien está pensando en ti!',
  '❤️ El amor está en el aire...',
  '🌹 Un momento perfecto para expresar amor',
  '💖 ¿Quién ama más hoy?',
  '✨ Es hora de mostrar tu amor',
  '💝 El contador del amor te espera',
  '🥰 ¡Demuestra cuánto amas!',
  '💞 El amor verdadero nunca descansa',
  '🌸 Un toque de amor lo cambia todo',
  '💓 Tu corazón tiene algo que decir'
];

export async function POST(request: NextRequest) {
  try {
    const { manual = false } = await request.json();
    
    // Obtener todas las suscripciones
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ 
        message: 'No hay suscripciones',
        results: [],
        title: 'Sin suscripciones',
        body: 'No hay dispositivos suscritos a las notificaciones'
      });
    }
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const title = manual ? '💕 Notificación de prueba' : '💕 Amor en línea';
    const body = manual ? 'Esta es una notificación de prueba desde el admin' : randomMessage;
    
    const results = [];
    
    for (const subscription of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        };
        
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify({
            title,
            body,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            url: process.env.APP_URL || 'http://localhost:3000'
          })
        );
        
        results.push({ success: true, endpoint: subscription.endpoint });
      } catch (error) {
        console.error('Error enviando notificación:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        results.push({ success: false, endpoint: subscription.endpoint, error: errorMessage });
        
        // Si la suscripción es inválida, eliminarla
        if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', subscription.endpoint);
        }
      }
    }
    
    return NextResponse.json({ 
      message: 'Notificaciones enviadas',
      results,
      title,
      body
    });
    
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 