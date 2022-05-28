import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Usuario } from 'app/entities/usuario';

define(Usuario, (faker: typeof Faker) => {
  const usuario = new Usuario();

  usuario.nombre = faker.name.firstName();

  usuario.apellido = faker.name.lastName();

  usuario.correoElectronico = faker.internet.email();

  usuario.setPassword('qwerasdf');

  return usuario;
});
