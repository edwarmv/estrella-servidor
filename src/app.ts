import express, { Application, Router } from 'express';

export class App {
  private app: Application;

  constructor(private routes: Router) {
    this.app = express();

    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(express.json());

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
      );
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
      next();
    });

    this.app.get('/', (req, res) => {
      console.log(process.env.URL);
      res.send('hello');
    });

    this.app.use(routes);
  }

  listen(port: number) {
    this.app.listen(port, () => {
      console.log(`App is listening on port ${port}!`);
    });
  }

}
