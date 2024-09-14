const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Define email options
  const mailOptions = {
    from: 'YourApp <no-reply@yourapp.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
