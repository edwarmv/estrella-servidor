import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Menu } from 'app/entities/menu';
import { RolMenu } from 'app/entities/rol-menu';
import { Rol } from 'app/entities/rol';

export default class RolMenuSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const rolAdministrador = await connection
      .getRepository(Rol)
      .findOne({ where: { nombre: 'Administrador' } });

    const menus = await connection.getRepository(Menu).find();

    menus.forEach(async menu => {
      await connection
        .getRepository(RolMenu)
        .insert([{ rol: rolAdministrador, menu }]);
    });
  }
}
