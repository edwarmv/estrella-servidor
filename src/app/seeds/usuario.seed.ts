import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Usuario } from 'app/entities/usuario';

export default class CrearUsuario implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {

    await factory(Usuario)().createMany(100);
  }
}
