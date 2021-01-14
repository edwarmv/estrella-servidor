import { Usuario } from 'app/entities/usuario';
import { Rol } from 'app/entities/rol';
import { RolUsuario } from 'app/entities/rol-usuario';
import { Menu } from 'app/entities/menu';
import { RolMenu } from 'app/entities/rol-menu';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Submenu } from 'app/entities/submenu';

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
        descripcion: 'Accede a las funciones b√°sicas del sistema'
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

    // Creamos los submenus
    await connection
    .createQueryBuilder()
    .insert()
    .into(Submenu)
    .values([
      { nombre: 'Pedidos', path: '/pedidos' },
      { nombre: 'Lista de pedidos', path: '/pedidos/lista-pedidos' },
      { nombre: 'Registrar pedido', path: '/pedidos/nuevo-pedido' },
      {
        nombre: 'Asignar pedidos a repartidores',
        path: '/pedidos/asignar-repartidores'
      },
      { nombre: 'Facturas', path: '/pedidos/facturas' },
      { nombre: 'Reportes', path: '/pedidos/reportes' },
      { nombre: 'Productos', path: '/productos' },
      { nombre: 'Registrar producto', path: '/productos/nuevo-producto' },
      { nombre: 'Usuarios', path: '/usuarios' },
      { nombre: 'Roles', path: '/roles' },
      { nombre: 'Registrar rol', path: '/roles/nuevo-rol' },
      { nombre: 'Menús', path: '/menus' },
      { nombre: 'Registrar menú', path: '/menus/nuevo-menu' },
      { nombre: 'Submenús', path: '/submenus' },
      { nombre: 'Registrar submenú', path: '/submenus/nuevo-submenu' },
      { nombre: 'Clientes', path: '/clientes' },
      { nombre: 'Registrar cliente', path: '/clientes/nuevo-cliente' },
      { nombre: 'Casa matriz', path: '/configuracion/casa-matriz' },
      { nombre: 'Generador de código de control', path: '/configuracion/generador-codigo-control' },
    ])
    .execute();

    // Creamos los menus
    await connection
    .createQueryBuilder()
    .insert()
    .into(Menu)
    .values([
      { nombre: 'Gestionar pedidos' },
      { nombre: 'Gestionar productos' },
      { nombre: 'Gestionar usuarios' },
      { nombre: 'Gestionar roles' },
      { nombre: 'Gestionar menús' },
      { nombre: 'Gestionar submenús' },
      { nombre: 'Gestionar clientes' },
      { nombre: 'Configuración' },
    ])
    .execute();

    // Menu gestionar pedidos
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(1)
    .add([1, 2, 3]);

    // Menu gestionar productos
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(2)
    .add([4, 5]);

    // Menu gestionar usuarios
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(3)
    .add(6);

    // Menu gestionar roles
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(4)
    .add([7, 8]);

    // Menu gestionar menus
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(5)
    .add([9, 10]);

    // Menu gestionar submenus
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(6)
    .add([11, 12]);

    // Menu gestionar clientes
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(7)
    .add([13, 14]);

    // Menu configuracion
    await connection
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(8)
    .add([15, 16]);


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
