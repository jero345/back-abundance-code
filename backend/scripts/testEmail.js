import 'dotenv/config';
import nodemailer from 'nodemailer';
import { sendAccessEmail } from '../src/services/emailService.js';

/* =========================================================
   PRUEBA DE CORREO — Abundance Code
   Manda el correo de acceso de ejemplo SIN necesidad de
   hacer una compra real, para verificar que el email está
   bien configurado.

   Cómo usarlo:
     cd backend
     node scripts/testEmail.js tucorreo@gmail.com

   Si no pones un correo, lo manda a tu propio SMTP_USER.
   ========================================================= */

const to = process.argv[2] || process.env.SMTP_USER;

function fail(msg) {
  console.error('\n❌ ' + msg + '\n');
  process.exit(1);
}

console.log('\n=== Prueba de envío de correo — Abundance Code ===\n');

// 1. Revisar que las credenciales existan
if (!process.env.SMTP_USER) {
  fail('Falta SMTP_USER en backend/.env\n   → Pon ahí el correo de Gmail desde el que enviarás.');
}
if (!process.env.SMTP_PASS) {
  fail('Falta SMTP_PASS en backend/.env\n   → Pon ahí la "contraseña de aplicación" de Gmail (16 letras, sin espacios).');
}
if (!to) {
  fail('No sé a quién enviar.\n   → Úsalo así: node scripts/testEmail.js tucorreo@gmail.com');
}

console.log('Servidor SMTP  :', (process.env.SMTP_HOST || 'smtp.gmail.com') + ':' + (process.env.SMTP_PORT || '587'));
console.log('Enviando desde :', process.env.SMTP_USER);
console.log('Enviando a     :', to);
console.log('Remitente "de" :', process.env.EMAIL_FROM || '(no configurado)');
console.log('');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// 2. Verificar conexión + login
try {
  console.log('[1/2] Verificando conexión y credenciales con Gmail...');
  await transporter.verify();
  console.log('      ✅ Conexión OK y credenciales válidas.\n');
} catch (err) {
  console.error('      ❌ No se pudo conectar / iniciar sesión:\n      ' + err.message + '\n');
  console.error('   Posibles causas más comunes:');
  console.error('   • Estás usando tu contraseña normal de Gmail en vez de la "contraseña de aplicación".');
  console.error('   • La cuenta no tiene activada la Verificación en 2 pasos (es obligatoria).');
  console.error('   • Copiaste la contraseña de aplicación CON espacios (debe ir sin espacios).');
  console.error('   • SMTP_USER no es el correo completo (ej: nombre@gmail.com).\n');
  process.exit(1);
}

// 3. Mandar el correo de acceso real (el mismo que recibe un cliente)
try {
  console.log('[2/2] Enviando correo de acceso de prueba...');
  await sendAccessEmail({
    email: to,
    name: 'Cliente de Prueba',
    access_token: 'TOKEN-DE-PRUEBA-NO-VALIDO',
    access_code: 'AC-TEST-1234',
  });
  console.log('      ✅ ¡Correo enviado!');
  console.log('      → Revisa la bandeja de entrada de ' + to + ' (y la carpeta de SPAM por si acaso).\n');
} catch (err) {
  console.error('      ❌ Conectó bien pero falló al enviar:\n      ' + err.message + '\n');
  process.exit(1);
}
