import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { CasaMatriz } from 'app/entities/casa-matriz';
import { Sucursal } from 'app/entities/sucursal';
import { Dosificacion } from 'app/entities/dosificacion';

export default class CrearCasaMatriz implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const casaMatrizToSave = new CasaMatriz();
    casaMatrizToSave.nombre = 'PANIFICADORA Y PASTELERÍA LA ESTRELLA DEL SUR';
    casaMatrizToSave.nit = '1782193018';
    casaMatrizToSave.direccion =
      'AVENIDA 6 DE AGOSTO BARRIO TABLADITA Nº 0280';
    casaMatrizToSave.numeroTelefono = '66-40056';
    casaMatrizToSave.ubicacion = 'TARIJA-BOLIVIA';
    casaMatrizToSave.descripcionActividadEconomica =
      'Elaboración de Productos de Panadería (Pan, Galletas, Pastelería)';

    const casaMatriz = await connection.getRepository(CasaMatriz)
    .save(casaMatrizToSave);

    const sucursal = await connection.getRepository(Sucursal)
      .save({
        nombre: 'Sucursal Nº 1',
        direccion: 'AVENIDA 6 DE AGOSTO BARRIO TABLADITA Nº 0280',
        ubicacion: 'TARIJA-BOLIVIA',
        numeroTelefono: '66-40056',
        casaMatriz
      });

    await connection.getRepository(Dosificacion)
    .insert({
      sucursal,
      llaveDosificacion:
        'zZ7Z]xssKqkEf_6K9uH(EcV+%x+u[Cca9T%+_$kiLjT8(zr3T9b5Fx2xG-D+_EBS',
      fechaLimiteEmision: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 180);
        return date;
      })(),
      numeroAutorizacion: '7904006306693'
    });
  }
}
