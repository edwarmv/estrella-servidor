import { config } from 'dotenv';
config();
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { routes } from './app/routes/index';
import { localTransporter } from './app/configuration/transporter';
import { App } from './app/app';

export const basePath: string = __dirname;

const app = new App(routes);
app.listen(3000);

localTransporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

createConnection()
.then(() => {
  console.log('Database connected');
})
.catch(error => console.log(error));
