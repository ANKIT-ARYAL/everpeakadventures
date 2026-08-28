import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const siteSettings = await prisma.siteSettings.findFirst().catch(() => null);

  const host = siteSettings?.smtpHost || process.env.SMTP_HOST;
  const port = siteSettings?.smtpPort || parseInt(process.env.SMTP_PORT || '587');
  const user = siteSettings?.smtpUser || process.env.SMTP_USER;
  const pass = siteSettings?.smtpPassword || process.env.SMTP_PASS;
  const from = siteSettings?.email ? `"${siteSettings.email}" <${siteSettings.email}>` : process.env.SMTP_FROM || '"Ever Peak Adventures" <info@everpeakadventures.com>';

  if (!host || !user || !pass) {
    console.log('\n--- EMAIL NOT SENT (SMTP NOT CONFIGURED) ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Content:\n', html);
    console.log('--------------------------------------------\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}
