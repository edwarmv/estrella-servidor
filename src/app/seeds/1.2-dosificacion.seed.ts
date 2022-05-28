import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Sucursal } from 'app/entities/sucursal';
import { Dosificacion } from 'app/entities/dosificacion';

export default class DocificacionSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const sucursal = await connection.getRepository(Sucursal).findOne(1);

    await connection.getRepository(Dosificacion).insert({
      sucursal,
      llaveDosificacion:
        'zZ7Z]xssKqkEf_6K9uH(EcV+%x+u[Cca9T%+_$kiLjT8(zr3T9b5Fx2xG-D+_EBS',
      fechaLimiteEmision: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 180);
        return date;
      })(),
      numeroAutorizacion: '7904006306693',
    });
  }
}
