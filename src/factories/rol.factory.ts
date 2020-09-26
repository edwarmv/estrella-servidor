import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Rol } from 'entities/rol';

define(Rol, (faker: typeof Faker) => {
  const rol = new Rol();

  rol.nombre = faker.name.jobArea();

  rol.descripcion  = faker.lorem.paragraph();

  return rol;
});
