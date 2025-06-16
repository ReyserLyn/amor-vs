# 💕 Amor Contador

Una PWA elegante para expresar amor entre Reyser y Marilyn con sincronización en tiempo real.

## ✨ ¿Qué hace?

Una aplicación web progresiva donde Reyser y Marilyn pueden expresar su amor haciendo clicks que se sincronizan en tiempo real entre todos sus dispositivos.

## 🎯 Características principales

- 💖 **Contador en tiempo real** - Los clicks aparecen instantáneamente en todos los dispositivos
- 📱 **App instalable** - Se puede instalar como app nativa en el móvil
- 🔔 **Notificaciones** - Recordatorios diarios de amor
- 🔐 **Acceso exclusivo** - Solo para Reyser y Marilyn
- 🎨 **Diseño elegante** - Interfaz moderna y responsiva

## 🛠️ Tecnologías utilizadas

- **Frontend**: Next.js 15, React, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Base de datos + Realtime + Auth)
- **Estado**: Zustand
- **PWA**: Service Worker + Manifest
- **Notificaciones**: Web Push API
- **Deploy**: Optimizado para Vercel/Netlify

## 📱 Funcionalidades

### Contador de amor
- Cada usuario solo puede hacer clicks para sí mismo
- Los clicks se guardan en la base de datos
- Sincronización instantánea entre dispositivos
- Actualizaciones optimistas para mejor UX

### PWA (Progressive Web App)
- Instalable como app nativa
- Funciona offline básico
- Iconos personalizados
- Splash screen

### Notificaciones Push
- Recordatorios diarios automáticos
- Panel de administración para envío manual
- Gestión de suscripciones

### Páginas adicionales
- `/historial` - Ver histórico de clicks
- `/admin-notificaciones` - Panel admin (solo Reyser)

## 🚀 Estado del proyecto

✅ **Completado y funcional**
- Aplicación completamente operativa
- Código limpio y optimizado para producción
- Sin logs de debug
- Listo para deploy
