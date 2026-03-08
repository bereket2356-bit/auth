// test-email.js
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'pigboy646@gmail.com', // ← replace with your email
      subject: 'TEST EMAIL',
      text: 'This is a test email from Nodemailer!',
    });

    console.log('Test email sent! Message ID:', info.messageId);
  } catch (error) {
    console.error('Test email failed:', error.message, error.code, error.response);
  }
}

testEmail();