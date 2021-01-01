import nodemailer, { createTransport } from 'nodemailer';

export const localTransporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    auth: {
        user: 'project.1',
        pass: 'secret.1'
    }
});

export const gmailTransporter = createTransport({
  service: 'gmail',
  port: 587,
  secure: true,
  auth: {
    user: '',
    pass: 'wijggafebjxyvucm'
  }
});

export const outlookTransporter = createTransport({
  service: 'Hotmail',
  auth: {
    user: '',
    pass: ''
  }
});
