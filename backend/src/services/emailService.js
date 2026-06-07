import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

export const sendOrderConfirmationEmail = async (order) => {
  if (!process.env.SMTP_USER) return; // Skip in dev if not configured

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Abundance Code" <${process.env.EMAIL_FROM}>`,
    to: order.email,
    subject: 'Your Abundance Code Sphere is on its way ✨',
    html: `
      <div style="font-family: Inter, sans-serif; background: #0B0B0B; color: #fff; padding: 40px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #D4AF37; font-size: 28px;">Your sphere is on its way.</h1>
        <p style="color: #ccc; font-size: 16px;">Hi ${order.name || 'there'},</p>
        <p style="color: #ccc;">Thank you for your order. Your <strong>Abundance Code Sphere</strong> will arrive within 7–14 business days.</p>

        <div style="background: #1a1a1a; border: 1px solid #D4AF37; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #D4AF37; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your Activation Code</p>
          <p style="color: #fff; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 4px;">${order.activationCode}</p>
        </div>

        <p style="color: #ccc;">Once you receive your sphere, visit <strong>abundancecode.com/activate</strong> and enter this code to create your personal energy profile.</p>

        <p style="color: #888; font-size: 14px; margin-top: 40px;">Order ID: ${order._id}</p>
      </div>
    `,
  });
};

export const sendActivationEmail = async (user) => {
  if (!process.env.SMTP_USER) return;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Abundance Code" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Your portal is now active — Day 1 begins',
    html: `
      <div style="font-family: Inter, sans-serif; background: #0B0B0B; color: #fff; padding: 40px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #D4AF37;">Welcome to your portal, ${user.name || ''}.</h1>
        <p style="color: #ccc;">Your 30-day discovery period has begun. Each day you will receive a personal activation based on your natal chart and planetary cycles.</p>
        <a href="${process.env.FRONTEND_URL}/portal" style="display: inline-block; background: #D4AF37; color: #0B0B0B; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">Access your portal</a>
      </div>
    `,
  });
};
