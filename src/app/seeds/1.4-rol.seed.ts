import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Rol } from 'app/entities/rol';

export default class RolSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Rol)
      .values([
        {
          nombre: 'Administrador',
          descripcion: 'Encargado de todo el sistema',
        },
        {
          nombre: 'Cliente',
          descripcion: 'Accede a las funciones básicas del sistema',
        },
        {
          nombre: 'Repartidor',
          descripcion: 'Repartidor de la empresa'
        }
      ])
      .execute();
  }
}
