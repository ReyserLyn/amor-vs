import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@/utils/supabase/server';

// Configurar VAPID keys
webpush.setVapidDetails(
  'mailto:reyserlyn@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { message, targetUser, senderUser } = await request.json();
    
    const supabase = await createClient();
    
    // Obtener suscripciones del usuario objetivo
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', targetUser);
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ error: 'No subscriptions found' }, { status: 404 });
    }
    
    // Mensajes creativos para las notificaciones diarias
    const creativeDailyMessages = [
      `💕 ${senderUser} te envió ${message} dosis de amor hoy`,
      `❤️ ¡${senderUser} estuvo pensando en ti ${message} veces hoy!`,
      `💝 ${senderUser} registró ${message} momentos de amor contigo`,
      `🌹 ${message} te amo de ${senderUser} llegaron hoy`,
      `💖 ${senderUser} llenó el día con ${message} gestos de amor`,
      `✨ ${message} latidos de amor de ${senderUser} para ti`,
      `🥰 ${senderUser} te dedicó ${message} pensamientos dulces hoy`,
      `💫 El amor de ${senderUser} brilló ${message} veces por ti`
    ];
    
    const randomMessage = creativeDailyMessages[Math.floor(Math.random() * creativeDailyMessages.length)];
    
    // Enviar notificaciones a todas las suscripciones
    const promises = subscriptions.map(async (sub) => {
      try {
        const subscription = JSON.parse(sub.subscription);
        
        const payload = JSON.stringify({
          title: '💕 Reporte diario de amor',
          body: randomMessage,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          data: {
            url: '/',
            timestamp: Date.now()
          }
        });
        
        await webpush.sendNotification(subscription, payload);
      } catch (error) {
        console.error('Error sending notification:', error);
        // Eliminar suscripción inválida
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('subscription', sub.subscription);
      }
    });
    
    await Promise.all(promises);
    
    return NextResponse.json({ success: true, sent: promises.length });
  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 