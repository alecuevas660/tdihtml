import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // 👈 Debe ir aquí, antes de acceder a process.env

export async function sendEmail({ name, email, telefono, mensaje }) {
  console.log('Contact model: Initializing email transport');
  
  // Log environment variables (without sensitive data)
  console.log('Contact model: Email configuration', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    hasUser: !!process.env.EMAIL_USER,
    hasPassword: !!process.env.EMAIL_PASSWORD,
    hasTo: !!process.env.EMAIL_TO
  });

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,  
    port: process.env.EMAIL_PORT,  
    secure: process.env.EMAIL_SECURE === 'true', // Asegura que sea un booleano
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false  // Evita problemas con certificados SSL
    }
  });

  console.log('Contact model: Creating email options');
  let mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_TO,
    subject: 'Nuevo mensaje de contacto',
    text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${telefono}\nMensaje: ${mensaje}`,
    html: `<p><strong>Nombre:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Teléfono:</strong> ${telefono}</p>
           <p><strong>Mensaje:</strong><br>${mensaje}</p>`
  };

  try {
    console.log('Contact model: Attempting to send email');
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact model: Email sent successfully', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    return info;
  } catch (error) {
    console.error('Contact model: Error sending email', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    throw error;
  }
}