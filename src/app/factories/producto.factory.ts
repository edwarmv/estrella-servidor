import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Producto } from 'app/entities/producto';

define(Producto, (faker: typeof Faker) => {
  const producto = new Producto();

  producto.nombre = faker.commerce.productName();

  producto.precio = faker.random
    .number({ max: 10, min: 0.52, precision: 0.01 });

  producto.descripcion = faker.lorem.paragraph();

  return producto;
});
