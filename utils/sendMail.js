const nodemailer = require('nodemailer');

const sendMail = async options => {
  const transporter =
    process.env.NODE_ENV === 'production'
      ? nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASS
          }
        })
      : nodemailer.createTransport({
          host: 'smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
          }
        });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message);

  if (process.env.NODE_ENV !== 'production') {
    console.log('Message sent: %s', info.messageId);
  }
};

module.exports = sendMail;
