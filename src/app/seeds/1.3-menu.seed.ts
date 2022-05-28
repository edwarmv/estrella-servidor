import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Menu } from 'app/entities/menu';

export default class MenuSeed implements Seeder{
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Menu)
      .values([
        { nombre: 'Pedidos', path: '/pedidos' },
        { nombre: 'Productos', path: '/productos' },
        { nombre: 'Usuarios', path: '/usuarios' },
        { nombre: 'Roles', path: '/roles' },
        { nombre: 'Menús', path: '/menus' },
        { nombre: 'Clientes', path: '/clientes' },
        { nombre: 'Configuración', path: '/configuracion' },
        { nombre: 'Deliveries', path: '/deliveries' },
        { nombre: 'Sucursales', path: '/sucursales' },
        // { nombre: 'Movimientos de cajas', path: '/movimientos-cajas' },
      ])
      .execute();
  }
}
