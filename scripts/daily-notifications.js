
const https = require('https');

const APP_URL = process.env.APP_URL || 'https://tu-dominio.com';

function sendNotification() {
  const data = JSON.stringify({});
  
  const options = {
    hostname: new URL(APP_URL).hostname,
    port: 443,
    path: '/api/notifications/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Notificación enviada:`, responseData);
    });
  });

  req.on('error', (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error:`, error.message);
  });

  req.write(data);
  req.end();
}

sendNotification(); 