const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

async function sendOtpEmail(toEmail, otp) {
  await transporter.sendMail({
    from: `Safarika <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Safarika password reset code',
    text: `Your password reset code is ${otp}. It expires in 10 minutes.`
  });
}

module.exports = {
  sendOtpEmail
};
