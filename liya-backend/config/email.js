const nodemailer = require('nodemailer');

// Create reusable transporter using environment variables (REQUIRED)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Validate required env vars
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('🚨 MISSING EMAIL CONFIG: Set EMAIL_USER and EMAIL_PASS in .env');
  console.error('   Use Gmail App Password: https://myaccount.google.com/apppasswords');
}

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('🚨 Email transporter FAILED:', error.message);
    console.error('   Fix: https://support.google.com/mail/?p=BadCredentials');
  } else {
    console.log('✅ Email transporter ready');
  }
});

module.exports = transporter;
