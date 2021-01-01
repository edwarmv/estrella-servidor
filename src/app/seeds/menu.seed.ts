import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Menu } from 'app/entities/menu';

export default class CrearMenu implements Seeder{
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Menu)().createMany(50);
  }
}
