import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { CasaMatriz } from 'app/entities/casa-matriz';
import { Sucursal } from 'app/entities/sucursal';

export default class SucursalSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const casaMatriz = await connection.getRepository(CasaMatriz).findOne(1);

    await connection.getRepository(Sucursal).save({
      nombre: 'Sucursal Nº 1',
      direccion: 'AVENIDA 6 DE AGOSTO BARRIO TABLADITA Nº 0280',
      ubicacion: 'TARIJA-BOLIVIA',
      numeroTelefono: '66-40056',
      casaMatriz,
    });
  }
}
