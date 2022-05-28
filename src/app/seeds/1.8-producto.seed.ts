import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Producto } from 'app/entities/producto';

export default class ProductoSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .getRepository(Producto)
      .insert({
        nombre: 'Pan con queso',
        precio: 0.5
      });

    await connection
      .getRepository(Producto)
      .insert({
        nombre: 'Pan galleta',
        precio: 0.5
      });

    await connection
      .getRepository(Producto)
      .insert({
        nombre: 'Pan de sandwich',
        precio: 7
      });

    await connection
      .getRepository(Producto)
      .insert({
        nombre: 'Pan francés',
        precio: 0.5
      });

    await connection
      .getRepository(Producto)
      .insert({
        nombre: 'Pan francés con orégano',
        precio: 0.5
      });
  }
}
