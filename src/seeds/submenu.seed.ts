import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Submenu } from 'entities/submenu';

export default class CrearSubmenu implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Submenu)().createMany(50);
  }
}