import { sendEmail } from './contactoModel.js';

const sendContactEmail = async (req, res) => {
  console.log('Contact controller: Received request');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  const { name, email, telefono, mensaje } = req.body;

  // Validación mejorada de campos requeridos
  if (!name?.trim() || !email?.trim() || !telefono?.trim() || !mensaje?.trim()) {
    console.error('Contact controller: Missing or empty required fields', {
      name: !!name?.trim(),
      email: !!email?.trim(),
      telefono: !!telefono?.trim(),
      mensaje: !!mensaje?.trim()
    });
    return res.status(400).json({ error: 'Todos los campos son requeridos y no pueden estar vacíos.' });
  }

  try {
    console.log('Contact controller: Attempting to send email');
    // Llama al modelo para enviar el correo
    let info = await sendEmail({ name, email, telefono, mensaje });
    console.log('Contact controller: Email sent successfully', {
      messageId: info.messageId,
      response: info.response
    });
    res.status(200).json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    console.error('Contact controller: Error sending email', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    });
    res.status(500).json({ success: false, error: 'Error al enviar el mensaje.' });
  }
};

export default { sendContactEmail };