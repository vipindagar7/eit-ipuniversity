import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/data";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendCounsellingConfirmation(params: {
  name: string;
  email: string;
  interestedIn: string;
}) {
  const { name, email, interestedIn } = params;

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color:#101828;">
    <h2 style="color:#1A2547;">Thanks for reaching out, ${escapeHtml(name)}!</h2>
    <p>We've received your counselling request for <strong>${escapeHtml(
      interestedIn
    )}</strong>. One of our academic counsellors will contact you within 24 hours on the phone number you provided.</p>
    <p>In the meantime, feel free to explore our <a href="${siteConfig.url}/colleges" style="color:#A87B22;">college comparison page</a> or read our latest <a href="${siteConfig.url}/blog" style="color:#A87B22;">admissions guides</a>.</p>
    <p style="margin-top:24px;">— Team ${escapeHtml(siteConfig.name)}</p>
    <hr style="border:none;border-top:1px solid #E1E4EA;margin:24px 0;" />
    <p style="font-size:12px;color:#5B6472;">${escapeHtml(siteConfig.contact.address)}</p>
  </div>`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM || siteConfig.contact.email,
    to: email,
    subject: `We've received your counselling request — ${siteConfig.name}`,
    html,
  });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
