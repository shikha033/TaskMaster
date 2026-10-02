import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

// Sends an email. Without SMTP settings (development), the message is
// printed in the server terminal instead, so the app works out of the box.
export async function sendEmail({ to, subject, text }) {
  const mailer = getTransporter();
  if (!mailer) {
    console.log(
      `\n--- EMAIL (SMTP not configured) ---\nTo: ${to}\n${subject}\n${text}\n-----------------------------------\n`
    );
    return;
  }
  await mailer.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}
