import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Usuario } from 'app/entities/usuario';
import { Rol } from 'app/entities/rol';
import { RolUsuario } from 'app/entities/rol-usuario';

export default class UsuarioSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const rolCliente = await connection
      .getRepository(Rol)
      .findOne({ nombre: 'Cliente' });
    const rolAdministrador = await connection
      .getRepository(Rol)
      .findOne({ nombre: 'Administrador' });
    const rolRepartidor = await connection
      .getRepository(Rol)
      .findOne({ nombre: 'Repartidor' });

    await factory(Usuario)().create({
      nombre: 'Edwar',
      apellido: 'Martinez',
      correoElectronico: 'edwar@hotmail.com',
      cuentaVerificada: true,
    });
    const usuarioEdwar = await connection
      .getRepository(Usuario)
      .findOne({ correoElectronico: 'edwar@hotmail.com' });
    await connection.getRepository(RolUsuario).insert([
      { usuario: usuarioEdwar, rol: rolCliente },
      { usuario: usuarioEdwar, rol: rolAdministrador, rolPorDefecto: true },
      { usuario: usuarioEdwar, rol: rolRepartidor },
    ]);

    await factory(Usuario)().create({
      nombre: 'Mabel',
      apellido: 'Zembrano',
      correoElectronico: 'mabel@hotmail.com',
      cuentaVerificada: true,
    });
    const usuarioMabel = await connection
      .getRepository(Usuario)
      .findOne({ correoElectronico: 'mabel@hotmail.com' });
    await connection
      .getRepository(RolUsuario)
      .insert({ usuario: usuarioMabel, rol: rolCliente });

    await factory(Usuario)().create({
      nombre: 'Macarena',
      apellido: 'Rodrigez',
      correoElectronico: 'macarena@hotmail.com',
      cuentaVerificada: true,
    });
    const usuarioMacarena = await connection
      .getRepository(Usuario)
      .findOne({ correoElectronico: 'macarena@hotmail.com' });
    await connection
      .getRepository(RolUsuario)
      .insert({ usuario: usuarioMacarena, rol: rolCliente });

    await factory(Usuario)().create({
      nombre: 'Manuel',
      apellido: 'López',
      correoElectronico: 'manuel@hotmail.com',
      cuentaVerificada: true,
    });
    const usuarioManuel = await connection
      .getRepository(Usuario)
      .findOne({ correoElectronico: 'manuel@hotmail.com' });
    await connection
      .getRepository(RolUsuario)
      .insert({ usuario: usuarioManuel, rol: rolCliente });

    await factory(Usuario)().create({
      nombre: 'Mateo',
      apellido: 'Rodrígez',
      correoElectronico: 'mateo@hotmail.com',
      cuentaVerificada: true,
    });
    const usuarioMateo = await connection
      .getRepository(Usuario)
      .findOne({ correoElectronico: 'mateo@hotmail.com' });
    await connection
      .getRepository(RolUsuario)
      .insert({ usuario: usuarioMateo, rol: rolCliente });
  }
}
