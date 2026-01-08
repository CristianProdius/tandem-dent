import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface ContactEmailData {
  name: string;
  phone: string;
  email?: string;
  service: string;
  message?: string;
  submissionId: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  const { name, phone, email, service, message, submissionId } = data;
  const currentDate = new Date().toLocaleDateString("ro-RO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto;">
        <tr>
          <td style="padding: 32px 24px;">

            <!-- Header with Logo -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
              <tr>
                <td>
                  <img src="https://www.tandemdent.md/images/logo/logo.png" alt="Tandem Dent" style="height: 48px; margin-bottom: 16px;">
                  <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">Programare nouă</p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">${currentDate}</p>
                </td>
              </tr>
            </table>

            <!-- Client Info -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
              <tr>
                <td style="padding: 24px 0;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 16px;">
                        <p style="margin: 0 0 2px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Nume</p>
                        <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${name}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 16px;">
                        <p style="margin: 0 0 2px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Telefon</p>
                        <p style="margin: 0;"><a href="tel:${phone}" style="font-size: 16px; color: #111827; font-weight: 600; text-decoration: none;">${phone}</a></p>
                      </td>
                    </tr>
                    ${email ? `
                    <tr>
                      <td style="padding-bottom: 16px;">
                        <p style="margin: 0 0 2px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                        <p style="margin: 0;"><a href="mailto:${email}" style="font-size: 15px; color: #111827; text-decoration: none;">${email}</a></p>
                      </td>
                    </tr>
                    ` : ""}
                    <tr>
                      <td style="${message ? "padding-bottom: 16px;" : ""}">
                        <p style="margin: 0 0 2px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Serviciu</p>
                        <p style="margin: 0; font-size: 15px; color: #111827;">${service}</p>
                      </td>
                    </tr>
                    ${message ? `
                    <tr>
                      <td>
                        <p style="margin: 0 0 2px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Mesaj</p>
                        <p style="margin: 0; font-size: 15px; color: #4b5563; line-height: 1.5;">${message}</p>
                      </td>
                    </tr>
                    ` : ""}
                  </table>
                </td>
              </tr>
            </table>

            <!-- Call Button -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
              <tr>
                <td>
                  <a href="tel:${phone}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500;">Sună clientul</a>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
              <tr>
                <td>
                  <p style="margin: 0; font-size: 11px; color: #9ca3af;">ID: ${submissionId}</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const textContent = `
Programare nouă
${currentDate}

---

Nume: ${name}
Telefon: ${phone}${email ? `\nEmail: ${email}` : ""}
Serviciu: ${service}${message ? `\nMesaj: ${message}` : ""}

---
ID: ${submissionId}
  `.trim();

  await transporter.sendMail({
    from: `"Tandem Dent" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `Programare: ${name} - ${service}`,
    text: textContent,
    html: htmlContent,
  });
}
