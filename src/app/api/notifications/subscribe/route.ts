import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { endpoint, p256dh, auth, username, userAgent } = await request.json();
    
    if (!endpoint || !p256dh || !auth || !username) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }
    
    // Guardar la suscripción en Supabase
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        endpoint,
        p256dh,
        auth,
        username,
        user_agent: userAgent || 'unknown'
      });
    
    if (error) {
      console.error('Error guardando suscripción:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Suscripción guardada exitosamente' });
    
  } catch (error: any) {
    console.error('Error en subscribe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 