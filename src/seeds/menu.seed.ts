import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Menu } from 'entities/menu';
import { Submenu } from 'entities/submenu';

export default class CreateMenu implements Seeder{
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
    .createQueryBuilder()
    .insert()
    .into(Submenu)
    .values([
      { nombre: 'Pedidos', path: '/pedidos' },
      { nombre: 'Productos', path: '/productos' },
      { nombre: 'Registrar producto', path: '/productos/nuevo-producto' },
      { nombre: 'Usuarios', path: '/usuarios' },
      { nombre: 'Roles', path: '/roles' },
      { nombre: 'Registrar rol', path: '/roles/nuevo-rol' },
    ])
    .execute();

    await connection
    .createQueryBuilder()
    .insert()
    .into(Menu)
    .values([
      { nombre: 'Gestionar pedidos' },
      { nombre: 'Gestionar productos' },
      { nombre: 'Gestionar usuarios' },
      { nombre: 'Gestionar roles' },
    ])
    .execute();

    // Gestionar pedidos
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(1)
    .add(1);

    // Gestionar productos
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(2)
    .add([2, 3]);

    // Gestionar usuarios
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(3)
    .add(4);

    // Gestionar roles
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(4)
    .add([5, 6]);
  }

}
