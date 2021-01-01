import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Cliente } from 'app/entities/cliente';

export default class CrearCliente implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Cliente)().createMany(100);
  }
}
