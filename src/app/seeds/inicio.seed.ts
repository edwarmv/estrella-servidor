import { Usuario } from 'app/entities/usuario';
import { Rol } from 'app/entities/rol';
import { RolUsuario } from 'app/entities/rol-usuario';
import { Menu } from 'app/entities/menu';
import { RolMenu } from 'app/entities/rol-menu';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class InicioSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // Creamos los roles
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

    // Obtenemos los id del roles
    const rolAdministrador = await connection
    .createQueryBuilder(Rol, 'rol')
    .where("rol.nombre = 'Administrador'")
    .getOne();

    const rolCliente = await connection
    .createQueryBuilder(Rol, 'rol')
    .where("rol.nombre = 'Cliente'")
    .getOne();

    // Creamos un usuario
    await factory(Usuario)().create({
      correoElectronico: 'edwar@edwar.com',
      cuentaVerificada: true
    });

    // Asignamos los roles al usuario edwar@edwar.com
    await connection
    .createQueryBuilder()
    .insert()
    .into(RolUsuario)
    .values([
      { rol: rolAdministrador, usuario: { id: 1 }, rolPorDefecto: true },
      { rol: rolCliente, usuario: { id: 1 } }
    ])
    .execute();

    // Creamos los menus
    await connection
    .createQueryBuilder()
    .insert()
    .into(Menu)
    .values([
      { nombre: 'Pedidos',       path: '/pedidos'       },
      { nombre: 'Productos',     path: '/productos'     },
      { nombre: 'Usuarios',      path: '/usuarios'      },
      { nombre: 'Roles',         path: '/roles'         },
      { nombre: 'Menús',         path: '/menus'         },
      { nombre: 'Clientes',      path: '/clientes'      },
      { nombre: 'Configuración', path: '/configuracion' },
      { nombre: 'Deliveries',    path: '/deliveries'    },
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
