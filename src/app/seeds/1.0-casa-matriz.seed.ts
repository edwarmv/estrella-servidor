import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { CasaMatriz } from 'app/entities/casa-matriz';

export default class CasaMatrizSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.getRepository(CasaMatriz)
    .insert({
      nombre: 'PANIFICADORA Y PASTELERÍA LA ESTRELLA DEL SUR',
      nit: '1782193018',
      direccion: 'AVENIDA 6 DE AGOSTO BARRIO TABLADITA Nº 0280',
      numeroTelefono: '66-40056',
      ubicacion: 'TARIJA-BOLIVIA',
      descripcionActividadEconomica: 'Elaboración de Productos de Panadería (Pan, Galletas, Pastelería)'
    });
  }
}
