import { Usuario } from 'entities/usuario';
import { Rol } from 'entities/rol';
import { RolUsuario } from 'entities/rol-usuario';
import { Menu } from 'entities/menu';
import { RolMenu } from 'entities/rol-menu';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Cliente } from 'entities/cliente';

export default class InicioSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // Creamos el rol
    await connection
    .createQueryBuilder()
    .insert()
    .into(Rol)
    .values([
      {
        nombre: 'Administrador',
        descripcion: 'Encargado de todo el sistema'
      },
      {
        nombre: 'Cliente',
        descripcion: 'Accede a las funciones básicas del sistema'
      }
    ])
    .execute();

    // Obtenemos el id del rol
    const rolAdministrador = await connection
    .createQueryBuilder(Rol, 'rol')
    .where("rol.nombre = 'Administrador'")
    .getOne();

    const rolCliente = await connection
    .createQueryBuilder(Rol, 'rol')
    .where("rol.nombre = 'Cliente'")
    .getOne();

    // Creamos un usuario
    await factory(Usuario)().create({ correoElectronico: 'edwar@edwar.com' });

    // Asignamos el rol Administrador al usuario edwar@edwar.com
    await connection
    .createQueryBuilder()
    .insert()
    .into(RolUsuario)
    .values([
      { rol: rolAdministrador, usuario: { id: 1 } },
      { rol: rolCliente, usuario: { id: 1 } }
    ])
    .execute();

    // Obtenemos un array de todos los menús
    const menus = await connection
    .createQueryBuilder(Menu, 'menu')
    .getMany();

    // Asignamos todos los menús al rol Administrador
    menus.forEach(async menu => {
      await connection
      .createQueryBuilder()
      .insert()
      .into(RolMenu)
      .values({ rol: rolAdministrador, menu })
      .execute();
    });

    // const cliente = await connection
    // .createQueryBuilder()
    // .insert()
    // .into(Cliente)
    // .values([
      // {
        // nitCI
      // }
    // ])
    // .execute();
  }
}
