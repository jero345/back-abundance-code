import nodemailer from 'nodemailer';
import { buildAccessUrl } from './accessService.js';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

/* Paleta de la marca — la misma que usa la web. */
const IVORY     = '#F5F1ED';
const CARD      = '#FFFDF7';
const BEIGE     = '#E8DCC8';
const CHAMPAGNE = '#D4AF37';
const MOKA      = '#3D2817';
const MUTED     = '#5B3E2A';

/* =============================================================================
 *  Correo de acceso
 *
 *  Es la red de seguridad: quien paga vuelve a la app directamente desde
 *  Stripe, así que este correo es para quien cerró la pestaña. El enlace lleva
 *  el token dentro, de modo que la cuenta queda vinculada al correo que pagó
 *  sin que el usuario tenga que acordarse de nada.
 * ============================================================================*/
export const sendAccessEmail = async (subscription) => {
  if (!process.env.SMTP_USER) {
    console.log('[Email] SMTP sin configurar — se omite el correo de acceso');
    return;
  }

  const url  = buildAccessUrl(subscription.access_token);
  const name = subscription.name ? `, ${subscription.name}` : '';

  await createTransporter().sendMail({
    from: `"Abundance Code" <${process.env.EMAIL_FROM}>`,
    to: subscription.email,
    subject: 'Tu acceso a Abundance Code está listo ✦',
    html: `
      <div style="font-family: Montserrat, Helvetica, Arial, sans-serif; background:${IVORY}; padding:40px 20px;">
        <div style="max-width:560px; margin:0 auto; background:${CARD}; border:1px solid ${BEIGE}; border-radius:16px; padding:40px;">

          <p style="color:${CHAMPAGNE}; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin:0 0 20px;">
            Tu portal está abierto
          </p>

          <h1 style="color:${MOKA}; font-size:24px; line-height:1.3; margin:0 0 20px; font-weight:600;">
            Bienvenida${name}.
          </h1>

          <p style="color:${MOKA}; font-size:15px; line-height:1.6; margin:0 0 12px;">
            Tu suscripción está activa. Con este botón entras a tu portal y creas tu cuenta
            — ya queda vinculada a este mismo correo, no tienes que hacer nada más.
          </p>

          <p style="color:${MUTED}; font-size:14px; line-height:1.6; margin:0 0 28px;">
            Dentro te pedimos tu fecha, hora y lugar de nacimiento. Con eso calculamos
            tu carta natal y en minutos tienes tu primera lectura.
          </p>

          <div style="text-align:center; margin:0 0 28px;">
            <a href="${url}"
               style="display:inline-block; background:${MOKA}; color:${IVORY}; padding:16px 36px;
                      border-radius:999px; text-decoration:none; font-weight:600; font-size:14px;
                      letter-spacing:0.06em;">
              ENTRAR A MI PORTAL
            </a>
          </div>

          <p style="color:${MUTED}; font-size:12px; line-height:1.6; margin:0 0 24px; text-align:center;">
            Si el botón no funciona, copia y pega este enlace:<br>
            <span style="color:${MOKA}; word-break:break-all;">${url}</span>
          </p>

          ${subscription.access_code ? `
          <div style="background:${BEIGE}; border-radius:12px; padding:18px; text-align:center; margin:0 0 24px;">
            <p style="color:${MUTED}; font-size:10px; letter-spacing:2px; text-transform:uppercase; margin:0 0 6px;">
              Código de respaldo
            </p>
            <p style="color:${MOKA}; font-size:20px; font-weight:700; letter-spacing:3px; margin:0;">
              ${subscription.access_code}
            </p>
          </div>` : ''}

          <div style="border-top:1px solid ${BEIGE}; padding-top:20px; margin-top:8px;">
            <p style="color:${MUTED}; font-size:12px; line-height:1.6; margin:0;">
              Este enlace es personal y caduca en 30 días. Si lo pierdes, pide uno nuevo en
              <a href="${process.env.FRONTEND_URL}/activar-acceso" style="color:${CHAMPAGNE};">
                ${(process.env.FRONTEND_URL || '').replace(/^https?:\/\//, '')}/activar-acceso
              </a>.
            </p>
          </div>
        </div>

        <p style="text-align:center; color:${MUTED}; font-size:11px; margin:24px 0 0;">
          Abundance Code · Puedes cancelar tu suscripción cuando quieras desde tu cuenta.
        </p>
      </div>
    `,
  });
};

/* Recordatorio para quien pagó y nunca llegó a entrar. */
export const sendAccessReminderEmail = async (subscription) => {
  if (!process.env.SMTP_USER) return;

  const url = buildAccessUrl(subscription.access_token);

  await createTransporter().sendMail({
    from: `"Abundance Code" <${process.env.EMAIL_FROM}>`,
    to: subscription.email,
    subject: 'Tu carta natal sigue esperándote ✦',
    html: `
      <div style="font-family: Montserrat, Helvetica, Arial, sans-serif; background:${IVORY}; padding:40px 20px;">
        <div style="max-width:560px; margin:0 auto; background:${CARD}; border:1px solid ${BEIGE}; border-radius:16px; padding:40px;">
          <h1 style="color:${MOKA}; font-size:22px; line-height:1.3; margin:0 0 16px; font-weight:600;">
            Tu portal está pagado y sin abrir.
          </h1>
          <p style="color:${MOKA}; font-size:15px; line-height:1.6; margin:0 0 28px;">
            Todavía no has creado tu cuenta, así que tu carta natal sigue sin calcularse.
            Son dos minutos y este enlace lo deja todo listo.
          </p>
          <div style="text-align:center;">
            <a href="${url}"
               style="display:inline-block; background:${MOKA}; color:${IVORY}; padding:16px 36px;
                      border-radius:999px; text-decoration:none; font-weight:600; font-size:14px;
                      letter-spacing:0.06em;">
              ENTRAR A MI PORTAL
            </a>
          </div>
        </div>
      </div>
    `,
  });
};
