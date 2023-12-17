const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = ({ from, to, subject, text, html }) => {
  console.log(transporter.transporter.options);
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};
