import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Rol } from 'app/entities/rol';

export default class CrearRol implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Rol)().createMany(100);
  }
}
