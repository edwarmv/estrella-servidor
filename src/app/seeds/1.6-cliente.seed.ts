import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Cliente } from 'app/entities/cliente';

export default class ClienteSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // await factory(Cliente)().createMany(100);
    await factory(Cliente)().create({
      nombre: 'Mabel',
      apellido: 'Zembrano'
    });

    await factory(Cliente)().create({
      nombre: 'Macarena',
      apellido: 'Rodrígez'
    });

    await factory(Cliente)().create({
      nombre: 'Manuel',
      apellido: 'López'
    });

    await factory(Cliente)().create({
      nombre: 'Mateo',
      apellido: 'Rodrígez'
    });
  }
}
