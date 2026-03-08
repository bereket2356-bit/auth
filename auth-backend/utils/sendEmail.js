// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });



// Even better – fallback for local development
const baseUrl = process.env.CLIENT_URL || 'http://localhost:5500';
const resetUrl = `${baseUrl}/reset-password.html?token=${resetToken}`;
    const mailOptions = {
      from: `"CHAT-BOT" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h2>You requested a password reset</h2>
        <p>Click the link below to reset your password (link expires in 15 minutes):</p>
        <a href="${resetUrl}" style="background:#512da8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! Message ID:', info.messageId, 'To:', email);
    return true;
  } catch (error) {
    console.error('Email send error:', error.message, error.code, error.response);
    return false;
  }
};

module.exports = { sendResetEmail };