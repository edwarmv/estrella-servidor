import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Producto } from 'app/entities/producto';
import faker from 'faker';

export default class CrearProducto implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const nombres: string[] = [];
    for(let i = 0; i < 100; i++) {
      nombres.push(faker.commerce.productName());
    }
    const nombresNoRepetidos = nombres.filter((item, index) => {
      return nombres.indexOf(item) === index;
    });
    nombresNoRepetidos.forEach(async nombre => {
      await factory(Producto)().create({ nombre });
    });
  }
}
