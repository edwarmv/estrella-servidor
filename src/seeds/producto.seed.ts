import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Producto } from 'entities/producto';

export default class CrearProducto implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Producto)().createMany(100);
  }
}
