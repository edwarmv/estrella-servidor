import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: true,
  auth: {
    user: 'edwarmv13@gmail.com',
    pass: 'wijggafebjxyvucm'
  }
});
