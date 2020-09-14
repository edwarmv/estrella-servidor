import 'reflect-metadata';
import express, { Application } from 'express';
import { createConnection } from 'typeorm';
import { routes } from './routes/index';
import { transporter } from './configuration/transporter';

const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(routes);

app.get('/', (req, res) => {
  res.send('hello');
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

createConnection().then(() => {
  console.log('Database connected');
}).catch(error => console.log(error));

app.listen(3000,() => {
  console.log('App is listening on port 3000!');
});
